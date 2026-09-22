import { NextResponse } from "next/server";
import { smartStoreImageUrls } from "@/lib/apify-smartstore";
import { diagnoseImageBuffers } from "@/lib/diagnosis";
import { isNaverLoginPage, isSmartStoreUrl } from "@/lib/diagnosis-request";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 300;

const tokenPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function apifySmartStoreImages(url: string) {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) return null;
  const actor = process.env.APIFY_SMARTSTORE_ACTOR ?? "delicious_zebu~naver-product-detail-scraper";
  const response = await fetch(`https://api.apify.com/v2/acts/${encodeURIComponent(actor)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productUrls: [url] }),
    signal: AbortSignal.timeout(90_000),
  });
  const items = await response.json() as unknown;
  const imageUrls = Array.isArray(items) ? smartStoreImageUrls(items[0]) : [];
  if (!response.ok || !imageUrls.length) throw new Error("스마트스토어 상품 이미지를 가져오지 못했습니다.");
  return Promise.all(imageUrls.map(async (imageUrl) => {
    const image = await fetch(imageUrl, { signal: AbortSignal.timeout(30_000) });
    if (!image.ok || !image.headers.get("content-type")?.startsWith("image/")) throw new Error("스마트스토어 상품 이미지를 읽지 못했습니다.");
    const buffer = Buffer.from(await image.arrayBuffer());
    if (buffer.length > 15 * 1024 * 1024) throw new Error("스마트스토어 상품 이미지가 너무 큽니다.");
    return buffer;
  }));
}

async function capturePage(url: string): Promise<Buffer[]> {
  if (isSmartStoreUrl(url)) {
    const images = await apifySmartStoreImages(url);
    if (images) return images;
  }
  const base = process.env.BROWSERLESS_BASE_URL?.replace(/\/$/, "");
  const token = process.env.BROWSERLESS_TOKEN;
  if (!base || !token) throw new Error("캡처 서비스가 설정되지 않았습니다.");
  if (isSmartStoreUrl(url)) {
    const params = new URLSearchParams({ token, proxy: "residential", proxyCountry: "kr", proxyLocaleMatch: "true", proxySticky: "true" });
    const response = await fetch(`${base}/unblock?${params}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, content: true, cookies: false, screenshot: true, browserWSEndpoint: false }),
      signal: AbortSignal.timeout(90_000),
    });
    const result = await response.json() as { screenshot?: unknown; content?: unknown };
    if (!response.ok || typeof result.screenshot !== "string" || !result.screenshot || typeof result.content !== "string" || isNaverLoginPage(result.content)) throw new Error("스마트스토어 인증 화면으로 상세페이지를 읽지 못했습니다.");
    return [Buffer.from(result.screenshot, "base64")];
  }
  const response = await fetch(`${base}/screenshot?token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, scrollPage: true, options: { fullPage: true, type: "png" } }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error("상세페이지를 캡처하지 못했습니다.");
  return [Buffer.from(await response.arrayBuffer())];
}

export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!tokenPattern.test(token)) return NextResponse.json({ error: "진단을 찾을 수 없습니다." }, { status: 404 });
  const supabase = supabaseAdmin();
  const { data: diagnosis } = await supabase
    .from("diagnoses")
    .select("id,email,product_url,input_paths,status")
    .eq("access_token", token)
    .maybeSingle();
  if (!diagnosis) return NextResponse.json({ error: "진단을 찾을 수 없습니다." }, { status: 404 });
  if (diagnosis.status === "complete") return NextResponse.json({ reportUrl: `/report/${token}` });
  if (!["ready", "uploading"].includes(diagnosis.status)) return NextResponse.json({ error: "이 진단은 현재 실행할 수 없습니다." }, { status: 409 });

  const { data: locked, error: lockError } = await supabase.from("diagnoses").update({ status: "processing" }).eq("id", diagnosis.id).in("status", ["ready", "uploading"]).select("id");
  if (lockError || !locked?.length) return NextResponse.json({ error: "이 진단은 현재 실행할 수 없습니다." }, { status: 409 });

  try {
    const paths = Array.isArray(diagnosis.input_paths) ? diagnosis.input_paths : [];
    const uploaded = await Promise.all(paths.map(async (path) => {
      const { data, error } = await supabase.storage.from("diagnosis-inputs").download(path);
      if (error || !data) throw new Error("업로드 이미지를 읽지 못했습니다.");
      const buffer = Buffer.from(await data.arrayBuffer());
      if (buffer.length > 15 * 1024 * 1024) throw new Error("이미지 크기가 너무 큽니다.");
      return buffer;
    }));
    const captured = diagnosis.product_url ? await capturePage(diagnosis.product_url) : [];
    const report = await diagnoseImageBuffers([...captured, ...uploaded]);
    const { error } = await supabase.from("diagnoses").update({ status: "complete", report, completed_at: new Date().toISOString() }).eq("id", diagnosis.id);
    if (error) throw error;
    return NextResponse.json({ reportUrl: `/report/${token}` });
  } catch (error) {
    await supabase.from("diagnoses").update({ status: "failed", error_message: "processing_failed" }).eq("id", diagnosis.id);
    console.error("Diagnosis processing failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "진단을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
