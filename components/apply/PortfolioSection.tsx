import { portfolioItems } from "@/data/site";

export function PortfolioSection() {
  return (
    <section id="portfolio" aria-labelledby="portfolio-title" className="overflow-hidden bg-[#111] py-20 lg:py-[140px]">
      <div className="mx-auto mb-10 max-w-[1280px] px-4 sm:px-6 lg:mb-14 lg:px-10">
        <p className="text-[14px] font-medium tracking-[0.18em] text-slate-400">PORTFOLIO</p>
        <h2 id="portfolio-title" className="mt-3 text-[38px] font-medium leading-[1.08] tracking-[-0.04em] text-white sm:text-[44px] lg:text-[52px]">제품의 장점을, 고객의 구매 이유로.</h2>
        <p className="mt-5 max-w-[620px] text-[15px] leading-7 text-slate-300">제품마다 다른 문제를 살펴보고, 정보의 순서와 문장을 다듬은 작업을 모았습니다.</p>
        <a href="/works" className="mt-6 inline-flex text-[14px] font-medium text-white underline decoration-[#99CAFF] decoration-2 underline-offset-4 transition hover:text-[#99CAFF]">전체 작업물 보기 →</a>
      </div>
      <div className="portfolio-marquee overflow-hidden">
        <div className="animate-portfolio-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-4 pr-4 lg:gap-8 lg:pr-8">
              {portfolioItems.map((item) => (
                <article key={item.category} className="w-[210px] shrink-0 md:w-[260px] lg:w-[330px]">
                  <div className="h-[340px] rounded-[14px] bg-[#f1f3f9] md:h-[420px] lg:h-[540px] lg:rounded-[20px]" />
                  <h3 className="mt-3 px-1 text-[16px] font-semibold leading-normal tracking-[-0.02em] text-white lg:mt-4 lg:text-[24px]">{item.category}</h3>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
