import { testimonials } from "@/data/site";

export function TestimonialSection() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[760px]">
          <p className="text-sm font-medium tracking-[0.18em] text-slate-500">TESTIMONIAL</p>
          <h2 className="mt-3 text-[38px] font-medium leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-[44px] lg:text-[52px] lg:leading-[1.1]">
            고객은 디자인을 기억하지 않습니다. “정리가 됐다”를 기억합니다.
          </h2>
        </div>

        <div className="mt-10 columns-1 gap-5 md:columns-2 xl:columns-3">
          {testimonials.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className={`mb-5 break-inside-avoid rounded-[20px] bg-[#f7f7fb] p-8 text-slate-900 ring-1 ring-inset ring-[#ececf4] ${
                index === 1 ? "xl:translate-y-4" : ""
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-lg text-[#463fa6] ring-1 ring-inset ring-[#ececf4]">
                “
              </div>
              <p className="mt-8 text-[15px] leading-8 text-slate-600">
                “{item.quote}”
              </p>
              <div className="mt-8 border-t border-current/10 pt-5">
                <p className="text-base font-medium">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
