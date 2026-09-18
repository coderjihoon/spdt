import type { Metadata } from "next";
import { DiagnosisSection } from "@/components/apply/DiagnosisSection";
import { ExampleSection } from "@/components/apply/ExampleSection";
import { FAQSection } from "@/components/apply/FAQSection";
import { Footer } from "@/components/apply/Footer";
import { FormSection } from "@/components/apply/FormSection";
import { Header } from "@/components/apply/Header";
import { Hero } from "@/components/apply/Hero";
import { ProblemSection } from "@/components/apply/ProblemSection";
import { ProcessSection } from "@/components/apply/ProcessSection";
import { TrustSection } from "@/components/apply/TrustSection";

const title = "상페닥터 | 무료 상세페이지 진단 신청";
const description =
  "제품 URL 또는 상세페이지 이미지를 보내면 구조, 카피, 디자인 흐름을 무료로 진단하고 구매를 막는 요소 3가지를 정리해드립니다.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { type: "website", locale: "ko_KR", url: "/apply", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function ApplyPage() {
  return (
    <main className="overflow-x-clip pb-20 md:pb-0">
      <Header />
      <Hero />
      <ProblemSection />
      <DiagnosisSection />
      <ExampleSection />
      <ProcessSection />
      <TrustSection />
      <FormSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
