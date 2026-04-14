"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageSquare, 
  PhoneCall, 
  PhoneOff, 
  X,
  AlertCircle,
  Clock,
  Check,
  ShieldCheck,
  ChevronRight,
  MoreVertical,
  Radio,
  User,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const Waveform = ({ active }: { active: boolean }) => {
  const [heights, setHeights] = useState<number[]>(Array(24).fill(4));
  
  useEffect(() => {
    if (!active) {
      setHeights(Array(24).fill(4));
      return;
    }
    const interval = setInterval(() => {
      setHeights(Array.from({ length: 24 }, () => Math.random() * 32 + 4));
    }, 100);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="flex items-end gap-1 h-10">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          animate={{ height: h }}
          className="w-1 bg-primary rounded-full transition-all duration-100"
        />
      ))}
    </div>
  );
};

const ControlButton = ({ icon: Icon, onClick, active = true, danger, amber, pulse }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative",
      danger 
        ? "bg-red-600 text-white shadow-[0_0_0_4px_rgba(220,38,38,0.3)] animate-pulse-red" 
        : amber 
          ? "bg-amber-100 text-amber-600 border border-amber-200"
          : active ? "bg-sky-50 text-primary border border-sky-100" : "bg-slate-100 text-slate-400 border border-slate-200",
      "hover:scale-110 active:scale-95"
    )}
  >
    <Icon className="w-5 h-5" />
    {pulse && (
       <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20 -z-10" />
    )}
  </button>
);

// --- Main Page Component ---

export default function Consultation() {
  const [mode, setMode] = useState<"video" | "voice">("video");
  const [hudVisible, setHudVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [time, setTime] = useState("12:34");

  const hudTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleActivity = () => {
      setHudVisible(true);
      if (hudTimer.current) clearTimeout(hudTimer.current);
      hudTimer.current = setTimeout(() => !drawerOpen && setHudVisible(false), 4000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    handleActivity();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [drawerOpen]);

  if (isEnded) {
    return (
      <div className="fixed inset-0 bg-white z-[200] flex items-center justify-center p-6 font-inter">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-8 border border-emerald-100 relative">
             <motion.svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0">
               <motion.circle 
                 cx="40" cy="40" r="38" 
                 stroke="#10B981" strokeWidth="4" 
                 fill="none" 
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 0.8 }}
               />
             </motion.svg>
             <Check className="w-10 h-10 text-emerald-600" />
          </div>
          
          <h2 className="text-2xl font-black text-sky-900 mb-2">Consultation Complete</h2>
          <p className="text-slate-600 font-medium mb-10 leading-relaxed">
            Your health session has been successfully recorded and synced with your <b className="text-primary">ABHA ID</b>.
          </p>
          
          <div className="w-full p-5 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <ShieldCheck className="w-6 h-6 text-primary" />
               <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Records Saved</p>
                  <p className="text-sm font-bold text-sky-900 leading-none">Sehat_Doc_2026_04.pdf</p>
               </div>
             </div>
             <ChevronRight className="w-4 h-4 text-primary" />
          </div>

          <button className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group transform transition-all hover:-translate-y-1">
            View Summary & Prescription <ChevronRight className="w-5 h-5 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#1a2332] overflow-hidden font-inter select-none">
      {/* Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.4)] pointer-events-none z-10" />

      {/* Main View Area (Simulated Video) */}
      <AnimatePresence mode="wait">
        {mode === "video" ? (
          <motion.div 
            key="video-feed"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
             {/* Simulated Doctor Video Call Background */}
             <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 opacity-30">
                  <div className="w-32 h-32 rounded-full border-4 border-slate-700 flex items-center justify-center">
                    <User className="w-16 h-16 text-slate-600" />
                  </div>
                  <p className="text-slate-500 font-black uppercase tracking-[0.3em]">Live Feed Active</p>
                </div>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="voice-feed"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-sky-50 flex flex-col items-center justify-center gap-10"
          >
             <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-sky-100">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <User className="w-10 h-10" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-sky-50" />
             </div>
             <div className="flex flex-col items-center gap-4">
                <Waveform active />
                <div className="px-4 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200">
                   Voice Mode — Connection Quality is Low
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draggable PiP */}
      <motion.div
        drag
        dragConstraints={{ left: 20, right: 340, top: 80, bottom: 580 }}
        className="absolute bottom-24 right-6 w-24 h-24 rounded-full border-2 border-white ring-1 ring-primary/20 bg-slate-900 z-30 shadow-2xl overflow-hidden cursor-move hidden md:flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-1.5 grayscale opacity-50">
           <VideoOff className="w-5 h-5 text-white" />
           <span className="text-[8px] font-bold text-white uppercase tracking-tighter">Self View</span>
        </div>
      </motion.div>

      {/* HUD HEADER */}
      <AnimatePresence>
        {hudVisible && !drawerOpen && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 inset-x-0 h-16 bg-white/85 backdrop-blur-xl border-b border-sky-100 px-6 flex items-center justify-between z-40 transition-opacity"
          >
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center rotate-45">
                   <Check className="w-5 h-5 text-white -rotate-45" />
                </div>
                <h4 className="text-[15px] font-black text-sky-900 uppercase tracking-widest">Consulting</h4>
             </div>
             <div className="text-primary font-black text-xl mono tracking-widest">{time}</div>
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HD Link</span>
             </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* EMERGENCY BUTTON */}
      <button 
        onClick={() => setShowEmergency(true)}
        className="absolute top-6 left-6 w-11 h-11 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-red-700 transition-colors"
      >
        <AlertCircle className="w-6 h-6" />
      </button>

      {/* CONTROL BAR */}
      <AnimatePresence>
        {hudVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 h-[72px] bg-white/90 backdrop-blur-xl border border-sky-100 rounded-[32px] shadow-[0_8px_32px_rgba(8,145,178,0.15)] z-40 flex items-center gap-4"
          >
             <ControlButton icon={isMuted ? MicOff : Mic} active={!isMuted} onClick={() => setIsMuted(!isMuted)} />
             <ControlButton icon={isCameraOff ? VideoOff : Video} active={!isCameraOff} onClick={() => setIsCameraOff(!isCameraOff)} />
             <ControlButton icon={MessageSquare} onClick={() => setDrawerOpen(true)} />
             <ControlButton icon={PhoneCall} amber onClick={() => setMode(mode === "video" ? "voice" : "video")} />
             <ControlButton icon={PhoneOff} danger onClick={() => setIsEnded(true)} pulse />
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTES DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              className="absolute top-0 right-0 w-[320px] h-full bg-white border-l border-sky-100 z-[110] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-sky-900 tracking-tight">Patient Notes</h3>
                <button onClick={() => setDrawerOpen(false)} className="p-2 text-slate-300 hover:text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-8 overflow-y-auto no-scrollbar">
                <div className="p-5 bg-sky-50 rounded-2xl border border-sky-100 border-l-[4px] border-l-primary/30">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Intake Summary</p>
                  <p className="text-[13px] font-bold text-slate-600 italic">"Moderate fever for 2 days, sharp headache, no existing allergies recorded."</p>
                </div>

                <div className="flex flex-col gap-3">
                   <div className="flex items-center justify-between">
                     <p className="text-[12px] font-black text-primary uppercase tracking-widest">Live Doctor Notes</p>
                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                   </div>
                   <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in duration-1000">
                      <p className="text-[15px] font-bold text-sky-900 leading-relaxed">
                        Suspected viral rhinitis. Prescribing paracetamol and hydration. Follow-up in 24h.
                      </p>
                   </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-50">
                 <div className="relative">
                   <input 
                    type="text" 
                    placeholder="Ask a question..."
                    className="w-full h-14 pl-5 pr-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary transition-all text-sm font-bold placeholder:text-slate-300"
                   />
                   <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                    <Check className="w-5 h-5" />
                   </button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* EMERGENCY MODAL */}
      <AnimatePresence>
        {showEmergency && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmergency(false)}
              className="absolute inset-0 bg-red-950/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-[400px] bg-white rounded-[32px] overflow-hidden shadow-2xl relative z-[110] p-8 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-sky-900 mb-2">Emergency Request?</h3>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                This will alert your clinical host and initiate an emergency patch-through to first responders.
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <button className="w-full h-14 bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-200">
                  Confirm Emergency SOS
                </button>
                <button 
                  onClick={() => setShowEmergency(false)}
                  className="w-full h-14 bg-slate-50 text-slate-400 font-bold rounded-2xl"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 4px rgba(220,38,38,0.3); }
          100% { box-shadow: 0 0 0 12px rgba(220,38,38,0); }
        }
        .animate-pulse-red {
          animation: pulse-red 2s infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mono { font-family: 'Roboto Mono', monospace; }
      `}</style>
    </div>
  );
}
