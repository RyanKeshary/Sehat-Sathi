"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";
import { MoveUpRight, WifiOff, MapPin, Tablet, Languages } from "lucide-react";
import ScrollReveal from "../animations/ScrollReveal";

const CHALLENGES = [
  "40-50% face geographical barriers",
  "Golden hour lost to travel time",
  "Language barriers cause clinical errors",
  "No specialist in rural sub-centers",
  "Cloud tools fail without internet",
];

const PROBLEM_CARDS = [
  {
    title: "Distance Barrier",
    description: "Rural patients travel an average of 50-100km to reach a district hospital, losing critical time.",
    icon: <MapPin className="w-8 h-8 text-accent" />,
  },
  {
    title: "Digital Gap",
    description: "Complex interfaces fail those with limited tech literacy. We bridge it with voice and simple UI.",
    icon: <Tablet className="w-8 h-8 text-accent" />,
  },
  {
    title: "Language Barrier",
    description: "Medical advice is often not in the patient's native tongue, leading to dangerous misunderstandings.",
    icon: <Languages className="w-8 h-8 text-accent" />,
  },
  {
    title: "Connectivity Issues",
    description: "Standard apps stop working without 4G. Our platform is built to sync and serve even in 2G zones.",
    icon: <WifiOff className="w-8 h-8 text-accent" />,
  },
];

function TiltCard({ children }: { children: React.ReactNode }) {
    const x = useSpring(0);
    const y = useSpring(0);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / width - 0.5) * 20;
        const yPct = (mouseY / height - 0.5) * -20;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateY: x, rotateX: y, perspective: 1000 }}
            className="group"
        >
            {children}
        </motion.div>
    );
}

export default function ProblemSection() {
  return (
    <section id="problem-section" className="py-24 bg-white text-primary overflow-hidden">
      <div className="container px-6 mx-auto mb-20">
        <ScrollReveal className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-display font-extrabold text-[#0A2540] mb-6">
            The Crisis Is Real.
          </h2>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
            Every day, millions of rural Indians suffer from conditions that are entirely treatable — if only they could reach a doctor.
          </p>
        </ScrollReveal>
      </div>

      {/* Marquee Ticker */}
      <div className="bg-primary py-6 mb-24 overflow-hidden flex whitespace-nowrap">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-12 px-6"
        >
          {[...CHALLENGES, ...CHALLENGES].map((text, idx) => (
            <div key={idx} className="flex items-center gap-6">
               <span className="text-white font-medium text-lg md:text-xl">{text}</span>
               <div className="w-2 h-2 rotate-45 bg-accent" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Problem Cards Grid */}
      <div className="container px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PROBLEM_CARDS.map((card, idx) => (
            <TiltCard key={idx}>
              <div className="problem-card h-full bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-l-4 border-accent relative overflow-hidden flex flex-col items-start text-left">
                <div className="mb-6 p-4 rounded-2xl bg-accent/5">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-primary mb-3">
                  {card.title}
                </h3>
                <p className="text-primary/70 leading-relaxed text-base">
                  {card.description}
                </p>
                
                <div className="mt-8 flex items-center gap-2 text-accent font-bold text-sm tracking-wide group-hover:gap-3 transition-all cursor-pointer">
                  <span>LEARN MORE</span>
                  <MoveUpRight className="w-4 h-4" />
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
