import { applyDiagnosisItems } from "@/data/apply";

export function DiagnosisSection() {
  return (
    <section id="diagnosis" className="bg-[#faf8f3] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-[13px] font-semibold tracking-[0.18em] text-[#748456]">
            DIAGNOSIS
          </p>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] text-[#1f2a24] sm:text-[46px]">
            상페닥터는 이 5가지를 봅니다
          </h2>
          <p className="mt-5 max-w-[460px] text-[17px] leading-8 text-[#586257]">
            감으로 평가하지 않습니다. 고객이 상세페이지를 읽고 결제까지 가는
            흐름을 기준으로 병목을 찾습니다.
          </p>
        </div>

        <div className="rounded-[26px] border border-[#ded7c7] bg-[#fffdf8] p-4 sm:p-6">
          <div className="divide-y divide-[#e8dfce]">
            {applyDiagnosisItems.map((item, index) => (
              <article key={item.title} className="grid gap-4 py-6 first:pt-2 last:pb-2 sm:grid-cols-[120px_1fr]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#748456] text-[12px] font-semibold text-[#fffdf8]">
                    {index + 1}
                  </span>
                  <p className="text-[13px] font-semibold tracking-[0.16em] text-[#7b806e]">
                    CHECK
                  </p>
                </div>
                <div>
                  <h3 className="text-[22px] font-semibold tracking-[-0.035em] text-[#1f2a24]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[16px] leading-7 text-[#586257]">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
