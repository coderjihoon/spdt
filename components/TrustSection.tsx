import { trustItems } from "@/data/site";

export function TrustSection() {
  const marqueeItems = [...trustItems, ...trustItems];

  return (
    <section id="trust" className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="text-center text-[24px] font-medium tracking-[-0.03em] text-slate-900">
          제품의 매력이 고객에게 제대로 전달되도록
        </h2>
        <div className="mt-8 overflow-hidden">
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {marqueeItems.map((item, index) => (
              <div key={`${item}-${index}`} className="flex shrink-0 items-center gap-10">
                <span className="text-sm font-medium tracking-[0.14em] text-slate-400">
                  {item}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
