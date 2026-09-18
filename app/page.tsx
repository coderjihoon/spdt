import { CTASection } from "@/components/CTASection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PackageSection } from "@/components/PackageSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { ProblemSection } from "@/components/ProblemSection";
import { ProcessSection } from "@/components/ProcessSection";
import { SolutionSection } from "@/components/SolutionSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { TrustSection } from "@/components/TrustSection";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Header />
      <Hero />
      <TrustSection />
      <ProblemSection />
      <SolutionSection />
      <PortfolioSection />
      <ProcessSection />
      <PackageSection />
      <TestimonialSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
