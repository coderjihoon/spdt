import type { Metadata } from "next";
import { Footer } from "@/components/apply/Footer";
import { Header } from "@/components/apply/Header";
import { portfolioItems } from "@/data/site";

export const metadata: Metadata = {
  title: "작업물 | 상페닥터",
  description: "상세페이지 구조와 카피, 디자인 작업 사례를 살펴보세요.",
  openGraph: { url: "/works", title: "작업물 | 상페닥터" },
};

export default function WorksPage() {
  return (
    <main className="overflow-x-clip bg-white pb-24 md:pb-28">
      <Header mobileCta={false} />
      <section className="mx-auto max-w-[1280px] px-4 pb-24 pt-20 sm:px-6 lg:px-10 lg:pb-36 lg:pt-32">
        <p className="text-[14px] font-medium tracking-[0.18em] text-[#004EE0]">WORKS</p>
        <h1 className="mt-4 max-w-[850px] text-[42px] font-medium leading-[1.12] tracking-[-0.04em] text-slate-950 sm:text-[58px] lg:text-[72px]">
          제품의 장점이<br />분명히 보이는 상세페이지.
        </h1>
        <p className="mt-7 max-w-[620px] text-[16px] leading-8 text-slate-600 sm:text-[18px]">
          제품의 강점이 고객에게 필요한 순서로 읽히도록, 구조와 카피, 화면을 함께 설계합니다.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-16">
          {Array.from({ length: 12 }, (_, index) => (
            <article key={index}>
              <div className="aspect-[3/4] rounded-[16px] bg-[#f1f3f9]" aria-hidden="true" />
              <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[20px]">
                {portfolioItems[index]?.category ?? `작업 사례 ${String(index + 1).padStart(2, "0")}`}
              </h2>
            </article>
          ))}
        </div>
      </section>
      <Footer />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-[#004EE0] px-4 py-3 text-white shadow-[0_-8px_30px_rgba(15,23,42,0.16)] sm:inset-x-6 sm:bottom-5 sm:rounded-[20px] sm:px-6 lg:inset-x-10 lg:px-8">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
          <p className="hidden text-[15px] font-medium leading-6 sm:block lg:text-[20px]">내 상세페이지에서 고객이 망설이는 곳을 찾아보세요.</p>
          <a href="/#diagnosis-form" className="inline-flex min-h-12 w-full items-center justify-center rounded-[12px] bg-white px-6 text-[14px] font-semibold text-[#004EE0] transition hover:bg-[#E3F2FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto">
            무료 진단 시작하기 →
          </a>
        </div>
      </div>
    </main>
  );
}
