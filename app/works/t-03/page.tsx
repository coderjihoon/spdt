import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/apply/Header";
import { Footer } from "@/components/apply/Footer";
import images from "./images.json";

export const metadata: Metadata = {
  title: "T-03 스마트 원격 터치패드 | 상페닥터",
  description: "손을 뻗는 불편함에서 출발해, 원격 터치패드의 필요성과 사용 가치를 전달한 상세페이지.",
  openGraph: { url: "/works/t-03", title: "T-03 스마트 원격 터치패드 | 상페닥터" },
};

export default function T03ProjectPage() {
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
            <h1 className="text-[44px] font-medium leading-[1.1] tracking-[-0.04em] text-slate-950 lg:text-[56px]">T-03</h1>
            <p className="mt-4 text-[20px] font-medium tracking-[-0.02em] text-slate-900">스마트 원격 터치패드 상세페이지</p>
            <p className="mt-5 text-[15px] leading-7 text-slate-600">T-03은 거치된 스마트폰이나 태블릿을 손안에서 조작하는 원격 터치패드입니다. 제품을 처음 접하는 고객도 작동 방식과 활용 장면을 쉽게 이해할 수 있도록 상세페이지를 기획하고 디자인했습니다.</p>

            <div className="mt-8 space-y-6 border-t border-slate-200 pt-6">
              <section aria-labelledby="challenge-title">
                <h2 id="challenge-title" className="text-[15px] font-semibold text-slate-950">해결해야 했던 문제</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">원격 터치패드라는 생소한 제품이 왜 필요한지, 기존 버튼형 컨트롤러와 어떻게 다른지 설명해야 했습니다. 기능을 나열하는 데서 그치지 않고, 고객이 일상에서 느끼는 불편함과 제품의 장점을 연결하는 것이 핵심 과제였습니다.</p>
              </section>
              <section aria-labelledby="direction-title">
                <h2 id="direction-title" className="text-[15px] font-semibold text-slate-950">기획·디자인 방향</h2>
                <p className="mt-2 text-[14px] leading-7 text-slate-600">침대·식사·운동 중 화면을 조작하려고 손을 뻗는 상황을 먼저 보여주고, T-03으로 편해지는 장면을 이어 배치했습니다. 이후 터치 동작, 활용 범위, 기존 컨트롤러와의 비교, 제품 사양 순으로 정보를 구성했습니다. 블루와 화이트를 중심으로 큰 글자와 직관적인 이미지·아이콘을 사용해 모바일에서도 핵심을 빠르게 파악하도록 설계했습니다.</p>
              </section>
            </div>

            <dl className="mt-7 grid grid-cols-[88px_1fr] gap-x-4 gap-y-3 border-t border-slate-200 pt-6 text-[13px] leading-6">
              <dt className="text-slate-500">작업 범위</dt><dd className="text-slate-900">상세페이지 기획 · 카피라이팅 · 디자인 · AI 제품·사용 장면 이미지 제작</dd>
              <dt className="text-slate-500">제작 시기</dt><dd className="text-slate-900">2026.11</dd>
            </dl>
          </aside>

          <section aria-label="T-03 상세페이지" className="min-w-0 bg-white">
            {images.map((image, index) => (
              <Image key={image.src} src={image.src} alt={`T-03 스마트 원격 터치패드 상세페이지 ${index + 1}`} width={image.width} height={image.height} unoptimized priority={index === 0} className="block h-auto w-full" />
            ))}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
