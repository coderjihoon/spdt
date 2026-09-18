import { siteConfig } from "@/data/site";

export function CTASection() {
  return (
    <section id="contact" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_18%_50%,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_72%_68%,rgba(124,118,255,0.34),transparent_22%),linear-gradient(135deg,#c5c1ff_0%,#7b74ef_42%,#463fa6_100%)] px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div className="relative">
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-4xl">
              <p className="text-sm font-medium tracking-[0.18em] text-white/55">
                FREE DIAGNOSIS
              </p>
              <h2 className="mt-3 text-[38px] font-medium leading-[1.05] tracking-[-0.05em] text-white sm:text-[44px] lg:text-[52px] lg:leading-[1.1]">
                지금 상세페이지에서 구매를 막고 있는
                <br className="hidden sm:block" />
                요소 3가지를 짚어드립니다.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                제품 URL 또는 자료를 보내주시면
                <br className="hidden sm:block" />
                개선 방향을 간단히 정리해드립니다.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">
              <a
                href={siteConfig.ctaHref}
                className="inline-flex items-center justify-center rounded-[12px] bg-white px-6 py-3.5 text-[12px] font-medium text-slate-900 transition hover:bg-white/90"
              >
                무료 진단 문의하기
              </a>
              <div className="rounded-[12px] border border-white/20 px-4 py-3 text-sm text-white/72">
                {siteConfig.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
