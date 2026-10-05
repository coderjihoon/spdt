import { NextResponse, after } from "next/server";
import { authorizedWorker } from "@/lib/naver-worker-auth";
import { processNaverJob } from "@/lib/naver-process";
import { supabaseAdmin } from "@/lib/supabase";
export const runtime = "nodejs";
export const maxDuration = 300;
export async function POST(request: Request) {
  if (!authorizedWorker(request)) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  const db = supabaseAdmin();
  const { error: heartbeatError } = await db.from("naver_worker_state").upsert({ worker_id: "primary", last_seen_at: new Date().toISOString() });
  if (heartbeatError) return NextResponse.json({ error: "작업 연결 상태를 기록하지 못했습니다." }, { status: 500 });
  const { data: recovered } = await db.from("diagnoses").select("id").eq("status", "collecting").not("collected_items", "is", null).limit(1);
  if (recovered?.[0]) after(() => processNaverJob(recovered[0].id));
  const { data, error } = await db.rpc("claim_naver_diagnosis");
  if (error) return NextResponse.json({ error: "작업을 가져오지 못했습니다." }, { status: 500 });
  return NextResponse.json({ job: data?.[0] ?? null });
}
