import type { Page } from "playwright-core";
import { MAX_SCROLL_STEPS, SCROLL_DELAY_MS, SCROLL_STEP_PX } from "./constants";

export async function scrollDetailPage(page: Page, deadline: number): Promise<void> {
  let previousHeight = 0;
  let atEnd = 0;
  for (let step = 0; step < MAX_SCROLL_STEPS && Date.now() < deadline; step++) {
    const state = await page.evaluate((distance) => {
      window.scrollBy(0, distance);
      return { y: window.scrollY, height: document.documentElement.scrollHeight, viewport: window.innerHeight };
    }, SCROLL_STEP_PX);
    await page.waitForTimeout(SCROLL_DELAY_MS);
    if (state.y + state.viewport >= state.height - 5 && state.height === previousHeight) atEnd++;
    else atEnd = 0;
    if (atEnd >= 2) break;
    previousHeight = state.height;
  }
}
