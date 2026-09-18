import { applyTrustPoints } from "@/data/apply";

export function TrustSection() {
  return (
    <section id="trust" className="bg-[#faf8f3] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[30px] bg-[#1f2a24] p-6 text-[#faf8f3] sm:p-8 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.18em] text-[#cdd7b2]">TRUST</p>
            <h2 className="mt-4 text-[34px] font-semibold leading-[1.12] tracking-[-0.04em] sm:text-[48px]">
              상페닥터는 예쁜 디자인보다 먼저,
              <br />
              팔리는 구조를 봅니다
            </h2>
          </div>
          <p className="text-[17px] leading-8 text-[#dfe4d4]">
            상세페이지를 고친다는 건 이미지를 더 화려하게 만드는 일이 아닙니다.
            고객이 납득하고, 비교하고, 확신하는 순서를 만드는 일입니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {applyTrustPoints.map((item) => (
            <article key={item.title} className="rounded-[22px] border border-white/12 bg-white/[0.06] p-6">
              <h3 className="text-[20px] font-semibold tracking-[-0.035em]">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#dfe4d4]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
