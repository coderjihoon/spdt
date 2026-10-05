import Image from "next/image";
import { caseStudies, type CaseImage } from "@/data/caseStudies";

function CaseImagePanel({ image, label }: { image: CaseImage; label: string }) {
  return (
    <figure className="min-w-0">
      <figcaption className="mb-3 text-[13px] font-medium text-slate-600">{label}</figcaption>
      <div className="overflow-hidden rounded-[16px] border border-[#ececf4] bg-[#f7f7fb]">
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="h-auto w-full" />
      </div>
    </figure>
  );
}

export function CaseStudiesSection() {
  return (
    <section aria-labelledby="case-studies-title" className="px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[14px] font-medium text-[#004EE0]">상세페이지 개선 사례</p>
        <h2 id="case-studies-title" className="mt-4 text-[clamp(30px,8vw,38px)] font-medium leading-[1.12] tracking-[-0.04em] text-slate-950 sm:text-[44px] lg:text-[52px]">
          실제 상세페이지에서는<br />이렇게 개선했습니다.
        </h2>
        <p className="mt-5 text-[16px] leading-7 text-slate-600">어떤 문제가 있었고, 무엇을 바꿨는지 확인해보세요.</p>

        <div className="mt-10 space-y-12 lg:mt-14">
          {caseStudies.length === 0 && (
            <article aria-label="상세페이지 개선 사례 레이아웃" className="border-t border-slate-200 pt-8 lg:pt-10">
              <h3 className="text-[24px] font-medium tracking-[-0.035em] text-slate-400">프로젝트명</h3>
              <div className="mt-7 grid gap-5 md:grid-cols-2">
                {["수정 전", "수정 후"].map((label) => (
                  <figure key={label} className="min-w-0">
                    <figcaption className="mb-3 text-[13px] font-medium text-slate-600">{label}</figcaption>
                    <div className="flex aspect-[4/3] items-center justify-center rounded-[16px] border border-[#ececf4] bg-[#f7f7fb] text-[14px] text-slate-400">이미지 준비 중</div>
                  </figure>
                ))}
              </div>
              <div className="mt-7 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2 sm:gap-8">
                {["발견한 문제", "수정한 내용과 이유"].map((label) => (
                  <div key={label}>
                    <h4 className="text-[15px] font-medium text-slate-900">{label}</h4>
                    <div aria-hidden="true" className="mt-4 space-y-2">
                      <div className="h-2.5 w-full rounded-full bg-[#f1f3f9]" />
                      <div className="h-2.5 w-2/3 rounded-full bg-[#f1f3f9]" />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )}
          {caseStudies.slice(0, 2).map((item) => (
            <article key={item.name} className="border-t border-slate-200 pt-8 lg:pt-10">
              <h3 className="text-[24px] font-medium tracking-[-0.035em] text-slate-900">{item.name}</h3>
              <div className={`mt-7 grid gap-5 ${item.before ? "md:grid-cols-2" : ""}`}>
                {item.before && <CaseImagePanel image={item.before} label="수정 전" />}
                <CaseImagePanel image={item.after} label={item.before ? "수정 후" : "개선한 상세페이지"} />
              </div>
              <dl className="mt-7 grid gap-5 border-t border-slate-100 pt-6 text-[15px] leading-7 sm:grid-cols-2 sm:gap-8">
                <div><dt className="font-medium text-slate-900">발견한 문제</dt><dd className="mt-2 text-slate-600">{item.issue}</dd></div>
                <div><dt className="font-medium text-slate-900">수정한 내용과 이유</dt><dd className="mt-2 text-slate-600">{item.change}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
