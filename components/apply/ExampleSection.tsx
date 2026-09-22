import { applyExampleCards } from "@/data/apply";

const labels = [
  { key: "problem", label: "문제점" },
  { key: "reason", label: "왜 문제인지" },
  { key: "direction", label: "개선 방향" },
] as const;

export function ExampleSection() {
  return (
    <section id="examples" className="bg-[#f7f7fb] px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[780px]">
            <p className="text-[14px] font-medium tracking-[0.18em] text-slate-500">REPORT EXAMPLE</p>
            <h2 className="mt-3 text-[38px] font-medium leading-[1.08] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px]">문제와 이유,<br />다음 방향까지 정리합니다.</h2>
          </div>
          <p className="max-w-[380px] text-[15px] leading-7 text-slate-600">문제와 이유를 짚고, 개선 방향까지 한 흐름으로 전달합니다.</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {applyExampleCards.map((card, cardIndex) => (
            <article key={card.eyebrow} className="rounded-[20px] bg-white p-6 ring-1 ring-inset ring-[#ececf4] sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <p className="text-[13px] font-medium tracking-[0.18em] text-[#004EE0]">{card.eyebrow}</p>
                <span className="text-[12px] text-slate-400">CASE 0{cardIndex + 1}</span>
              </div>
              <div className="mt-2">
                {labels.map((item, index) => (
                  <div key={item.key} className="grid gap-2 border-b border-slate-100 py-5 last:border-0 sm:grid-cols-[110px_1fr]">
                    <p className="text-[12px] font-medium tracking-[0.12em] text-slate-400">0{index + 1} · {item.label}</p>
                    <p className="text-[16px] leading-7 tracking-[-0.02em] text-slate-700">{card[item.key]}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
