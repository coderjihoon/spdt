import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { extensionFor, isUnlimitedDiagnosisEmail, koreanDay, validateDiagnosisRequest, validatePublicHttpsUrl, isNaverStoreUrl } from "@/lib/diagnosis-request";
import { normalizeNaverUrl } from "@/lib/naver-collection";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = validateDiagnosisRequest(await request.json());
    const productUrl = await validatePublicHttpsUrl(input.productUrl);
    const naverUrl = productUrl && isNaverStoreUrl(productUrl) ? normalizeNaverUrl(productUrl) : null;
    const supabase = supabaseAdmin();
    if (naverUrl) {
      const { data: worker, error: workerError } = await supabase.from("naver_worker_state").select("last_seen_at").eq("worker_id", "primary").maybeSingle();
      if (workerError || !worker || Date.now() - Date.parse(worker.last_seen_at) > 3 * 60_000) {
        return NextResponse.json({ error: "현재 스마트스토어 자동 수집이 일시적으로 중단되었습니다. 잠시 후 다시 시도해 주세요." }, { status: 503 });
      }
    }
    const unlimited = isUnlimitedDiagnosisEmail(input.email);
    if (!unlimited) {
      const { error: limitError } = await supabase.from("diagnosis_daily_limits").insert({ email: input.email, day: koreanDay() });
      if (limitError) {
        if (limitError.code === "23505") return NextResponse.json({ error: "이 이메일은 오늘 이미 무료 진단을 사용했습니다." }, { status: 429 });
        throw limitError;
      }
    }
    const accessToken = randomUUID();
    const inputPaths = input.files.map((file, index) => `${accessToken}/${String(index + 1).padStart(2, "0")}.${extensionFor(file.type)}`);
    const { error } = await supabase.from("diagnoses").insert({
      access_token: accessToken,
      email: input.email,
      name: input.name,
      product_url: naverUrl ?? productUrl,
      collect_deadline: naverUrl ? new Date(Date.now() + 30 * 60_000).toISOString() : null,
      input_paths: inputPaths,
      status: naverUrl ? "collecting" : inputPaths.length ? "uploading" : "ready",
    });
    if (error) {
      if (!unlimited) await supabase.from("diagnosis_daily_limits").delete().eq("email", input.email).eq("day", koreanDay());
      throw error;
    }
    const uploads = await Promise.all(inputPaths.map(async (path) => {
      const { data, error: uploadError } = await supabase.storage.from("diagnosis-inputs").createSignedUploadUrl(path);
      if (uploadError || !data) throw uploadError ?? new Error("업로드를 준비하지 못했습니다.");
      return data.signedUrl;
    }));
    return NextResponse.json({ accessToken, uploads, queued: Boolean(naverUrl) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "신청을 처리하지 못했습니다.";
    const status = /이메일|이름|이미지|제품 URL|공개 HTTPS|잘못된 요청/.test(message) ? 400 : 500;
    return NextResponse.json({ error: status === 500 ? "신청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." : message }, { status });
  }
}
