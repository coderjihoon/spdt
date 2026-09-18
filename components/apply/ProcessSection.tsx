import { applyProcessSteps } from "@/data/apply";

export function ProcessSection() {
  return (
    <section id="process" className="bg-[#faf8f3] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        <div className="max-w-[760px]">
          <p className="text-[13px] font-semibold tracking-[0.18em] text-[#748456]">PROCESS</p>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] text-[#1f2a24] sm:text-[46px]">
            신청은 간단합니다
          </h2>
          <p className="mt-4 text-[17px] leading-8 text-[#586257]">
            자료가 완벽하지 않아도 됩니다. 현재 상태를 기준으로 먼저 막히는
            지점을 찾아드립니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {applyProcessSteps.map((item) => (
            <article
              key={item.step}
              className="rounded-[24px] border border-[#ded7c7] bg-[#fffdf8] p-6"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#1f2a24] text-[16px] font-semibold text-[#faf8f3]">
                {item.step}
              </span>
              <h3 className="mt-6 text-[20px] font-semibold leading-7 tracking-[-0.035em] text-[#1f2a24]">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-[#586257]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
