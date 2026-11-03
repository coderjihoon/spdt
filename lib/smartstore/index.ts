import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { errors as playwrightErrors, type Browser, type Page } from "playwright-core";
import { EXTRACTOR_VERSION, MAX_CONCURRENT_BROWSERS, REQUEST_TIMEOUT_MS } from "./constants";
import { SmartstoreError } from "./errors";
import { extractDetail } from "./extract-detail";
import { extractProduct } from "./extract-product";
import { findDetailArea } from "./find-detail-area";
import { launchSmartstoreBrowser } from "./launch-browser";
import { scrollDetailPage } from "./scroll-page";
import type { SmartstoreAnalysisSource } from "./types";
import { isAllowedProductNavigation, validateSmartstoreUrl } from "./validate-url";

let activeBrowsers = 0;

async function debugPage(page: Page, selector?: string) {
  if (process.env.NODE_ENV === "production" || process.env.DEBUG_SMARTSTORE_EXTRACTOR !== "true") return;
  const directory = join(tmpdir(), "smartstore-extractor", randomUUID());
  await mkdir(directory, { recursive: true });
  await Promise.allSettled([
    writeFile(join(directory, "state.json"), JSON.stringify({ url: page.url(), selector }, null, 2)),
    page.evaluate((selected) => (selected ? document.querySelector(selected) : document.body)?.outerHTML.slice(0, 100_000) ?? "", selector).then((html) => writeFile(join(directory, "detail.html"), html)),
    page.screenshot({ path: join(directory, "page.png"), fullPage: false, timeout: 3000 }),
  ]);
  console.info("Smartstore extractor debug:", directory);
}

export async function analyzeSmartstore(input: unknown): Promise<SmartstoreAnalysisSource> {
  const url = await validateSmartstoreUrl(input);
  if (activeBrowsers >= MAX_CONCURRENT_BROWSERS) throw new SmartstoreError("PAGE_LOAD_FAILED");
  activeBrowsers++;
  let browser: Browser | undefined;
  let page: Page | undefined;
  let selector: string | undefined;
  const deadline = Date.now() + REQUEST_TIMEOUT_MS;
  try {
    ({ browser, page } = await launchSmartstoreBrowser());
    page.setDefaultTimeout(Math.max(1000, deadline - Date.now()));
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: Math.max(1000, deadline - Date.now()) });
    if (!await isAllowedProductNavigation(page.url())) throw new SmartstoreError("PAGE_LOAD_FAILED");
    if (response?.status() === 404 || response?.status() === 410) throw new SmartstoreError("PRODUCT_NOT_FOUND");
    if (response?.status() === 403 || response?.status() === 429) throw new SmartstoreError("BLOCKED");
    if (!response) throw new SmartstoreError("PAGE_LOAD_FAILED");
    const bodyStart = await page.locator("body").innerText({ timeout: 5000 }).then((text) => text.slice(0, 3000));
    if (/captcha|보안 확인|자동입력|비정상적인 접근|접근이 제한|현재 서비스 접속이 불가|접속이 불가합니다/i.test(bodyStart)) throw new SmartstoreError("BLOCKED");
    if (/상품을 찾을 수 없|존재하지 않는 상품|판매가 중단된 상품/i.test(bodyStart)) throw new SmartstoreError("PRODUCT_NOT_FOUND");
    if (response.status() >= 400) throw new SmartstoreError("PAGE_LOAD_FAILED");
    await page.locator('button[data-shp-area="detailitm.more"]').first().click({ timeout: 3000 }).catch(() => {});
    await scrollDetailPage(page, deadline);
    if (Date.now() >= deadline) throw new SmartstoreError("TIMEOUT");
    selector = await findDetailArea(page);
    await page.locator(selector).scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
    const [product, detail] = await Promise.all([extractProduct(page, url), extractDetail(page, selector)]);
    if (!detail.blocks.length) throw new SmartstoreError("DETAIL_AREA_NOT_FOUND");
    return { product, detail, meta: { extractedAt: new Date().toISOString(), imageCount: detail.images.length, blockCount: detail.blocks.length, extractorVersion: EXTRACTOR_VERSION } };
  } catch (error) {
    if (page) await debugPage(page, selector).catch(() => {});
    if (error instanceof SmartstoreError) throw error;
    if (error instanceof playwrightErrors.TimeoutError || Date.now() >= deadline) throw new SmartstoreError("TIMEOUT", { cause: error });
    throw new SmartstoreError("PAGE_LOAD_FAILED", { cause: error });
  } finally {
    await browser?.close().catch(() => {});
    activeBrowsers--;
  }
}
