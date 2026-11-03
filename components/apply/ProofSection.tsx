import Image from "next/image";
import { applyProofStats } from "@/data/apply";

export function ProofStatsSection() {
  return (
    <section id="proof" aria-label="숫자로 보는 상페닥터" className="relative isolate overflow-hidden rounded-t-[32px] bg-[#111318] text-white sm:rounded-t-[48px] lg:rounded-t-[56px]">
      <div className="absolute inset-x-0 top-0 h-[280px] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] sm:h-[360px] lg:left-[35%] lg:h-full lg:[mask-image:linear-gradient(to_right,transparent,black_25%)]">
        <Image
          src="/proof-stats-meeting.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-right-top lg:object-contain"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#111318]/80 to-[#111318] lg:via-black/35" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#111318]/65 via-transparent to-transparent" />
      <div className="relative mx-auto flex min-h-[700px] max-w-[1500px] flex-col justify-between gap-36 px-6 py-14 sm:min-h-[760px] sm:px-10 sm:py-16 lg:min-h-[600px] lg:gap-16 lg:px-16 lg:pt-20">
        <p className="flex items-center gap-4 text-[12px] font-medium tracking-[0.12em] text-white/85 sm:text-[14px]">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#3578ff]" />
          숫자로 보는 상페닥터
        </p>
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-3 lg:gap-6">
          {applyProofStats.map((stat, index) => (
            <div key={stat.label} className="border-l border-white/40 pl-5 sm:pl-8 lg:pl-10">
              <p className={`font-semibold leading-none tracking-[-0.04em] tabular-nums text-white ${index === 2 ? "text-[clamp(3.25rem,5.2vw,5.4rem)]" : "text-[clamp(3.25rem,6vw,6rem)]"}`}>{stat.value}</p>
              <p className="mt-5 text-[15px] leading-6 text-white/70 sm:text-[17px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-8 rounded-t-[32px] bg-white sm:h-12 sm:rounded-t-[48px]" />
    </section>
  );
}
