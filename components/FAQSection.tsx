import { faqItems, siteConfig } from "@/data/site";

export function FAQSection() {
  return (
    <section id="faq" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="lg:pr-8">
          <p className="text-sm font-medium tracking-[0.18em] text-slate-500">FAQ</p>
          <h2 className="mt-3 text-[38px] font-medium leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px] lg:leading-[1.1]">
            자주 묻는 질문
          </h2>
          <p className="mt-4 max-w-[520px] text-base leading-7 text-slate-600">
            아래 내용을 먼저 확인해 보시고 프로젝트 상황이 다르면 메일로 바로
            문의해 주세요.
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-6 inline-flex text-sm font-medium text-slate-900 underline underline-offset-4"
          >
            {siteConfig.email}
          </a>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className="group rounded-[20px] bg-[#f7f7fb] px-6 py-5 ring-1 ring-inset ring-[#ececf4]"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-lg font-medium tracking-[-0.03em] text-slate-900">
                  {item.question}
                </span>
                <span className="text-2xl text-slate-400 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl pr-6 text-base leading-7 text-slate-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
