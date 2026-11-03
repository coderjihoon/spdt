"""Probe Syphoon's public Naver product HTML and seller detail API.

Set SYPHOON_NAVER_HTML_KEY and SYPHOON_NAVER_PDP_KEY in .env.local.
The script prints only response summaries and never prints API keys or body content.
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


def error_hint(body, keys):
    hint = body
    for key in keys:
        if key:
            hint = hint.replace(key, "[redacted]")
    hint = re.sub(r"\b[A-Za-z0-9_-]{16,}\b", "[redacted]", hint)
    return re.sub(r"\s+", " ", hint).strip()[:120]


def summarize_detail_contents(value):
    summaries = []

    def visit(item, path="detailContents"):
        if len(summaries) >= 12:
            return
        if isinstance(item, dict):
            for key, child in item.items():
                next_path = f"{path}.{key}"
                if isinstance(child, str) and re.search(r"detail|content|html|description|mobile", key, re.I):
                    summaries.append({
                        "path": next_path,
                        "type": "string",
                        "chars": len(child),
                        "image_tags": len(re.findall(r"<img\b", child, re.I)),
                    })
                elif re.search(r"detail|content|html|description|mobile", key, re.I):
                    summaries.append({"path": next_path, "type": type(child).__name__})
                elif isinstance(child, (dict, list)):
                    visit(child, next_path)
        elif isinstance(item, list):
            for index, child in enumerate(item):
                visit(child, f"{path}[{index}]")

    visit(value)
    first_keys = []
    if isinstance(value, list) and value and isinstance(value[0], dict):
        first_keys = sorted(value[0].keys())
    elif isinstance(value, dict):
        first_keys = sorted(value.keys())
    return {"type": type(value).__name__, "count": len(value) if isinstance(value, list) else None,
            "keys": first_keys[:30], "fields": summaries}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--detail-only", action="store_true")
    args = parser.parse_args()
    html_key = env_value("SYPHOON_NAVER_HTML_KEY")
    pdp_key = env_value("SYPHOON_NAVER_PDP_KEY")
    if not html_key or not pdp_key:
        raise SystemExit("SYPHOON_NAVER_HTML_KEY and SYPHOON_NAVER_PDP_KEY are required in .env.local")

    if not args.detail_only:
        product_url = "https://smartstore.naver.com/pizookie/products/7452552588"
        status, body = request_syphoon({"key": html_key, "url": product_url, "method": "GET"})
        try:
            parsed = json.loads(body)
            if isinstance(parsed, dict):
                body = str(parsed.get("data", body))
        except (ValueError, TypeError):
            pass
        title = re.search(r"<title[^>]*>(.*?)</title>", body, re.I | re.S)
        print("product_html", {
            "http": status,
            "chars": len(body),
            "title": re.sub(r"<[^>]+>", "", title.group(1)).strip()[:100] if title else None,
            "has_detail_container": "se-main-container" in body or 'id="DEFAULT"' in body,
            "detail_image_tags": len(re.findall(r"<img\b", body, re.I)),
            "has_preloaded_state": "__PRELOADED_STATE__" in body,
            "error_page": "[에러] 에러페이지" in body or "시스템오류" in body,
            "login_page": bool(re.search(r"<title[^>]*>[^<]*(?:sign in|로그인)", body, re.I)),
            "error_hint": error_hint(body, [html_key]) if status and status >= 400 else None,
        }, flush=True)

    # These public identifiers come from a prior Apify product record.
    # The product endpoint is documented by Syphoon; it must return seller content
    # before this provider can replace the existing browser collector.
    channel_uid = "33Yhk9eHBJmH70al6HcEh"
    product_id = "13634965251"
    detail_url = (f"https://smartstore.naver.com/i/v2/channels/{channel_uid}"
                  f"/products/{product_id}?withWindow=false")
    product_url = f"https://smartstore.naver.com/deopocket/products/{product_id}"
    status, body = request_syphoon({
        "key": pdp_key, "url": detail_url,
        "product_url": product_url,
        "method": "GET",
    })
    try:
        response = json.loads(body)
        data = response.get("data", response)
        content = data.get("detailContent", "") if isinstance(data, dict) else ""
    except (ValueError, AttributeError):
        response = {}
        data = {}
        content = ""
    print("detail_api", {
        "http": status,
        "chars": len(body),
        "detail_chars": len(content),
        "image_tags": len(re.findall(r"<img\b", content, re.I)),
        "error_page": "[에러] 에러페이지" in body,
        "product_title_present": bool(isinstance(data, dict) and (data.get("name") or data.get("productName"))),
        "payload_keys": sorted(data.keys())[:30] if isinstance(data, dict) else [],
        "detail_contents": summarize_detail_contents(data.get("detailContents")) if isinstance(data, dict) else None,
        "error_hint": error_hint(body, [pdp_key]) if status and status >= 400 else None,
    })

    original_id = "13575275204"
    content_url = (f"https://smartstore.naver.com/n/v2/channels/{channel_uid}"
                   f"/products/{product_id}/contents/{original_id}/MOBILE?isResponsive=true")
    status, body = request_syphoon({
        "key": pdp_key, "url": content_url,
        "product_url": product_url,
        "method": "GET",
    })
    try:
        response = json.loads(body)
        detail = response.get("data", response)
        content = detail.get("mobileRenderContent", "") if isinstance(detail, dict) else ""
    except (ValueError, AttributeError):
        content = ""
    print("detail_content_api", {
        "http": status,
        "chars": len(body),
        "detail_chars": len(content) if isinstance(content, str) else 0,
        "image_tags": len(re.findall(r"<img\b", content, re.I)) if isinstance(content, str) else 0,
        "error_hint": error_hint(body, [pdp_key]) if status and status >= 400 else None,
    })


if __name__ == "__main__":
    main()
