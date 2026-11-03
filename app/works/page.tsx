import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/apply/Footer";
import { Header } from "@/components/apply/Header";

export const metadata: Metadata = {
  title: "작업물 | 상페닥터",
  description: "상세페이지 구조와 카피, 디자인 작업 사례를 살펴보세요.",
  openGraph: { url: "/works", title: "작업물 | 상페닥터" },
};

export default function WorksPage() {
  return (
    <main className="overflow-x-clip bg-white">
      <Header mobileCta={false} />
      <section className="px-4 pb-24 pt-16 sm:px-6 lg:px-10 lg:pb-36 lg:pt-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h1 className="text-[36px] font-medium leading-[1.15] tracking-[-0.04em] text-slate-950 sm:text-[52px] lg:text-[60px]">
            제품의 장점이<br />분명히 보이는 상세페이지.
          </h1>
          <p className="max-w-[480px] text-[16px] leading-8 text-slate-600 lg:max-w-[360px] lg:text-[18px] xl:max-w-[480px]">
            제품의 강점이 고객에게 필요한 순서로 읽히도록, 구조와 카피, 화면을 함께 설계합니다.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-20 lg:gap-20">
          <article>
            <Link href="/works/deopocket" className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">
              <div className="relative aspect-video overflow-hidden bg-[#eee5d7]">
                <Image src="/works/deopocket/thumbnail-v2.webp" alt="데오포켓 가정용 탈취제 상세페이지 보기" fill priority sizes="100vw" className="object-cover transition-opacity group-hover:opacity-90" />
              </div>
              <h2 className="mt-4 text-[20px] font-semibold leading-normal tracking-[-0.02em] text-slate-900 group-hover:underline group-hover:underline-offset-4 lg:text-[24px]">데오포켓 가정용 탈취제 상세페이지 리뉴얼</h2>
              <p className="mt-1 text-[14px] leading-6 text-slate-600 lg:text-[16px]">검증된 탈취 성능에 감성적인 생활 장면을 더해, 우리 집에 두고 싶은 제품으로 소개했습니다.</p>
            </Link>
          </article>
          <article>
            <Link href="/works/zeus" className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">
              <div className="relative aspect-video overflow-hidden bg-[#3b2845]">
                <Image src="/works/zeus/thumbnail-v2.webp" alt="ZEUS 코골이 관리 웨어러블 상세페이지 보기" fill priority sizes="100vw" className="object-cover transition-opacity group-hover:opacity-90" />
              </div>
              <h2 className="mt-4 text-[20px] font-semibold leading-normal tracking-[-0.02em] text-slate-900 group-hover:underline group-hover:underline-offset-4 lg:text-[24px]">ZEUS 코골이 관리 웨어러블 상세페이지</h2>
              <p className="mt-1 text-[14px] leading-6 text-slate-600 lg:text-[16px]">연구 기반 기술과 간편한 착용 방식을 직관적으로 풀어, 새로운 코골이 관리 경험으로 소개했습니다.</p>
            </Link>
          </article>
          <article>
            <Link href="/works/myodam" className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">
              <div className="relative aspect-video overflow-hidden bg-[#ed903f]">
                <Image src="/works/myodam/thumbnail-v2.webp" alt="묘담 키튼 건강스틱 상세페이지 보기" fill priority sizes="100vw" className="object-cover transition-opacity group-hover:opacity-90" />
              </div>
              <h2 className="mt-4 text-[20px] font-semibold leading-normal tracking-[-0.02em] text-slate-900 group-hover:underline group-hover:underline-offset-4 lg:text-[24px]">묘담 키튼 건강스틱 상세페이지</h2>
              <p className="mt-1 text-[14px] leading-6 text-slate-600 lg:text-[16px]">성장기 고양이에게 필요한 영양을 신중하게 설계하고, 보호자가 쉽게 이해하고 신뢰할 수 있도록 풀어낸 상세페이지입니다.</p>
            </Link>
          </article>
          <article>
            <Link href="/works/nacreworks" className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">
              <div className="relative aspect-video overflow-hidden bg-[#171719]">
                <Image src="/works/nacreworks/thumbnail-v2.webp" alt="나크레웍스 천연 자개 맥세이프 케이스 상세페이지 보기" fill priority sizes="100vw" className="object-cover transition-opacity group-hover:opacity-90" />
              </div>
              <h2 className="mt-4 text-[20px] font-semibold leading-normal tracking-[-0.02em] text-slate-900 group-hover:underline group-hover:underline-offset-4 lg:text-[24px]">나크레웍스 천연 자개 맥세이프 케이스 상세페이지</h2>
              <p className="mt-1 text-[14px] leading-6 text-slate-600 lg:text-[16px]">천연 자개 고유의 아름다움에 제품의 기능성과 기술력을 더해, 특별한 가치를 지닌 프리미엄 케이스로 소개했습니다.</p>
            </Link>
          </article>
          <article>
            <Link href="/works/sonkei" className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">
              <div className="relative aspect-video overflow-hidden bg-[#e6f2f6]">
                <Image src="/works/sonkei/thumbnail-v2.webp" alt="소네키 26FW 주얼리 컬렉션 상세페이지 보기" fill priority sizes="100vw" className="object-cover transition-opacity group-hover:opacity-90" />
              </div>
              <h2 className="mt-4 text-[20px] font-semibold leading-normal tracking-[-0.02em] text-slate-900 group-hover:underline group-hover:underline-offset-4 lg:text-[24px]">소네키 26FW 주얼리 컬렉션 와디즈 펀딩 상세페이지</h2>
              <p className="mt-1 text-[14px] leading-6 text-slate-600 lg:text-[16px]">주얼리에 담긴 소망과 의미를 감성적인 비주얼로 풀어내고, 브랜드의 스토리와 제품의 가치를 하나의 흐름으로 전달했습니다.</p>
            </Link>
          </article>
          <article>
            <Link href="/works/t-03" className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">
              <div className="relative aspect-video overflow-hidden bg-[#e6effa]">
                <Image src="/works/t-03/thumbnail-v2.webp" alt="T-03 스마트 원격 터치패드 상세페이지 보기" fill priority sizes="100vw" className="object-cover transition-opacity group-hover:opacity-90" />
              </div>
              <h2 className="mt-4 text-[20px] font-semibold leading-normal tracking-[-0.02em] text-slate-900 group-hover:underline group-hover:underline-offset-4 lg:text-[24px]">T-03 스마트 원격 터치패드</h2>
              <p className="mt-1 text-[14px] leading-6 text-slate-600 lg:text-[16px]">손을 뻗는 불편함에서 출발해, 원격 터치패드의 필요성과 사용 가치를 전달한 상세페이지.</p>
            </Link>
          </article>
          <article>
            <Link href="/works/fiore" className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004EE0]">
              <div className="relative aspect-video overflow-hidden bg-[#fae7e9]">
                <Image src="/works/fiore/thumbnail-v2.webp" alt="피오르 이노시톨 건강식품 상세페이지 보기" fill priority sizes="100vw" className="object-cover transition-opacity group-hover:opacity-90" />
              </div>
              <h2 className="mt-4 text-[20px] font-semibold leading-normal tracking-[-0.02em] text-slate-900 group-hover:underline group-hover:underline-offset-4 lg:text-[24px]">피오르 이노시톨 건강식품 상세페이지</h2>
              <p className="mt-1 text-[14px] leading-6 text-slate-600 lg:text-[16px]">여성의 건강한 일상을 위한 섬세한 성분 설계에 부드러운 감성을 더해, 신뢰하고 선택할 수 있는 제품으로 소개했습니다.</p>
            </Link>
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
}
