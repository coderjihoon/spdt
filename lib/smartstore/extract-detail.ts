import type { Page } from "playwright-core";
import { EXCLUDED_SELECTORS, MIN_IMAGE_HEIGHT, MIN_IMAGE_WIDTH } from "./constants";
import type { SmartstoreAnalysisSource } from "./types";

export async function extractDetail(page: Page, selector: string): Promise<SmartstoreAnalysisSource["detail"]> {
  return page.evaluate(({ selector, excluded, minWidth, minHeight }) => {
    const root = document.querySelector(selector);
    if (!root) return { images: [], text: "", blocks: [] };
    const images: SmartstoreAnalysisSource["detail"]["images"] = [];
    const blocks: SmartstoreAnalysisSource["detail"]["blocks"] = [];
    const seen = new Set<string>();
    let textBuffer = "";
    const flush = () => {
      const text = textBuffer.replace(/[\s\u200b]+/g, " ").trim();
      if (text) blocks.push({ order: blocks.length + 1, type: "text", text });
      textBuffer = "";
    };
    const validUrl = (source: string | null | undefined) => {
      if (!source) return undefined;
      try {
        const url = new URL(source, location.href);
        return url.protocol === "https:" && !url.username && !url.password ? url.href : undefined;
      } catch { return undefined; }
    };
    const imageSource = (image: HTMLImageElement) => {
      const candidates = [image.currentSrc, image.getAttribute("data-original"), image.getAttribute("data-src"), image.getAttribute("data-lazy-src"), image.src];
      const srcset = image.getAttribute("srcset") || image.getAttribute("data-srcset");
      if (srcset) candidates.push(...srcset.split(",").reverse().map((part) => part.trim().split(/\s+/)[0]));
      return candidates.map(validUrl).find(Boolean);
    };
    const visit = (node: Node): void => {
      if (node.nodeType === Node.TEXT_NODE) { textBuffer += node.textContent || ""; return; }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const element = node as Element;
      if (excluded.some((rule) => element.matches(rule))) return;
      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") return;
      if (element.tagName === "IMG") {
        flush();
        const image = element as HTMLImageElement;
        const url = imageSource(image);
        const rect = image.getBoundingClientRect();
        const naturalWidth = image.naturalWidth || undefined;
        const naturalHeight = image.naturalHeight || undefined;
        const displayWidth = Math.round(rect.width) || undefined;
        const displayHeight = Math.round(rect.height) || undefined;
        const width = naturalWidth ?? displayWidth ?? 0;
        const height = naturalHeight ?? displayHeight ?? 0;
        if (url && !seen.has(url) && width >= minWidth && height >= minHeight && !/pixel|spacer|tracker/i.test(url)) {
          seen.add(url);
          images.push({ order: images.length + 1, url, naturalWidth, naturalHeight, displayWidth, displayHeight });
          blocks.push({ order: blocks.length + 1, type: "image", imageUrl: url });
        }
        return;
      }
      if (element.tagName === "BR") { flush(); return; }
      const isBlock = /^(P|DIV|SECTION|ARTICLE|LI|H[1-6]|TABLE|TR|TD|TH|FIGURE|FIGCAPTION|BLOCKQUOTE)$/.test(element.tagName);
      if (isBlock) flush();
      for (const child of element.childNodes) visit(child);
      if (isBlock) flush();
    };
    visit(root);
    flush();
    return { images, text: blocks.filter((block) => block.type === "text").map((block) => block.text).join("\n"), blocks };
  }, { selector, excluded: EXCLUDED_SELECTORS, minWidth: MIN_IMAGE_WIDTH, minHeight: MIN_IMAGE_HEIGHT });
}
