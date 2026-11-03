import { chromium, type Browser, type BrowserContext, type Page } from "playwright-core";
import { isAllowedProductNavigation, isPublicHttpsUrl } from "./validate-url";

export function browserlessWebSocketEndpoint(baseUrl: string, token: string): string {
  const base = new URL(baseUrl);
  if (base.protocol !== "https:" || !token) throw new Error("Browserless requires an HTTPS endpoint and API token");
  const endpoint = new URL(base.origin);
  endpoint.protocol = "wss:";
  endpoint.pathname = `${base.pathname.replace(/\/$/, "")}/chromium/playwright`;
  endpoint.searchParams.set("token", token);
  endpoint.searchParams.set("timeout", "60000");
  return endpoint.toString();
}

async function connectBrowser() {
  if (process.env.SMARTSTORE_BROWSER_BACKEND !== "browserless") {
    return chromium.launch({ headless: true, executablePath: process.env.SMARTSTORE_CHROMIUM_PATH || undefined, timeout: 15_000 });
  }
  const token = process.env.BROWSERLESS_TOKEN;
  if (!token) throw new Error("Browserless mode requires BROWSERLESS_TOKEN");
  const endpoint = browserlessWebSocketEndpoint(process.env.BROWSERLESS_BASE_URL || "https://production-sfo.browserless.io", token);
  // Native Playwright protocol is required for the request interception below.
  return chromium.connect(endpoint, { timeout: 15_000 });
}

export async function launchSmartstoreBrowser(): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
  const browser = await connectBrowser();
  try {
    const context = await browser.newContext({
      locale: "ko-KR", timezoneId: "Asia/Seoul", viewport: { width: 1280, height: 900 },
      serviceWorkers: "block", acceptDownloads: false,
    });
    const page = await context.newPage();
    context.on("page", (opened) => { if (opened !== page) void opened.close().catch(() => {}); });
    const checked = new Map<string, boolean>();
    await context.route("**/*", async (route) => {
      const request = route.request();
      const target = request.url();
      let allowed = false;
      try {
        const parsed = new URL(target);
        if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
          allowed = await isAllowedProductNavigation(target);
        } else if (["https:", "http:"].includes(parsed.protocol)) {
          // Asset hosts are DNS checked as well; seller HTML can contain arbitrary URLs.
          if (checked.has(parsed.hostname)) allowed = checked.get(parsed.hostname)! && parsed.protocol === "https:";
          else {
            allowed = await isPublicHttpsUrl(target);
            checked.set(parsed.hostname, allowed);
          }
        }
      } catch { allowed = false; }
      if (allowed) await route.continue().catch(() => {});
      else await route.abort("blockedbyclient").catch(() => {});
    });
    return { browser, context, page };
  } catch (error) {
    await browser.close();
    throw error;
  }
}
