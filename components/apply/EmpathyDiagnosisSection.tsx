"use client";

import { useEffect, useRef, useState } from "react";

const diagnosisPerspectives = [
  {
    number: "01",
    title: "살 이유가 보이는가",
    description: "제품의 핵심 장점과 고객이 얻는 이점이 명확하게 전달되는지 확인합니다.",
    checks: "핵심 소구점 · 고객이 얻는 이점",
  },
  {
    number: "02",
    title: "설득 순서가 자연스러운가",
    description: "고객이 궁금해할 정보가 필요한 시점에 나오는지 확인합니다.",
    checks: "정보 우선순위 · 설명 흐름",
  },
  {
    number: "03",
    title: "구매를 망설일 이유가 남아 있는가",
    description: "효과에 대한 근거, 사용법, 옵션 등 결정에 필요한 정보가 빠져 있는지 확인합니다.",
    checks: "신뢰 근거 · 사용법 · 옵션 안내",
  },
];

export function EmpathyDiagnosisSection({ centered = false }: { centered?: boolean }) {
  const titleId = centered ? "empathy-diagnosis-title-centered" : "empathy-diagnosis-title";
  const sectionRef = useRef<HTMLElement>(null);
  const [activePerspective, setActivePerspective] = useState(-1);
  const [pinPhase, setPinPhase] = useState<"before" | "pinned" | "after">("before");

  useEffect(() => {
    if (!centered) return;

    let frame = 0;
    const updateActivePerspective = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;

        const sectionRect = section.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const triggerLine = window.innerHeight * 0.15;
        const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
        const stepSize = scrollRange / diagnosisPerspectives.length;
        const nextPerspective = sectionTop > triggerLine
          ? -1
          : sectionTop >= 0
            ? 0
            : Math.min(diagnosisPerspectives.length - 1, Math.floor(-sectionTop / stepSize));
        const nextPinPhase = !window.matchMedia("(min-width: 1024px)").matches || sectionTop > 0
          ? "before"
          : sectionRect.bottom > window.innerHeight
            ? "pinned"
            : "after";

        setActivePerspective((current) => current === nextPerspective ? current : nextPerspective);
        setPinPhase((current) => current === nextPinPhase ? current : nextPinPhase);
      });
    };

    updateActivePerspective();
    window.addEventListener("scroll", updateActivePerspective, { passive: true });
    window.addEventListener("resize", updateActivePerspective);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActivePerspective);
      window.removeEventListener("resize", updateActivePerspective);
    };
  }, [centered]);

  return (
    <section ref={sectionRef} id="guide" aria-labelledby={titleId} className={centered ? "relative px-4 py-14 sm:px-6 lg:min-h-[300svh] lg:px-10 lg:py-0" : "px-4 py-14 sm:px-6 lg:px-10 lg:py-24"}>
      <div className={centered
        ? pinPhase === "pinned"
          ? "lg:fixed lg:inset-x-0 lg:top-0 lg:z-10 lg:flex lg:h-screen lg:items-center lg:px-10"
          : pinPhase === "after"
            ? "lg:absolute lg:inset-x-0 lg:bottom-0 lg:flex lg:h-screen lg:items-center lg:px-10"
            : "lg:flex lg:min-h-screen lg:items-center"
        : ""}>
        <div className={centered ? "mx-auto w-full max-w-[1280px] lg:translate-y-10" : "mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16"}>
          <div className={centered ? "mx-auto max-w-[850px] text-center" : "max-w-[850px]"}>
            <p className="text-[14px] font-medium text-[#004EE0]">상세페이지의 문제를 함께 찾는 가이드</p>
            <h2 id={titleId} className="mt-4 text-[clamp(30px,8vw,38px)] font-medium leading-[1.12] tracking-[-0.04em] text-slate-950 sm:text-[44px] lg:text-[52px]">
              어디부터 고쳐야 할지 막막한 상세페이지,<br className="hidden sm:block" /> 함께 짚어드립니다.
            </h2>
            <div className={`mt-6 max-w-[720px] space-y-3 text-[16px] leading-7 text-slate-600 ${centered ? "mx-auto" : ""}`}>
              <p>상페닥터는 고객이 제품을 이해하고 구매를 결정하는 흐름을 따라,<br className="hidden sm:block" /> 상세페이지의 문제와 수정 우선순위를 짚어드립니다.</p>
            </div>
          </div>

          <div className={centered ? "mt-12 pt-8 lg:mt-16 lg:pt-10" : "border-t border-slate-200 pt-8 lg:mt-2 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10"}>
            {!centered && <h3 className="text-[20px] font-medium tracking-[-0.03em] text-slate-900 sm:text-[22px]">상페닥터는 이 세 가지를 확인합니다.</h3>}
            <div className={centered ? "grid gap-4 lg:grid-cols-3" : "mt-6 flex flex-col gap-4"}>
              {diagnosisPerspectives.map((item, index) => {
                const isActive = centered && index === activePerspective;

                return (
                  <article key={item.number} className={`${centered ? "flex min-h-72 flex-col rounded-[20px] p-6 sm:p-7" : "grid min-h-44 grid-cols-[44px_minmax(0,1fr)] gap-x-5 rounded-[20px] border border-[#ececf4] bg-white p-6 sm:p-7"} ${isActive ? "border border-[#004EE0] bg-[#004EE0] text-white" : centered ? "border border-[#ececf4] bg-white text-slate-900" : ""} transition-colors duration-500 motion-reduce:transition-none`}>
                    <span className={`${centered ? "" : "pt-1"} text-[14px] font-medium tracking-[0.12em] ${isActive ? "text-blue-100" : "text-[#004EE0]"}`}>{item.number}</span>
                    <div className={centered ? "flex flex-1 flex-col" : "flex flex-col"}>
                      <h4 className={`${centered ? "mt-7" : ""} text-[20px] font-medium leading-[1.4] tracking-[-0.035em] sm:text-[22px] ${isActive ? "text-white" : "text-slate-900"}`}>{item.title}</h4>
                      <p className={`mt-3 text-[15px] leading-7 ${isActive ? "text-white/85" : "text-slate-600"}`}>{item.description}</p>
                      <p className={`${centered ? "mt-auto w-full" : "mt-5"} border-t pt-4 text-[13px] leading-6 ${isActive ? "border-white/25 text-white/80" : "border-slate-100 text-slate-500"}`}>{item.checks}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
