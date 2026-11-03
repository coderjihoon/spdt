import type { Page } from "playwright-core";
import { DETAIL_SELECTORS } from "./constants";
import { SmartstoreError } from "./errors";

export async function findDetailArea(page: Page): Promise<string> {
  const selector = await page.evaluate((selectors) => {
    const useful = (element: Element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden" && rect.width >= 200 && (element.querySelectorAll("img").length > 0 || (element.textContent?.trim().length ?? 0) >= 40);
    };
    for (const candidate of selectors) {
      if ([...document.querySelectorAll(candidate)].some(useful)) return candidate;
    }
    const candidates = [...document.querySelectorAll("article, section, div")]
      .filter((element) => !element.closest("header, footer, nav, aside, [role='tablist']"))
      .map((element) => ({ element, images: element.querySelectorAll("img").length, text: element.textContent?.trim().length ?? 0 }))
      .filter(({ element, images }) => useful(element) && images >= 2)
      .filter(({ element }) => !/review|qna|question|recommend|리뷰|문의|추천/i.test([element.id, element.className, element.getAttribute("aria-label")].join(" ")))
      .filter(({ element }) => !element.querySelector("[id*='review' i], [class*='review' i], [id*='recommend' i], [class*='recommend' i], [id*='qna' i]"))
      .sort((a, b) => (b.images * 10 + Math.min(b.text, 1000) / 100) - (a.images * 10 + Math.min(a.text, 1000) / 100));
    const chosen = candidates[0]?.element;
    if (!chosen) return null;
    chosen.setAttribute("data-smartstore-extract-detail", "true");
    return "[data-smartstore-extract-detail='true']";
  }, DETAIL_SELECTORS);
  if (!selector) throw new SmartstoreError("DETAIL_AREA_NOT_FOUND");
  return selector;
}
