"use client";

import { useState } from "react";
import { portfolioItems } from "@/data/site";

export function PortfolioSection() {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? portfolioItems : portfolioItems.slice(0, 2);

  return (
    <section id="portfolio" className="bg-[#f7f7fb] px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[780px]">
            <p className="text-[14px] font-medium tracking-[0.18em] text-slate-500">PORTFOLIO</p>
            <h2 className="mt-3 text-[38px] font-medium leading-[1.08] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px]">작업 사례입니다.</h2>
          </div>
          <p className="max-w-[380px] text-[15px] leading-7 text-slate-600">제품의 장점이 고객의 구매 이유로 이어지도록 구조와 카피, 화면 순서를 다시 설계합니다.</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {visibleItems.map((item, index) => (
            <article key={item.category} className="overflow-hidden rounded-[20px] bg-white ring-1 ring-inset ring-[#ececf4]">
              <div className={`h-44 bg-gradient-to-br ${item.accent} p-6 sm:p-7`}>
                <div className="flex h-full flex-col justify-between rounded-[16px] bg-white/80 p-5 ring-1 ring-inset ring-white">
                  <div className="flex items-center justify-between">
                    <span className="rounded-[10px] bg-[#004EE0] px-3 py-1.5 text-[11px] font-medium text-white">{item.chip}</span>
                    <span className="text-[11px] tracking-[0.18em] text-slate-400">CASE 0{index + 1}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 w-1/3 rounded-full bg-slate-200" />
                    <div className="h-2.5 w-4/5 rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-7">
                <p className="text-[12px] font-medium tracking-[0.16em] text-slate-400">{item.category}</p>
                <h3 className="mt-3 text-[22px] font-medium tracking-[-0.035em] text-slate-900">{item.scope}</h3>
                <p className="mt-3 text-[15px] leading-7 text-slate-600">{item.insight}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button type="button" onClick={() => setExpanded((value) => !value)} className="rounded-[12px] bg-white px-5 py-3 text-[13px] font-medium text-slate-700 ring-1 ring-inset ring-[#ececf4] transition hover:bg-slate-50">
            {expanded ? "포트폴리오 접기" : `포트폴리오 전체 보기 (${portfolioItems.length})`}
          </button>
        </div>
      </div>
    </section>
  );
}
