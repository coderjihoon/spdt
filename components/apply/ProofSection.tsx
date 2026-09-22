import { applyFounderNote, applyProofStats, applyTestimonials } from "@/data/apply";

export function ProofSection() {
  return (
    <section id="proof" className="bg-[#f7f7fb] px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-6 sm:grid-cols-3">
          {applyProofStats.map((stat) => (
            <div key={stat.label} className="rounded-[20px] bg-white p-6 text-center ring-1 ring-inset ring-[#ececf4] sm:p-7">
              <p className="text-[28px] font-semibold tracking-[-0.03em] text-[#004EE0]">{stat.value}</p>
              <p className="mt-2 text-[13px] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {applyTestimonials.map((item) => (
              <article key={item.author} className="rounded-[20px] bg-white p-6 ring-1 ring-inset ring-[#ececf4] sm:p-7">
                <p className="text-[15px] leading-7 text-slate-800">“{item.quote}”</p>
                <p className="mt-4 text-[13px] font-medium text-slate-500">{item.author} · {item.role}</p>
              </article>
            ))}
          </div>

          <div className="flex items-center gap-4 rounded-[20px] bg-white p-6 ring-1 ring-inset ring-[#ececf4] sm:p-7">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">{applyFounderNote.name[0]}</span>
            <div>
              <p className="text-[14px] font-medium text-slate-900">{applyFounderNote.name} · {applyFounderNote.role}</p>
              <p className="mt-1 text-[13px] leading-6 text-slate-500">{applyFounderNote.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
