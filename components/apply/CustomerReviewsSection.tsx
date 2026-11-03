import Image from "next/image";
import { testimonials } from "@/data/site";

const featuredNames = new Set([
  "MP****",
  "매일*************",
  "Ly*******",
  "춤추********",
  "태앵*",
  "발랄**********",
  "대범********",
  "반짝********",
  "젤리*",
  "낙천********",
]);
const featuredTestimonials = testimonials.filter((item) => featuredNames.has(item.name)).map((item, index) => ({
  ...item,
  avatar: `/faces/notion-face-${(index % 5) + 1}.png`,
  displayName: item.name,
}));
const reviewRows = [featuredTestimonials.slice(0, 5), featuredTestimonials.slice(5, 10)];
const customerRoleLabels: Record<string, string> = {
  "Biz·기업": "기업 브랜드 담당자",
  "헬스/스포츠": "헬스·스포츠 브랜드 운영",
};

export function CustomerReviewsSection() {
  if (featuredTestimonials.length === 0) return null;

  return (
    <section id="customer-reviews" aria-labelledby="customer-reviews-title" className="bg-[#f7f7fb] px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[14px] font-medium text-[#004EE0]">고객 후기</p>
        <h2 id="customer-reviews-title" className="mt-4 text-[clamp(30px,8vw,38px)] font-medium leading-[1.12] tracking-[-0.04em] text-slate-950 sm:text-[44px] lg:text-[52px]">함께 작업한 고객의 이야기</h2>
        <p className="mt-5 text-[16px] leading-7 text-slate-600">상세페이지를 함께 개선한 고객들의 실제 후기를 확인해보세요.</p>

        <div className="-mx-4 mt-10 flex flex-col gap-5 sm:-mx-6 lg:mx-0">
          {reviewRows.map((row, rowIndex) => (
            <div key={rowIndex} className="customer-review-marquee overflow-hidden motion-reduce:overflow-x-auto">
              <div className="customer-review-track animate-testimonial-marquee flex w-max gap-5" style={{ animationDirection: rowIndex === 0 ? "normal" : "reverse" }}>
                {[...row, ...row].map((item, index) => (
                  <article key={`${item.name}-${index}`} aria-hidden={index >= row.length ? true : undefined} className={`flex min-h-[360px] w-[min(82vw,420px)] shrink-0 flex-col rounded-[20px] border border-[#ececf4] bg-white p-6 sm:p-7 lg:p-8 ${index >= row.length ? "motion-reduce:hidden" : ""}`}>
                    <div className="mb-8 flex items-center justify-between gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E3F2FF] p-1">
                        <Image src={item.avatar} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                      </span>
                      <span className="rounded-full border border-slate-300 px-4 py-2 text-[11px] font-medium text-slate-500">{item.role.split(" · ")[0]}</span>
                    </div>
                    {item.quote.length > 90 ? (
                      <details className="group mb-8 text-[16px] leading-8 text-slate-700">
                        <summary tabIndex={index >= row.length ? -1 : 0} className="cursor-pointer list-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">
                          <span className="line-clamp-3 group-open:hidden">“{item.quote}”</span>
                          <span className="mt-3 inline-block text-[13px] font-medium text-[#004EE0] group-open:hidden">더 보기</span>
                          <span className="hidden group-open:block">“{item.quote}”</span>
                          <span className="mt-3 hidden text-[13px] font-medium text-[#004EE0] group-open:inline-block">접기</span>
                        </summary>
                      </details>
                    ) : (
                      <p className="mb-8 text-[16px] leading-8 text-slate-700">“{item.quote}”</p>
                    )}
                    <div className="mt-auto border-t border-slate-100 pt-5 text-[13px] leading-6 text-slate-500">
                      <p className="text-[15px] font-medium text-slate-900">{item.displayName}</p>
                      <p className="mt-1">{customerRoleLabels[item.role.split(" · ")[0]] ?? item.role.split(" · ")[0]}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
