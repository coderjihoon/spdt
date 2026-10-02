"use client";

import { FormEvent, useState } from "react";
import { applyFormChecklist } from "@/data/apply";
import { useDiagnosisSubmit } from "./useDiagnosisSubmit";

const inputClass = "mt-2 h-14 w-full rounded-[12px] border-0 bg-[#f7f7fb] px-4 text-[15px] text-slate-900 outline-none ring-1 ring-inset ring-[#ececf4] transition placeholder:text-slate-400 focus:ring-2 focus:ring-[#1883FF]";

export function FormSection() {
  const [selectedFileName, setSelectedFileName] = useState("");
  const { error, progress, progressPercent, busy, submit } = useDiagnosisSubmit();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const files = Array.from((form.elements.namedItem("pageImage") as HTMLInputElement).files ?? []);
    submit({
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      productUrl: String(data.get("productUrl") || "").trim(),
      files,
    });
  }

  return (
    <section id="diagnosis-form" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_18%_25%,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_70%_85%,rgba(153,202,255,0.3),transparent_25%),linear-gradient(135deg,#1883FF_0%,#004EE0_70%)] p-5 sm:p-8 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="text-white lg:sticky lg:top-28">
            <p className="text-[14px] font-medium tracking-[0.18em] text-white/55">FREE DIAGNOSIS</p>
            <h2 className="mt-3 text-[38px] font-medium leading-[1.08] tracking-[-0.05em] sm:text-[44px] lg:text-[52px]">지금 막히는 곳부터<br />확인해보세요.</h2>
            <p className="mt-5 max-w-[480px] text-[16px] leading-8 text-white/75">제품 URL이나 상세페이지 이미지 하나만 보내주세요. 구매를 막는 핵심 요소 3가지를 분석해드립니다.</p>
            <ul className="mt-8 space-y-3">
              {applyFormChecklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] text-white/75"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/14 text-[10px] text-white">✓</span>{item}</li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[20px] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-8">
            <div className="flex items-end justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-[12px] font-medium tracking-[0.16em] text-[#004EE0]">APPLICATION</p>
                <h3 className="mt-2 text-[26px] font-medium tracking-[-0.04em] text-slate-950">무료 진단 신청</h3>
              </div>
              <p className="text-[12px] text-slate-400">약 1분 소요</p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block"><span className="text-[13px] font-medium text-slate-700">이름 또는 브랜드 <em className="font-normal text-slate-400">(선택)</em></span><input name="name" type="text" maxLength={100} placeholder="예: 오월브랜드" className={inputClass} /></label>
              <label className="block"><span className="text-[13px] font-medium text-slate-700">이메일</span><input required name="email" type="email" autoComplete="email" placeholder="결과를 받을 이메일" className={inputClass} /></label>
            </div>

            <label className="mt-5 block"><span className="text-[13px] font-medium text-slate-700">제품 URL 입력</span><input name="productUrl" type="url" placeholder="https://" aria-describedby={error ? "form-error" : undefined} aria-invalid={Boolean(error)} className={inputClass} /></label>

            <label className="mt-5 block">
              <span className="text-[13px] font-medium text-slate-700">상세페이지 이미지 첨부</span>
              <input name="pageImage" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => setSelectedFileName(Array.from(event.target.files ?? []).map((file) => file.name).join(", "))} className="mt-2 block w-full rounded-[12px] bg-[#f7f7fb] px-4 py-4 text-[13px] text-slate-500 ring-1 ring-inset ring-[#ececf4] file:mr-4 file:rounded-[9px] file:border-0 file:bg-[#004EE0] file:px-4 file:py-2.5 file:text-[12px] file:font-medium file:text-white" />
              <p className="mt-2 text-[12px] leading-5 text-slate-400">JPG, PNG, WEBP는 최대 10장, 각 15MB까지 올릴 수 있습니다. URL과 이미지를 함께 보내도 됩니다.</p>
              {selectedFileName && <p className="mt-1 truncate text-[12px] text-slate-600">{selectedFileName}</p>}
            </label>

            <label className="mt-5 flex items-start gap-3 text-[13px] leading-5 text-slate-500"><input required name="consent" type="checkbox" className="mt-0.5 h-4 w-4 accent-[#004EE0]" /><span>진단 및 상담을 위해 입력 정보와 이미지를 보관하는 것에 동의합니다. 보관된 자료는 진단 목적 외에는 사용하거나 외부에 공개하지 않으며, 삭제를 원하시면 언제든 요청하실 수 있습니다.</span></label>
            {error && <p id="form-error" role="alert" className="mt-4 rounded-[10px] bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">{error}</p>}
            {progress && <p aria-live="polite" className="mt-4 rounded-[10px] bg-[#f1f3f9] px-4 py-3 text-[13px] font-medium text-slate-600">{progress}</p>}
            <button disabled={busy} type="submit" className={`relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-[12px] px-6 py-4 text-[13px] font-medium text-white transition-colors disabled:cursor-wait ${busy ? "bg-[#3471C8]" : "bg-[#004EE0] hover:bg-[#042E7B]"}`}>
              {busy && <span aria-hidden="true" className={`absolute inset-0 origin-left bg-[#004EE0] transition-transform ease-linear motion-reduce:transition-none ${progressPercent === 100 ? "duration-200" : "duration-[700ms]"}`} style={{ transform: `scaleX(${progressPercent / 100})` }} />}
              <span className="relative">{busy ? `진단 중입니다 · ${progressPercent}%` : "무료 진단 시작하기"}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
