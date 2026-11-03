import Image from "next/image";
import { applyNavLinks, applySiteConfig } from "@/data/apply";

export function Header({ mobileCta = true }: { mobileCta?: boolean }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between py-4">
          <a href="/" className="flex items-center gap-3">
            <Image src="/logo%20final2.png" alt="상페닥터" width={1154} height={339} className="h-8 w-auto sm:h-9" priority />
          </a>

          <div className="flex items-center gap-7">
            <nav className="hidden items-center text-[12px] text-slate-600 lg:flex">
              {applyNavLinks.map((link) => (
                <a key={link.href} href={link.href} className="transition hover:text-slate-950">{link.label}</a>
              ))}
            </nav>

            <a href={applySiteConfig.ctaHref} className="inline-flex items-center justify-center rounded-[10px] bg-[#004EE0] px-4 py-2.5 text-[12px] font-medium text-white transition hover:bg-[#042E7B]">
              무료 진단
            </a>
          </div>
        </div>
      </header>

      {mobileCta && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-100 bg-white/95 px-4 py-3 shadow-[0_-12px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl md:hidden">
          <a href={applySiteConfig.ctaHref} className="flex items-center justify-center rounded-[12px] bg-[#004EE0] px-4 py-4 text-[13px] font-medium text-white">
            무료 진단 시작하기
          </a>
        </div>
      )}
    </>
  );
}
