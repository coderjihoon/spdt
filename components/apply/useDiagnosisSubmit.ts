"use client";

import { useState } from "react";

type StartResponse = { accessToken: string; uploads: string[]; queued?: boolean; error?: string };
type SubmitInput = { name?: string; email: string; productUrl: string; files: File[] };

export function useDiagnosisSubmit() {
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  async function submit({ name, email, productUrl, files }: SubmitInput) {
    if (!productUrl && !files.length) return setError("제품 URL 또는 상세페이지 이미지 중 하나는 꼭 남겨주세요.");
    setError("");
    setProgressPercent(0);
    setProgress("신청을 준비하고 있어요.");
    const progressTimer = window.setInterval(() => setProgressPercent((current) => Math.min(current + 1, 95)), 800);
    try {
      const start = await fetch("/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || "", email, productUrl, files: files.map(({ name, type, size }) => ({ name, type, size })) }),
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
      if (payload.queued) {
        window.clearInterval(progressTimer);
        setProgressPercent(50);
        setProgress("운영자 Chrome에서 상세정보를 자동 수집하고 있어요. 브라우저를 닫아도 이메일로 결과를 보내드립니다.");
        for (let attempt = 0; attempt < 180; attempt++) {
          const response = await fetch(`/api/diagnoses/${payload.accessToken}/status`, { cache: "no-store" });
          const state = await response.json() as { status: string; message?: string; reportUrl?: string };
          if (state.reportUrl) { window.location.assign(state.reportUrl); return; }
          if (state.status === "failed") throw new Error(state.message || "진단을 완료하지 못했습니다.");
          if (state.status === "collecting" && state.message) setProgress(state.message);
          if (state.status === "processing") { setProgress("상세정보 수집을 마쳤어요. 보고서를 생성하고 있습니다."); setProgressPercent(80); }
          await new Promise((resolve) => window.setTimeout(resolve, 10_000));
        }
        setProgress("처리가 길어지고 있습니다. 완료되면 입력하신 이메일로 결과를 보내드립니다.");
        return;
      }
      setProgress("상세페이지를 분석하고 있어요. 최대 2분 정도 걸릴 수 있습니다.");
      const run = await fetch(`/api/diagnoses/${payload.accessToken}/run`, { method: "POST" });
      const result = await run.json() as { reportUrl?: string; error?: string };
      if (!run.ok || !result.reportUrl) throw new Error(result.error || "진단을 완료하지 못했습니다.");
      const reportUrl = result.reportUrl;
      (window as Window & { fbq?: (command: string, event: string) => void }).fbq?.("track", "Lead");
      window.clearInterval(progressTimer);
      setProgressPercent(100);
      window.setTimeout(() => window.location.assign(reportUrl), 250);
    } catch (submitError) {
      window.clearInterval(progressTimer);
      setProgress("");
      setProgressPercent(0);
      setError(submitError instanceof Error ? submitError.message : "신청을 처리하지 못했습니다.");
    }
  }

  return { error, progress, progressPercent, busy: Boolean(progress), submit };
}
