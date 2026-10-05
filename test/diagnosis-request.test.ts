import assert from "node:assert/strict";
import test from "node:test";
import { smartStoreImageUrls } from "@/lib/apify-smartstore";
import { isNaverStoreUrl, isUnlimitedDiagnosisEmail, validateDiagnosisRequest } from "@/lib/diagnosis-request";
import { capturePage, PageCaptureError } from "../lib/diagnosis-capture";

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

test("capture failures name the requested store and preserve the cause", async () => {
  const originalFetch = globalThis.fetch;
  const originalAccount = process.env.CLOUDFLARE_ACCOUNT_ID;
  const originalCloudToken = process.env.CLOUDFLARE_API_TOKEN;
  process.env.CLOUDFLARE_ACCOUNT_ID = "test-account";
  process.env.CLOUDFLARE_API_TOKEN = "test";
  const originalBase = process.env.BROWSERLESS_BASE_URL;
  const originalToken = process.env.BROWSERLESS_TOKEN;
  const calls: string[] = [];
  process.env.BROWSERLESS_BASE_URL = "https://browser.example.com";
  process.env.BROWSERLESS_TOKEN = "test";
  globalThis.fetch = (async (input: string | URL | Request) => {
    calls.push(String(input));
    return new Response("Usage limit exceeded", { status: 401 });
  }) as typeof fetch;
  try {
    const url = "https://deopocket.co.kr/product/데오포켓-실내용-탈취제/33/category/1/display/2/?icid=MAIN.product_listmain_1";
    assert.equal(isNaverStoreUrl(url), false);
    await assert.rejects(capturePage(url), (error: unknown) => {
      assert.ok(error instanceof PageCaptureError);
      assert.ok(error.message.startsWith("상세페이지를 읽지 못했습니다."));
      assert.ok(!error.message.includes("네이버"));
      assert.ok(error.cause instanceof Error);
      assert.match(error.cause.message, /401/);
      return true;
    });
    assert.ok(calls[0].startsWith("https://api.cloudflare.com/"));
    await assert.rejects(capturePage("https://brand.naver.com/store/products/123"), (error: unknown) => {
      assert.ok(error instanceof PageCaptureError);
      assert.ok(error.message.startsWith("네이버 상세정보 전체를 읽지 못했습니다."));
      assert.ok(error.cause instanceof Error);
      assert.match(error.cause.message, /401/);
      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalAccount === undefined) delete process.env.CLOUDFLARE_ACCOUNT_ID; else process.env.CLOUDFLARE_ACCOUNT_ID = originalAccount;
    if (originalCloudToken === undefined) delete process.env.CLOUDFLARE_API_TOKEN; else process.env.CLOUDFLARE_API_TOKEN = originalCloudToken;
    if (originalBase === undefined) delete process.env.BROWSERLESS_BASE_URL; else process.env.BROWSERLESS_BASE_URL = originalBase;
    if (originalToken === undefined) delete process.env.BROWSERLESS_TOKEN; else process.env.BROWSERLESS_TOKEN = originalToken;
  }
});

test("Cloudflare is primary and Browserless runs only for daily quota exhaustion", async () => {
  const originalFetch = globalThis.fetch;
  const keys = ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN", "BROWSERLESS_BASE_URL", "BROWSERLESS_TOKEN"];
  const original = keys.map(key => process.env[key]);
  [" account\n", " test\n", "https://browser.example.com", "test"].forEach((value, index) => { process.env[keys[index]] = value; });
  const url = "https://deopocket.co.kr/product/탈취제/33/";
  const calls: string[] = [];
  let cloudStatus = 200;
  let cloudMessage = "";
  let fallbackStatus = 200;
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const endpoint = String(input);
    calls.push(endpoint);
    const body = JSON.parse(String(init?.body));
    if (endpoint.startsWith("https://api.cloudflare.com/")) {
      assert.equal(endpoint, "https://api.cloudflare.com/client/v4/accounts/account/browser-run/screenshot");
      assert.equal((init?.headers as Record<string, string>).Authorization, "Bearer test");
      assert.equal(body.url, new URL(url).href);
      assert.equal(body.screenshotOptions.fullPage, true);
      assert.match(body.addScriptTag[0].content, /ec-data-src/);
      assert.equal(body.waitForSelector.selector, 'html[data-capture-ready="true"]');
      return cloudStatus === 200 ? new Response("cloud image", { headers: { "content-type": "image/jpeg" } }) : Response.json({ errors: [{ message: cloudMessage }] }, { status: cloudStatus });
    }
    assert.ok(endpoint.startsWith("https://browser.example.com/function?"));
    assert.equal(body.context.url, new URL(url).href);
    assert.match(body.code, /ec-data-src/);
    return new Response("backup image", { status: fallbackStatus, headers: { "content-type": "image/jpeg" } });
  }) as typeof fetch;
  try {
    assert.equal((await capturePage(url))[0].toString(), "cloud image");
    assert.equal(calls.length, 1);
    for (const [status, message] of [[401, "Unauthorized"], [429, "Too many requests"], [500, "Internal error"]] as const) {
      calls.length = 0;
      cloudStatus = status;
      cloudMessage = message;
      await assert.rejects(capturePage(url), PageCaptureError);
      assert.equal(calls.length, 1);
    }
    calls.length = 0;
    cloudStatus = 429;
    cloudMessage = "Unable to create new browser: code: 429: message: Browser time limit exceeded for today";
    assert.equal((await capturePage(url))[0].toString(), "backup image");
    assert.equal(calls.length, 2);
    calls.length = 0;
    fallbackStatus = 401;
    await assert.rejects(capturePage(url), PageCaptureError);
    assert.equal(calls.length, 2);
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, index) => { if (original[index] === undefined) delete process.env[key]; else process.env[key] = original[index]; });
  }
});
