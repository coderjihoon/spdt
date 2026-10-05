import { isNaverStoreUrl, validatePublicHttpsUrl } from "@/lib/diagnosis-request";

export type DetailItem = { type: "text"; text: string } | { type: "image"; url: string; link?: string | null };

export function normalizeNaverUrl(value: string) {
  const url = new URL(value);
  if (!isNaverStoreUrl(value) || !/^\/[a-zA-Z0-9_-]+\/products\/\d+\/?$/.test(url.pathname)) throw new Error("네이버 상품 URL을 확인해 주세요.");
  url.hostname = url.hostname.replace(/^m\./, "");
  url.search = "";
  url.hash = "";
  return url.toString();
}

export function validateDetailItems(value: unknown): DetailItem[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 500) throw new Error("상세정보 수집 결과가 올바르지 않습니다.");
  let totalText = 0;
  return value.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new Error("상세정보 수집 결과가 올바르지 않습니다.");
    const row = item as Record<string, unknown>;
    if (row.type === "text" && typeof row.text === "string") {
      const text = row.text.trim();
      totalText += text.length;
      if (!text || text.length > 12000 || totalText > 100000) throw new Error("상세정보 텍스트가 너무 깁니다.");
      return { type: "text", text };
    }
    if (row.type === "image" && typeof row.url === "string" && row.url.length < 2048) {
      const url = new URL(row.url);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error("이미지 URL이 올바르지 않습니다.");
      return { type: "image", url: url.toString(), link: typeof row.link === "string" ? row.link.slice(0, 2048) : null };
    }
    throw new Error("상세정보 수집 결과가 올바르지 않습니다.");
  });
}

export async function fetchDetailImage(value: string) {
  const host = new URL(value).hostname.toLowerCase();
  if (!(host === "pstatic.net" || host.endsWith(".pstatic.net") || host === "naver.net" || host.endsWith(".naver.net"))) throw new Error("허용되지 않은 상세 이미지 주소입니다.");
  await validatePublicHttpsUrl(value);
  const response = await fetch(value, { redirect: "error", signal: AbortSignal.timeout(12000), headers: { Accept: "image/jpeg,image/png,image/webp" } });
  if (!response.ok || !["image/jpeg", "image/png", "image/webp"].includes(response.headers.get("content-type")?.split(";")[0] ?? "")) throw new Error("상세 이미지를 읽지 못했습니다.");
  const length = Number(response.headers.get("content-length") || 0);
  if (length > 15 * 1024 * 1024) throw new Error("상세 이미지가 너무 큽니다.");
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 15 * 1024 * 1024) throw new Error("상세 이미지가 너무 큽니다.");
  return bytes;
}
