import { problemCards } from "@/data/site";

export function ProblemSection() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[760px]">
          <p className="text-sm font-medium tracking-[0.18em] text-slate-500">PROBLEM</p>
          <h2 className="mt-3 text-[38px] font-medium leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px] lg:leading-[1.1]">
            제품은 좋은데, 상세페이지에서 설득이 안 되고 있나요?
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {problemCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[20px] bg-[#f7f7fb] p-8 ring-1 ring-inset ring-[#ececf4] lg:p-10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-lg text-[#463fa6] ring-1 ring-inset ring-[#ececf4]">
                *
              </div>
              <h3 className="mt-10 text-2xl font-medium tracking-[-0.04em] text-slate-900">
                {card.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
