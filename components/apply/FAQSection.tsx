import { applyFaqItems, applySiteConfig } from "@/data/apply";

export function FAQSection() {
  return (
    <section id="faq" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-[14px] font-medium tracking-[0.18em] text-slate-500">FAQ</p>
          <h2 className="mt-3 text-[38px] font-medium leading-[1.08] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px]">신청 전에<br />확인해보세요.</h2>
          <p className="mt-5 max-w-[480px] text-[16px] leading-7 text-slate-600">무료 진단만 받아도 됩니다. 제작이 필요할 때에만 제작·리뉴얼 방향을 제안드립니다.</p>
          <a href={applySiteConfig.emailHref} className="mt-6 inline-flex text-[14px] font-medium text-slate-900 underline decoration-[#004EE0] decoration-2 underline-offset-4">{applySiteConfig.email}</a>
        </div>

        <div className="divide-y divide-slate-100 border-y border-slate-100">
          {applyFaqItems.map((item, index) => (
            <details key={item.question} open={index === 0} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-[18px] font-medium tracking-[-0.03em] text-slate-900">{item.question}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#f1f3f9] text-[20px] leading-none text-[#004EE0] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-2xl pr-10 text-[15px] leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
