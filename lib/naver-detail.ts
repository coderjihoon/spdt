type DetailIds = { channelUid: string; productId: string; originalProductId: string };

const code = `export default async ({ page, context }) => {
  await page.setViewport({ width: context.detail ? 700 : 1280, height: 900 });
  await page.goto(context.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  let hero;
  let selector;
  if (context.detail) {
    const html = await page.evaluate(async ({ channelUid, productId, originalProductId }) => {
      const response = await fetch('/n/v2/channels/' + channelUid + '/products/' + productId + '/contents/' + originalProductId + '/MOBILE?isResponsive=true');
      if (!response.ok) throw new Error('Detail API ' + response.status);
      const data = await response.json();
      const document = new DOMParser().parseFromString(data.mobileRenderContent || '', 'text/html');
      document.querySelectorAll('script,iframe,object,embed').forEach(element => element.remove());
      document.querySelectorAll('*').forEach(element => [...element.attributes].filter(attribute => attribute.name.startsWith('on')).forEach(attribute => element.removeAttribute(attribute.name)));
      return document.body.innerHTML;
    }, context.detail);
    if (!html) throw new Error('No detail content');
    await page.setContent('<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;width:680px;background:white}main{width:680px}img{display:block;max-width:100%;height:auto}</style></head><body><main id="detail">' + html + '</main></body></html>');
    selector = '#detail';
  } else {
    const button = await page.waitForSelector('button[data-shp-area="detailitm.more"]', { timeout: 30000 });
    hero = await page.screenshot({ type: 'jpeg', quality: 70, encoding: 'base64' });
    const before = await page.$eval('#DEFAULT', element => element.getBoundingClientRect().height);
    await button.click();
    await page.waitForFunction(old => document.querySelector('#DEFAULT')?.getBoundingClientRect().height > old + 500, { timeout: 15000 }, before);
    selector = '#DEFAULT';
  }
  const loaded = await page.evaluate(async selector => {
    const images = [...document.querySelectorAll(selector + ' img')];
    images.forEach(image => { if (image.dataset.src) image.src = image.dataset.src; image.loading = 'eager'; });
    await Promise.race([Promise.allSettled(images.map(image => image.decode())), new Promise(resolve => setTimeout(resolve, 20000))]);
    return images.filter(image => image.naturalWidth > 1).length;
  }, selector);
  if (!loaded) throw new Error('Detail images did not load');
  const screenshot = await (await page.$(selector)).screenshot({ type: 'jpeg', quality: 70, encoding: 'base64' });
  return { data: { screenshots: hero ? [hero, screenshot] : [screenshot] }, type: 'application/json' };
}`;

export async function captureNaverDetail(url: string, detail?: DetailIds): Promise<Buffer[]> {
  const base = process.env.BROWSERLESS_BASE_URL?.replace(/\/$/, "");
  const token = process.env.BROWSERLESS_TOKEN;
  if (!base || !token) throw new Error("캡처 서비스가 설정되지 않았습니다.");
  const product = new URL(url);
  const browserUrl = detail ? `https://brand.naver.com${product.pathname}` : url;
  const params = new URLSearchParams({ token, proxy: "residential", proxyCountry: "kr", proxySticky: "true", stealth: "true" });
  const response = await fetch(`${base}/function?${params}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, context: { url: browserUrl, detail } }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) throw new Error(`네이버 상세정보 캡처에 실패했습니다 (${response.status}).`);
  const result = await response.json() as { data?: { screenshots?: unknown } };
  const screenshots = result.data?.screenshots;
  if (!Array.isArray(screenshots) || !screenshots.length || screenshots.some((value) => typeof value !== "string")) throw new Error("네이버 상세정보 이미지가 없습니다.");
  return screenshots.map((value) => {
    const image = Buffer.from(value as string, "base64");
    if (!image.length || image.length > 15 * 1024 * 1024) throw new Error("네이버 상세정보 이미지 크기를 확인해 주세요.");
    return image;
  });
}
