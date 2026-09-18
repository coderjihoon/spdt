import { footerLinks, siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 px-4 pb-10 pt-10 sm:px-6 lg:px-10 lg:pb-14">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold tracking-[0.2em] text-white">
              SP
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-slate-900">
                {siteConfig.name}
              </p>
              <p className="text-xs text-slate-500">{siteConfig.label}</p>
            </div>
          </div>

          <p className="mt-5 text-base leading-7 text-slate-600">{siteConfig.description}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-5 inline-flex text-sm font-medium text-slate-900 underline underline-offset-4"
          >
            {siteConfig.email}
          </a>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:min-w-[22rem]">
          <div>
            <p className="text-sm font-medium tracking-[0.18em] text-slate-400">MENU</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              {footerLinks.map((link) => (
                <a key={link.href} href={link.href} className="transition hover:text-slate-900">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} SPDT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
