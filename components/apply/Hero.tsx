"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useDiagnosisSubmit } from "./useDiagnosisSubmit";

const reportRows = [
  { label: "첫 화면", value: "핵심 메시지 보완 필요", width: "w-[78%]" },
  { label: "구매 흐름", value: "근거 순서 재정리", width: "w-[62%]" },
  { label: "카피", value: "고객 언어로 정리", width: "w-[86%]" },
];

export function Hero() {
  const [productUrl, setProductUrl] = useState("");
  const [email, setEmail] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error, progress, progressPercent, busy, submit } = useDiagnosisSubmit();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFileNames(Array.from(event.target.files ?? []).map((file) => file.name));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit({ email, productUrl, files: Array.from(fileInputRef.current?.files ?? []) });
  }

  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-12 sm:px-6 lg:px-10 lg:pb-24 lg:pt-20">
      <div className="absolute inset-x-0 top-16 -z-10 h-[520px] bg-[radial-gradient(circle_at_center,rgba(24,131,255,0.17),transparent_62%)] blur-3xl" />

      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center">
          <p className="text-[14px] font-medium tracking-[0.18em] text-slate-500">FREE DETAIL PAGE DIAGNOSIS</p>
          <h1 className="mt-5 max-w-[680px] text-[40px] font-medium leading-[1.02] tracking-[-0.055em] text-slate-950 [text-wrap:balance] sm:text-[56px] lg:text-[68px]">
            상세페이지가<br />왜 안 팔리는지,<br />먼저 짚어드립니다.
          </h1>
          <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-slate-600 lg:text-[19px]">
            제품 URL이나 이미지 하나만 보내주세요. 구조·카피·디자인 흐름을 살펴본 뒤, 구매를 막는 요소 3가지를 짚어드립니다.
          </p>
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex w-full max-w-[440px] flex-col gap-3">
            <input
              type="url"
              value={productUrl}
              onChange={(event) => setProductUrl(event.target.value)}
              placeholder="https://your-product-url"
              className="h-14 w-full rounded-[12px] border-0 bg-[#f7f7fb] px-4 text-[15px] text-slate-900 outline-none ring-1 ring-inset ring-[#ececf4] transition placeholder:text-slate-400 focus:ring-2 focus:ring-[#1883FF]"
            />

            <div className="flex items-center gap-3 text-[12px] font-medium text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              또는
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <label className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#99CAFF] bg-[#f7f7fb] px-4 text-[14px] font-medium text-[#004EE0] transition hover:bg-[#E3F2FF]">
              <span className="truncate">
                {fileNames.length
                  ? `첨부됨: ${fileNames[0]}${fileNames.length > 1 ? ` 외 ${fileNames.length - 1}장` : ""}`
                  : "상세페이지 이미지 첨부하기"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="결과를 받을 이메일"
              className="h-14 w-full rounded-[12px] border-0 bg-[#f7f7fb] px-4 text-[15px] text-slate-900 outline-none ring-1 ring-inset ring-[#ececf4] transition placeholder:text-slate-400 focus:ring-2 focus:ring-[#1883FF]"
            />

            <button disabled={busy} type="submit" className="mt-1 flex h-14 w-full items-center justify-center rounded-[12px] bg-[#004EE0] text-[13px] font-medium text-white transition hover:bg-[#042E7B] disabled:cursor-wait disabled:opacity-60">
              {busy ? `진단 중입니다 · ${progressPercent}%` : "무료 진단 시작하기 →"}
            </button>
            <p className="text-[12px] leading-5 text-slate-500">진단 목적으로만 사용하며 외부에 공개하지 않습니다.</p>
            {error && <p role="alert" className="rounded-[10px] bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">{error}</p>}
            {progress && <p aria-live="polite" className="rounded-[10px] bg-[#f1f3f9] px-4 py-3 text-[13px] font-medium text-slate-600">{progress}</p>}
          </form>
          <p className="mt-4 text-[13px] text-slate-500">
            <a href="#report-preview" className="underline underline-offset-2 hover:text-slate-700">진단서 예시 보기</a>
          </p>
        </div>

        <div className="mx-auto w-full max-w-[650px] text-left">
          <div className="rounded-[20px] bg-white p-4 ring-1 ring-inset ring-[#ececf4] shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex items-start justify-between gap-5 border-b border-slate-100 pb-5">
              <div>
                <p className="text-[11px] font-medium tracking-[0.2em] text-slate-400">DIAGNOSIS REPORT</p>
                <h2 className="mt-2 text-[24px] font-medium tracking-[-0.04em] text-slate-900 sm:text-[28px]">구매가 멈추는 3가지 지점</h2>
              </div>
              <span className="rounded-[10px] bg-[#004EE0] px-3 py-2 text-[11px] font-medium text-white">FREE</span>
            </div>

            <div className="mt-5 space-y-3">
              {reportRows.map((row, index) => (
                <div key={row.label} className="rounded-[16px] bg-[#f7f7fb] p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-white text-[11px] font-medium text-[#004EE0] ring-1 ring-inset ring-[#ececf4]">0{index + 1}</span>
                      <p className="text-[13px] text-slate-500">{row.label}</p>
                    </div>
                    <p className="text-[13px] font-medium text-slate-800 sm:text-[14px]">{row.value}</p>
                  </div>
                  <div className="mt-4 h-1.5 rounded-full bg-white"><div className={`h-full rounded-full bg-[#1883FF] ${row.width}`} /></div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="rounded-[16px] bg-slate-900 p-5 text-white">
                <p className="text-[11px] font-medium tracking-[0.18em] text-white/55">NEXT ACTION</p>
                <p className="mt-2 text-[16px] font-medium leading-6 tracking-[-0.02em]">고객이 끝까지 읽고 구매를 결정할 수 있도록 정보 순서를 정리합니다.</p>
              </div>
              <div className="flex min-w-[150px] flex-col justify-center rounded-[16px] bg-[#f7f7fb] p-5 ring-1 ring-inset ring-[#ececf4]">
                <p className="text-[11px] text-slate-400">필요 자료</p>
                <p className="mt-1 text-[14px] font-medium text-slate-800">URL 또는 이미지</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
