import assert from "node:assert/strict";
import test from "node:test";
import { validateDiagnosisRequest } from "@/lib/diagnosis-request";

const image = { name: "page.png", type: "image/png", size: 1024 };

test("validates either an image or a product URL", () => {
  assert.equal(validateDiagnosisRequest({ email: "A@EXAMPLE.COM", files: [image] }).email, "a@example.com");
  assert.equal(validateDiagnosisRequest({ email: "a@example.com", productUrl: "https://shop.example.com" }).productUrl, "https://shop.example.com");
});

test("rejects missing source and unsafe upload metadata", () => {
  assert.throws(() => validateDiagnosisRequest({ email: "a@example.com" }));
  assert.throws(() => validateDiagnosisRequest({ email: "a@example.com", files: [{ ...image, type: "application/pdf" }] }));
});
