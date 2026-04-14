"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";
import { Mic, BrainCircuit, Stethoscope } from "lucide-react";

const STEPS = [
  {
    icon: <Mic className="w-8 h-8" />,
    title: "Describe Your Symptoms",
    description: "Speak or type in your own language. Our AI understands 15+ Indic dialects.",
    color: "#00C896"
  },
  {
    icon: <BrainCircuit className="w-8 h-8" />,
    title: "AI Triages & Matches",
    description: "Instant analysis of urgency. If specialized care is needed, we match you instantly.",
    color: "#3B82F6"
  },
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: "Consult & Heal",
    description: "Face-to-face video consultation with a verified doctor and a clear recovery path.",
    color: "#00C896"
  }
];

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 bg-[#060F1E] relative overflow-hidden">
      <div className="container px-6 mx-auto relative z-10">
        <ScrollReveal className="text-center mb-20">
          <h2 className="text-white text-3xl md:text-5xl font-display font-bold mb-4">Getting Help Is Now This Simple.</h2>
          <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            From describing a symptom to speaking with a specialist — it takes less than 3 minutes.
          </p>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 relative">
          {/* Connecting SVG Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full hidden lg:block -translate-y-1/2 z-0">
            <svg width="100%" height="100" viewBox="0 0 1000 100" fill="none" preserveAspectRatio="none">
               {/* Background dashed path */}
               <path 
                d="M 50 50 Q 250 10 500 50 T 950 50" 
                stroke="white" 
                strokeOpacity="0.1" 
                strokeWidth="2" 
                strokeDasharray="8 8" 
               />
               {/* Animated draw path — targeted by GSAP hook */}
               <path 
                id="hiw-draw-path"
                d="M 50 50 Q 250 10 500 50 T 950 50" 
                stroke="url(#gradient-line)" 
                strokeWidth="4" 
                strokeLinecap="round"
                fill="none"
               />
               {/* Framer Motion parallax path (kept as a backup overlay) */}
               <motion.path 
                d="M 50 50 Q 250 10 500 50 T 950 50" 
                stroke="url(#gradient-line)" 
                strokeWidth="4" 
                strokeLinecap="round"
                style={{ pathLength }}
                fill="none"
                opacity={0.5}
               />
               <defs>
                 <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#00C896" />
                   <stop offset="100%" stopColor="#3B82F6" />
                 </linearGradient>
               </defs>
            </svg>
          </div>

          {STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="hiw-step relative z-10 flex flex-col items-center text-center max-w-xs"
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-8 relative"
                style={{ backgroundColor: `${step.color}20`, border: `2px solid ${step.color}40` }}
              >
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: step.color }} />
                <div style={{ color: step.color }}>{step.icon}</div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white text-primary font-bold flex items-center justify-center text-sm shadow-xl">
                  {idx + 1}
                </div>
              </div>
              <h4 className="text-xl font-display font-bold text-white mb-4">{step.title}</h4>
              <p className="text-white/60 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
