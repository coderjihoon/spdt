import Image from "next/image";
import { applyNavLinks, applySiteConfig } from "@/data/apply";

export function Header() {
  return (
    <>
      <div className="bg-[#004EE0] px-4 py-2 text-center text-[11px] text-white sm:px-6">
        <a href={applySiteConfig.ctaHref} className="inline-flex items-center gap-2">
          <span className="rounded-full bg-white/14 px-2.5 py-1 font-medium">FREE DIAGNOSIS</span>
          <span>{applySiteConfig.promo}</span>
        </a>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between py-4">
          <a href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="SPDT" width={662} height={298} className="h-7 w-auto" priority />
            <p className="hidden text-xs text-slate-500 sm:block">{applySiteConfig.name} · 무료 진단</p>
          </a>

          <nav className="hidden items-center gap-7 text-[12px] text-slate-600 lg:flex">
            {applyNavLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-slate-950">{link.label}</a>
            ))}
          </nav>

          <a href={applySiteConfig.ctaHref} className="inline-flex items-center justify-center rounded-[10px] bg-[#004EE0] px-4 py-2.5 text-[12px] font-medium text-white transition hover:bg-[#042E7B]">
            무료 진단 시작하기
          </a>
        </div>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-100 bg-white/95 px-4 py-3 shadow-[0_-12px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl md:hidden">
        <a href={applySiteConfig.ctaHref} className="flex items-center justify-center rounded-[12px] bg-[#004EE0] px-4 py-4 text-[13px] font-medium text-white">
          무료 진단 시작하기
        </a>
      </div>
    </>
  );
}
