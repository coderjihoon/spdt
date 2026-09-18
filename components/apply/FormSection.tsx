"use client";

import { FormEvent, useState } from "react";
import { applyFormChecklist } from "@/data/apply";

type StartResponse = { accessToken: string; uploads: string[]; error?: string };

export function FormSection() {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const files = Array.from((form.elements.namedItem("pageImage") as HTMLInputElement).files ?? []);
    const productUrl = String(data.get("productUrl") || "").trim();
    if (!productUrl && !files.length) return setError("제품 URL 또는 상세페이지 이미지 중 하나는 꼭 남겨주세요.");
    setError("");
    setProgress("신청을 준비하고 있어요.");
    try {
      const start = await fetch("/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          productUrl,
          files: files.map(({ name, type, size }) => ({ name, type, size })),
        }),
      });
      const payload = await start.json() as StartResponse;
      if (!start.ok || !payload.accessToken) throw new Error(payload.error || "신청을 처리하지 못했습니다.");
      if (files.length) {
        setProgress("이미지를 안전하게 올리고 있어요.");
        await Promise.all(files.map(async (file, index) => {
          const upload = await fetch(payload.uploads[index], { method: "PUT", headers: { "Content-Type": file.type }, body: file });
          if (!upload.ok) throw new Error("이미지 업로드에 실패했습니다.");
        }));
      }
      setProgress("상세페이지를 분석하고 있어요. 최대 2분 정도 걸릴 수 있습니다.");
      const run = await fetch(`/api/diagnoses/${payload.accessToken}/run`, { method: "POST" });
      const result = await run.json() as { reportUrl?: string; error?: string };
      if (!run.ok || !result.reportUrl) throw new Error(result.error || "진단을 완료하지 못했습니다.");
      window.location.assign(result.reportUrl);
    } catch (submitError) {
      setProgress("");
      setError(submitError instanceof Error ? submitError.message : "신청을 처리하지 못했습니다.");
    }
  }

  const busy = Boolean(progress);
  return (
    <section id="diagnosis-form" className="bg-[#f1eadc] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-[13px] font-semibold tracking-[0.18em] text-[#748456]">FREE DIAGNOSIS</p>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] text-[#1f2a24] sm:text-[46px]">무료 진단 신청하기</h2>
          <p className="mt-5 max-w-[480px] text-[17px] leading-8 text-[#586257]">제품 URL이나 상세페이지 이미지를 보내면, 구매를 막는 핵심 요소를 바로 분석해드립니다.</p>
          <div className="mt-8 rounded-[22px] border border-[#d8d0bd] bg-[#fffdf8] p-6">
            <p className="text-[14px] font-semibold text-[#1f2a24]">신청 전 준비하면 좋은 것</p>
            <ul className="mt-4 space-y-3">{applyFormChecklist.map((item) => <li key={item} className="flex items-center gap-3 text-[15px] text-[#586257]"><span className="h-2.5 w-2.5 rounded-full bg-[#748456]" />{item}</li>)}</ul>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="rounded-[30px] border border-[#d8d0bd] bg-[#fffdf8] p-5 shadow-[0_24px_70px_rgba(31,42,36,0.1)] sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block"><span className="text-[13px] font-semibold text-[#1f2a24]">이름/브랜드 <em className="font-normal text-[#7a7f71]">(선택)</em></span><input name="name" type="text" maxLength={100} placeholder="예: 오월브랜드" className="mt-2 h-13 w-full rounded-[16px] border border-[#ded7c7] bg-[#faf8f3] px-4 text-[15px] text-[#1f2a24] outline-none transition placeholder:text-[#9c9a8f] focus:border-[#748456] focus:ring-4 focus:ring-[#748456]/15" /></label>
            <label className="block"><span className="text-[13px] font-semibold text-[#1f2a24]">이메일</span><input required name="email" type="email" autoComplete="email" placeholder="결과를 확인할 이메일" className="mt-2 h-13 w-full rounded-[16px] border border-[#ded7c7] bg-[#faf8f3] px-4 text-[15px] text-[#1f2a24] outline-none transition placeholder:text-[#9c9a8f] focus:border-[#748456] focus:ring-4 focus:ring-[#748456]/15" /></label>
          </div>
          <label className="mt-5 block"><span className="text-[13px] font-semibold text-[#1f2a24]">제품 URL</span><input name="productUrl" type="url" placeholder="https://" aria-describedby={error ? "form-error" : undefined} aria-invalid={Boolean(error)} className="mt-2 h-13 w-full rounded-[16px] border border-[#ded7c7] bg-[#faf8f3] px-4 text-[15px] text-[#1f2a24] outline-none transition placeholder:text-[#9c9a8f] focus:border-[#748456] focus:ring-4 focus:ring-[#748456]/15" /></label>
          <label className="mt-5 block"><span className="text-[13px] font-semibold text-[#1f2a24]">상세페이지 이미지</span><input name="pageImage" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => setSelectedFileName(Array.from(event.target.files ?? []).map((file) => file.name).join(", "))} className="mt-2 block w-full rounded-[16px] border border-dashed border-[#cfc6b2] bg-[#faf8f3] px-4 py-4 text-[14px] text-[#586257] file:mr-4 file:rounded-full file:border-0 file:bg-[#748456] file:px-4 file:py-2 file:text-[13px] file:font-semibold file:text-[#fffdf8]" /><p className="mt-2 text-[12px] leading-5 text-[#7a7f71]">JPG, PNG, WEBP 최대 10장·각 15MB. URL과 이미지를 함께 보내도 됩니다.</p>{selectedFileName && <p className="mt-1 text-[12px] text-[#586257]">{selectedFileName}</p>}</label>
          <label className="mt-5 flex items-start gap-3 text-[13px] leading-5 text-[#586257]"><input required name="consent" type="checkbox" className="mt-1 h-4 w-4 accent-[#748456]" /><span>진단을 위해 입력 정보와 이미지를 최대 30일간 보관하는 것에 동의합니다.</span></label>
          {error && <p id="form-error" role="alert" className="mt-4 text-[13px] font-semibold text-[#b04c2f]">{error}</p>}
          {progress && <p aria-live="polite" className="mt-4 text-[13px] font-semibold text-[#586257]">{progress}</p>}
          <button disabled={busy} type="submit" className="mt-6 flex w-full items-center justify-center rounded-[18px] bg-[#1f2a24] px-6 py-4 text-[15px] font-semibold text-[#faf8f3] transition hover:bg-[#354238] disabled:cursor-wait disabled:opacity-60">{busy ? "진단 중입니다" : "무료 진단 시작하기"}</button>
        </form>
      </div>
    </section>
  );
}
