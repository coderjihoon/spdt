import type { Page } from "playwright-core";
import type { SmartstoreAnalysisSource } from "./types";

export async function extractProduct(page: Page, url: string): Promise<SmartstoreAnalysisSource["product"]> {
  return page.evaluate((productUrl) => {
    const meta = (name: string) => document.querySelector<HTMLMetaElement>(`meta[property='${name}'], meta[name='${name}']`)?.content?.trim();
    const jsonProducts: Record<string, unknown>[] = [];
    for (const script of document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')) {
      try {
        const parsed: unknown = JSON.parse(script.textContent || "null");
        const visit = (value: unknown): void => {
          if (Array.isArray(value)) return value.forEach(visit);
          if (!value || typeof value !== "object") return;
          const item = value as Record<string, unknown>;
          if (item["@type"] === "Product") jsonProducts.push(item);
          if (item["@graph"]) visit(item["@graph"]);
        };
        visit(parsed);
      } catch { /* malformed JSON-LD is common */ }
    }
    const product = jsonProducts[0] ?? {};
    const offers = Array.isArray(product.offers) ? product.offers[0] : product.offers;
    const offer = offers && typeof offers === "object" ? offers as Record<string, unknown> : {};
    const value = (item: unknown) => typeof item === "string" && item.trim() ? item.trim() : undefined;
    const number = (item: unknown) => { const n = Number(String(item ?? "").replace(/[^0-9.]/g, "")); return Number.isFinite(n) && n > 0 ? n : undefined; };
    const image = Array.isArray(product.image) ? product.image[0] : product.image;
    const brand = product.brand && typeof product.brand === "object" ? product.brand as Record<string, unknown> : {};
    const productNo = new URL(productUrl).pathname.match(/\/products\/(\d+)/)?.[1];
    const price = number(meta("product:price:amount") ?? offer.highPrice ?? offer.price);
    const salePrice = number(offer.lowPrice ?? offer.price ?? meta("product:sale_price:amount"));
    return {
      url: productUrl, productNo,
      title: value(product.name) ?? meta("og:title") ?? value(document.querySelector("h1")?.textContent),
      price, salePrice: salePrice && salePrice !== price ? salePrice : undefined,
      storeName: value(brand.name) ?? value(document.querySelector("meta[property='og:site_name']")?.getAttribute("content")) ?? new URL(productUrl).pathname.split("/")[1],
      category: value(product.category) ?? meta("product:category"),
      mainImage: value(image) ?? meta("og:image"),
    };
  }, url);
}
