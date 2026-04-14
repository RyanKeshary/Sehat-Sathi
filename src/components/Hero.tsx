"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  const pills = ["Offline-First PWA", "ABHA Integrated", "DPDPA Compliant"];

  const stats = [
    { label: "HbA1c", value: "6.4%", color: "teal", delay: 0 },
    { label: "Blood Pressure", value: "120/80", color: "teal", delay: 1 },
    { label: "Next Dose", value: "in 2h 40m", color: "teal", delay: 2 },
  ];

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden flex items-center">
      {/* Background Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-wrap gap-3">
            {pills.map((pill) => (
              <span
                key={pill}
                className="px-4 py-1.5 bg-accent text-primary text-sm font-semibold rounded-full border border-primary/10 shadow-sm"
              >
                {pill}
              </span>
            ))}
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-heading leading-[1.1]">
            Healthcare that reaches{" "}
            <span className="text-primary italic">every corner</span> of India.
          </h1>

          <p className="text-xl text-body max-w-lg leading-relaxed">
            Sehat Sathi bridge the gap between clinics and communities with
            ABHA-integrated, offline-ready digital health solutions tailored for Bharat.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button className="px-8 py-4 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white border border-accent text-heading font-bold rounded-xl hover:bg-accent/50 transition-colors shadow-sm">
              Watch Demo
            </button>
          </div>

          {/* Trust Strip */}
          <div className="mt-12 pt-8 border-t border-accent flex flex-col gap-4">
            <p className="text-sm font-bold uppercase tracking-wider text-body/60">
              Trusted by 500+ Clinics across India
            </p>
            <div className="flex items-center gap-8 grayscale opacity-50">
              {/* Mock logos or text */}
              <span className="font-bold text-lg">NHM</span>
              <span className="font-bold text-lg">AIIMS</span>
              <span className="font-bold text-lg">ABDM</span>
            </div>
          </div>
        </motion.div>

        {/* Right Visuals */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[450px]">
            {/* Phone Image */}
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-heading/5">
              <Image
                src="/hero-mockup.png"
                alt="Sehat Sathi Dashboard"
                width={500}
                height={1000}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Stat Cards */}
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                animate={{
                  y: [-8, 0, -8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: stat.delay,
                  ease: "easeInOut",
                }}
                className={cn(
                  "absolute z-20 glass p-5 rounded-2xl shadow-premium border-l-4 border-l-primary flex flex-col gap-1 w-48",
                  i === 0 ? "-left-12 top-20" : i === 1 ? "-right-8 top-1/2" : "-left-8 bottom-32"
                )}
              >
                <span className="text-xs font-bold text-body/60 uppercase">
                  {stat.label}
                </span>
                <span className="text-2xl font-bold text-heading">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
