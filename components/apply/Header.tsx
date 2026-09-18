import { applyNavLinks, applySiteConfig } from "@/data/apply";

export function Header() {
  return (
    <>
      <div className="border-b border-[#ded7c7] bg-[#1f2a24] px-4 py-2.5 text-center text-[12px] text-[#faf8f3]">
        <a href={applySiteConfig.ctaHref} className="inline-flex items-center gap-2">
          <span className="rounded-full bg-[#748456] px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em]">
            FREE
          </span>
          <span>{applySiteConfig.promo}</span>
        </a>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#ded7c7]/80 bg-[#faf8f3]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between py-4">
          <a href="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#748456] text-[15px] font-semibold text-[#faf8f3] shadow-[inset_0_-10px_20px_rgba(31,42,36,0.12)]">
              상
            </span>
            <div>
              <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#1f2a24]">
                {applySiteConfig.name}
              </p>
              <p className="text-[11px] text-[#697166]">{applySiteConfig.label}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-[13px] font-medium text-[#697166] lg:flex">
            <a href="/" className="transition hover:text-[#1f2a24]">
              홈페이지
            </a>
            {applyNavLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-[#1f2a24]">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="hidden items-center justify-center rounded-[999px] border border-[#d8d0bd] bg-[#fffdf8] px-4 py-2.5 text-[13px] font-semibold text-[#1f2a24] transition hover:border-[#bfb69e] sm:inline-flex"
            >
              홈으로
            </a>
            <a
              href={applySiteConfig.ctaHref}
              className="inline-flex items-center justify-center rounded-[999px] bg-[#1f2a24] px-4 py-2.5 text-[13px] font-semibold text-[#faf8f3] transition hover:bg-[#354238]"
            >
              무료 진단 신청
            </a>
          </div>
        </div>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#ded7c7] bg-[#faf8f3]/95 px-4 py-3 shadow-[0_-12px_34px_rgba(31,42,36,0.12)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-[0.36fr_0.64fr] gap-2">
          <a
            href="/"
            className="flex items-center justify-center rounded-[14px] border border-[#d8d0bd] bg-[#fffdf8] px-3 py-4 text-[14px] font-semibold text-[#1f2a24]"
          >
            홈으로
          </a>
          <a
            href={applySiteConfig.ctaHref}
            className="flex items-center justify-center rounded-[14px] bg-[#748456] px-4 py-4 text-[14px] font-semibold text-[#fffdf8]"
          >
            무료 진단 신청
          </a>
        </div>
      </div>
    </>
  );
}
