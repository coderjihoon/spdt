import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/apply/Header";
import { Footer } from "@/components/apply/Footer";
import images from "./images.json";

export const metadata: Metadata = {
  title: "ZEUS 코골이 관리 웨어러블 상세페이지 제작 | 상페닥터",
  description: "연구 기반 기술과 간편한 착용 방식을 직관적으로 풀어, 새로운 코골이 관리 경험으로 소개했습니다.",
  openGraph: { url: "/works/zeus", title: "ZEUS 코골이 관리 웨어러블 상세페이지 제작 | 상페닥터" },
};

export default function ZeusProjectPage() {
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
            <h1 className="text-[44px] font-medium leading-[1.1] tracking-[-0.04em] text-slate-950 lg:text-[56px]">ZEUS Sleep</h1>
            <p className="mt-4 text-[20px] font-medium tracking-[-0.02em] text-slate-900">코골이 관리 웨어러블 상세페이지</p>
            <p className="mt-5 text-[15px] leading-7 text-slate-600">ZEUS는 턱 아래에 부착해 사용하는 코골이 관리용 웨어러블 디바이스입니다. 해외 브랜드의 연구개발 배경과 제품 작동 원리, 간편한 사용 방식을 국내 고객이 쉽게 이해할 수 있도록 와디즈 상세페이지를 기획·디자인했습니다.</p>

            <div className="mt-8 space-y-6 border-t border-slate-200 pt-6">
              <section aria-labelledby="challenge-title">
                <h2 id="challenge-title" className="text-[15px] font-semibold text-slate-950">해결해야 했던 문제</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">제품의 작동 방식이 일반적인 코골이 관리 제품과 달라, 고객이 짧은 시간 안에 원리와 차별점을 이해하기 어려웠습니다. 또한 연구 및 임상 자료의 신뢰감을 전달하면서도, 의료기기로 오인되지 않도록 제품의 역할과 사용 범위를 명확하게 표현할 필요가 있었습니다.</p>
              </section>
              <section aria-labelledby="direction-title">
                <h2 id="direction-title" className="text-[15px] font-semibold text-slate-950">기획·디자인 방향</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">코골이로 인한 일상 속 불편에서 시작해 기존 관리 방식의 한계, ZEUS의 작동 원리와 차별점, 연구 데이터, 사용 방법과 안전 정보 순으로 정보를 재구성했습니다. 브랜드의 딥 퍼플 컬러와 정제된 테크 비주얼을 기반으로 제품 착용 장면, 작동 원리 그래픽과 모션을 활용해 복잡한 기술을 직관적으로 전달하고, 연구 근거와 실제 사용 정보를 함께 배치해 신뢰도를 높였습니다.</p>
              </section>
            </div>

            <dl className="mt-7 grid grid-cols-[88px_1fr] gap-x-4 gap-y-3 border-t border-slate-200 pt-6 text-[13px] leading-6">
              <dt className="text-slate-500">작업 범위</dt><dd className="text-slate-900">상세페이지 기획 · 카피라이팅 · 디자인 · AI 제품·사용 장면 이미지 제작 · 작동 원리 그래픽·영상 제작 · 제품·패키지 목업 제작</dd>
              <dt className="text-slate-500">판매 채널</dt><dd className="text-slate-900">와디즈</dd>
              <dt className="text-slate-500">제작 시기</dt><dd className="text-slate-900">2026.11</dd>
            </dl>
          </aside>

          <section aria-label="ZEUS 상세페이지" className="min-w-0 bg-white">
            {images.map((image, index) => (
              <Image key={image.src} src={image.src} alt={`ZEUS 코골이 관리 웨어러블 상세페이지 ${index + 1}`} width={image.width} height={image.height} unoptimized priority={index === 0} className="block h-auto w-full" />
            ))}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
