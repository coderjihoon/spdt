import { processSteps } from "@/data/site";

export function ProcessSection() {
  return (
    <section id="process" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="lg:pr-8">
            <p className="text-sm font-medium tracking-[0.18em] text-slate-500">PROCESS</p>
            <h2 className="mt-3 text-[38px] font-medium leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px] lg:leading-[1.1]">
              이런 순서로 진행합니다.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              자료 확인부터 납품까지. 어떻게 보이느냐보다, 왜 이렇게 만드는지를
              먼저 정합니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {processSteps.map((item) => (
              <article
                key={item.step}
                className="rounded-[20px] bg-[#f7f7fb] p-6 ring-1 ring-inset ring-[#ececf4]"
              >
                <span className="text-sm font-medium tracking-[0.24em] text-slate-400">
                  STEP {item.step}
                </span>
                <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
