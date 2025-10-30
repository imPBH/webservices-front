import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { CTA } from "../components/sections/CTA";
import { FAQSection } from "../components/sections/FAQ";
import { Features } from "../components/sections/Features";
import { Hero } from "../components/sections/Hero";
import { UseCases } from "../components/sections/UseCases";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <Hero />
      <Features />
      <UseCases />
      <FAQSection />
      <CTA />
      <Footer />
    </div>
  );
}
