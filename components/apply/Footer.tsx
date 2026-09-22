import Image from "next/image";
import { applyFooterLinks, applySiteConfig } from "@/data/apply";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 px-4 pb-28 pt-10 sm:px-6 md:pb-10 lg:px-10 lg:pb-14">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="SPDT" width={662} height={298} className="h-8 w-auto" />
            <p className="text-xs text-slate-500">{applySiteConfig.name} · 무료 상세페이지 진단</p>
          </div>
          <p className="mt-5 text-[15px] leading-7 text-slate-600">{applySiteConfig.description}</p>
          <a href={applySiteConfig.emailHref} className="mt-5 inline-flex text-sm font-medium text-slate-900 underline decoration-[#004EE0] decoration-2 underline-offset-4">{applySiteConfig.email}</a>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:min-w-[24rem]">
          <nav className="flex flex-col gap-3 text-sm text-slate-600">
            <a href="/" className="transition hover:text-slate-900">홈페이지</a>
            {applyFooterLinks.map((link) => <a key={link.href} href={link.href} className="transition hover:text-slate-900">{link.label}</a>)}
          </nav>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} SPDT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
