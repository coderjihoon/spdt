import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/apply/Header";
import { Footer } from "@/components/apply/Footer";
import images from "./images.json";

export const metadata: Metadata = {
  title: "피오르 이노시톨 건강식품 상세페이지 제작 | 상페닥터",
  description: "여성의 건강한 일상을 위한 섬세한 성분 설계에 부드러운 감성을 더해, 신뢰하고 선택할 수 있는 제품으로 소개했습니다.",
  openGraph: { url: "/works/fiore", title: "피오르 이노시톨 건강식품 상세페이지 제작 | 상페닥터" },
};

export default function FioreProjectPage() {
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
            <h1 className="text-[44px] font-medium leading-[1.1] tracking-[-0.04em] text-slate-950 lg:text-[56px]">피오르</h1>
            <p className="mt-4 text-[20px] font-medium tracking-[-0.02em] text-slate-900">이노시톨 건강식품 상세페이지</p>
            <p className="mt-5 text-[15px] leading-7 text-slate-600">피오르 이노시톨은 여성의 건강한 일상 관리를 위해 설계된 이노시톨 제품입니다. 주요 성분과 배합 특징을 소비자가 쉽게 이해할 수 있도록 정리하고, 여성 타깃에 어울리는 부드럽고 세련된 비주얼을 활용해 제품의 전문성과 감성을 함께 전달하는 상세페이지를 제작했습니다.</p>

            <div className="mt-8 space-y-6 border-t border-slate-200 pt-6">
              <section aria-labelledby="challenge-title">
                <h2 id="challenge-title" className="text-[15px] font-semibold text-slate-950">해결해야 했던 문제</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">이노시톨은 성분명과 배합 비율만으로는 일반 소비자가 제품의 특징을 이해하기 어려운 카테고리입니다. 복잡한 성분 정보를 직관적으로 전달하면서도, 비슷한 제품 사이에서 피오르만의 차별성과 신뢰감을 보여줄 필요가 있었습니다.</p>
              </section>
              <section aria-labelledby="direction-title">
                <h2 id="direction-title" className="text-[15px] font-semibold text-slate-950">기획·디자인 방향</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">여성의 일상적인 건강 고민에 대한 공감에서 시작해 제품 소개, 핵심 성분, 배합 특징, 섭취 정보로 이어지도록 콘텐츠를 구성했습니다. 화사하고 부드러운 컬러와 감각적인 제품 이미지를 활용하고, 성분별 특징을 간결한 카피와 인포그래픽으로 시각화해 정보 전달력과 브랜드의 완성도를 높였습니다.</p>
              </section>
            </div>

            <dl className="mt-7 grid grid-cols-[88px_1fr] gap-x-4 gap-y-3 border-t border-slate-200 pt-6 text-[13px] leading-6">
              <dt className="text-slate-500">작업 범위</dt><dd className="text-slate-900">상세페이지 기획 · 카피라이팅 · 디자인 · AI 제품·컨셉 이미지 제작 · 제품·패키지 목업 제작</dd>
              <dt className="text-slate-500">제작 시기</dt><dd className="text-slate-900">2026.11</dd>
            </dl>
          </aside>

          <section aria-label="피오르 상세페이지" className="min-w-0 bg-white">
            {images.map((image, index) => (
              <Image key={image.src} src={image.src} alt={`피오르 이노시톨 건강식품 상세페이지 ${index + 1}`} width={image.width} height={image.height} unoptimized priority={index === 0} className="block h-auto w-full" />
            ))}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
