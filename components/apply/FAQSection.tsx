import { applyFaqItems, applySiteConfig } from "@/data/apply";

export function FAQSection() {
  return (
    <section id="faq" className="bg-[#faf8f3] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-[13px] font-semibold tracking-[0.18em] text-[#748456]">FAQ</p>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] text-[#1f2a24] sm:text-[46px]">
            자주 묻는 질문
          </h2>
          <p className="mt-4 max-w-[500px] text-[17px] leading-8 text-[#586257]">
            무료 진단만 받아도 괜찮습니다. 상황에 따라 제작이나 리뉴얼이 필요할
            때만 다음 방향을 제안드립니다.
          </p>
          <a
            href={applySiteConfig.emailHref}
            className="mt-6 inline-flex text-[14px] font-semibold text-[#1f2a24] underline decoration-[#748456] decoration-2 underline-offset-4"
          >
            {applySiteConfig.email}
          </a>
        </div>

        <div className="space-y-3">
          {applyFaqItems.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className="group rounded-[20px] border border-[#ded7c7] bg-[#fffdf8] px-5 py-5"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-[18px] font-semibold tracking-[-0.03em] text-[#1f2a24]">
                  {item.question}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf0e3] text-[22px] leading-none text-[#748456] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl pr-2 text-[15px] leading-7 text-[#586257]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
