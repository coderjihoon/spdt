import { NextResponse, after } from "next/server";
import { authorizedWorker } from "@/lib/naver-worker-auth";
import { isUnlimitedDiagnosisEmail, koreanDay } from "@/lib/diagnosis-request";
import { normalizeNaverUrl, validateDetailItems } from "@/lib/naver-collection";
import { processNaverJob } from "@/lib/naver-process";
import { supabaseAdmin } from "@/lib/supabase";
export const runtime = "nodejs";
export const maxDuration = 300;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!authorizedWorker(request)) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  const { id } = await params;
  if (!uuid.test(id)) return NextResponse.json({ error: "작업을 찾을 수 없습니다." }, { status: 404 });
  const raw = await request.text();
  if (raw.length > 300000) return NextResponse.json({ error: "수집 결과가 너무 큽니다." }, { status: 413 });
  try {
    const body = JSON.parse(raw);
    if (!uuid.test(body.lease)) throw new Error("작업 임대가 올바르지 않습니다.");
    const db = supabaseAdmin();
    const { data: job } = await db.from("diagnoses").select("email,product_url,status,collect_deadline,collect_lease_until,collect_attempts").eq("id", id).eq("collect_lease", body.lease).maybeSingle();
    if (!job || job.status !== "collecting" || !job.collect_lease_until || Date.parse(job.collect_lease_until) < Date.now() || Date.parse(job.collect_deadline) < Date.now()) return NextResponse.json({ error: "작업 임대가 만료되었습니다." }, { status: 409 });
    if (body.error) {
      const blocked = body.error === "security_check";
      const terminal = blocked || job.collect_attempts >= 3;
      const { error } = await db.from("diagnoses").update({ collect_lease: null, collect_lease_until: null, ...(terminal ? { status: "failed", error_message: blocked ? "naver_security_check" : "naver_collection_failed" } : {}) }).eq("id", id).eq("collect_lease", body.lease);
      if (error) throw error;
      if (terminal && !isUnlimitedDiagnosisEmail(job.email)) await db.from("diagnosis_daily_limits").delete().eq("email", job.email).eq("day", koreanDay());
      return NextResponse.json({ retry: !terminal });
    }
    if (normalizeNaverUrl(body.url) !== normalizeNaverUrl(job.product_url)) throw new Error("수집한 상품 URL이 일치하지 않습니다.");
    const items = validateDetailItems(body.items);
    const { data, error } = await db.from("diagnoses").update({ collected_items: items, collect_lease: null, collect_lease_until: null }).eq("id", id).eq("collect_lease", body.lease).is("collected_items", null).select("id");
    if (error) throw error;
    if (data?.length) after(() => processNaverJob(id));
    return NextResponse.json({ accepted: Boolean(data?.length) });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "수집 결과가 올바르지 않습니다." }, { status: 400 }); }
}
