"use client";

import dynamic from "next/dynamic";
import ComponentSkeleton from "@/components/ui/ComponentSkeleton";

const HeroSection = dynamic(() => import("@/components/landing/HeroSection"), { 
  ssr: true,
  loading: () => <div className="min-h-screen bg-[#060F1E]" /> 
});
const ProblemSection = dynamic(() => import("@/components/landing/ProblemSection"), { 
  ssr: false, 
  loading: () => <ComponentSkeleton /> 
});
const FeaturesSection = dynamic(() => import("@/components/landing/FeaturesSection"), { 
  ssr: false, 
  loading: () => <ComponentSkeleton /> 
});
const HowItWorksSection = dynamic(() => import("@/components/landing/HowItWorksSection"), { 
  ssr: false, 
  loading: () => <ComponentSkeleton /> 
});
const StatsSection = dynamic(() => import("@/components/landing/FinalSections").then(mod => mod.StatsSection), { 
  ssr: false, 
  loading: () => <ComponentSkeleton /> 
});
const TestimonialsSection = dynamic(() => import("@/components/landing/FinalSections").then(mod => mod.TestimonialsSection), { 
  ssr: false, 
  loading: () => <ComponentSkeleton /> 
});
const CTASection = dynamic(() => import("@/components/landing/FinalSections").then(mod => mod.CTASection), { 
  ssr: false, 
  loading: () => <ComponentSkeleton /> 
});
const Footer = dynamic(() => import("@/components/landing/FinalSections").then(mod => mod.Footer), { 
  ssr: true 
});

import { useScrollAnimations } from "@/hooks/useScrollAnimations";

export default function Home() {
  // Initialize all GSAP ScrollTrigger animations for the landing page
  useScrollAnimations();

  return (
    <main className="relative bg-dark-bg min-h-screen">
      {/* Sections */}
      <div className="relative">
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
