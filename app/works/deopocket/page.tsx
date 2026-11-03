import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/apply/Header";
import { Footer } from "@/components/apply/Footer";
import images from "./images.json";

export const metadata: Metadata = {
  title: "데오포켓 가정용 탈취제 상세페이지 리뉴얼 | 상페닥터",
  description: "검증된 탈취 성능에 감성적인 생활 장면을 더해, 우리 집에 두고 싶은 제품으로 소개했습니다.",
  openGraph: { url: "/works/deopocket", title: "데오포켓 가정용 탈취제 상세페이지 리뉴얼 | 상페닥터" },
};

export default function DeopocketProjectPage() {
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
            <h1 className="text-[44px] font-medium leading-[1.1] tracking-[-0.04em] text-slate-950 lg:text-[56px]">데오포켓</h1>
            <p className="mt-4 text-[20px] font-medium tracking-[-0.02em] text-slate-900">가정용 탈취제 상세페이지 리뉴얼</p>
            <p className="mt-5 text-[15px] leading-7 text-slate-600">데오포켓은 냄새가 신경 쓰이는 공간에 놓거나 걸어 사용하는 파우치형 탈취제 브랜드입니다. 새롭게 바뀐 제품 디자인과 30~50대 여성 타깃에 맞춰, 제품의 성능과 일상 속 활용도를 함께 전달하는 상세페이지를 제작했습니다.</p>

            <div className="mt-8 space-y-6 border-t border-slate-200 pt-6">
              <section aria-labelledby="challenge-title">
                <h2 id="challenge-title" className="text-[15px] font-semibold text-slate-950">해결해야 했던 문제</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">기존 상세페이지는 기술과 성능 정보가 중심이어서, 고객이 자신의 생활 속 문제와 제품을 연결하기 어려웠습니다. 탈취 성능의 객관적인 근거는 유지하면서 사용 편의성과 공간에 자연스럽게 어울리는 디자인을 보여줄 필요가 있었습니다.</p>
              </section>
              <section aria-labelledby="direction-title">
                <h2 id="direction-title" className="text-[15px] font-semibold text-slate-950">기획·디자인 방향</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">고객의 냄새 고민에 대한 공감에서 시작해 제품 소개, 성능 근거, 사용 공간과 사이즈 선택으로 이어지도록 정보를 재구성했습니다. 부드러운 색감과 실제 가정 같은 생활 이미지를 활용하고, 감성적인 카피에 시험 수치와 사용 정보를 더해 공감과 신뢰를 함께 전달했습니다.</p>
              </section>
            </div>

            <dl className="mt-7 grid grid-cols-[88px_1fr] gap-x-4 gap-y-3 border-t border-slate-200 pt-6 text-[13px] leading-6">
              <dt className="text-slate-500">작업 범위</dt><dd className="text-slate-900">상세페이지 기획 · 카피라이팅 · 디자인 · AI 제품·생활 컨셉 이미지 제작 · 제품·패키지 목업 제작</dd>
              <dt className="text-slate-500">제작 시기</dt><dd className="text-slate-900">2026.11</dd>
            </dl>
          </aside>

          <section aria-label="데오포켓 상세페이지" className="min-w-0 bg-white">
            {images.map((image, index) => (
              <Image key={image.src} src={image.src} alt={`데오포켓 가정용 탈취제 상세페이지 ${index + 1}`} width={image.width} height={image.height} unoptimized priority={index === 0} className="block h-auto w-full" />
            ))}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
