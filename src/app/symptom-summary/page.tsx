"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  AlertTriangle, 
  Eye, 
  Video, 
  FileText, 
  Bell,
  X,
  Stethoscope,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const RadialGauge = ({ score = 6 }: { score?: number }) => {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // We want a partial arc (e.g., 270 degrees)
  const arcLength = circumference * 0.75; 
  const dashoffset = arcLength - (score / 10) * arcLength;

  // Color Mapping
  const getColor = (s: number) => {
    if (s <= 3) return "#059669"; // Emerald
    if (s <= 6) return "#D97706"; // Amber
    return "#DC2626"; // Red
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-[225deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl font-black text-sky-900"
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-[-4px]">Severity</span>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, chips }: { label: string; value?: string; chips?: string[] }) => (
  <div className="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-slate-50 last:border-0">
    <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</span>
    {chips ? (
      <div className="flex flex-wrap gap-2">
        {chips.map(c => (
          <span key={c} className="px-2.5 py-1 bg-primary/5 text-primary text-[11px] font-black uppercase rounded-lg border border-primary/10 tracking-widest">
            {c}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-[17px] font-bold text-slate-700">{value}</span>
    )}
  </div>
);

const NextStepRow = ({ num, icon: Icon, title, desc, delay }: { num: number; icon: any; title: string; desc: string; delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 group hover:border-primary/20 transition-all cursor-pointer"
  >
    <div className="relative">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
        <Icon className="w-5 h-5" />
      </div>
      <div className="absolute -top-1 -left-1 w-5 h-5 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center text-[10px] font-black">
        {num}
      </div>
    </div>
    <div className="flex-1">
      <h4 className="text-[17px] font-black text-sky-900 leading-tight mb-1">{title}</h4>
      <p className="text-[14px] text-slate-500 font-medium leading-snug">{desc}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors self-center" />
  </motion.div>
);

// --- Main Page ---

export default function SymptomSummary() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowDisclaimer(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F9FF] font-inter pb-20 selection:bg-primary/20">
      
      {/* TOP BAR */}
      <header className="fixed top-0 inset-x-0 h-[64px] bg-white border-b border-sky-100 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-sky-900" />
          </button>
          <h1 className="text-xl font-black text-sky-900">Symptom Summary</h1>
        </div>
        <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Not a diagnosis</span>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-[560px] mx-auto flex flex-col gap-6">
        
        {/* SEVERITY CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[24px] border border-sky-100 border-t-[4px] border-t-amber-500 shadow-xl shadow-sky-900/5"
        >
          <div className="flex flex-col items-center text-center gap-6">
            <RadialGauge score={6} />
            <div>
              <h2 className="text-2xl font-black text-slate-700 leading-tight">Moderate Concern</h2>
              <p className="text-[15px] text-slate-500 font-medium italic mt-2">
                Based on: Fever, 2 days duration, severity 3/5
              </p>
            </div>
          </div>
        </motion.div>

        {/* AI SUMMARY CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[24px] border border-sky-100 shadow-xl shadow-sky-900/5"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-primary tracking-tight">AI Summary</h3>
            <div className="px-3 py-1 bg-amber-50 border border-amber-100 rounded-full flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">AI-assisted — Doctor confirms</span>
            </div>
          </div>

          <div className="flex flex-col">
            <SummaryRow label="Chief Complaint" value="Fever with mild headache" />
            <SummaryRow label="Duration" value="2 days" />
            <SummaryRow label="Severity" value="3/10 — Moderate" />
            <SummaryRow label="Medications" value="None" />
            <SummaryRow label="Allergies" value="None" />
            <SummaryRow label="Affected Systems" chips={["Respiratory", "Metabolic"]} />
          </div>
        </motion.div>

        {/* NEXT STEPS CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-[24px] border border-sky-100 shadow-xl shadow-sky-900/5"
        >
          <h3 className="text-xl font-black text-sky-900 mb-6">Next Steps</h3>
          <div className="flex flex-col gap-4">
            <NextStepRow 
              num={1} 
              icon={Eye} 
              title="Doctor reviews" 
              desc="A licensed GP will review your summary in 2 minutes." 
              delay={0.6}
            />
            <NextStepRow 
              num={2} 
              icon={Video} 
              title="Video call #2 in queue" 
              desc="Estimate waiting time is 8 minutes. Stay on this screen." 
              delay={0.7}
            />
            <NextStepRow 
              num={3} 
              icon={FileText} 
              title="E-prescription saved" 
              desc="Digital prescription will be available after the call." 
              delay={0.8}
            />
            <NextStepRow 
              num={4} 
              icon={Bell} 
              title="Reminders set" 
              desc="Dose timings will be synced with your WhatsApp." 
              delay={0.9}
            />
          </div>
        </motion.div>

        {/* DISCLAIMER STRIP */}
        <AnimatePresence>
          {showDisclaimer && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full bg-amber-50 border-l-[4px] border-l-amber-600 overflow-hidden"
            >
              <div className="p-4 flex gap-3">
                <div className="w-10 h-10 bg-amber-600 flex items-center justify-center rounded-xl text-white shrink-0">
                  <X className="w-6 h-6" />
                </div>
                <p className="text-[14px] text-amber-700 font-bold leading-tight pt-1">
                  This summary is for information only. If you experience shortness of breath or sudden chest pain, call emergency immediately.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="flex flex-col gap-4 mt-4">
          <button className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all group">
            <Stethoscope className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Connect Me to a Doctor Now
          </button>
          <button className="text-sm font-black text-primary/60 hover:text-primary transition-colors tracking-widest uppercase">
            Edit my answers
          </button>
        </div>

      </main>

    </div>
  );
}
