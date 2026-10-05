"""One-shot public Naver detail probe in an Apify hosted browser."""

import asyncio
import os

from apify import Actor
from playwright.async_api import async_playwright


async def main():
    async with Actor:
        data = await Actor.get_input() or {}
        url = data["url"]
        if not url.startswith((
            "https://smartstore.naver.com/",
            "https://brand.naver.com/",
        )):
            raise ValueError("Expected a public Naver product URL")

        proxy = {
            "server": "http://{}:{}".format(
                os.environ["APIFY_PROXY_HOSTNAME"],
                os.environ["APIFY_PROXY_PORT"],
            ),
            "username": "groups-RESIDENTIAL,country-KR",
            "password": os.environ["APIFY_PROXY_PASSWORD"],
        }
        async with async_playwright() as playwright:
            browser = await playwright.chromium.launch(headless=True, proxy=proxy)
            page = await browser.new_page(viewport={"width": 1280, "height": 900})
            try:
                response = await page.goto(url, wait_until="domcontentloaded", timeout=45000)
                await page.wait_for_timeout(5000)
                button = page.locator('button[data-shp-area="detailitm.more"]')
                if await button.count():
                    await button.first.click(timeout=5000)
                    await page.wait_for_timeout(1500)
                result = await page.evaluate("""() => ({
                    title: document.title,
                    bodyStart: document.body.innerText.slice(0, 250),
                    hasDetail: !!document.querySelector('#DEFAULT .se-main-container'),
                    detailTextChars: document.querySelector('#DEFAULT .se-main-container')?.innerText.length || 0,
                    detailImageTags: document.querySelectorAll('#DEFAULT .se-main-container img').length,
                    hasSecurityCheck: /보안 확인|로그인|자동입력|시스템오류/.test(document.body.innerText.slice(0, 1500))
                })""")
                result["status"] = response.status if response else None
            except Exception as error:
                result = {"error": type(error).__name__, "message": str(error)[:200]}
            finally:
                await browser.close()
        await Actor.push_data(result)


asyncio.run(main())
