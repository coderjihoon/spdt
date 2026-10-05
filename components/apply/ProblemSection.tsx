import { applyProblemItems } from "@/data/apply";

const problemIcons = [
  // 전환: 하락하는 그래프
  <><path d="M3 3v18h18" /><path d="m7 8 5 5 4-4 5 5" /><path d="M17 14h4v-4" /></>,
  // 광고비: 지갑
  <><path d="M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v11H5a3 3 0 0 1-3-3V6" /><path d="M20 12h-5v5h5" /><path d="M16 14.5h.01" /></>,
  // 개선 우선순위: 도움말
  <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 2-2.5 3.5" /><path d="M12 17h.01" /></>,
  // 제품 장점 전달: 확성기
  <><path d="m3 10 18-5v14L3 14z" /><path d="M7 15v5h4l-1-4" /><path d="M7 9v6" /></>,
  // 펀딩 준비: 로켓
  <><path d="M12 16 8 12c2-6 6-9 13-9 0 7-3 11-9 13Z" /><circle cx="16" cy="8" r="1.5" /><path d="m8 12-5 1 3-6 5-1M12 16l-1 5 6-3 1-5M7 17c-2 0-4 2-4 4 2 0 4-2 4-4Z" /></>,
  // 페이지 정리: 레이아웃
  <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 9v12" /></>,
];

export function ProblemSection() {
  return (
    <section id="problems" className="bg-[#F2F7FF] px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[780px]">
          <p className="text-[14px] font-medium tracking-[0.18em] text-slate-500">PROBLEM</p>
          <h2 className="mt-3 text-[clamp(28px,8vw,38px)] font-medium leading-[1.08] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px]">혹시 지금<br />이런 상황이신가요?</h2>
          <p className="mt-5 max-w-[620px] text-[16px] leading-7 text-slate-600">아래 상황 중 하나라도 해당한다면, 지금 상세페이지를 점검할 때입니다.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {applyProblemItems.map((item, index) => (
            <article key={item} className="rounded-[20px] bg-white p-6 ring-1 ring-inset ring-[#ececf4] sm:p-7">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-[12px] font-medium text-[#004EE0] ring-1 ring-inset ring-[#ececf4]"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">{problemIcons[index]}</svg></span>
              <p className="mt-8 text-[19px] font-medium leading-7 tracking-[-0.035em] text-slate-900">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
