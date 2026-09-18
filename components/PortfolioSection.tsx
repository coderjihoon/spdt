import { portfolioItems } from "@/data/site";

export function PortfolioSection() {
  return (
    <section id="portfolio" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[780px]">
          <p className="text-sm font-medium tracking-[0.18em] text-slate-500">PORTFOLIO</p>
          <h2 className="mt-3 text-[38px] font-medium leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px] lg:leading-[1.1]">
            예쁘게 끝내는 것보다,
            <br className="hidden sm:block" />
            이해되게 끝내는 게 중요합니다.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {portfolioItems.map((item) => (
            <article
              key={item.category}
              className="overflow-hidden rounded-[20px] bg-white ring-1 ring-inset ring-[#ececf4]"
            >
              <div className={`relative h-72 overflow-hidden bg-gradient-to-br ${item.accent}`}>
                <div className="absolute inset-6 rounded-[20px] bg-white p-5 ring-1 ring-inset ring-[#ececf4]">
                  <div className="flex items-center justify-between">
                    <span className="rounded-[10px] bg-[#463fa6] px-3 py-1.5 text-[11px] font-medium text-white">
                      {item.chip}
                    </span>
                    <span className="text-[11px] tracking-[0.2em] text-slate-400">PREVIEW</span>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="h-3 w-24 rounded-full bg-[#e6e8f3]" />
                    <div className="h-3 w-4/5 rounded-full bg-[#f1f3f9]" />
                    <div className="h-3 w-3/5 rounded-full bg-[#f1f3f9]" />
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-[16px] bg-[#f7f7fb] p-4">
                      <div className="h-3 w-16 rounded-full bg-white" />
                      <div className="mt-3 h-20 rounded-[14px] bg-white ring-1 ring-inset ring-[#ececf4]" />
                    </div>
                    <div className="rounded-[16px] bg-[#f7f7fb] p-4">
                      <div className="h-3 w-20 rounded-full bg-white" />
                      <div className="mt-3 space-y-2">
                        <div className="h-3 rounded-full bg-white ring-1 ring-inset ring-[#ececf4]" />
                        <div className="h-3 w-4/5 rounded-full bg-white ring-1 ring-inset ring-[#ececf4]" />
                        <div className="h-3 w-3/5 rounded-full bg-white ring-1 ring-inset ring-[#ececf4]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <p className="text-sm font-medium tracking-[0.18em] text-slate-400">
                  {item.category}
                </p>
                <h3 className="mt-3 text-2xl font-medium tracking-[-0.04em] text-slate-900">
                  {item.scope}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{item.insight}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
