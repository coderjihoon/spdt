import type { SupabaseClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

type DiagnosisEmail = { id: string; email: string; email_sent_at: string | null };
const KAKAO_INQUIRY_URL = "https://open.kakao.com/me/spdt";

export function diagnosisEmailContent(token: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
    throw new Error("Invalid diagnosis token");
  }
  const site = new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://spdt.studio");
  if (site.protocol !== "https:" || site.username || site.password) throw new Error("Invalid email site URL");
  const reportUrl = new URL(`/report/${token}`, site.origin).href;
  // The configured origin and validated UUID are the only dynamic HTML values.
  const htmlUrl = reportUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return {
    subject: "[상페닥터] 상세페이지 진단서가 도착했습니다",
    text: `상세페이지 진단이 완료되었습니다.\n\n아래 링크에서 진단 결과와 수정 우선순위를 확인해 주세요.\n${reportUrl}\n\n카카오톡 문의하기\n${KAKAO_INQUIRY_URL}\n\n이 링크로 진단서를 다시 확인할 수 있습니다. 링크를 다른 사람에게 전달하면 진단 내용을 볼 수 있습니다.\n\n상페닥터 · SPDT`,
    html: `<!doctype html><html lang="ko"><head><meta charset="utf-8"></head><body style="margin:0;background:#f7f7f8;font-family:Arial,sans-serif;color:#171719"><div style="max-width:520px;margin:32px auto;padding:32px;background:#fff;border-radius:16px"><p style="font-size:13px;color:#46474c">상페닥터 · SPDT</p><h1 style="font-size:24px;line-height:1.4">상세페이지 진단서가 도착했습니다</h1><p style="font-size:15px;line-height:1.8">진단 결과와 수정 우선순위를 확인해 주세요.</p><p style="margin:28px 0 20px"><a href="${htmlUrl}" style="display:inline-block;padding:14px 24px;margin:0 8px 8px 0;background:#004ee0;color:#fff;text-decoration:none;border-radius:10px;white-space:nowrap">진단서 확인하기</a> <a href="${KAKAO_INQUIRY_URL}" style="display:inline-block;padding:14px 24px;margin:0 0 8px 0;background:#fee500;color:#171719;text-decoration:none;border-radius:10px;white-space:nowrap">카카오톡 문의하기</a></p><p style="font-size:12px;line-height:1.8;color:#46474c">버튼이 열리지 않으면 아래 주소를 브라우저에 붙여 넣어 주세요.<br><a href="${htmlUrl}" style="color:#004ee0;word-break:break-all">${htmlUrl}</a></p><p style="font-size:12px;line-height:1.8;color:#878a93">이 링크로 진단서를 다시 확인할 수 있습니다.<br>링크를 다른 사람에게 전달하면 진단 내용을 볼 수 있습니다.</p></div></body></html>`,
  };
}

export async function sendDiagnosisEmail(email: string, token: string) {
  const user = process.env.GMAIL_USER?.trim().toLowerCase();
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !password) throw new Error("email_not_configured");
  if (!/^[^\s<>@]+@gmail\.com$/.test(user)) throw new Error("email_invalid_sender");
  let content: ReturnType<typeof diagnosisEmailContent>;
  try { content = diagnosisEmailContent(token); } catch { throw new Error("email_invalid_content"); }
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    dnsTimeout: 10_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    const info = await transport.sendMail({
      from: { name: "상페닥터", address: user },
      to: email,
      replyTo: user,
      messageId: `<diagnosis.${token}@gmail.com>`,
      ...content,
    });
    if (!info.accepted.includes(email)) throw new Error("email_recipient_rejected");
    return info.messageId;
  } catch (error) {
    // Keep only safe codes. A lost SMTP response may follow Gmail's acceptance.
    const smtpError = error as { code?: string; command?: string; responseCode?: number; message?: string } | null;
    if (smtpError?.message === "email_recipient_rejected") throw new Error("email_recipient_rejected");
    if (smtpError?.code === "EAUTH") throw new Error("email_auth_failed");
    if (smtpError?.code === "EENVELOPE" || smtpError?.code === "EMESSAGE" || (smtpError?.responseCode ?? 0) >= 400) throw new Error("email_smtp_rejected");
    if (smtpError?.command === "CONN" || smtpError?.code === "EDNS") throw new Error("email_connection_failed");
    throw new Error("email_delivery_unknown");
  } finally {
    transport.close();
  }
}

export async function deliverDiagnosisEmail(supabase: SupabaseClient, diagnosis: DiagnosisEmail, token: string) {
  if (diagnosis.email_sent_at) return;
  let claimed = false;
  try {
    const { data: locked, error: lockError } = await supabase.from("diagnoses")
      .update({ email_sending_at: new Date().toISOString(), email_error: null })
      .eq("id", diagnosis.id).eq("status", "complete")
      .is("email_sent_at", null).is("email_sending_at", null).select("id");
    if (lockError) throw new Error("email_lock_failed");
    if (!locked?.length) return;
    claimed = true;
    const emailId = await sendDiagnosisEmail(diagnosis.email, token);
    const { error } = await supabase.from("diagnoses").update({
      email_id: emailId,
      email_sent_at: new Date().toISOString(),
      email_sending_at: null,
      email_error: null,
    }).eq("id", diagnosis.id).eq("status", "complete");
    if (error) throw new Error("email_status_save_failed");
  } catch (error) {
    const code = error instanceof Error && /^email_[a-z0-9_]+$/.test(error.message) ? error.message : "email_send_failed";
    console.error("Diagnosis email failed:", code);
    if (!claimed) return;
    try {
      const safeToRetry = ["email_not_configured", "email_invalid_sender", "email_invalid_content", "email_recipient_rejected", "email_auth_failed", "email_smtp_rejected", "email_connection_failed"].includes(code);
      const { error: saveError } = await supabase.from("diagnoses").update({ email_error: code, ...(safeToRetry ? { email_sending_at: null } : {}) })
        .eq("id", diagnosis.id).eq("status", "complete").is("email_sent_at", null);
      if (saveError) console.error("Diagnosis email status could not be saved");
    } catch {
      console.error("Diagnosis email status could not be saved");
    }
  }
}
