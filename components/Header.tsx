import { navLinks, siteConfig } from "@/data/site";

export function Header() {
  return (
    <>
      <div className="bg-[#463fa6] px-4 py-2 text-center text-[11px] text-white sm:px-6">
        <a href={siteConfig.ctaHref} className="inline-flex items-center gap-2">
          <span className="rounded-full bg-white/14 px-2.5 py-1 font-medium">FREE DIAGNOSIS</span>
          <span>{siteConfig.promo}</span>
        </a>
      </div>

      <header className="border-b border-slate-100 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between py-5">
          <a href="#" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold tracking-[0.18em] text-white">
              SP
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-[0.18em] text-slate-900">
                {siteConfig.name}
              </p>
              <p className="text-xs text-slate-500">{siteConfig.label}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-[12px] text-slate-600 lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-slate-900">
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={siteConfig.ctaHref}
            className="inline-flex items-center justify-center rounded-[10px] bg-[#463fa6] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-[#3d3691]"
          >
            무료 진단 문의하기
          </a>
        </div>
      </header>
    </>
  );
}
