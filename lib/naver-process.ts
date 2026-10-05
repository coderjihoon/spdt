import { diagnoseImageBuffers, DiagnosisInputError } from "@/lib/diagnosis";
import { isUnlimitedDiagnosisEmail, koreanDay } from "@/lib/diagnosis-request";
import { fetchDetailImage, type DetailItem } from "@/lib/naver-collection";
import { supabaseAdmin } from "@/lib/supabase";
import { deliverDiagnosisEmail } from "@/lib/diagnosis-email";

export async function processNaverJob(id: string) {
  const db = supabaseAdmin();
  const { data: locked, error: lockError } = await db.from("diagnoses").update({ status: "processing", processing_started_at: new Date().toISOString() }).eq("id", id).eq("status", "collecting").not("collected_items", "is", null).select("id,access_token,email,product_url,collected_items,input_paths,email_sent_at").maybeSingle();
  if (lockError || !locked) return;
  try {
    const items = locked.collected_items as DetailItem[];
    const images: Buffer[] = [];
    const ordered: Array<{ type: "text"; text: string } | { type: "image"; index: number; link?: string | null }> = [];
    for (const item of items) {
      if (item.type === "text") ordered.push(item);
      else {
        try { images.push(await fetchDetailImage(item.url)); ordered.push({ type: "image", index: images.length - 1, link: item.link }); }
        catch { ordered.push({ type: "text", text: "[상세 이미지 로드 실패]" }); }
      }
    }
    for (const path of locked.input_paths ?? []) {
      const { data, error } = await db.storage.from("diagnosis-inputs").download(path);
      if (error || !data) throw new Error("업로드 이미지를 읽지 못했습니다.");
      images.push(Buffer.from(await data.arrayBuffer()));
      ordered.push({ type: "image", index: images.length - 1 });
    }
    const report = await diagnoseImageBuffers(images, locked.product_url, ordered);
    const { error } = await db.from("diagnoses").update({ status: "complete", report, completed_at: new Date().toISOString() }).eq("id", id).eq("status", "processing");
    if (error) throw error;
    await deliverDiagnosisEmail(db, locked, locked.access_token);
  } catch (error) {
    console.error("Naver diagnosis failed", error instanceof Error ? error.message : "unknown");
    await db.from("diagnoses").update({ status: "failed", error_message: error instanceof DiagnosisInputError ? "diagnosis_input_invalid" : "processing_failed" }).eq("id", id).eq("status", "processing");
    if (error instanceof DiagnosisInputError && !isUnlimitedDiagnosisEmail(locked.email)) await db.from("diagnosis_daily_limits").delete().eq("email", locked.email).eq("day", koreanDay());
  }
}
