import { applyProblemItems } from "@/data/apply";

export function ProblemSection() {
  return (
    <section id="problems" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[780px]">
          <p className="text-[14px] font-medium tracking-[0.18em] text-slate-500">PROBLEM</p>
          <h2 className="mt-3 text-[38px] font-medium leading-[1.08] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px]">이런 상황이라면<br />먼저 진단이 필요합니다.</h2>
          <p className="mt-5 max-w-[620px] text-[16px] leading-7 text-slate-600">상세페이지에 이미지를 더하기 전, 고객이 어디서 읽기를 멈추는지부터 찾아야 합니다.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {applyProblemItems.map((item, index) => (
            <article key={item} className="rounded-[20px] bg-[#f7f7fb] p-6 ring-1 ring-inset ring-[#ececf4] sm:p-7">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-[12px] font-medium text-[#004EE0] ring-1 ring-inset ring-[#ececf4]">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-8 text-[19px] font-medium leading-7 tracking-[-0.035em] text-slate-900">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
