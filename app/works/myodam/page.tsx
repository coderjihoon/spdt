import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/apply/Header";
import { Footer } from "@/components/apply/Footer";
import images from "./images.json";

export const metadata: Metadata = {
  title: "묘담 키튼 건강스틱 상세페이지 제작 | 상페닥터",
  description: "성장기 고양이에게 필요한 영양을 신중하게 설계하고, 보호자가 쉽게 이해하고 신뢰할 수 있도록 풀어낸 상세페이지입니다.",
  openGraph: { url: "/works/myodam", title: "묘담 키튼 건강스틱 상세페이지 제작 | 상페닥터" },
};

export default function MyodamProjectPage() {
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
            <h1 className="text-[44px] font-medium leading-[1.1] tracking-[-0.04em] text-slate-950 lg:text-[56px]">묘담</h1>
            <p className="mt-4 text-[20px] font-medium tracking-[-0.02em] text-slate-900">키튼 건강스틱 상세페이지</p>
            <p className="mt-5 text-[15px] leading-7 text-slate-600">묘담은 고양이의 생애주기에 맞는 건강 습관을 제안하는 반려묘 브랜드입니다. 이번 프로젝트에서는 생후 3개월부터 1세 미만의 성장기 고양이를 위한 키튼 전용 영양스틱 ‘묘담 첫걸음’의 특징과 영양 설계가 직관적으로 전달되도록 상세페이지를 제작했습니다.</p>

            <div className="mt-8 space-y-6 border-t border-slate-200 pt-6">
              <section aria-labelledby="challenge-title">
                <h2 id="challenge-title" className="text-[15px] font-semibold text-slate-950">해결해야 했던 문제</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">성장기 영양 제품은 성분과 기능을 강조할수록 정보가 어렵고 복잡하게 느껴질 수 있었습니다. 보호자의 ‘처음이라 더 잘해주고 싶은 마음’에 공감하면서도, 필요한 영양소와 과도한 영양 섭취를 경계하는 묘담만의 설계 기준을 쉽고 신뢰감 있게 전달할 필요가 있었습니다.</p>
              </section>
              <section aria-labelledby="direction-title">
                <h2 id="direction-title" className="text-[15px] font-semibold text-slate-950">기획·디자인 방향</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">보호자의 성장기 고민에 대한 공감에서 시작해 키튼 전용 설계, 핵심 영양 성분, 영양 균형, 전 원료 공개, 급여 상황과 제품 정보로 자연스럽게 이어지도록 구성했습니다. 타우린·아르기닌·신바이오틱스·오메가3 등 핵심 성분은 인포그래픽과 직관적인 시각 자료로 표현하고, 전체적으로 깨끗하고 신뢰감 있는 톤을 유지해 전문성과 브랜드 감성을 함께 전달했습니다.</p>
              </section>
            </div>

            <dl className="mt-7 grid grid-cols-[88px_1fr] gap-x-4 gap-y-3 border-t border-slate-200 pt-6 text-[13px] leading-6">
              <dt className="text-slate-500">작업 범위</dt><dd className="text-slate-900">상세페이지 기획 · 카피라이팅 · 디자인 · AI 제품·컨셉 이미지 제작 · 인포그래픽 제작 · 제품·패키지 목업 제작</dd>
              <dt className="text-slate-500">제작 시기</dt><dd className="text-slate-900">2026.11</dd>
            </dl>
          </aside>

          <section aria-label="묘담 상세페이지" className="min-w-0 bg-white">
            {images.map((image, index) => (
              <Image key={image.src} src={image.src} alt={`묘담 키튼 건강스틱 상세페이지 ${index + 1}`} width={image.width} height={image.height} unoptimized priority={index === 0} className="block h-auto w-full" />
            ))}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
