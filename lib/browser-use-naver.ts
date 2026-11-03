import { BrowserUse } from "browser-use-sdk/v4";
import { chromium } from "playwright-core";
import { normalizeNaverUrl, validateDetailItems, type DetailItem } from "@/lib/naver-collection";

type Extracted = { ok: boolean; error?: string; url?: string; items?: unknown[]; expanded?: boolean; scope?: string };
type BrowserClient = Pick<BrowserUse, "browsers">;
type BrowserConnection = Pick<typeof chromium, "connectOverCDP">;

export type BrowserUseCollection = { items: DetailItem[]; expanded: boolean; scope: string };

/** A single login-free cloud browser attempt. Creating a browser is billable. */
export async function collectNaverWithBrowserUse(
  productUrl: string,
  extractorSource: string,
  dependencies?: { client?: BrowserClient; chromium?: BrowserConnection },
): Promise<BrowserUseCollection> {
  const url = normalizeNaverUrl(productUrl);
  const apiKey = process.env.BROWSER_USE_API_KEY;
  if (!dependencies?.client && !apiKey) throw new Error("Browser Use API key is not configured");
  const client = dependencies?.client ?? new BrowserUse({ apiKey, maxRetries: 0, timeout: 15_000 });
  const remoteChromium = dependencies?.chromium ?? chromium;
  // Browser Use create has no idempotency key. Never retry an ambiguous create.
  const session = await client.browsers.create({ proxyCountryCode: "kr", timeout: 2, enableRecording: false });
  let browser: Awaited<ReturnType<typeof chromium.connectOverCDP>> | undefined;
  try {
    if (!session.id) throw new Error("Browser Use did not return a browser ID");
    let cdpUrl = session.cdpUrl;
    // A freshly created browser can be active before its CDP endpoint is ready.
    if (!cdpUrl && apiKey) {
      for (let attempt = 0; attempt < 5 && !cdpUrl; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await fetch(`https://api.browser-use.com/api/v4/browsers/${encodeURIComponent(session.id)}`, {
          headers: { "X-Browser-Use-API-Key": apiKey }, signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) throw new Error(`Browser Use browser status failed (${response.status})`);
        const state = await response.json() as { status?: string; cdpUrl?: string | null };
        if (state.status !== "active") throw new Error(`Browser Use browser is ${state.status ?? "unavailable"}`);
        cdpUrl = state.cdpUrl ?? null;
      }
    }
    // The provider currently returns HTTPS CDP discovery URLs; Playwright accepts
    // both secure discovery and secure WebSocket endpoints.
    if (!cdpUrl || !["https:", "wss:"].includes(new URL(cdpUrl).protocol)) {
      const scheme = cdpUrl ? new URL(cdpUrl).protocol : "missing";
      throw new Error(`Browser Use has no secure CDP endpoint (${scheme})`);
    }
    browser = await remoteChromium.connectOverCDP(cdpUrl, { timeout: 15_000 });
    const context = browser.contexts()[0];
    if (!context) throw new Error("Browser Use did not return a browser context");
    const page = context.pages()[0] ?? await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    if (normalizeNaverUrl(page.url()) !== url) throw new Error("Naver redirected away from the requested product");
    const result = await page.evaluate((source) => {
      // Reuse the tested Chrome extension extractor in the remote browser.
      return (0, eval)(`${source}\nreadDetailInPage()`) as Promise<Extracted>;
    }, extractorSource);
    if (!result.ok || !result.items || normalizeNaverUrl(result.url ?? "") !== url) {
      const state = await page.evaluate(() => {
        const body = document.body?.innerText ?? "";
        return {
          title: document.title.slice(0, 100),
          hasDetail: Boolean(document.querySelector("#DEFAULT")),
          hasPasswordField: Boolean(document.querySelector('input[type="password"]')),
          loginSignal: /로그인|sign\s?in/i.test(body.slice(0, 3000)),
          securitySignal: /보안 확인|자동입력|captcha|비정상적인 접근/i.test(body.slice(0, 3000)),
          errorSignal: /시스템 오류|일시적인 오류|페이지를 찾을 수|서비스 이용에 불편/i.test(body.slice(0, 3000)),
        };
      });
      throw new Error(`${result.error || "The remote browser did not return the requested product detail"} (${JSON.stringify(state)})`);
    }
    return { items: validateDetailItems(result.items), expanded: result.expanded === true, scope: result.scope ?? "" };
  } finally {
    await browser?.close().catch(() => {});
    // CDP disconnect does not end billing. The provider also enforces a 2-minute limit.
    await client.browsers.stop(session.id);
  }
}
