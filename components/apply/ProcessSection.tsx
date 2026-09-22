import { applyProcessSteps } from "@/data/apply";

export function ProcessSection() {
  return (
    <section id="process" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-[14px] font-medium tracking-[0.18em] text-slate-500">PROCESS</p>
          <h2 className="mt-3 text-[38px] font-medium leading-[1.08] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px]">자료가 덜 준비돼도<br />진단할 수 있습니다.</h2>
          <p className="mt-5 max-w-[480px] text-[16px] leading-7 text-slate-600">준비된 자료 안에서 고객이 어디서 멈추는지부터 확인합니다.</p>
        </div>

        <ol className="relative border-l border-slate-200 pl-7 sm:pl-10">
          {applyProcessSteps.map((item) => (
            <li key={item.step} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[2.45rem] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-1 ring-slate-200 sm:-left-[3.25rem]"><span className="h-2 w-2 rounded-full bg-[#004EE0]" /></span>
              <p className="text-[12px] font-medium tracking-[0.16em] text-[#004EE0]">STEP 0{item.step}</p>
              <h3 className="mt-2 text-[21px] font-medium leading-7 tracking-[-0.035em] text-slate-900">{item.title}</h3>
              <p className="mt-2 max-w-[620px] text-[15px] leading-7 text-slate-600">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
