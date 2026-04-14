"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  Mic2, 
  PhoneCall, 
  ShieldCheck,
  Check,
  Stethoscope,
  TrendingUp,
  Apple,
  Wind
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

interface HealthTip {
  text: string;
  icon: React.ElementType;
}

// --- Sub-components ---

const QueueRing = ({ progress = 0.5, minutes = 6, position = 2 }: { progress?: number; minutes?: number; position?: number }) => {
  const size = 180;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E0F2FE"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0891B2"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 2, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <motion.div 
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span className="text-3xl font-black text-sky-900 leading-none">#{position}</span>
        <span className="text-lg font-bold text-primary mt-1">Est. {minutes} min</span>
      </motion.div>
    </div>
  );
};

const ConnectivitySegment = ({ label, icon: Icon, active }: { label: string; icon: React.ElementType; active?: boolean }) => (
  <div className="flex flex-col items-center gap-2 flex-1">
    <div className={cn(
      "w-full h-12 rounded-xl flex items-center justify-center border transition-all duration-500",
      active ? "bg-primary/5 border-primary shadow-[0_0_0_3px_rgba(8,145,178,0.2)]" : "bg-slate-50 border-slate-100 opacity-40 grayscale"
    )}>
      <Icon className={cn("w-5 h-5", active ? "text-primary" : "text-slate-400")} />
    </div>
    <span className={cn("text-[8px] font-black uppercase tracking-widest text-center", active ? "text-primary" : "text-slate-400")}>
      {label}
    </span>
  </div>
);

const HealthTipsCarousel = ({ tips }: { tips: HealthTip[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % tips.length), 8000);
    return () => clearInterval(timer);
  }, [tips.length]);

  const tip = tips[index];

  return (
    <div className="bg-sky-50 p-6 rounded-[24px] border border-sky-100/50">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h4 className="text-[13px] font-black text-primary uppercase tracking-[0.2em]">While you wait</h4>
      </div>
      <div className="h-20 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
               <tip.icon className="w-6 h-6" />
            </div>
            <p className="text-[15px] font-bold text-slate-600 leading-snug">
              {tip.text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Dots */}
      <div className="flex gap-1.5 mt-4">
        {tips.map((_, i) => (
          <div key={i} className={cn("h-1 rounded-full transition-all duration-500", i === index ? "w-4 bg-primary" : "w-1.5 bg-sky-200")} />
        ))}
      </div>
    </div>
  );
};

// --- Page Component ---

export default function WaitingRoom() {
  const tips: HealthTip[] = [
    { text: "Keep a steady record of your symptoms to help the doctor during consultation.", icon: Stethoscope },
    { text: "Vitamin D levels are crucial for immune health during seasonal changes.", icon: Apple },
    { text: "Breathing exercises can help reduce acute anxiety during sudden fever.", icon: Wind },
  ];

  return (
    <div className="min-h-screen bg-[#FDFEFE] font-inter pb-20 selection:bg-primary/20">
      
      {/* TOP NAV */}
      <header className="fixed top-0 inset-x-0 h-[64px] bg-white border-b border-sky-100 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-primary" />
          <h1 className="text-xl font-black text-sky-900">Waiting Room</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-sky-100 flex items-center justify-center text-[10px] font-bold text-primary">DR</div>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400">Doctors joining...</span>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-[480px] mx-auto flex flex-col gap-6">
        
        {/* QUEUE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[32px] border border-sky-100 shadow-[0_4px_24px_rgba(8,145,178,0.08)]"
        >
          <div className="flex flex-col items-center">
            <QueueRing progress={0.5} minutes={6} position={2} />
            
            <div className="w-full h-px bg-slate-50 my-8" />
            
            <div className="flex items-center gap-3 mb-6">
               <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <p className="text-[17px] font-bold text-slate-700">Connecting you to available clinicians...</p>
            </div>

            <button className="text-sm font-black text-primary uppercase tracking-widest hover:opacity-100 opacity-60 transition-opacity">
              Switch to Voice Call
            </button>
          </div>
        </motion.div>

        {/* DOCTOR CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-[24px] border border-sky-100 border-t-[4px] border-t-primary shadow-lg shadow-sky-900/5"
        >
          <div className="flex items-center gap-4 mb-4">
             <div className="relative">
                <div className="w-14 h-14 bg-sky-50 rounded-full flex items-center justify-center text-primary font-black text-lg">
                  MN
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white" />
             </div>
             <div>
                <h3 className="text-xl font-black text-sky-900 leading-tight">Dr. Meera Nair</h3>
                <p className="text-sm font-bold text-slate-400">MBBS, MD · 12 yrs exp.</p>
             </div>
             <div className="ml-auto">
               <div className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 border border-primary/10">
                 <Check className="w-3 h-3" /> Brief Reviewing
               </div>
             </div>
          </div>
          <p className="text-[15px] font-medium text-slate-600 leading-relaxed pl-2 bg-slate-50/50 py-3 rounded-xl">
            Dr. Nair has read your symptom summary and is preparing for your consultation.
          </p>
        </motion.div>

        {/* SUMMARY PREVIEW */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-[24px] border border-sky-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-black text-primary uppercase tracking-widest">Your Summary</h3>
            <button className="text-xs font-bold text-primary/60 border-b border-primary/20">Edit answers</button>
          </div>

          <div className="flex flex-col gap-4">
             {[
               { label: "Chief Complaint", value: "Fever · 2 days" },
               { label: "Severity", value: "Moderate (3/10)" },
               { label: "Medications", value: "None" },
             ].map((row) => (
               <div key={row.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                 <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">{row.label}</span>
                 <span className="text-[15px] font-bold text-sky-900">{row.value}</span>
               </div>
             ))}
          </div>
        </motion.div>

        {/* CONNECTIVITY BAND */}
        <div className="bg-white p-4 rounded-[24px] border border-sky-100 flex flex-col gap-4">
           <div className="flex gap-2">
              <ConnectivitySegment label="HD Video" icon={Video} active />
              <ConnectivitySegment label="Good Video" icon={Video} />
              <ConnectivitySegment label="Voice Only" icon={Mic2} />
              <ConnectivitySegment label="IVR Only" icon={PhoneCall} />
           </div>
           <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] text-center opacity-60">
             Current Connection: High Definition (2.4 Mbps)
           </p>
        </div>

        {/* HEALTH TIPS */}
        <HealthTipsCarousel tips={tips} />

      </main>

    </div>
  );
}
