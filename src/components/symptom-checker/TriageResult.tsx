"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Home, Calendar, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import TriageResultCard from "../ai/TriageResultCard";
import { cn } from "@/utils/cn";

export type TriageLevel = "GREEN" | "YELLOW" | "RED";

export type TriageData = {
  level: TriageLevel;
  percentage: number;
  explanation: string;
  symptoms: { name: string; medicalTerm: string; description: string; importance: number }[];
  actions: { text: string; timeframe: string; type: "home" | "appointment" | "emergency" }[];
  citations: string[];
};

const LEVEL_COLORS = {
  GREEN: "#00C896", // accent
  YELLOW: "#F59E0B", // warning
  RED: "#EF4444", // danger
};

const ACTION_ICONS = {
  home: <Home className="w-5 h-5 text-[#00C896]" />,
  appointment: <Calendar className="w-5 h-5 text-[#F59E0B]" />,
  emergency: <AlertTriangle className="w-5 h-5 text-[#EF4444]" />,
};

export default function TriageResult({ data }: { data: TriageData }) {
  const [showExplainability, setShowExplainability] = useState(false);
  const color = LEVEL_COLORS[data.level];

  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (data.percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="h-full bg-[#0A2540] border-l border-white/10 flex flex-col"
    >
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-display font-bold text-white mb-2">Health Analysis</h2>
        <div className="text-white/50 text-sm font-mono">
          {new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <TriageResultCard 
          level={data.level.toLowerCase() as any}
          symptoms={data.symptoms.map(s => s.name)}
          recommendations={data.actions.map(a => ({ title: a.text, description: a.timeframe }))}
          confidence={data.percentage}
        />

        {/* Explainability Section */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => setShowExplainability(!showExplainability)}
            className="flex items-center justify-between w-full text-white/50 hover:text-white transition-colors"
          >
            <span className="font-medium text-sm">Why did Sehat AI say this?</span>
            {showExplainability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {showExplainability && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 flex flex-col gap-2">
                  {data.citations.map((cit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <Info className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                      <span className="text-white/60">Based on: <span className="text-white/80">{cit}</span></span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
