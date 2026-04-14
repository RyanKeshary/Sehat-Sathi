"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Video, Brain, FileText, Users, CheckCircle2 } from "lucide-react";
import ScrollReveal from "../animations/ScrollReveal";
import LanguageMorphText from "../ai/LanguageMorphText";
import { cn } from "@/utils/cn";

const FEATURES = [
  {
    title: "Video Doctor Consult",
    subtitle: "Real-time care for remote areas",
    icon: <Video className="w-12 h-12" />,
    color: "from-[#00C896] to-[#3B82F6]",
    bullets: ["Low-latency VP9 Codec", "Auto bandwidth adjustment", "Digital prescriptions", "Works on 2G/3G"],
  },
  {
    title: "AI Symptom Checker",
    subtitle: "Triage in your mother tongue",
    icon: <Brain className="w-12 h-12" />,
    color: "from-blue-600 to-indigo-600",
    bullets: ["Support for 15+ Indic languages", "AI-driven triage (Safe/Watch/Emergency)", "Anonymous health screening", "Voice-input support"],
  },
  {
    title: "Digital Health Records",
    subtitle: "Your medical history, offline",
    icon: <FileText className="w-12 h-12" />,
    color: "from-purple-600 to-pink-600",
    bullets: ["ABHA ID Integration", "Encrypted offline vault", "Scan & upload paper records", "Automatic server sync"],
  },
  {
    title: "ASHA Worker Mode",
    subtitle: "Empowering frontline heroes",
    icon: <Users className="w-12 h-12" />,
    color: "from-orange-500 to-red-500",
    bullets: ["Dedicated worker dashboard", "Offline patient registration", "Follow-up reminders", "Community health tracking"],
  }
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    if (!sectionRef.current || !triggerRef.current) return;

    // Main horizontal scroll animation
    const horizontalTween = gsap.to(sectionRef.current, {
      xPercent: -75,
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: () => `+=${sectionRef.current?.offsetWidth}`,
        scrub: 1.5,
        pin: true,
        invalidateOnRefresh: true,
      },
    });

    // Child animations for each panel — content slides up as panel enters center
    panelsRef.current.forEach((panel) => {
      if (!panel) return;
      const content = panel.querySelector(".feature-content");
      const mockup = panel.querySelector(".feature-mockup");

      if (content) {
        gsap.from(content, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: horizontalTween,
            start: "left center",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (mockup) {
        gsap.from(mockup, {
          y: 50,
          opacity: 0,
          scale: 0.9,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: horizontalTween,
            start: "left center",
            toggleActions: "play none none reverse",
          },
        });
      }
    });
  }, { scope: triggerRef });

  return (
    <div id="features-section" className="bg-[#060F1E] overflow-hidden">
      <div ref={triggerRef} className="h-screen overflow-hidden">
        {/* Sticky Header */}
        <div className="absolute top-28 left-0 w-full z-20 text-center flex flex-col items-center pointer-events-none">
             <ScrollReveal className="max-w-4xl mx-auto px-6">
                 <h3 className="text-white text-3xl md:text-5xl font-display font-bold mb-4">One Platform. Everything You Need.</h3>
                 <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl">
                    We built Sehat Sathi to solve every barrier — distance, language, connectivity, and cost — in a single application designed for rural India.
                 </p>
             </ScrollReveal>
        </div>

        <div ref={sectionRef} className="flex h-full w-[400vw] relative bg-dark-bg">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              ref={(el) => { if (el) panelsRef.current[i] = el; }}
              className="w-screen h-screen flex items-center justify-center p-6 md:p-20 relative"
            >
              {/* background decorative element */}
              <div className={cn("absolute inset-0 opacity-5 bg-gradient-to-br", feature.color)} />

              <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 mt-16">
                {/* Text Content */}
                <div className="feature-content max-w-xl">
                  <div className={cn("w-24 h-24 rounded-3xl mb-8 flex items-center justify-center bg-gradient-to-br shadow-2xl", feature.color)}>
                    {feature.icon}
                  </div>
                  <h4 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-4">
                    {feature.title}
                  </h4>
                  {i === 1 ? (
                    <LanguageMorphText 
                      options={[
                        { text: "Describe your symptoms", language: "en" },
                        { text: "अपने लक्षण बताएं", language: "hi" },
                        { text: "ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ", language: "pa" },
                        { text: "మీ లక్షణాలను వివరించండి", language: "te" },
                        { text: "உங்கள் அறிகுறிகளை விவரிக்கவும்", language: "ta" }
                      ]}
                      className="text-xl text-white/60 mb-8 font-medium italic overflow-hidden"
                    />
                  ) : (
                    <p className="text-xl text-white/60 mb-8 font-medium italic">
                      {feature.subtitle}
                    </p>
                  )}
                  <ul className="space-y-4">
                    {feature.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-white/80 text-lg">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  
                  <button className={cn("mt-12 px-8 py-4 rounded-full font-bold text-white transition-all transform hover:scale-105 active:scale-95", "bg-white/10 border border-white/20 hover:bg-white/20")}>
                    Learn More
                  </button>
                </div>

                {/* Visual Mockup */}
                <div className="feature-mockup hidden lg:flex justify-center relative">
                    <div className={cn("w-full max-w-sm aspect-[9/19] rounded-[3.5rem] border-[12px] border-[#1a1a1a] bg-black/40 overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]", "before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/60 before:to-transparent")}>
                        <div className="p-8 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-center text-white/40 text-[10px] font-mono pt-4">
                                <span>12:45 PM</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-2 rounded-sm border border-current" />
                                    <span>LTE</span>
                                </div>
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                                <div className={cn("w-20 h-20 rounded-full animate-pulse blur-3xl opacity-50", feature.color)} />
                                <div className="absolute text-white/20">
                                    {feature.icon}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-2 w-2/3 bg-white/10 rounded" />
                                <div className="h-2 w-1/2 bg-white/10 rounded" />
                                <div className={cn("h-10 w-full rounded-2xl bg-gradient-to-r opacity-40", feature.color)} />
                            </div>
                        </div>
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass px-4 py-2 rounded-full font-mono text-[10px] text-accent font-bold tracking-widest uppercase border-accent/20">
                             Simulated Device
                        </div>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
