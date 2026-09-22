import assert from "node:assert/strict";
import test from "node:test";
import { smartStoreImageUrls } from "@/lib/apify-smartstore";
import { isNaverLoginPage, isSmartStoreUrl, isUnlimitedDiagnosisEmail, validateDiagnosisRequest } from "@/lib/diagnosis-request";

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

test("identifies Smart Store URLs", () => {
  assert.equal(isSmartStoreUrl("https://smartstore.naver.com/store/products/123"), true);
  assert.equal(isSmartStoreUrl("https://shop.example.com/products/123"), false);
});

test("identifies Naver login pages", () => {
  assert.equal(isNaverLoginPage("<title>NAVER 로그인</title>"), true);
  assert.equal(isNaverLoginPage("<title>상품 상세</title>"), false);
});

test("uses only Naver-hosted product images from Apify data", () => {
  const urls = smartStoreImageUrls({ detailContent: '<img src="https://shop-phinf.pstatic.net/one.jpg">', imageUrl: "https://example.com/two.jpg" });
  assert.deepEqual(urls, ["https://shop-phinf.pstatic.net/one.jpg"]);
});
