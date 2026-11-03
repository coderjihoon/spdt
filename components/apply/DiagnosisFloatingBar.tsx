"use client";

import { useEffect, useState } from "react";

export function DiagnosisFloatingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const problemSection = document.getElementById("problems");
      if (!problemSection) return;

      const hasReachedProblems = problemSection.getBoundingClientRect().top <= window.innerHeight;
      setVisible(hasReachedProblems);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-[520px] overflow-hidden rounded-[18px] bg-[#004EE0] shadow-[0_6px_24px_rgba(15,23,42,0.18)] lg:bottom-5">
      <a
        href="#diagnosis-form"
        className="flex min-h-14 w-full items-center justify-center px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#042E7B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        상세페이지 무료 진단하기
      </a>
    </div>
  );
}
