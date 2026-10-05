import { NextResponse } from "next/server";
import { diagnoseImageBuffers, DiagnosisInputError } from "@/lib/diagnosis";
import { capturePage, PageCaptureError } from "@/lib/diagnosis-capture";
import { isUnlimitedDiagnosisEmail, koreanDay, isNaverStoreUrl } from "@/lib/diagnosis-request";
import { supabaseAdmin } from "@/lib/supabase";
import { deliverDiagnosisEmail } from "@/lib/diagnosis-email";

export const runtime = "nodejs";
export const maxDuration = 300;

const tokenPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!tokenPattern.test(token)) return NextResponse.json({ error: "진단을 찾을 수 없습니다." }, { status: 404 });
  const supabase = supabaseAdmin();
  const { data: diagnosis } = await supabase
    .from("diagnoses")
    .select("id,email,product_url,input_paths,status,email_sent_at")
    .eq("access_token", token)
    .maybeSingle();
  if (!diagnosis) return NextResponse.json({ error: "진단을 찾을 수 없습니다." }, { status: 404 });
  if (isNaverStoreUrl(diagnosis.product_url)) return NextResponse.json({ error: "스마트스토어 진단은 자동 수집 대기 중입니다." }, { status: 409 });
  if (diagnosis.status === "complete") {
    await deliverDiagnosisEmail(supabase, diagnosis, token);
    return NextResponse.json({ reportUrl: `/report/${token}` });
  }
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
    let captured: Buffer[] = [];
    if (diagnosis.product_url) {
      try {
        captured = await capturePage(diagnosis.product_url);
      } catch (error) {
        if (!uploaded.length) throw error;
        console.warn("URL capture failed; analyzing uploaded images", error instanceof Error ? error.message : "unknown");
      }
    }
    const report = await diagnoseImageBuffers([...captured, ...uploaded], diagnosis.product_url ?? undefined);
    const { error } = await supabase.from("diagnoses").update({ status: "complete", report, completed_at: new Date().toISOString() }).eq("id", diagnosis.id);
    if (error) throw error;
  } catch (error) {
    const blocked = error instanceof PageCaptureError || error instanceof DiagnosisInputError;
    await supabase.from("diagnoses").update({ status: "failed", error_message: blocked ? "capture_failed" : "processing_failed" }).eq("id", diagnosis.id);
    if (blocked && !isUnlimitedDiagnosisEmail(diagnosis.email)) await supabase.from("diagnosis_daily_limits").delete().eq("email", diagnosis.email).eq("day", koreanDay());
    console.error("Diagnosis processing failed", error);
    return NextResponse.json({ error: blocked ? error.message : "진단을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: blocked ? 422 : 500 });
  }
  await deliverDiagnosisEmail(supabase, diagnosis, token);
  return NextResponse.json({ reportUrl: `/report/${token}` });
}
