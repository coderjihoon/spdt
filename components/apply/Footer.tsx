import { applyFooterLinks, applySiteConfig } from "@/data/apply";

export function Footer() {
  return (
    <footer className="border-t border-[#ded7c7] bg-[#faf8f3] px-4 pb-28 pt-10 sm:px-6 md:pb-10 lg:px-10 lg:pb-14">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[560px]">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#748456] text-[15px] font-semibold text-[#faf8f3]">
              상
            </span>
            <div>
              <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#1f2a24]">
                {applySiteConfig.name}
              </p>
              <p className="text-[12px] text-[#697166]">{applySiteConfig.label}</p>
            </div>
          </div>

          <p className="mt-5 text-[15px] leading-7 text-[#586257]">{applySiteConfig.description}</p>
          <a
            href={applySiteConfig.emailHref}
            className="mt-5 inline-flex text-[14px] font-semibold text-[#1f2a24] underline decoration-[#748456] decoration-2 underline-offset-4"
          >
            {applySiteConfig.email}
          </a>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:min-w-[22rem]">
          <nav className="flex flex-col gap-3 text-[14px] text-[#586257]">
            <a href="/" className="transition hover:text-[#1f2a24]">
              홈페이지
            </a>
            {applyFooterLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-[#1f2a24]">
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-[13px] text-[#7a7f71]">
            © {new Date().getFullYear()} {applySiteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
