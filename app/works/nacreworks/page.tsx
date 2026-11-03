import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/apply/Header";
import { Footer } from "@/components/apply/Footer";
import images from "./images.json";

export const metadata: Metadata = {
  title: "나크레웍스 천연 자개 맥세이프 케이스 상세페이지 제작 | 상페닥터",
  description: "천연 자개 고유의 아름다움에 제품의 기능성과 기술력을 더해, 특별한 가치를 지닌 프리미엄 케이스로 소개했습니다.",
  openGraph: { url: "/works/nacreworks", title: "나크레웍스 천연 자개 맥세이프 케이스 상세페이지 제작 | 상페닥터" },
};

export default function NacreworksProjectPage() {
  return (
    <main className="bg-white">
      <Header mobileCta={false} />
      <div className="mx-auto max-w-[1920px] px-4 pb-20 pt-8 sm:px-6 lg:px-10 lg:pb-32 lg:pt-12">
        <Link href="/works" className="inline-flex min-h-11 items-center gap-2 text-[14px] text-slate-600 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m12 5-7 7 7 7M5 12h14" /></svg>
          작업물 목록
        </Link>

        <div className="mt-6 grid items-start gap-12 lg:mt-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)] xl:gap-20">
          <aside className="break-keep lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:pr-3">
            <h1 className="text-[44px] font-medium leading-[1.1] tracking-[-0.04em] text-slate-950 lg:text-[56px]">나크레웍스</h1>
            <p className="mt-4 text-[20px] font-medium tracking-[-0.02em] text-slate-900">천연 자개 맥세이프 케이스 상세페이지</p>
            <p className="mt-5 text-[15px] leading-7 text-slate-600">나크레웍스는 천연 자개 특유의 빛과 질감을 스마트폰 케이스에 담아낸 브랜드입니다. 자개 소재의 아름다움과 맥세이프 기능, 보호 설계 등 제품의 차별점을 효과적으로 전달하기 위해 크라우드펀딩용 상세페이지를 제작했습니다.</p>

            <div className="mt-8 space-y-6 border-t border-slate-200 pt-6">
              <section aria-labelledby="challenge-title">
                <h2 id="challenge-title" className="text-[15px] font-semibold text-slate-950">해결해야 했던 문제</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">천연 자개 케이스의 높은 제품 가치를 고객이 직관적으로 이해할 수 있도록 전달하는 것이 중요했습니다. 일반적인 디자인 케이스와의 차별성을 보여주는 동시에, 소재의 특성과 기능적 장점을 설득력 있게 설명할 필요가 있었습니다.</p>
              </section>
              <section aria-labelledby="direction-title">
                <h2 id="direction-title" className="text-[15px] font-semibold text-slate-950">기획·디자인 방향</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">천연 자개의 아름다움을 보여주는 감성적인 비주얼로 시작해 소재의 차별성, 제품 개발 과정, 특허 기술과 보호 성능으로 이어지는 스토리텔링을 구성했습니다. 자개 특유의 빛과 질감을 강조하는 고급스러운 이미지와 절제된 레이아웃을 활용하고, 감성적인 브랜드 스토리에 구체적인 기능 정보를 더해 제품의 가치와 신뢰도를 함께 전달했습니다.</p>
              </section>
            </div>

            <dl className="mt-7 grid grid-cols-[88px_1fr] gap-x-4 gap-y-3 border-t border-slate-200 pt-6 text-[13px] leading-6">
              <dt className="text-slate-500">작업 범위</dt><dd className="text-slate-900">상세페이지 기획 · 스토리텔링 · 카피라이팅 · 디자인 · 제품 이미지 편집 및 목업 제작</dd>
              <dt className="text-slate-500">판매 채널</dt><dd className="text-slate-900">크라우드펀딩</dd>
              <dt className="text-slate-500">제작 시기</dt><dd className="text-slate-900">2026.06</dd>
            </dl>
          </aside>

          <section aria-label="나크레웍스 상세페이지" className="min-w-0 bg-white">
            {images.map((image, index) => (
              <Image key={image.src} src={image.src} alt={`나크레웍스 천연 자개 맥세이프 케이스 상세페이지 ${index + 1}`} width={image.width} height={image.height} unoptimized priority={index === 0} className="block h-auto w-full" />
            ))}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
