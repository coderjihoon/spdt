/**
 * Login-free SmartStore collection pilot. No customer submissions are created.
 * Run only after approving live Browser Use spending:
 *   node --env-file=.env.local --import tsx scripts/pilot-browser-use.ts <product URL> ...
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { collectNaverWithBrowserUse } from "../lib/browser-use-naver";
import { normalizeNaverUrl } from "../lib/naver-collection";

async function main() {
  if (!process.env.BROWSER_USE_API_KEY) throw new Error("BROWSER_USE_API_KEY is not configured");
  const urls = process.argv.slice(2).map(normalizeNaverUrl);
  if (!urls.length) throw new Error("Provide at least one SmartStore product URL");
  const extractor = await readFile(resolve("extension/naver-detail/detail.js"), "utf8");
  for (const url of urls) {
    const started = Date.now();
    try {
      const result = await collectNaverWithBrowserUse(url, extractor);
      console.log(JSON.stringify({ ok: true, url, elapsedMs: Date.now() - started,
        itemCount: result.items.length,
        imageCount: result.items.filter((item) => item.type === "image").length,
        textCount: result.items.filter((item) => item.type === "text").length,
        expanded: result.expanded, scope: result.scope }));
    } catch (error) {
      console.log(JSON.stringify({ ok: false, url, elapsedMs: Date.now() - started,
        error: error instanceof Error ? error.message : "unknown error" }));
    }
  }
}

main().catch((error) => { console.error(error instanceof Error ? error.message : "pilot failed"); process.exitCode = 1; });
