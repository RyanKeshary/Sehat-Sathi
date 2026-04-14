"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  WifiOff, 
  Video, 
  Bell, 
  FileText, 
  ShieldCheck 
} from "lucide-react";

export function FeatureGrid() {
  const features = [
    {
      title: "AI Symptom Checker",
      desc: "Instant clinical insights using local LLMs that work even on low-spec hardware.",
      icon: Brain,
    },
    {
      title: "Offline Records",
      desc: "Full PWA functionality. Sync with ABDM servers automatically when online.",
      icon: WifiOff,
    },
    {
      title: "Video Consultation",
      desc: "Low-latency HD video calls optimized for rural bandwidth conditions.",
      icon: Video,
    },
    {
      title: "Medication Reminders",
      desc: "Smart alerts via WhatsApp, SMS, and App notifications to improve adherence.",
      icon: Bell,
    },
    {
      title: "E-Prescription",
      desc: "FHIR-ready prescriptions that integrate directly with network pharmacies.",
      icon: FileText,
    },
    {
      title: "Compliance Dashboard",
      desc: "Real-time audit trails and DPDPA/ABDM compliance tracking for hospitals.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 flex flex-col items-center gap-4">
          <span className="text-primary font-bold uppercase tracking-wider text-sm">Capabilities</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold max-w-3xl">
            Everything Bharat needs for digital health in one platform.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="bg-white p-10 rounded-2xl border border-accent shadow-premium hover:shadow-hover transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-body leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
