import { applyProblemItems } from "@/data/apply";

export function ProblemSection() {
  return (
    <section id="problems" className="bg-[#faf8f3] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        <div className="max-w-[760px]">
          <p className="text-[13px] font-semibold tracking-[0.18em] text-[#748456]">PROBLEM</p>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] text-[#1f2a24] sm:text-[46px]">
            이런 상황이라면 먼저 진단이 필요합니다
          </h2>
          <p className="mt-4 text-[17px] leading-8 text-[#586257]">
            상세페이지는 예쁜 이미지보다 먼저, 고객이 왜 멈추는지 찾는 일이
            필요합니다.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {applyProblemItems.map((item, index) => (
            <article
              key={item}
              className="group rounded-[20px] border border-[#ded7c7] bg-[#fffdf8] p-6 transition hover:-translate-y-1 hover:border-[#b9c197] hover:shadow-[0_18px_46px_rgba(31,42,36,0.09)]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#edf0e3] text-[13px] font-semibold text-[#5f7045]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-5 text-[18px] font-semibold leading-7 tracking-[-0.03em] text-[#1f2a24]">
                {item}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
