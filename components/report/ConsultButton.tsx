"use client";

import { useState } from "react";

const KAKAO_URL = "https://open.kakao.com/me/spdt";

export function ConsultButton({ code, productUrl, imageUrls, header = false }: { code: string; productUrl?: string; imageUrls: string[]; header?: boolean }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied" | "failed">("idle");
  const [message, setMessage] = useState("");

  async function handleClick() {
    const lines = [
      `상담코드: ${code}`,
      "",
      "[상페닥터 진단 리포트]",
      `${window.location.origin}${window.location.pathname}`,
      ...(productUrl ? ["", `제품 URL: ${productUrl}`] : []),
      ...(imageUrls.length ? ["", "첨부 이미지:", ...imageUrls] : []),
    ];
    const text = lines.join("\n");
    setMessage(text);
    setCopyStatus("copying");
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  return (
    <div className={header ? "max-w-[240px] sm:max-w-sm" : "mt-5"}>
      <a
        href={KAKAO_URL}
        target="_blank"
        rel="noreferrer"
        onClick={handleClick}
        className={header
          ? "inline-flex items-center rounded-[10px] bg-[#004EE0] px-4 py-2.5 text-[12px] font-medium text-white transition hover:bg-[#042E7B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]"
          : "inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-[#004EE0] transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"}
      >
        {header ? "상담하기" : "카카오톡으로 리뉴얼 상담하기"}
      </a>
      <div role="status" className={`${copyStatus === "idle" ? "" : "mt-2"} text-[12px] leading-5 ${header ? "text-slate-600" : "text-white"}`}>
        {copyStatus === "copying" && <p>상담 내용을 복사하고 있어요.</p>}
        {copyStatus === "copied" && <p>상담코드({code})와 진단서 주소를 복사했어요. 카톡 채팅창에 붙여넣어 주세요.</p>}
        {copyStatus === "failed" && <p>자동 복사가 안 됐어요. 아래 내용을 직접 복사해 카톡 채팅창에 붙여넣어 주세요.</p>}
      </div>
      {copyStatus === "failed" && <textarea aria-label="직접 복사할 상담 내용" readOnly value={message} onFocus={(event) => event.currentTarget.select()} rows={4} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-[12px] leading-5 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0]" />}
      {copyStatus !== "idle" && <a href={KAKAO_URL} className={`mt-2 inline-block text-[12px] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 ${header ? "text-[#004EE0] focus-visible:outline-[#004EE0]" : "text-white focus-visible:outline-white"}`}>카톡이 열리지 않으면 여기서 직접 열기</a>}
    </div>
  );
}
