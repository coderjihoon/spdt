import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import nodemailer from "nodemailer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { deliverDiagnosisEmail, diagnosisEmailContent, sendDiagnosisEmail } from "@/lib/diagnosis-email";

const token = "12345678-1234-4234-8234-123456789012";
const diagnosis = { id: "record-id", email: "applicant@example.com", email_sent_at: null };
const keys = ["GMAIL_USER", "GMAIL_APP_PASSWORD", "NEXT_PUBLIC_SITE_URL"];
let originalEnv: (string | undefined)[];

beforeEach(() => {
  originalEnv = keys.map((key) => process.env[key]);
  process.env.GMAIL_USER = "wlgnsrbrb@gmail.com";
  process.env.GMAIL_APP_PASSWORD = "abcd efgh ijkl mnop";
  process.env.NEXT_PUBLIC_SITE_URL = "https://spdt.example.com";
});
afterEach(() => {
  mock.restoreAll();
  keys.forEach((key, index) => {
    if (originalEnv[index] === undefined) delete process.env[key]; else process.env[key] = originalEnv[index];
  });
});

function smtp(failure?: unknown, accepted = true) {
  const options: unknown[] = [];
  const messages: Record<string, unknown>[] = [];
  let closed = 0;
  mock.method(nodemailer, "createTransport", (settings: unknown) => {
    options.push(settings);
    return {
      async sendMail(message: Record<string, unknown>) {
        messages.push(message);
        if (failure) throw failure;
        return { messageId: message.messageId, accepted: accepted ? [message.to] : [] };
      },
      close() { closed++; },
    };
  });
  return { options, messages, get closed() { return closed; } };
}

function storage({ failLock = false, failSave = false } = {}) {
  const updates: Record<string, unknown>[] = [];
  const filters: unknown[][] = [];
  let sending = false;
  let sent = false;
  const supabase = { from(table: string) {
    assert.equal(table, "diagnoses");
    return { update(values: Record<string, unknown>) {
      let claim = false;
      const builder = {
        eq(...args: unknown[]) { filters.push(args); return builder; },
        is(...args: unknown[]) { filters.push(args); return builder; },
        select() { claim = true; return builder; },
        then(resolve: (result: unknown) => unknown) {
          if (claim && failLock || !claim && failSave && values.email_id) return Promise.resolve({ error: { code: "unavailable" } }).then(resolve);
          if (claim && (sending || sent)) return Promise.resolve({ data: [], error: null }).then(resolve);
          updates.push(values);
          if ("email_sending_at" in values) sending = Boolean(values.email_sending_at);
          if (values.email_sent_at) sent = true;
          return Promise.resolve({ data: claim ? [{ id: diagnosis.id }] : null, error: null }).then(resolve);
        },
      };
      return builder;
    } };
  } } as unknown as SupabaseClient;
  return { supabase, updates, filters, get sending() { return sending; } };
}

test("uses the chosen Gmail account over TLS with HTML, text and a stable Message-ID", async () => {
  const client = smtp();
  assert.equal(await sendDiagnosisEmail(diagnosis.email, token), `<diagnosis.${token}@gmail.com>`);
  assert.deepEqual(client.options[0], {
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user: "wlgnsrbrb@gmail.com", pass: "abcdefghijklmnop" },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000, dnsTimeout: 10000,
    disableFileAccess: true, disableUrlAccess: true,
  });
  const message = client.messages[0];
  assert.deepEqual(message.from, { name: "상페닥터", address: "wlgnsrbrb@gmail.com" });
  assert.equal(message.replyTo, "wlgnsrbrb@gmail.com");
  assert.equal(message.to, diagnosis.email);
  assert.match(String(message.text), new RegExp(`https://spdt.example.com/report/${token}`));
  assert.ok(String(message.html).includes(`href="https://spdt.example.com/report/${token}"`));
  assert.ok(String(message.html).includes('href="https://open.kakao.com/me/spdt"'));
  assert.match(String(message.html), /진단서 확인하기<\/a>\s*<a [^>]*>카카오톡 문의하기<\/a>/);
  assert.ok(String(message.text).includes("https://open.kakao.com/me/spdt"));
  assert.equal(client.closed, 1);
});

test("rejects unsafe origins, invalid tokens and senders before SMTP connects", async () => {
  const client = smtp();
  for (const site of ["http://example.com", "https://user:password@example.com", "javascript:alert(1)"]) {
    process.env.NEXT_PUBLIC_SITE_URL = site;
    await assert.rejects(sendDiagnosisEmail(diagnosis.email, token), /email_invalid_content/);
  }
  process.env.NEXT_PUBLIC_SITE_URL = "https://spdt.example.com";
  assert.throws(() => diagnosisEmailContent('" onclick="alert(1)'), /Invalid diagnosis token/);
  process.env.GMAIL_USER = "injected\r\nCc: victim@gmail.com";
  await assert.rejects(sendDiagnosisEmail(diagnosis.email, token), /email_invalid_sender/);
  assert.equal(client.options.length, 0);
});

test("concurrent completed-diagnosis requests send once and record Gmail acceptance", async () => {
  const client = smtp();
  const db = storage();
  await Promise.all([deliverDiagnosisEmail(db.supabase, diagnosis, token), deliverDiagnosisEmail(db.supabase, diagnosis, token)]);
  assert.equal(client.messages.length, 1);
  const recorded = db.updates.find((update) => update.email_id);
  assert.equal(recorded?.email_id, `<diagnosis.${token}@gmail.com>`);
  assert.ok(!Number.isNaN(Date.parse(String(recorded?.email_sent_at))));
  assert.equal(recorded?.email_sending_at, null);
  assert.equal(db.sending, false);
  assert.ok(db.filters.some((filter) => filter[0] === "email_sending_at" && filter[1] === null));
  assert.ok(db.updates.every((update) => !("status" in update)));
});

test("sent emails and failed DB locks never contact SMTP", async () => {
  const client = smtp();
  const db = storage();
  await deliverDiagnosisEmail(db.supabase, { ...diagnosis, email_sent_at: "2026-10-03T00:00:00Z" }, token);
  await deliverDiagnosisEmail(storage({ failLock: true }).supabase, diagnosis, token);
  assert.equal(client.messages.length, 0);
  assert.equal(db.updates.length, 0);
});

test("missing app password releases the claim and remains retryable", async () => {
  delete process.env.GMAIL_APP_PASSWORD;
  const client = smtp();
  const db = storage();
  await deliverDiagnosisEmail(db.supabase, diagnosis, token);
  assert.equal(client.messages.length, 0);
  assert.deepEqual(db.updates[1], { email_error: "email_not_configured", email_sending_at: null });
  assert.equal(db.sending, false);
});

test("authentication failure saves a safe code and allows retry", async () => {
  const client = smtp({ code: "EAUTH", response: "private credentials and recipient" });
  const db = storage();
  await deliverDiagnosisEmail(db.supabase, diagnosis, token);
  assert.deepEqual(db.updates[1], { email_error: "email_auth_failed", email_sending_at: null });
  assert.equal(client.closed, 1);
  assert.equal(db.sending, false);
});

test("invalid site configuration releases the lock before SMTP connects", async () => {
  process.env.NEXT_PUBLIC_SITE_URL = "http://example.com";
  const client = smtp();
  const db = storage();
  await deliverDiagnosisEmail(db.supabase, diagnosis, token);
  assert.equal(client.options.length, 0);
  assert.deepEqual(db.updates[1], { email_error: "email_invalid_content", email_sending_at: null });
  assert.equal(db.sending, false);
});

test("recipient rejection never records successful acceptance", async () => {
  smtp(undefined, false);
  const db = storage();
  await deliverDiagnosisEmail(db.supabase, diagnosis, token);
  assert.deepEqual(db.updates[1], { email_error: "email_recipient_rejected", email_sending_at: null });
  assert.ok(db.updates.every((update) => !update.email_sent_at));
});

test("lost DATA response preserves the lock instead of risking duplicate delivery", async () => {
  const client = smtp({ code: "ETIMEDOUT", command: "DATA", message: "private detail" });
  const db = storage();
  await deliverDiagnosisEmail(db.supabase, diagnosis, token);
  await deliverDiagnosisEmail(db.supabase, diagnosis, token);
  assert.equal(client.messages.length, 1);
  assert.deepEqual(db.updates[1], { email_error: "email_delivery_unknown" });
  assert.equal(db.sending, true);
});

test("Gmail acceptance followed by failed DB persistence keeps the lock", async () => {
  const client = smtp();
  const db = storage({ failSave: true });
  await assert.doesNotReject(deliverDiagnosisEmail(db.supabase, diagnosis, token));
  await deliverDiagnosisEmail(db.supabase, diagnosis, token);
  assert.equal(client.messages.length, 1);
  assert.deepEqual(db.updates[1], { email_error: "email_status_save_failed" });
  assert.equal(db.sending, true);
});
