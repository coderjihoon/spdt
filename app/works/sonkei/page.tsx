import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/apply/Header";
import { Footer } from "@/components/apply/Footer";
import images from "./images.json";

export const metadata: Metadata = {
  title: "소네키 26FW 주얼리 컬렉션 와디즈 펀딩 상세페이지 제작 | 상페닥터",
  description: "주얼리에 담긴 소망과 의미를 감성적인 비주얼로 풀어내고, 브랜드의 스토리와 제품의 가치를 하나의 흐름으로 전달했습니다.",
  openGraph: { url: "/works/sonkei", title: "소네키 26FW 주얼리 컬렉션 와디즈 펀딩 상세페이지 제작 | 상페닥터" },
};

export default function SonkeiProjectPage() {
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
            <h1 className="text-[44px] font-medium leading-[1.1] tracking-[-0.04em] text-slate-950 lg:text-[56px]">소네키</h1>
            <p className="mt-4 text-[20px] font-medium tracking-[-0.02em] text-slate-900">26FW 주얼리 컬렉션 와디즈 펀딩 상세페이지</p>
            <p className="mt-5 text-[15px] leading-7 text-slate-600">소네키는 섬세한 디자인과 특별한 의미를 담은 주얼리 브랜드입니다. 고래꼬리 모티브와 천연 다이아몬드를 활용한 26FW 컬렉션의 스토리를 중심으로, 제품의 아름다움과 소장 가치를 전달하는 와디즈 펀딩 상세페이지를 제작했습니다.</p>

            <div className="mt-8 space-y-6 border-t border-slate-200 pt-6">
              <section aria-labelledby="challenge-title">
                <h2 id="challenge-title" className="text-[15px] font-semibold text-slate-950">해결해야 했던 문제</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">주얼리는 디자인뿐 아니라 제품에 담긴 의미와 감성이 구매 결정에 중요한 영향을 미칩니다. 여러 제품의 디자인과 특징을 일관된 브랜드 분위기 안에서 보여주면서, 펀딩 참여에 필요한 제품 정보와 리워드 구성까지 명확하게 전달할 필요가 있었습니다.</p>
              </section>
              <section aria-labelledby="direction-title">
                <h2 id="direction-title" className="text-[15px] font-semibold text-slate-950">기획·디자인 방향</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">컬렉션의 메시지와 브랜드 스토리로 감성적인 공감대를 형성한 뒤, 제품별 디자인과 디테일, 컬러 옵션, 리워드 정보로 자연스럽게 이어지도록 구성했습니다. 은은한 하늘색과 그레이 톤을 중심으로 여백이 돋보이는 레이아웃을 적용하고, 섬세한 제품 이미지와 절제된 타이포그래피로 주얼리의 고급스러운 분위기를 강조했습니다.</p>
              </section>
            </div>

            <dl className="mt-7 grid grid-cols-[88px_1fr] gap-x-4 gap-y-3 border-t border-slate-200 pt-6 text-[13px] leading-6">
              <dt className="text-slate-500">작업 범위</dt><dd className="text-slate-900">상세페이지 기획 · 카피라이팅 · 디자인 · AI 제품·컨셉 이미지 제작 · 제품 이미지 편집 및 보정</dd>
              <dt className="text-slate-500">판매 채널</dt><dd className="text-slate-900">와디즈</dd>
              <dt className="text-slate-500">제작 시기</dt><dd className="text-slate-900">2026.10</dd>
            </dl>
          </aside>

          <section aria-label="소네키 상세페이지" className="min-w-0 bg-white">
            {images.map((image, index) => (
              <Image key={image.src} src={image.src} alt={`소네키 26FW 주얼리 컬렉션 상세페이지 ${index + 1}`} width={image.width} height={image.height} unoptimized priority={index === 0} className="block h-auto w-full" />
            ))}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
