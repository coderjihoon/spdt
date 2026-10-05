import { NextResponse } from "next/server";
import { isUnlimitedDiagnosisEmail, koreanDay } from "@/lib/diagnosis-request";
import { supabaseAdmin } from "@/lib/supabase";
export const runtime = "nodejs";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!uuid.test(token)) return NextResponse.json({ error: "진단을 찾을 수 없습니다." }, { status: 404 });
  const db = supabaseAdmin();
  const { data: job } = await db.from("diagnoses").select("id,email,status,collected_items,collect_deadline,processing_started_at,error_message").eq("access_token", token).maybeSingle();
  if (!job) return NextResponse.json({ error: "진단을 찾을 수 없습니다." }, { status: 404 });
  if (job.status === "collecting" && !job.collected_items && job.collect_deadline && Date.parse(job.collect_deadline) < Date.now()) {
    await db.from("diagnoses").update({ status: "failed", error_message: "naver_worker_timeout" }).eq("id", job.id).eq("status", "collecting").is("collected_items", null);
    job.status = "failed"; job.error_message = "naver_worker_timeout";
    if (!isUnlimitedDiagnosisEmail(job.email)) await db.from("diagnosis_daily_limits").delete().eq("email", job.email).eq("day", koreanDay());
  }
  if (job.status === "processing" && job.processing_started_at && Date.parse(job.processing_started_at) < Date.now() - 10 * 60_000) {
    await db.from("diagnoses").update({ status: "failed", error_message: "processing_failed" }).eq("id", job.id).eq("status", "processing");
    job.status = "failed"; job.error_message = "processing_failed";
  }
  let waitingMessage: string | undefined;
  if (job.status === "collecting" && !job.collected_items) {
    const { data: worker } = await db.from("naver_worker_state").select("last_seen_at").eq("worker_id", "primary").maybeSingle();
    if (!worker || Date.now() - Date.parse(worker.last_seen_at) > 3 * 60_000) waitingMessage = "운영자 Chrome 연결이 끊겨 수집을 기다리고 있습니다. 30분 안에 복구되지 않으면 신청이 실패 처리됩니다.";
  }
  const messages: Record<string, string> = {
    naver_worker_timeout: "운영자 Chrome에서 30분 안에 상세정보를 수집하지 못했습니다. 잠시 후 다시 신청하거나 문의해 주세요.",
    naver_security_check: "네이버 보안 확인 화면이 표시되어 자동 수집을 중단했습니다. 잠시 후 다시 신청하거나 문의해 주세요.",
    naver_collection_failed: "상품 상세정보 수집에 실패했습니다. 잠시 후 다시 신청하거나 문의해 주세요.",
    processing_failed: "보고서 생성에 실패했습니다. 문의해 주세요.",
    diagnosis_input_invalid: "수집한 상세정보에서 진단 근거를 충분히 확인하지 못해 보고서를 발급하지 않았습니다. 문의해 주세요.",
  };
  return NextResponse.json({ status: job.status, ready: job.status === "collecting" && Boolean(job.collected_items), reportUrl: job.status === "complete" ? `/report/${token}` : undefined, message: job.status === "failed" ? messages[job.error_message] ?? "진단을 완료하지 못했습니다. 문의해 주세요." : waitingMessage });
}
