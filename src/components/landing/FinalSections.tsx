"use client";

import React from "react";
import { motion } from "framer-motion";
import ScrollReveal from "../animations/ScrollReveal";
import Link from "next/link";

const STATS = [
  { value: 85, suffix: "-90%", label: "AI Accuracy" },
  { value: 500, suffix: "ms", label: "Video Latency" },
  { value: 22, suffix: "", label: "Languages Supported" },
  { value: 0, suffix: "", label: "Data Lost Offline" }
];

export function StatsSection() {
  return (
    <section id="impact" className="py-24 bg-[#0A2540] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full" style={{ backgroundImage: "radial-gradient(#00C896 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="container px-6 mx-auto relative z-10">
        <ScrollReveal className="text-center mb-20 max-w-4xl mx-auto">
          <h2 className="text-white text-3xl md:text-5xl font-display font-bold mb-4">The Numbers Don't Lie.</h2>
          <p className="text-white/60 text-lg md:text-xl font-medium">
            Our platform's clinical effectiveness, measured and verified.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center relative py-10"
            >
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="text-5xl md:text-6xl font-display font-black text-white mb-2 font-mono">
                <span
                  data-counter={stat.value}
                  data-counter-suffix={stat.suffix}
                >
                  0
                </span>
              </div>
              <div className="text-accent font-bold tracking-widest uppercase text-xs">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { quote: "Sehat Sathi changed how our village views doctors. The AI speaks our language perfectly.", name: "Rajesh Kumar", location: "Nabha, Punjab" },
  { quote: "Even with 2G, I could consult a specialist in Delhi. This is the future of our healthcare.", name: "Sita Devi", location: "Bastar, Chhattisgarh" },
  { quote: "The offline syncing feature is a lifesaver for our ASHA workers in remote hills.", name: "Amrita Thapa", location: "Chamoli, Uttarakhand" },
  { quote: "I registered my grandmother for ABHA ID in minutes. The simplicity is incredible.", name: "Arjun Verma", location: "Sanchi, MP" }
];

export function TestimonialsSection() {
    return (
        <section id="testimonials-section" className="py-24 bg-[#060F1E] overflow-hidden">
            <div className="container px-6 mx-auto mb-16">
                <ScrollReveal className="text-center max-w-4xl mx-auto">
                    <h3 className="text-white text-3xl md:text-5xl font-display font-bold mb-4">Hear From Rural India.</h3>
                    <p className="text-white/60 text-lg md:text-xl font-medium">Real patients. Real doctors. Real change.</p>
                </ScrollReveal>
            </div>

            <div className="flex gap-8 px-6 overflow-hidden">
                <motion.div
                    id="testimonials-container"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="flex gap-8 whitespace-nowrap"
                    style={{ willChange: "transform" }}
                >
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
                        <div key={idx} className="w-[400px] glass p-10 rounded-3xl flex flex-col justify-between shrink-0">
                            <p className="text-white/80 italic text-lg leading-relaxed mb-8 whitespace-normal">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <div>
                                <h5 className="text-white font-bold">{t.name}</h5>
                                <span className="text-accent text-sm">{t.location}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export function CTASection() {
    return (
        <section className="py-24 container px-6 mx-auto">
            <div
              id="cta-card"
              className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-accent to-highlight p-12 md:p-24 text-center shadow-2xl"
              style={{ clipPath: "inset(0 0% 0 0)" }}
            >
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }} />
                
                <ScrollReveal className="relative z-10 mb-12">
                   <h2
                     id="cta-headline"
                     className="text-4xl md:text-7xl font-display font-extrabold mb-8 leading-tight"
                   >
                       <span className="bg-gradient-to-r from-[#00C896] to-[#3B82F6] bg-clip-text text-transparent">Your Health Has No Borders.</span>
                   </h2>
                   <p className="text-white/80 text-lg md:text-2xl font-medium max-w-3xl mx-auto">
                     Join thousands of patients and doctors using Sehat Sathi to bridge India's healthcare gap.
                   </p>
                </ScrollReveal>
                
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <Link href="/get-started" className="relative group">
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping group-hover:animate-none opacity-50" />
                        <div className="relative bg-primary text-white text-xl font-bold px-12 py-5 rounded-full hover:scale-105 transition-transform flex items-center gap-3">
                            Join Sehat Sathi Free
                        </div>
                    </Link>
                    <p className="text-white/80 font-medium text-sm">
                        Free for patients · Works on 2G · Available in 10+ languages
                    </p>
                </div>
            </div>
        </section>
    );
}

export function Footer() {
    return (
        <footer className="bg-[#060F1E] border-t border-white/5 pt-24 pb-12 px-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div className="md:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                         <div className="w-8 h-8 rounded-lg bg-accent" />
                         <span className="font-display font-bold text-2xl">Sehat Sathi</span>
                    </div>
                    <p className="text-white/50 leading-relaxed mb-8">
                        Bridging the rural healthcare gap through AI and human-centered design.
                    </p>
                    <div className="flex gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer">
                                {i}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h6 className="text-white font-bold mb-6">Product</h6>
                    <ul className="space-y-4 text-white/50">
                        {["Features", "AI Triage", "Offline Sync", "Mobile App"].map(link => (
                            <li key={link} className="hover:text-accent transition-colors cursor-pointer">{link}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h6 className="text-white font-bold mb-6">Company</h6>
                    <ul className="space-y-4 text-white/50">
                        {["About Us", "Contact", "Doctors", "Impact"].map(link => (
                            <li key={link} className="hover:text-accent transition-colors cursor-pointer">{link}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h6 className="text-white font-bold mb-6">Compliance</h6>
                    <div className="flex flex-wrap gap-3">
                        <div className="glass px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest text-white/40 border-white/5">
                            DPDPA Compliant
                        </div>
                        <div className="glass px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest text-white/40 border-white/5">
                            ABDM Integrated
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-white/30 text-xs">
                <span>© 2026 Sehat Sathi. All rights reserved.</span>
                <span className="italic">An AI in every pocket. An Asha in every village.</span>
            </div>
        </footer>
    );
}
