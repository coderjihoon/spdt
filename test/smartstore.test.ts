import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright-core";
import { DETAIL_SELECTORS } from "../lib/smartstore/constants";
import { extractDetail } from "../lib/smartstore/extract-detail";
import { findDetailArea } from "../lib/smartstore/find-detail-area";
import { browserlessWebSocketEndpoint } from "../lib/smartstore/launch-browser";
import { isPrivateAddress, validateSmartstoreUrl } from "../lib/smartstore/validate-url";

const publicDns = async () => [{ address: "223.130.200.107" }];

test("builds a Browserless Playwright websocket endpoint without losing base paths", () => {
  assert.equal(browserlessWebSocketEndpoint("https://browser.example.com/region/", "secret"), "wss://browser.example.com/region/chromium/playwright?token=secret&timeout=60000");
  assert.throws(() => browserlessWebSocketEndpoint("http://browser.example.com", "secret"));
});

test("accepts Naver product URLs and rejects unsafe or unrelated URLs", async () => {
  assert.equal(await validateSmartstoreUrl("https://smartstore.naver.com/shop/products/123?tracking=1", publicDns), "https://smartstore.naver.com/shop/products/123");
  assert.equal(await validateSmartstoreUrl("https://brand.naver.com/shop/products/456", publicDns), "https://brand.naver.com/shop/products/456");
  for (const url of [
    "not a url", "https://smartstore.naver.com/shop", "https://example.com/products/123",
    "https://localhost/shop/products/123", "https://127.0.0.1/shop/products/123",
    "https://10.0.0.1/shop/products/123", "http://smartstore.naver.com/shop/products/123",
    "https://smartstore.naver.com.evil.test/shop/products/123", "file:///shop/products/123",
  ]) await assert.rejects(validateSmartstoreUrl(url, publicDns), { code: "INVALID_URL" });
  await assert.rejects(validateSmartstoreUrl("https://smartstore.naver.com/shop/products/123", async () => [{ address: "192.168.1.2" }]), { code: "INVALID_URL" });
  assert.equal(isPrivateAddress("127.0.0.1"), true);
  assert.equal(isPrivateAddress("10.1.2.3"), true);
  assert.equal(isPrivateAddress("::1"), true);
});

test("detail selector falls back and preserves filtered DOM order", async (t) => {
  const executablePath = process.env.SMARTSTORE_CHROMIUM_PATH || (process.platform === "darwin" ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" : undefined);
  let browser;
  try { browser = await chromium.launch({ executablePath, headless: true, timeout: 10_000 }); }
  catch (error) { t.skip(`Chromium could not launch: ${error instanceof Error ? error.message.slice(0, 100) : "unknown"}`); return; }
  try {
    const page = await browser.newPage();
    await page.setContent(`<main><div class="detailContent"><p>첫 문장</p><img src="https://shop-phinf.pstatic.net/one.jpg" data-original="https://shop-phinf.pstatic.net/one.jpg" style="width:150px;height:180px"><p>둘째 문장</p><img src="https://shop-phinf.pstatic.net/one.jpg" data-original="https://shop-phinf.pstatic.net/one.jpg" style="width:150px;height:180px"><img src="https://shop-phinf.pstatic.net/tiny.jpg" style="width:20px;height:20px"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2ioAAAAASUVORK5CYII=" style="width:150px;height:180px"><p>마지막 문장</p></div><section data-shp-area="review"><img src="https://shop-phinf.pstatic.net/review.jpg" style="width:150px;height:180px"></section></main>`);
    // tsx annotates nested functions with __name; Next's production compiler does not.
    await page.evaluate("globalThis.__name = (value) => value");
    const selector = await findDetailArea(page);
    assert.equal(selector, DETAIL_SELECTORS[4]);
    const detail = await extractDetail(page, selector);
    assert.deepEqual(detail.blocks.map(({ type }) => type), ["text", "image", "text", "text"]);
    assert.equal(detail.images.length, 1);
    assert.equal(detail.images[0].url, "https://shop-phinf.pstatic.net/one.jpg");
    assert.equal(detail.images[0].order, 1);
    assert.match(detail.text, /첫 문장\n둘째 문장\n마지막 문장/);
    assert.ok(!detail.text.includes("review"));
    await page.setContent(`<main><section class="sellerBody"><p>판매자가 작성한 상세 설명 문장입니다.</p><img src="https://shop-phinf.pstatic.net/a.jpg" style="width:150px;height:180px"><img src="https://shop-phinf.pstatic.net/b.jpg" style="width:150px;height:180px"></section><section class="reviewList"><img src="https://shop-phinf.pstatic.net/review.jpg" style="width:150px;height:180px"></section></main>`);
    const structuralSelector = await findDetailArea(page);
    assert.equal(structuralSelector, "[data-smartstore-extract-detail='true']");
    const structuralDetail = await extractDetail(page, structuralSelector);
    assert.equal(structuralDetail.images.length, 2);
    assert.ok(!structuralDetail.images.some((image) => image.url.includes("review")));
    await page.close();
  } finally { await browser.close(); }
});
