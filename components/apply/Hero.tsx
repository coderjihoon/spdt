"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useDiagnosisSubmit } from "./useDiagnosisSubmit";

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
      <div aria-hidden="true" className="hero-diagnostic-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[520px] -top-48 h-[800px] w-[800px] bg-[radial-gradient(circle,rgba(24,131,255,0.14),transparent_68%)] lg:-left-[400px]" />
        <div className="absolute -right-[540px] top-[18%] h-[900px] w-[900px] bg-[radial-gradient(circle,rgba(132,119,255,0.12),transparent_68%)] lg:-right-[460px]" />
        <div className="absolute -bottom-[420px] -left-[480px] h-[800px] w-[800px] bg-[radial-gradient(circle,rgba(66,194,255,0.13),transparent_68%)] lg:-left-[280px]" />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* Iconora free previews: personal and commercial use. https://www.iconorastudio.com/ */}
        <Image src="/hero-icons/bar-chart-glass.webp" alt="" width={320} height={320} className="hero-diagnostic-icon absolute -left-8 top-[17%] h-[220px] w-[220px] object-contain xl:-left-16 xl:h-80 xl:w-80" style={{ animationDelay: "-1s", rotate: "-7deg" }} />
        <Image src="/hero-icons/revenue-glass.webp" alt="" width={180} height={180} className="hero-diagnostic-icon absolute -right-7 top-[12%] h-[180px] w-[180px] object-contain" style={{ animationDelay: "-3s", rotate: "6deg" }} />
        <Image src="/hero-icons/wallet-glass.webp" alt="" width={240} height={240} className="hero-diagnostic-icon absolute bottom-[10%] left-[5%] hidden h-60 w-60 object-contain xl:block" style={{ animationDelay: "-5s", rotate: "8deg" }} />
        <Image src="/hero-icons/cash-glass.webp" alt="" width={210} height={210} className="hero-diagnostic-icon absolute bottom-[4%] right-[6%] hidden h-[210px] w-[210px] object-contain xl:block" style={{ animationDelay: "-2s", rotate: "-9deg" }} />
      </div>

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center">
          <p className="text-[14px] font-medium tracking-[0.18em] text-slate-500">FREE DETAIL PAGE DIAGNOSIS</p>
          <h1 className="mt-5 max-w-[680px] text-[40px] font-medium leading-[1.02] tracking-[-0.055em] text-slate-950 [text-wrap:balance] sm:text-[56px] lg:text-[68px]">
            잘 안팔리는 제품의<br />상세페이지를 분석해<br /><span className="text-[#004EE0]">매출을 올립니다.</span>
          </h1>
          <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-slate-600 lg:text-[19px]">
            판매 페이지 주소나 상세페이지 파일을 보내주세요. 고객이 어디서 구매를 망설이는지 확인하고, 먼저 고쳐야 할 3가지 요소를 알려드립니다.
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

            <button disabled={busy} type="submit" className={`relative mt-1 flex h-14 w-full items-center justify-center overflow-hidden rounded-[12px] text-[13px] font-medium text-white transition-colors disabled:cursor-wait ${busy ? "bg-[#3471C8]" : "bg-[#004EE0] hover:bg-[#042E7B]"}`}>
              {busy && <span aria-hidden="true" className={`absolute inset-0 origin-left bg-[#004EE0] transition-transform ease-linear motion-reduce:transition-none ${progressPercent === 100 ? "duration-200" : "duration-[700ms]"}`} style={{ transform: `scaleX(${progressPercent / 100})` }} />}
              <span className="relative">{busy ? `진단 중입니다 · ${progressPercent}%` : "무료 진단 시작하기 →"}</span>
            </button>
            {progress && <p aria-live="polite" className="rounded-[10px] bg-[#f1f3f9] px-4 py-3 text-[13px] font-medium text-slate-600">{progress}</p>}
            <p className="text-[12px] leading-5 text-slate-500">진단 목적으로만 사용하며 외부에 공개되지 않습니다.</p>
            {error && <p role="alert" className="rounded-[10px] bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">{error}</p>}
          </form>
          <p className="mt-4 text-[13px] text-slate-500">
            <a href="#report-preview" className="underline underline-offset-2 hover:text-slate-700">진단서 예시 보기</a>
          </p>
        </div>
      </div>
    </section>
  );
}
