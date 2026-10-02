"use client";

import { useState } from "react";

const KAKAO_URL = "https://open.kakao.com/me/spdt";

export function ConsultButton({ code, productUrl, imageUrls, header = false }: { code: string; productUrl?: string; imageUrls: string[]; header?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const lines = [
      `상담코드: ${code}`,
      "",
      "[상페닥터 진단 리포트]",
      window.location.href,
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
    <div className={header ? "" : "mt-5"}>
      <button
        type="button"
        onClick={handleClick}
        className={header
          ? "inline-flex items-center rounded-[10px] bg-[#004EE0] px-4 py-2.5 text-[12px] font-medium text-white transition hover:bg-[#042E7B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]"
          : "inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-[#004EE0] transition hover:bg-white/90"}
      >
        {header ? "상담하기" : "카카오톡으로 리뉴얼 상담하기"}
      </button>
      {copied && <p className={`mt-2 text-[12px] ${header ? "text-slate-600" : "text-white/70"}`}>상담코드({code})가 복사됐어요. 카톡 채팅창에 붙여넣어 주세요.</p>}
    </div>
  );
}
