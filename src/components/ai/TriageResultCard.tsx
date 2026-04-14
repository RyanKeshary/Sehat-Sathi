"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Calendar, AlertCircle, Phone, ArrowRight, Info } from "lucide-react";
import { cn } from "@/utils/cn";

export interface Recommendation {
  title: string;
  description: string;
}

interface TriageResultCardProps {
  level: 'green' | 'yellow' | 'red';
  symptoms: string[];
  recommendations: Recommendation[];
  confidence: number;
}

export default function TriageResultCard({ level, symptoms, recommendations, confidence }: TriageResultCardProps) {
  const isGreen = level === 'green';
  const isYellow = level === 'yellow';
  const isRed = level === 'red';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-3xl border p-6 md:p-8 relative overflow-hidden",
        isGreen && "bg-[#00C896]/[0.06] border-[#00C896]",
        isYellow && "bg-amber-500/10 border-amber-500",
        isRed && "bg-rose-500/10 border-rose-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
      )}
    >
      {/* Background Icon Decoration */}
      <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12">
        {isGreen && <Check size={200} />}
        {isYellow && <Calendar size={200} />}
        {isRed && <AlertCircle size={200} />}
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
            isGreen && "bg-[#00C896] text-white",
            isYellow && "bg-amber-500 text-white",
            isRed && "bg-rose-500 text-white animate-pulse"
          )}>
            {isGreen && (
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {isYellow && (
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 10 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
              >
                <Calendar size={40} />
              </motion.div>
            )}
            {isRed && (
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <AlertCircle size={40} />
              </motion.div>
            )}
          </div>

          <div>
            <h2 className={cn(
              "text-2xl md:text-3xl font-display font-black leading-tight",
              isGreen && "text-[#00C896]",
              isYellow && "text-amber-500",
              isRed && "text-rose-500"
            )}>
              {isGreen && "Home Care Recommended"}
              {isYellow && "Schedule a Doctor Visit"}
              {isRed && "Seek Immediate Medical Attention"}
            </h2>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-xs font-bold uppercase tracking-widest opacity-50">Urgency:</span>
               <span className={cn(
                 "text-xs font-black uppercase tracking-widest",
                 isGreen && "text-[#00C896]",
                 isYellow && "text-amber-500",
                 isRed && "text-rose-500"
               )}>
                 {isGreen && "Low"}
                 {isYellow && "Within 2-3 Days"}
                 {isRed && "Absolute Emergency"}
               </span>
            </div>
          </div>
        </div>

        {/* Symptoms identified */}
        <div className="mb-8">
          <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-3">Identified Symptoms</h4>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((s, i) => (
              <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-4 mb-8">
           <h4 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-1">Care Instructions</h4>
           {recommendations.map((rec, i) => (
             <motion.div 
               key={i}
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.5 + i * 0.1 }}
               className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors"
             >
               <div className={cn(
                 "w-2 h-2 rounded-full mt-2 shrink-0",
                 isGreen && "bg-[#00C896]",
                 isYellow && "bg-amber-500",
                 isRed && "bg-rose-500"
               )} />
               <div>
                 <h5 className="font-bold text-white mb-1">{rec.title}</h5>
                 <p className="text-white/50 text-sm leading-relaxed">{rec.description}</p>
               </div>
             </motion.div>
           ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
           {isRed ? (
             <a 
               href="tel:108"
               className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-rose-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
             >
               <Phone size={24} /> Call Emergency (108)
             </a>
           ) : isYellow ? (
             <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/30">
               <Calendar size={20} /> Book Specialist Now <ArrowRight size={20} />
             </button>
           ) : (
             <button className="flex-1 bg-[#00C896] hover:bg-[#00b084] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-[#00C896]/30">
                <Info size={20} /> Local Home-Care Guide
             </button>
           )}
        </div>

        {/* Confidence Footer */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
               <span>AI Confidence</span>
               <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 1, delay: 1 }}
                    className={cn(
                      "h-full",
                      isGreen && "bg-[#00C896]",
                      isYellow && "bg-amber-500",
                      isRed && "bg-rose-500 text-white"
                    )}
                  />
               </div>
               <span>{confidence}%</span>
            </div>
            <span className="text-white/20 text-[10px] font-medium leading-tight text-right italic max-w-[150px]">
              Analysis based on clinical patterns. Always verify with a doctor.
            </span>
        </div>
      </div>
    </motion.div>
  );
}
