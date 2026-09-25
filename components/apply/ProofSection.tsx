import Image from "next/image";
import { applyProofStats, applyTestimonials } from "@/data/apply";

export function ProofSection() {
  const rows = [
    applyTestimonials,
    [...applyTestimonials.slice(3), ...applyTestimonials.slice(0, 3)],
  ];

  return (
    <>
      <section id="testimonials" className="bg-[#f7f7fb] px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[14px] font-medium tracking-[0.18em] text-slate-500">REVIEWS</p>
              <h2 className="mt-3 text-[38px] font-medium leading-[1.08] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px]">진단을 받아본<br />분들의 이야기</h2>
            </div>
          </div>

          <div className="-mx-4 mt-10 flex flex-col gap-5 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} aria-hidden={rowIndex === 1} className="animate-testimonial-marquee flex w-max gap-5" style={{ animationDirection: rowIndex === 1 ? "reverse" : "normal" }}>
                {[...row, ...row].map((item, index) => (
                  <article key={`${item.author}-${index}`} aria-hidden={index >= row.length} className="flex min-h-[430px] w-[min(82vw,420px)] shrink-0 flex-col rounded-[28px] bg-[#f1f3f9] p-7 sm:p-9">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white p-1">
                        <Image src={item.avatar} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                      </span>
                      <span className="rounded-full border border-slate-300 px-4 py-2 text-[11px] font-medium text-slate-500">{item.role}</span>
                    </div>
                    <span className="mt-16 text-[52px] font-semibold leading-none text-[#99CAFF]">“</span>
                    <p className="mt-5 text-[30px] font-medium leading-[1.2] tracking-[-0.045em] text-slate-950 sm:text-[34px]">{item.quote}</p>
                    <div className="mt-auto pt-12">
                      <div className="border-l border-slate-300 pl-4">
                        <p className="text-[16px] font-medium tracking-[-0.03em] text-slate-900">{item.author}</p>
                        <p className="mt-1 text-[13px] text-slate-500">{item.role}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-6 sm:grid-cols-3">
            {applyProofStats.map((stat) => (
              <div key={stat.label} className="rounded-[20px] bg-white p-6 text-center ring-1 ring-inset ring-[#ececf4] sm:p-7">
                <p className="text-[48px] font-semibold leading-none tracking-[-0.05em] text-[#004EE0] sm:text-[56px]">{stat.value}</p>
                <p className="mt-2 text-[13px] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
