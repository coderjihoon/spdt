import assert from "node:assert/strict";
import test from "node:test";
import { collectNaverWithBrowserUse } from "../lib/browser-use-naver";

const url = "https://smartstore.naver.com/pizookie/products/7452552588";
type Dependencies = NonNullable<Parameters<typeof collectNaverWithBrowserUse>[2]>;

function fakeBrowser(result: unknown, pageUrl = url) {
  const calls: string[] = [];
  const page = {
    goto: async (target: string) => { calls.push(`goto:${target}`); },
    url: () => pageUrl,
    evaluate: async () => result,
  };
  const browser = {
    contexts: () => [{ pages: () => [page] }],
    close: async () => { calls.push("close"); },
  };
  const client = { browsers: {
    create: async (settings: { proxyCountryCode: string; timeout: number }) => {
      calls.push(`create:${settings.proxyCountryCode}:${settings.timeout}`);
      return { id: "test-browser", cdpUrl: "https://test.example/cdp" };
    },
    stop: async (id: string) => { calls.push(`stop:${id}`); },
  } };
  const remoteChromium = { connectOverCDP: async () => browser };
  return { calls, dependencies: { client, chromium: remoteChromium } as unknown as Dependencies };
}

test("collects ordered text and images through a Korean cloud browser, then stops it", async () => {
  const { calls, dependencies } = fakeBrowser({ ok: true, url, expanded: true, scope: "detail",
    items: [{ type: "text", text: "첫 문장" }, { type: "image", url: "https://shop-phinf.pstatic.net/image.jpg" }, { type: "text", text: "끝 문장" }] });
  const result = await collectNaverWithBrowserUse(url, "extractor source", dependencies);
  assert.deepEqual(result.items.map((item) => item.type), ["text", "image", "text"]);
  assert.deepEqual(calls, ["create:kr:2", `goto:${url}`, "close", "stop:test-browser"]);
});

test("rejects redirected or invalid content and still stops the paid browser", async () => {
  const redirect = fakeBrowser({ ok: true, url, items: [{ type: "text", text: "ignored" }] }, "https://nid.naver.com/nidlogin.login");
  await assert.rejects(collectNaverWithBrowserUse(url, "source", redirect.dependencies));
  assert.deepEqual(redirect.calls.slice(-2), ["close", "stop:test-browser"]);

  const invalid = fakeBrowser({ ok: true, url, items: [{ type: "image", url: "http://unsafe.example/x" }] });
  await assert.rejects(collectNaverWithBrowserUse(url, "source", invalid.dependencies));
  assert.deepEqual(invalid.calls.slice(-2), ["close", "stop:test-browser"]);
});
