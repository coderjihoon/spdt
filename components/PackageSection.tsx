import { packageItems, siteConfig } from "@/data/site";

export function PackageSection() {
  return (
    <section id="packages" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[720px]">
          <p className="text-sm font-medium tracking-[0.18em] text-slate-500">PACKAGE</p>
          <h2 className="mt-3 text-[38px] font-medium leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px] lg:leading-[1.1]">
            필요한 범위에 맞춰 선택하세요.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-3">
          {packageItems.map((item) => (
            <article
              key={item.name}
              className={`rounded-[20px] p-6 ring-1 ring-inset ${
                item.highlighted
                  ? "bg-[#463fa6] text-white ring-[#463fa6]"
                  : "bg-[#f7f7fb] text-slate-900 ring-[#ececf4]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-sm tracking-[0.18em] ${
                      item.highlighted ? "text-white/65" : "text-slate-400"
                    }`}
                  >
                    {item.target}
                  </p>
                  <h3 className="mt-3 text-3xl font-medium tracking-[-0.05em]">
                    {item.name}
                  </h3>
                </div>
                {item.highlighted ? (
                  <span className="rounded-[10px] bg-white/12 px-3 py-1.5 text-[11px] font-medium text-white">
                    MOST FIT
                  </span>
                ) : null}
              </div>

              <p
                className={`mt-5 text-base leading-7 ${
                  item.highlighted ? "text-white/75" : "text-slate-600"
                }`}
              >
                {item.description}
              </p>

              <ul className="mt-6 space-y-3">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-6">
                    <span
                      className={`mt-2 h-2.5 w-2.5 rounded-full ${
                        item.highlighted ? "bg-white" : "bg-[#463fa6]"
                      }`}
                    />
                    <span className={item.highlighted ? "text-white/86" : "text-slate-700"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={siteConfig.ctaHref}
                className={`mt-8 inline-flex rounded-[12px] px-5 py-3 text-[12px] font-medium transition ${
                  item.highlighted
                    ? "bg-white text-slate-900 hover:bg-white/90"
                    : "bg-[#463fa6] text-white hover:bg-[#3d3691]"
                }`}
              >
                문의하기
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
