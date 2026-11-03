import { isIP } from "node:net";
import { lookup } from "node:dns/promises";
import { normalizeNaverUrl } from "@/lib/naver-collection";
import { SmartstoreError } from "./errors";

const HOSTS = new Set(["smartstore.naver.com", "brand.naver.com", "m.smartstore.naver.com", "m.brand.naver.com"]);

export function isPrivateAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19));
  }
  if (isIP(address) === 6) {
    const value = address.toLowerCase();
    return value === "::" || value === "::1" || value.startsWith("fc") || value.startsWith("fd") || /^fe[89ab]/.test(value) || value.startsWith("::ffff:") && isPrivateAddress(value.slice(7));
  }
  return true;
}

type ResolveAddresses = (hostname: string) => Promise<{ address: string }[]>;
const resolveAddresses: ResolveAddresses = (hostname) => lookup(hostname, { all: true });

export async function isPublicHttpsUrl(value: string, resolve: ResolveAddresses = resolveAddresses): Promise<boolean> {
  let url: URL;
  try { url = new URL(value); } catch { return false; }
  if (url.protocol !== "https:" || url.username || url.password || url.port && url.port !== "443" || url.hostname === "localhost" || url.hostname.endsWith(".localhost") || isIP(url.hostname)) return false;
  try {
    const addresses = await resolve(url.hostname);
    return addresses.length > 0 && addresses.every(({ address }) => !isPrivateAddress(address));
  } catch { return false; }
}

export async function validateSmartstoreUrl(value: unknown, resolve: ResolveAddresses = resolveAddresses): Promise<string> {
  if (typeof value !== "string" || value.length > 2048) throw new SmartstoreError("INVALID_URL");
  let url: URL;
  try { url = new URL(value); } catch { throw new SmartstoreError("INVALID_URL"); }
  if (!HOSTS.has(url.hostname.toLowerCase()) || !await isPublicHttpsUrl(value, resolve)) throw new SmartstoreError("INVALID_URL");
  try { return normalizeNaverUrl(value); } catch { throw new SmartstoreError("INVALID_URL"); }
}

export async function isAllowedProductNavigation(value: string): Promise<boolean> {
  try { await validateSmartstoreUrl(value); return true; } catch { return false; }
}
