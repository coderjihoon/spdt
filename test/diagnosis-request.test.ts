import assert from "node:assert/strict";
import test from "node:test";
import { smartStoreImageUrls } from "@/lib/apify-smartstore";
import { isNaverStoreUrl, isUnlimitedDiagnosisEmail, validateDiagnosisRequest } from "@/lib/diagnosis-request";
import { capturePage } from "../lib/diagnosis-capture";

const image = { name: "page.png", type: "image/png", size: 1024 };

test("validates either an image or a product URL", () => {
  assert.equal(validateDiagnosisRequest({ email: "A@EXAMPLE.COM", files: [image] }).email, "a@example.com");
  assert.equal(validateDiagnosisRequest({ email: "a@example.com", productUrl: "https://shop.example.com" }).productUrl, "https://shop.example.com");
});

test("rejects missing source and unsafe upload metadata", () => {
  assert.throws(() => validateDiagnosisRequest({ email: "a@example.com" }));
  assert.throws(() => validateDiagnosisRequest({ email: "a@example.com", files: [{ ...image, type: "application/pdf" }] }));
});

test("matches configured unlimited diagnosis emails", () => {
  assert.equal(isUnlimitedDiagnosisEmail("wlgnsrbrb@gmail.com", "other@example.com, WLgnsrbrb@gmail.com"), true);
  assert.equal(isUnlimitedDiagnosisEmail("other@example.com", "wlgnsrbrb@gmail.com"), false);
});

test("identifies Naver store URLs", () => {
  assert.equal(isNaverStoreUrl("https://smartstore.naver.com/store/products/123"), true);
  assert.equal(isNaverStoreUrl("https://brand.naver.com/store/products/123"), true);
  assert.equal(isNaverStoreUrl("https://m.smartstore.naver.com/store/products/123"), true);
  assert.equal(isNaverStoreUrl("https://shop.example.com/products/123"), false);
});

test("uses only Naver-hosted product images from Apify data", () => {
  const urls = smartStoreImageUrls({ detailContent: '<img src="https://shop-phinf.pstatic.net/one.jpg">', imageUrl: "https://example.com/two.jpg" });
  assert.deepEqual(urls, ["https://shop-phinf.pstatic.net/one.jpg"]);
  assert.deepEqual(smartStoreImageUrls({ images: [{ imageUrl: "https://shopping-phinf.pstatic.net/main.jpg" }], storeImages: ["https://shop-phinf.pstatic.net/detail.jpg"] }), ["https://shopping-phinf.pstatic.net/main.jpg", "https://shop-phinf.pstatic.net/detail.jpg"]);
});

test("captures full Naver details after normalizing product URLs", async () => {
  const originalFetch = globalThis.fetch;
  const originalApify = process.env.APIFY_API_TOKEN;
  const originalBase = process.env.BROWSERLESS_BASE_URL;
  const originalToken = process.env.BROWSERLESS_TOKEN;
  const calls: string[] = [];
  let actorInput: unknown;
  const contexts: unknown[] = [];
  process.env.APIFY_API_TOKEN = "test";
  process.env.BROWSERLESS_BASE_URL = "https://browser.example.com";
  process.env.BROWSERLESS_TOKEN = "test";
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    calls.push(url);
    if (url.includes("api.apify.com")) {
      actorInput = JSON.parse(String(init?.body));
      return Response.json([{ images: [{ imageUrl: "https://shopping-phinf.pstatic.net/main.jpg" }], storeProductNo: 456, storeDetail: { channel: { channelUid: "channel123" } } }]);
    }
    if (url.includes("pstatic.net")) return new Response("gallery", { headers: { "content-type": "image/jpeg" } });
    contexts.push(JSON.parse(String(init?.body)).context);
    return Response.json({ data: { screenshots: [Buffer.from("detail").toString("base64")] } });
  }) as typeof fetch;
  try {
    const smart = await capturePage("https://smartstore.naver.com/shop/products/123?NaPm=tracking");
    assert.deepEqual(smart.map((buffer) => buffer.toString()), ["gallery", "detail"]);
    assert.deepEqual(actorInput, { productUrls: ["https://smartstore.naver.com/shop/products/123"] });
    assert.deepEqual(contexts[0], { url: "https://brand.naver.com/shop/products/123", detail: { channelUid: "channel123", productId: "123", originalProductId: "456" } });
    const brand = await capturePage("https://brand.naver.com/applestore/products/456?NaPm=tracking");
    assert.equal(brand[0].toString(), "detail");
    assert.deepEqual(contexts[1], { url: "https://brand.naver.com/applestore/products/456" });
    assert.equal(calls.filter((url) => url.includes("api.apify.com")).length, 1);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApify === undefined) delete process.env.APIFY_API_TOKEN; else process.env.APIFY_API_TOKEN = originalApify;
    if (originalBase === undefined) delete process.env.BROWSERLESS_BASE_URL; else process.env.BROWSERLESS_BASE_URL = originalBase;
    if (originalToken === undefined) delete process.env.BROWSERLESS_TOKEN; else process.env.BROWSERLESS_TOKEN = originalToken;
  }
});
