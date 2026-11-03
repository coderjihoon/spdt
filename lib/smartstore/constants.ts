export const DETAIL_SELECTORS = [
  "#DEFAULT .se-main-container",
  "#DEFAULT",
  "[data-shp-area*='detail'] .se-main-container",
  "[id*='detailContent' i]",
  "[class*='detailContent' i]",
  "[aria-label*='상세정보']",
];
export const EXCLUDED_SELECTORS = ["script", "style", "noscript", "svg", "button", "input", "select", "textarea", "[aria-hidden='true']", "[hidden]", "[data-shp-area*='review']", "[data-shp-area*='qna']", "[class*='review' i]", "[id*='review' i]", "[class*='recommend' i]", "[id*='recommend' i]", "[class*='qna' i]", "[id*='qna' i]"];
export const MIN_IMAGE_WIDTH = 100;
export const MIN_IMAGE_HEIGHT = 100;
export const MAX_SCROLL_STEPS = 80;
export const SCROLL_STEP_PX = 900;
export const SCROLL_DELAY_MS = 250;
export const REQUEST_TIMEOUT_MS = 60_000;
export const MAX_CONCURRENT_BROWSERS = 2;
export const EXTRACTOR_VERSION = "1.0.0";
