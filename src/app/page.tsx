"use client";

import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import { StatsSection, TestimonialsSection, CTASection, Footer } from "@/components/landing/FinalSections";
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
