import type { Metadata } from "next";
import { DiagnosisSection } from "@/components/apply/DiagnosisSection";
import { ExampleSection } from "@/components/apply/ExampleSection";
import { FAQSection } from "@/components/apply/FAQSection";
import { Footer } from "@/components/apply/Footer";
import { FormSection } from "@/components/apply/FormSection";
import { Header } from "@/components/apply/Header";
import { Hero } from "@/components/apply/Hero";
import { PortfolioSection } from "@/components/apply/PortfolioSection";
import { ProblemSection } from "@/components/apply/ProblemSection";
import { ProcessSection } from "@/components/apply/ProcessSection";
import { ProofSection } from "@/components/apply/ProofSection";
import { ReportPreviewSection } from "@/components/apply/ReportPreviewSection";
import { TrustSection } from "@/components/apply/TrustSection";

const title = "상페닥터 | 무료 상세페이지 진단 신청";
const description =
  "제품 URL 또는 상세페이지 이미지를 보내면 정보 순서와 문장, 디자인을 무료로 진단하고 구매를 막는 요소 3가지를 정리해드립니다.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { type: "website", locale: "ko_KR", url: "/", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function Home() {
  return (
    <main className="overflow-x-clip bg-white pb-20 md:pb-0">
      <Header />
      <Hero />
      <ProofSection />
      <ReportPreviewSection />
      <PortfolioSection />
      <ProblemSection />
      <DiagnosisSection />
      <ExampleSection />
      <ProcessSection />
      <TrustSection />
      <FAQSection />
      <FormSection />
      <Footer />
      <a
        href="https://open.kakao.com/me/spdt"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-4 bottom-24 z-40 inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-5 py-3.5 text-sm font-semibold text-[#191919] shadow-[0_6px_20px_rgba(15,23,42,0.18)] transition hover:bg-[#FADA0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004EE0] md:right-6 md:bottom-6"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M12 3C6.5 3 2 6.5 2 11c0 2.9 1.8 5.4 4.6 6.8L5.5 22l5-2.4c.5.1 1 .1 1.5.1 5.5 0 10-3.5 10-8S17.5 3 12 3Z" />
        </svg>
        문의하기
      </a>
    </main>
  );
}
