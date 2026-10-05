async function readDetailInPage() {
  try {
    const hostname = location.hostname.replace(/^m\./, "");
    if (!["smartstore.naver.com", "brand.naver.com"].includes(hostname) || !/^\/[^/]+\/products\/\d+/.test(location.pathname)) {
      throw new Error("네이버 스마트스토어 상품 페이지에서 실행해 주세요.");
    }
    const until = Date.now() + 8000;
    let detail = document.querySelector("#DEFAULT .se-main-container");
    while (!detail && Date.now() < until) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      detail = document.querySelector("#DEFAULT .se-main-container");
    }
    if (!detail) detail = document.querySelector("#DEFAULT");
    if (!detail) throw new Error("상품 상세 본문을 찾지 못했습니다. 로그인·보안 확인 화면 또는 다른 상세페이지 구조일 수 있습니다.");
    const button = document.querySelector('button[data-shp-area="detailitm.more"]');
    if (button?.getAttribute("aria-expanded") === "false") button.click();
    if (button) {
      const expandedUntil = Date.now() + 5000;
      while (button.isConnected && button.getAttribute("aria-expanded") === "false" && Date.now() < expandedUntil) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (button.isConnected && button.getAttribute("aria-expanded") === "false") throw new Error("상세정보 펼치기에 실패했습니다.");
    }
    const outer = document.querySelector("#DEFAULT");
    const editors = document.querySelectorAll("#DEFAULT .se-main-container").length;
    let scope = "본문 편집 영역";
    if (outer && (detail === outer || editors > 1)) {
      detail = outer;
      scope = "상세정보 전체 영역";
    }
    const collectItems = (includeBackgrounds = false) => {
      const items = [];
      const textParts = [];
      const backgrounds = new Set();
      const blockTags = new Set(["ADDRESS", "ARTICLE", "BLOCKQUOTE", "DIV", "FIGCAPTION", "FIGURE", "H1", "H2", "H3", "H4", "H5", "H6", "HR", "LI", "OL", "P", "SECTION", "TABLE", "TD", "TH", "TR", "UL"]);
      const ignoredTags = new Set(["BUTTON", "INPUT", "NOSCRIPT", "SCRIPT", "SELECT", "STYLE", "SVG", "TEXTAREA"]);
      const flushText = () => {
        const value = textParts.join("").replace(/[\s\u200b]+/g, " ").trim();
        if (value) items.push({ type: "text", text: value });
        textParts.length = 0;
      };
      const imageUrl = (source) => {
        if (!source) return "";
        try {
          const url = new URL(source, location.href).href;
          return /^https:\/\//.test(url) ? url : "";
        } catch { return ""; }
      };
      const visit = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          textParts.push(node.nodeValue || "");
          return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const element = node;
        if (ignoredTags.has(element.tagName) || element.getAttribute("aria-hidden") === "true") return;
        const style = getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden") return;
        if (element.tagName === "BR") {
          flushText();
          return;
        }
        if (element.tagName === "IMG") {
          flushText();
          const source = element.getAttribute("data-src") || element.getAttribute("data-original") || element.getAttribute("data-lazy-src") || element.currentSrc || element.src;
          const url = imageUrl(source);
          if (url) items.push({ type: "image", url, link: element.closest("a[href]")?.getAttribute("href") || null });
          return;
        }
        const isBlock = blockTags.has(element.tagName) || style.display === "block" || style.display === "flex" || style.display === "grid";
        if (isBlock) flushText();
        if (includeBackgrounds) {
          for (const match of style.backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
            const url = imageUrl(match[1]);
            if (url && !backgrounds.has(url)) {
              flushText();
              items.push({ type: "image", url, link: element.closest("a[href]")?.getAttribute("href") || null });
              backgrounds.add(url);
            }
          }
        }
        for (const child of element.childNodes) visit(child);
        if (isBlock) flushText();
      };
      visit(detail);
      flushText();
      return items;
    };
    let items = collectItems();
    const imagesUntil = Date.now() + (items.some((item) => item.type === "text") && !detail.querySelector("img") ? 1200 : 8000);
    while (!items.some((item) => item.type === "image") && Date.now() < imagesUntil) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      items = collectItems();
    }
    if (!items.some((item) => item.type === "image") && outer && outer !== detail) {
      detail = outer;
      scope = "상세정보 전체 영역";
      items = collectItems();
    }
    if (!items.some((item) => item.type === "image")) items = collectItems(true);
    if (!items.length) {
      const count = detail.querySelectorAll("img").length;
      const frames = detail.querySelectorAll("iframe").length;
      const textLength = (detail.innerText || "").length;
      const attributes = [...detail.querySelector("img")?.attributes || []].map((attribute) => attribute.name).join(", ");
      throw new Error(`상품 상세 내용을 찾지 못했습니다. 상세정보 전체 img ${count}개, iframe ${frames}개, 편집 영역 ${editors}개, 텍스트 ${textLength}자, 첫 img 속성: ${attributes || "없음"}.`);
    }
    items.unshift({ type: "text", text: `상품 페이지 제목: ${document.title}` });
    return { ok: true, url: location.origin + location.pathname, title: document.title, expanded: !button || !button.isConnected || button.getAttribute("aria-expanded") === "true", scope, items };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "상세정보를 읽지 못했습니다." };
  }
}
