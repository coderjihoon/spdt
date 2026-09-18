import { applyExampleCards } from "@/data/apply";

const labels = [
  { key: "problem", label: "문제점" },
  { key: "reason", label: "왜 문제인지" },
  { key: "direction", label: "개선 방향" },
] as const;

export function ExampleSection() {
  return (
    <section id="examples" className="bg-[#eef0e5] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <p className="text-[13px] font-semibold tracking-[0.18em] text-[#637348]">EXAMPLE</p>
            <h2 className="mt-3 text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] text-[#1f2a24] sm:text-[46px]">
              진단은 이렇게 전달됩니다
            </h2>
          </div>
          <p className="max-w-[360px] text-[15px] leading-7 text-[#586257]">
            추상적인 평가 대신, 문제와 이유 그리고 바로 생각해볼 수 있는 개선
            방향으로 정리합니다.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {applyExampleCards.map((card) => (
            <article
              key={card.eyebrow}
              className="rounded-[26px] border border-[#d7ddc3] bg-[#fffdf8] p-6 shadow-[0_18px_52px_rgba(57,74,53,0.08)] sm:p-8"
            >
              <p className="text-[13px] font-semibold tracking-[0.18em] text-[#748456]">
                {card.eyebrow}
              </p>

              <div className="mt-7 space-y-4">
                {labels.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-[18px] border border-[#e7dfcf] bg-[#faf8f3] p-5"
                  >
                    <p className="text-[12px] font-semibold tracking-[0.14em] text-[#748456]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-[17px] leading-7 tracking-[-0.02em] text-[#1f2a24]">
                      {card[item.key]}
                    </p>
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
