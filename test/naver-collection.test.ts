import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeNaverUrl, validateDetailItems } from "../lib/naver-collection";
import { authorizedWorker } from "../lib/naver-worker-auth";

test("canonicalizes product URLs and rejects unrelated Naver pages", () => {
  assert.equal(normalizeNaverUrl("https://m.smartstore.naver.com/pizookie/products/7452552588?foo=bar"), "https://smartstore.naver.com/pizookie/products/7452552588");
  assert.throws(() => normalizeNaverUrl("https://smartstore.naver.com/pizookie/profile"));
  assert.throws(() => normalizeNaverUrl("https://evil.example/pizookie/products/7452552588"));
});

test("accepts ordered text-only details and rejects oversized or unsafe items", () => {
  assert.deepEqual(validateDetailItems([{ type: "text", text: "첫 화면" }, { type: "text", text: "구매 안내" }]), [{ type: "text", text: "첫 화면" }, { type: "text", text: "구매 안내" }]);
  assert.throws(() => validateDetailItems([{ type: "image", url: "http://127.0.0.1/private" }]));
  assert.throws(() => validateDetailItems([{ type: "text", text: "x".repeat(12001) }]));
});

test("worker requires the configured bearer secret", () => {
  const previous = process.env.NAVER_WORKER_TOKEN;
  process.env.NAVER_WORKER_TOKEN = "a".repeat(32);
  try {
    assert.equal(authorizedWorker(new Request("https://example.com", { headers: { Authorization: `Bearer ${"a".repeat(32)}` } })), true);
    assert.equal(authorizedWorker(new Request("https://example.com", { headers: { Authorization: "Bearer wrong" } })), false);
  } finally { if (previous === undefined) delete process.env.NAVER_WORKER_TOKEN; else process.env.NAVER_WORKER_TOKEN = previous; }
});
