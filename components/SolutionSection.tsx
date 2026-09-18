import { solutionCards } from "@/data/site";

export function SolutionSection() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
        <div>
          <p className="text-sm font-medium tracking-[0.18em] text-slate-500">SOLUTION</p>
          <h2 className="mt-3 text-[38px] font-medium leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px] lg:leading-[1.1]">
            예쁜데 안 팔리는 건,
            <br className="hidden sm:block" />
            순서가 없어서입니다.
          </h2>
          <p className="mt-5 max-w-[520px] text-base leading-7 text-slate-600">
            아무리 좋은 제품이라도 구조 없이 늘어놓으면 설득력이 약해집니다.
            고객이 이해하고 납득할 순서를 먼저 세우고 그 위에 카피와 디자인을
            얹습니다.
          </p>
        </div>

        <div className="rounded-[20px] bg-[#f7f7fb] p-5 ring-1 ring-inset ring-[#ececf4] sm:p-8">
          <div className="rounded-[20px] bg-white p-5 ring-1 ring-inset ring-[#ececf4] sm:p-6">
            {solutionCards.map((card, index) => (
              <article
                key={card.title}
                className={`grid gap-3 rounded-[16px] px-4 py-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:items-start ${
                  index !== solutionCards.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#463fa6] text-[11px] font-medium text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.03em] text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
