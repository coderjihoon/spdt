"use client";

import { useState } from "react";

const KAKAO_URL = "https://open.kakao.com/me/spdt";

export function ConsultButton({ code, reportUrl, productUrl, imageUrls }: { code: string; reportUrl: string; productUrl?: string; imageUrls: string[] }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const lines = [
      `상담코드: ${code}`,
      "",
      "[상페닥터 진단 리포트]",
      reportUrl,
      ...(productUrl ? ["", `제품 URL: ${productUrl}`] : []),
      ...(imageUrls.length ? ["", "첨부 이미지:", ...imageUrls] : []),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
    } catch {
      setCopied(false);
    }
    window.open(KAKAO_URL, "_blank", "noreferrer");
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold transition hover:bg-white/90"
        style={{ color: "#004EE0" }}
      >
        카카오톡으로 리뉴얼 상담하기
      </button>
      {copied && <p className="mt-2 text-[12px] text-white/70">상담코드({code})가 복사됐어요. 카톡 채팅창에 붙여넣어 주세요.</p>}
    </div>
  );
}
