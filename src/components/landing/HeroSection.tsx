"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import ParticleBackground from "../animations/ParticleBackground";
import Link from "next/link";
import VideoModal from "./VideoModal";

const SOCIAL_PROOFS = [
  { icon: "🏥", text: "500+ Verified Doctors", delay: 0.1 },
  { icon: "🗣️", text: "15+ Languages", delay: 0.2 },
  { icon: "⚡", text: "Works Offline", delay: 0.3 },
  { icon: "🔒", text: "DPDPA Compliant", delay: 0.4 },
  { icon: "📍", text: "Serving Rural India", delay: 0.5 },
];

export default function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section
      id="hero-section"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-dark-bg pt-20"
    >
      {/* Background */}
      <div id="hero-particles">
        <ParticleBackground />
      </div>

      {/* Content */}
      <div id="hero-content" className="container relative z-10 px-6 text-center">
        {/* Headline */}
        <div className="mb-6 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold text-5xl lg:text-7xl text-white leading-tight"
          >
            800 Million Indians
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold text-5xl lg:text-7xl leading-tight"
          >
            Deserve <span className="bg-gradient-to-r from-[#00C896] to-[#3B82F6] bg-clip-text text-transparent">Better Healthcare</span>
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-2xl lg:text-3xl text-white/70"
          >
            Starting Right Now.
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[640px] mx-auto font-sans text-base lg:text-xl text-white/65 mb-10 leading-relaxed text-center"
        >
          Sehat Sathi connects rural patients with certified doctors through video consultation, 
          checks symptoms in 10+ Indian languages using AI, and keeps your health records safe 
          — even without internet.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/get-started">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group h-[52px] bg-accent text-dark-bg px-8 rounded-full font-bold flex items-center gap-2 glow-green"
            >
              <span>Start Free Consultation</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsVideoOpen(true)}
            className="h-[52px] border border-white/20 hover:border-white/40 px-8 rounded-full font-bold flex items-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Watch How It Works</span>
          </motion.button>
        </motion.div>

        {/* Social Proof Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {SOCIAL_PROOFS.map((proof, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: proof.delay, duration: 0.5 }
              }}
              whileInView={{
                scale: [1, 1.02, 1],
                transition: { 
                  duration: 4, 
                  repeat: Infinity, 
                  delay: proof.delay * 2 
                }
              }}
              className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium border-white/5"
            >
              <span>{proof.icon}</span>
              <span className="text-white/80">{proof.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 12, 0] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-accent rounded-full" 
          />
        </div>
        <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
      </motion.div>
      <AnimatePresence>
        <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      </AnimatePresence>
    </section>
  );
}
