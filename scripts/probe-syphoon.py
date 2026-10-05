"""Probe Syphoon's public Naver product HTML and seller detail API.

Set SYPHOON_API_KEY in .env.local. The script prints only response summaries.
It never sends or reads a Naver login session.
"""

import json
import argparse
import re
import socket
import urllib.error
import urllib.request
from pathlib import Path


def env_value(name):
    for line in Path(".env.local").read_text().splitlines():
        if line.startswith(name + "="):
            return line.partition("=")[2].strip().strip('"').strip("'")
    return ""


def request_syphoon(payload):
    request = urllib.request.Request(
        "https://naverapi.syphoon.com",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            return response.status, response.read(2_000_000).decode(errors="replace")
    except urllib.error.HTTPError as error:
        return error.code, error.read(2_000).decode(errors="replace")
    except (TimeoutError, socket.timeout):
        return None, "timeout"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--detail-only", action="store_true")
    args = parser.parse_args()
    key = env_value("SYPHOON_API_KEY")
    if not key:
        raise SystemExit("SYPHOON_API_KEY is not configured in .env.local")

    if not args.detail_only:
        product_url = "https://smartstore.naver.com/pizookie/products/7452552588"
        status, body = request_syphoon({"key": key, "url": product_url, "method": "GET"})
        title = re.search(r"<title[^>]*>(.*?)</title>", body, re.I | re.S)
        print("product_html", {
            "http": status,
            "chars": len(body),
            "title": title.group(1).strip()[:100] if title else None,
            "has_detail_container": "se-main-container" in body,
            "has_preloaded_state": "__PRELOADED_STATE__" in body,
            "error_page": "[에러] 에러페이지" in body,
        }, flush=True)

    # These public identifiers come from a prior successful Apify product record.
    # A successful request proves this API can return content, not that the
    # Pizookie page or arbitrary customer URLs are supported.
    channel_uid = "33Yhk9eHBJmH70al6HcEh"
    product_id = "13634965251"
    original_id = "13575275204"
    detail_url = (f"https://smartstore.naver.com/n/v2/channels/{channel_uid}"
                  f"/products/{product_id}/contents/{original_id}/MOBILE?isResponsive=true")
    status, body = request_syphoon({
        "key": key, "url": detail_url,
        "product_url": "https://smartstore.naver.com/deopocket/products/13634965251",
        "method": "GET",
    })
    try:
        response = json.loads(body)
        detail = response.get("data", response)
        content = detail.get("mobileRenderContent", "") if isinstance(detail, dict) else ""
    except (ValueError, AttributeError):
        content = ""
    print("detail_api", {
        "http": status,
        "chars": len(body),
        "detail_chars": len(content),
        "image_tags": len(re.findall(r"<img\b", content, re.I)),
        "error_page": "[에러] 에러페이지" in body,
    })


if __name__ == "__main__":
    main()
