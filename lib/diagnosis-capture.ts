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

export async function capturePage(url: string): Promise<Buffer[]> {
  if (isNaverStoreUrl(url)) {
    const productUrl = new URL(url);
    productUrl.hostname = productUrl.hostname.replace(/^m\./, "");
    productUrl.search = "";
    productUrl.hash = "";
    url = productUrl.toString();
    try {
      if (productUrl.hostname === "brand.naver.com") return await captureNaverDetail(url);
      const product = await apifySmartStoreProduct(url);
      if (!product) throw new Error("스마트스토어 수집 서비스가 설정되지 않았습니다.");
      return [...product.images, ...await captureNaverDetail(url, product.detail)];
    } catch (error) {
      console.error("Naver full detail capture failed", error);
      throw new Error("네이버 상세정보 전체를 읽지 못했습니다. 상세페이지 이미지로 다시 신청하거나, 오른쪽 하단의 카카오톡 문의하기로 문의해 주세요.");
    }
  }
  const base = process.env.BROWSERLESS_BASE_URL?.replace(/\/$/, "");
  const token = process.env.BROWSERLESS_TOKEN;
  if (!base || !token) throw new Error("캡처 서비스가 설정되지 않았습니다.");
  const response = await fetch(`${base}/screenshot?token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, scrollPage: true, options: { fullPage: true, type: "png" } }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error("상세페이지를 캡처하지 못했습니다.");
  return [Buffer.from(await response.arrayBuffer())];
}
