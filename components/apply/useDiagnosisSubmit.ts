"use client";

import { useState } from "react";

type StartResponse = { accessToken: string; uploads: string[]; error?: string };
type SubmitInput = { name?: string; email: string; productUrl: string; files: File[] };

export function useDiagnosisSubmit() {
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  async function submit({ name, email, productUrl, files }: SubmitInput) {
    if (!productUrl && !files.length) return setError("제품 URL 또는 상세페이지 이미지 중 하나는 꼭 남겨주세요.");
    setError("");
    setProgress("신청을 준비하고 있어요.");
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

  return { error, progress, busy: Boolean(progress), submit };
}
