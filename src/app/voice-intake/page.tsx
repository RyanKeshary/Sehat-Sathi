"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  Keyboard, 
  ChevronRight, 
  Languages,
  Loader2,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const SemicircleBars = ({ isActive, heights }: { isActive: boolean; heights: number[] }) => (
  <div className="flex gap-1 items-end justify-center h-10 w-[180px]">
    {heights.map((h, i) => (
      <div
        key={i}
        style={{ height: `${isActive ? h : 4}px` }}
        className={cn(
          "w-1 rounded-full transition-[height] duration-75",
          isActive ? "bg-primary" : "bg-slate-200"
        )}
      />
    ))}
  </div>
);

const HighlightText = ({ text, keywords }: { text: string; keywords: string[] }) => {
  if (!text) return null;
  
  const words = text.split(" ");
  return (
    <div className="flex flex-wrap gap-x-1.5 leading-relaxed">
      {words.map((word, i) => {
        const isMatch = keywords.some(k => word.toLowerCase().includes(k.toLowerCase()));
        return (
          <span 
            key={i} 
            className={cn(
              "text-[17px] font-bold transition-all",
              isMatch ? "text-primary border-b-2 border-primary/40 -mb-[2px]" : "text-slate-700"
            )}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// --- Page Component ---

export default function VoiceIntake() {
  const [status, setStatus] = useState<"idle" | "recording" | "processing">("idle");
  const [barHeights, setBarHeights] = useState<number[]>(Array(24).fill(4));
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const animFrame = useRef<number | null>(null);

  const keywords = ["fever", "days", "two", "high", "patient", "symptoms"];

  useEffect(() => {
    if (status === "recording") {
      const update = () => {
        setBarHeights(Array.from({ length: 24 }, () => Math.random() * 32 + 4));
        
        // Progressively simulate transcription and confidence
        setTranscript(prev => {
          if (prev.length < 40) return "Well, I've had this fever for two days now and it feels quite high...";
          return prev;
        });
        setConfidence(c => Math.min(c + 0.3, 85));
        
        animFrame.current = requestAnimationFrame(update);
      };
      animFrame.current = requestAnimationFrame(update);
    } else {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
      setBarHeights(Array(24).fill(4));
    }
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
  }, [status]);

  const toggleRecording = () => {
    if (status === "idle") {
      setTranscript("");
      setConfidence(0);
      setStatus("recording");
    } else if (status === "recording") {
      setStatus("processing");
      setTimeout(() => setStatus("idle"), 2000); // Simulate processing
    }
  };

  return (
    <div className="h-screen bg-[#FAFCFF] flex flex-col font-inter overflow-hidden">
      
      {/* TOP BAR */}
      <header className="h-[64px] bg-white border-b border-sky-100 px-6 flex items-center justify-between z-10 shrink-0">
        <h1 className="text-lg font-black text-sky-900">Voice Intake</h1>
        <div className="px-3 py-1 bg-white border border-sky-200 rounded-full flex items-center gap-2 hover:bg-slate-50 cursor-pointer shadow-sm">
           <Languages className="w-3.5 h-3.5 text-primary" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">English</span>
        </div>
      </header>

      {/* CENTRAL AREA */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-6">
        
        {/* QUESTION CARD */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-[24px] border border-sky-100 shadow-xl shadow-sky-900/5 w-full max-w-sm mb-12"
        >
          <div className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg w-fit mb-3">
            Question 3 of 7
          </div>
          <h2 className="text-xl font-black text-sky-900 leading-tight">
            How long have you had this fever?
          </h2>
        </motion.div>

        {/* PULSING RECORD BUTTON */}
        <div className="relative flex items-center justify-center mb-12">
           <AnimatePresence>
             {status === "recording" && (
                <motion.div 
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-primary/30"
                />
             )}
           </AnimatePresence>
           
           <button 
             onClick={toggleRecording}
             className={cn(
               "w-[160px] h-[160px] rounded-full flex items-center justify-center z-10 p-2 transition-all duration-500",
               status === "recording" ? "bg-white border-2 border-primary shadow-2xl" : "bg-sky-50 border-2 border-sky-200"
             )}
           >
             {status === "processing" ? (
               <Loader2 className="w-10 h-10 text-primary animate-spin" />
             ) : (
               <Mic className={cn("w-10 h-10 transition-colors", status === "recording" ? "text-primary fill-primary/10" : "text-primary/60")} />
             )}
           </button>
        </div>

        {/* SEMICIRCLE BARS */}
        <div className="mb-6 h-10 flex flex-col items-center">
          <SemicircleBars isActive={status === "recording"} heights={barHeights} />
        </div>

        {/* STATUS LABEL */}
        <div className="h-8 mb-12">
          {status === "idle" && <p className="text-[17px] font-medium text-slate-500 animate-pulse">Tap to speak</p>}
          {status === "recording" && <p className="text-[17px] font-black text-primary uppercase tracking-[0.2em] animate-in fade-in zoom-in duration-300">Listening...</p>}
          {status === "processing" && <p className="text-[17px] font-medium text-slate-500 animate-in slide-in-from-bottom-2">Understanding your words...</p>}
        </div>

        {/* TRANSCRIPT CARD */}
        <AnimatePresence>
          {(status === "recording" || transcript) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-[24px] border border-sky-100 shadow-xl shadow-sky-900/5 w-full max-w-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-black text-slate-400 uppercase tracking-widest">What I heard:</span>
                {status === "recording" && (
                   <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                )}
              </div>
              
              <div className="min-h-[60px]">
                <HighlightText text={transcript} keywords={keywords} />
              </div>

              {/* Confidence Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-50">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${confidence}%` }}
                  className="h-full bg-primary transition-all duration-300"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER ACTIONS */}
      <footer className="px-6 py-8 flex flex-col gap-6 items-center bg-white border-t border-sky-50 shadow-[0_-8px_40px_rgba(0,0,0,0.02)]">
        <div className="flex w-full gap-4 max-w-[480px]">
          <button className="flex-1 py-4 font-black text-primary text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/5 rounded-2xl transition-all">
            <Keyboard className="w-4 h-4" /> Use Text instead
          </button>
          <button 
            disabled={confidence < 70}
            className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 disabled:opacity-40 disabled:grayscale transition-all flex items-center justify-center gap-2 group"
          >
            Confirm & Continue <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
           <Phone className="w-3.5 h-3.5 text-amber-600" />
           <span className="text-[11px] font-bold text-amber-700">Call <b className="text-amber-800">1800-XXX-XXXX</b> if voice isn't working.</span>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes pulse-border {
          0% { box-shadow: 0 0 0 0 rgba(8,145,178,0.4); }
          100% { box-shadow: 0 0 0 24px rgba(8,145,178,0); }
        }
        .animate-pulse-border {
          animation: pulse-border 1.5s infinite ease-out;
        }
      `}</style>
    </div>
  );
}
