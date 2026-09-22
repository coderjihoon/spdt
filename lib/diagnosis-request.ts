import { isIP } from "node:net";
import { lookup } from "node:dns/promises";

export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 15 * 1024 * 1024;
export const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type UploadMeta = { name: string; type: string; size: number };
export type DiagnosisRequest = { email: string; name: string | null; productUrl: string | null; files: UploadMeta[] };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateDiagnosisRequest(input: unknown): DiagnosisRequest {
  if (!input || typeof input !== "object") throw new Error("잘못된 요청입니다.");
  const body = input as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const rawName = typeof body.name === "string" ? body.name.trim() : "";
  const rawUrl = typeof body.productUrl === "string" ? body.productUrl.trim() : "";
  const files = Array.isArray(body.files) ? body.files : [];
  if (!emailPattern.test(email) || email.length > 254) throw new Error("이메일 주소를 확인해 주세요.");
  if (rawName.length > 100) throw new Error("이름은 100자 이하로 입력해 주세요.");
  if (files.length > MAX_FILES) throw new Error(`이미지는 최대 ${MAX_FILES}장까지 올릴 수 있습니다.`);
  const safeFiles = files.map((file) => {
    if (!file || typeof file !== "object") throw new Error("이미지 정보를 확인해 주세요.");
    const f = file as Record<string, unknown>;
    const name = typeof f.name === "string" ? f.name : "";
    const type = typeof f.type === "string" ? f.type : "";
    const size = typeof f.size === "number" ? f.size : 0;
    if (!name || name.length > 200 || !ALLOWED_TYPES.has(type) || !Number.isFinite(size) || size < 1 || size > MAX_FILE_BYTES) {
      throw new Error("이미지는 JPG, PNG, WEBP 형식의 15MB 이하 파일만 올릴 수 있습니다.");
    }
    return { name, type, size };
  });
  if (!rawUrl && !safeFiles.length) throw new Error("제품 URL 또는 상세페이지 이미지 중 하나는 꼭 필요합니다.");
  return { email, name: rawName || null, productUrl: rawUrl || null, files: safeFiles };
}

function privateAddress(address: string) {
  if (address === "::1" || address.startsWith("fc") || address.startsWith("fd") || address.startsWith("fe80:" )) return true;
  if (isIP(address) !== 4) return false;
  const [a, b] = address.split(".").map(Number);
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

export async function validatePublicHttpsUrl(value: string | null) {
  if (!value) return null;
  let url: URL;
  try { url = new URL(value); } catch { throw new Error("제품 URL을 확인해 주세요."); }
  if (url.protocol !== "https:" || url.username || url.password || url.hostname === "localhost") throw new Error("공개 HTTPS 제품 URL만 사용할 수 있습니다.");
  const addresses = await lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => privateAddress(address))) throw new Error("공개 HTTPS 제품 URL만 사용할 수 있습니다.");
  return url.toString();
}

export function extensionFor(type: string) {
  return type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : "webp";
}

export const koreanDay = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

export function isSmartStoreUrl(value: string | null) {
  if (!value) return false;
  try { return new URL(value).hostname === "smartstore.naver.com"; } catch { return false; }
}

export function isNaverLoginPage(html: string) {
  return /<title[^>]*>\s*NAVER 로그인\s*<\/title>/i.test(html);
}
