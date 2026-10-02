import { applyTrustPoints } from "@/data/apply";

export function TrustSection() {
  return (
    <section id="trust" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px] rounded-[20px] bg-slate-950 px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-[14px] font-medium tracking-[0.18em] text-white/45">HOW WE LOOK AT A PAGE</p>
            <h2 className="mt-3 text-[38px] font-medium leading-[1.08] tracking-[-0.05em] sm:text-[44px] lg:text-[52px]">디자인보다 먼저,<br />고객이 어디서 멈추는지 봅니다.</h2>
          </div>
          <p className="max-w-[560px] text-[16px] leading-8 text-white/65">첫 화면부터 구매 버튼까지, 고객이 이해하고 비교하는 데 필요한 정보를 살펴봅니다.</p>
        </div>

        <div className="mt-10 grid divide-y divide-white/10 border-y border-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {applyTrustPoints.map((item, index) => (
            <article key={item.title} className="py-7 lg:px-7 lg:first:pl-0 lg:last:pr-0">
              <p className="text-[12px] font-medium text-[#99CAFF]">0{index + 1}</p>
              <h3 className="mt-3 text-[20px] font-medium leading-7 tracking-[-0.035em]">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-white/60">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
