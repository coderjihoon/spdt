import { smartStoreImageUrls } from "@/lib/apify-smartstore";
import { isNaverStoreUrl } from "@/lib/diagnosis-request";
import { captureNaverDetail } from "@/lib/naver-detail";

async function apifySmartStoreProduct(url: string) {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) return null;
  const actor = process.env.APIFY_SMARTSTORE_ACTOR ?? "zen-studio~naver-product-detail-scraper";
  const response = await fetch(`https://api.apify.com/v2/acts/${encodeURIComponent(actor)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productUrls: [url] }),
    signal: AbortSignal.timeout(90_000),
  });
  const items = await response.json() as unknown;
  const item = Array.isArray(items) ? items[0] : null;
  const imageUrls = smartStoreImageUrls(item);
  if (!response.ok || !imageUrls.length) throw new Error("스마트스토어 상품 이미지를 가져오지 못했습니다.");
  const record = item as { storeDetail?: { channel?: { channelUid?: unknown } }; storeProductNo?: unknown };
  const channelUid = record?.storeDetail?.channel?.channelUid;
  const originalProductId = String(record?.storeProductNo ?? "");
  const productId = new URL(url).pathname.match(/\/products\/(\d+)$/)?.[1];
  if (typeof channelUid !== "string" || !/^[a-zA-Z0-9]+$/.test(channelUid) || !/^\d+$/.test(originalProductId) || !productId) throw new Error("스마트스토어 상세정보 식별자를 찾지 못했습니다.");
  const images = await Promise.all(imageUrls.map(async (imageUrl) => {
    const image = await fetch(imageUrl, { signal: AbortSignal.timeout(30_000) });
    if (!image.ok || !image.headers.get("content-type")?.startsWith("image/")) throw new Error("스마트스토어 상품 이미지를 읽지 못했습니다.");
    const buffer = Buffer.from(await image.arrayBuffer());
    if (buffer.length > 15 * 1024 * 1024) throw new Error("스마트스토어 상품 이미지가 너무 큽니다.");
    return buffer;
  }));
  return { images, detail: { channelUid, productId, originalProductId } };
}

// Cafe24 detail images can have no src until the visitor expands the section.
const prepareImages = `async () => {
  document.querySelector('.btn-detail-view')?.click();
  const images = [...document.querySelectorAll('img')];
  const detailImages = images.filter(image => image.hasAttribute('ec-data-src'));
  for (const image of images) {
    const src = image.getAttribute('ec-data-src') || image.getAttribute('data-src');
    if (src) image.src = src;
    image.loading = 'eager';
  }
  await Promise.allSettled(images.map(image => image.decode()));
  if (detailImages.some(image => image.naturalWidth < 2)) throw new Error('Detail images did not load');
  const detail = document.querySelector('.prd-detail-wrap');
  if (detail) {
    detail.style.setProperty('max-height', 'none', 'important');
    detail.style.setProperty('height', 'auto', 'important');
    detail.style.setProperty('overflow', 'visible', 'important');
  }
}`;

async function captureBrowserless(url: string): Promise<Buffer[]> {
  const base = process.env.BROWSERLESS_BASE_URL?.replace(/\/$/, "");
  const token = process.env.BROWSERLESS_TOKEN;
  if (!base || !token) throw new Error("Browserless 캡처 서비스가 설정되지 않았습니다.");
  const response = await fetch(`${base}/function?token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: `export default async ({ page, context }) => {
        await page.setViewport({ width: 1280, height: 900 });
        await page.goto(context.url, { waitUntil: 'networkidle2', timeout: 30000 });
        await page.evaluate(${prepareImages});
        return { data: await page.screenshot({ fullPage: true, type: 'jpeg', quality: 70 }), type: 'image/jpeg' };
      }`,
      context: { url },
    }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error(`Browserless 캡처에 실패했습니다 (${response.status}).`);
  return [Buffer.from(await response.arrayBuffer())];
}

async function capturePageImages(url: string): Promise<Buffer[]> {
  if (isNaverStoreUrl(url)) {
    const productUrl = new URL(url);
    productUrl.hostname = productUrl.hostname.replace(/^m\./, "");
    productUrl.search = "";
    productUrl.hash = "";
    url = productUrl.toString();
    if (productUrl.hostname === "brand.naver.com") return await captureNaverDetail(url);
    const product = await apifySmartStoreProduct(url);
    if (!product) throw new Error("스마트스토어 수집 서비스가 설정되지 않았습니다.");
    return [...product.images, ...await captureNaverDetail(url, product.detail)];
  }
  const account = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!account || !token) throw new Error("Cloudflare 캡처 서비스가 설정되지 않았습니다.");
  url = new URL(url).href;
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/browser-run/screenshot`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      viewport: { width: 1280, height: 900 },
      screenshotOptions: { fullPage: true, type: "jpeg", quality: 70 },
      gotoOptions: { waitUntil: "networkidle2", timeout: 30000 },
      scrollPage: true,
      addScriptTag: [{ content: `(${prepareImages})().then(() => document.documentElement.setAttribute('data-capture-ready', 'true'));` }],
      waitForSelector: { selector: 'html[data-capture-ready="true"]', timeout: 30000 },
    }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok) {
    const message = await response.text();
    // A 429 can also mean concurrency or request rate, rather than daily usage.
    if (/browser time limit exceeded for today/i.test(message)) {
      console.warn("Cloudflare daily browser quota exhausted; using Browserless");
      return captureBrowserless(url);
    }
    throw new Error(`Cloudflare 캡처에 실패했습니다 (${response.status}).`);
  }
  if (!response.headers.get("content-type")?.startsWith("image/")) throw new Error("Cloudflare 캡처 이미지가 없습니다.");
  return [Buffer.from(await response.arrayBuffer())];
}

export class PageCaptureError extends Error {
  constructor(url: string, cause: unknown) {
    const page = isNaverStoreUrl(url) ? "네이버 상세정보 전체" : "상세페이지";
    super(`${page}를 읽지 못했습니다. 상세페이지 이미지로 다시 신청하거나, 오른쪽 하단의 카카오톡 문의하기로 문의해 주세요.`, { cause });
  }
}

export async function capturePage(url: string): Promise<Buffer[]> {
  try {
    return await capturePageImages(url);
  } catch (error) {
    throw new PageCaptureError(url, error);
  }
}
