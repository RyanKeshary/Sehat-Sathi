"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Camera, CameraOff, MonitorUp, MessageSquare, 
  Globe, PhoneOff, ShieldCheck, SignalHigh, AlertTriangle, User
} from "lucide-react";
import { cn } from "@/utils/cn";

export default function ActiveCall({ 
  onEndCall, 
  durationSeconds 
}: { 
  onEndCall: () => void,
  durationSeconds: number
}) {
  const [showControls, setShowControls] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [weakConnection, setWeakConnection] = useState(false);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 5000);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    handleMouseMove(); // Initial trigger
    
    // Simulate weak connection after 15s
    const weakConnTimer = setTimeout(() => setWeakConnection(true), 15000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
      clearTimeout(weakConnTimer);
    };
  }, []);

  const formatDuration = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="relative w-full h-screen bg-[#060F1E] overflow-hidden flex font-sans text-white">
      
      {/* Main Video Area */}
      <div className="flex-1 h-full relative cursor-default">
        {/* Remote Video Container */}
        <div className="absolute inset-4 rounded-3xl overflow-hidden bg-zinc-900 border border-[#00C896]/30 shadow-[0_0_30px_rgba(0,200,150,0.1)] transition-all duration-300">
           {/* Mock Doctor Video */}
           <div className="w-full h-full bg-gradient-to-br from-[#060F1E] to-[#0A2540] flex items-center justify-center relative">
               <User className="w-32 h-32 text-white/5" />
               <div className="absolute bottom-6 left-6 text-xl font-display font-bold text-white/80 drop-shadow-lg">
                 Dr. Priya Sharma
               </div>

               {/* Translation Subtitles */}
               {showAIPanel && (
                 <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl bg-black/60 backdrop-blur-md rounded-xl p-4 text-center">
                    <p className="text-[#00C896] text-sm font-semibold mb-1">Live Translation (Hindi)</p>
                    <p className="text-xl font-medium text-white/90">क्या आपने कल रात पेरासिटामोल ली थी?</p>
                    <p className="text-xs text-white/50 mt-1 italic">(Did you take paracetamol last night?)</p>
                 </div>
               )}
           </div>
        </div>

        {/* Top Status Bar UI */}
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 z-20 pointer-events-auto shadow-2xl"
            >
              <div className="font-mono font-bold text-lg min-w-[60px] text-center">
                {formatDuration(durationSeconds)}
              </div>
              <div className="w-px h-5 bg-white/20" />
              <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
                <SignalHigh className={cn("w-4 h-4", weakConnection ? "text-[#F59E0B]" : "text-[#00C896]")} />
                <span>{weakConnection ? "Fair" : "Excellent"}</span>
              </div>
              <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-white/40 ml-2">
                 <span>↓ {weakConnection ? "0.3" : "1.2"} Mbps</span>
                 <span>↑ {weakConnection ? "0.2" : "0.8"} Mbps</span>
              </div>
              <div className="w-px h-5 bg-white/20 hidden md:block" />
              <div className="hidden md:flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#00C896] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> E2EE
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weak Connection Alert */}
        <AnimatePresence>
          {weakConnection && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-[#F59E0B]/20 backdrop-blur-md border border-[#F59E0B]/50 text-[#F59E0B] px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl"
            >
               <AlertTriangle className="w-5 h-5" />
               <span className="text-sm font-semibold">Weak connection detected — switching to low-res mode</span>
               <button onClick={() => setWeakConnection(false)} className="text-xs bg-[#F59E0B] text-black px-3 py-1.5 rounded-full font-bold hover:bg-[#F59E0B]/80 transition">
                 Keep HQ Video
               </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Local Picture-in-Picture Video */}
        <motion.div 
          drag 
          dragConstraints={{ left: 20, right: window.innerWidth - 220, top: 20, bottom: window.innerHeight - 200 }}
          dragElastic={0.1}
          dragMomentum={false}
          className="absolute bottom-28 right-8 w-48 aspect-[3/4] bg-zinc-800 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-30 cursor-grab active:cursor-grabbing group"
        >
          {camOn ? (
            <div className="w-full h-full bg-gradient-to-tr from-zinc-700 to-zinc-800 flex justify-center items-center relative">
               <User className="w-12 h-12 text-white/20" />
               <div className="absolute inset-0 border-[3px] border-[#3B82F6] opacity-0 group-active:opacity-100 transition-opacity pointer-events-none rounded-xl" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
               <CameraOff className="w-8 h-8 text-white/50" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] backdrop-blur font-medium">You</div>
          {!micOn && (
            <div className="absolute top-2 right-2 bg-[#EF4444] p-1 rounded-full text-white">
               <MicOff className="w-3 h-3" />
            </div>
          )}
        </motion.div>

        {/* Control Tray */}
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-4 rounded-full flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
               <ControlButton 
                 icon={micOn ? <Mic /> : <MicOff />} 
                 isActive={micOn} 
                 onClick={() => setMicOn(!micOn)} 
                 dangerOff 
                 tooltip="Microphone (M)" 
               />
               <ControlButton 
                 icon={camOn ? <Camera /> : <CameraOff />} 
                 isActive={camOn} 
                 onClick={() => setCamOn(!camOn)} 
                 dangerOff 
                 tooltip="Camera (V)" 
               />
               <div className="w-px h-8 bg-white/10 mx-2" />
               <ControlButton icon={<MonitorUp />} isActive={false} onClick={() => {}} tooltip="Share Screen" />
               <ControlButton 
                 icon={<MessageSquare />} 
                 isActive={false} 
                 onClick={() => {}} 
                 tooltip="Chat" 
                 badge={2} 
               />
               <ControlButton 
                 icon={<Globe />} 
                 isActive={showAIPanel} 
                 onClick={() => setShowAIPanel(!showAIPanel)} 
                 tooltip="Live AI Translation & Notes" 
                 accent
               />
               <div className="w-px h-8 bg-white/10 mx-2" />
               <button 
                 onClick={onEndCall}
                 className="w-14 h-14 rounded-full bg-[#EF4444] text-white flex items-center justify-center hover:bg-[#EF4444]/80 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                 title="End Call"
               >
                 <PhoneOff className="w-6 h-6" />
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* In-Call AI Features Panel */}
      <AnimatePresence>
        {showAIPanel && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-[#0A2540] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.3)] shrink-0 flex flex-col z-50 overflow-hidden"
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#060F1E]">
               <h3 className="font-display font-bold text-lg flex items-center gap-2">
                 <Globe className="w-5 h-5 text-accent" />
                 AI Assistant Mode
               </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-8 pb-32 relative">
               
               {/* Smart Notes */}
               <section>
                 <h4 className="text-xs uppercase tracking-widest text-white/50 font-bold mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                   Live Clinical Notes
                 </h4>
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <div>
                      <span className="text-white/40 text-xs uppercase">Symptoms</span>
                      <p className="text-sm font-medium mt-1">High fever (102°F), onset 2 days ago. Accompanied by mild headache.</p>
                    </div>
                    <div>
                      <span className="text-white/40 text-xs uppercase flex justify-between">
                        <span>Prescribed</span>
                        <span className="text-accent">Auto-detected</span>
                      </span>
                      <div className="mt-2 bg-[#060F1E] rounded-lg p-2 flex items-center gap-3 border border-white/5">
                         <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex justify-center items-center">💊</div>
                         <div className="text-sm">
                           <div className="font-bold">Paracetamol 500mg</div>
                           <div className="text-white/60 text-xs">SOS for fever. Max 3/day.</div>
                         </div>
                      </div>
                    </div>
                 </div>
               </section>

               {/* Live Transcript */}
               <section>
                 <h4 className="text-xs uppercase tracking-widest text-white/50 font-bold mb-4">Transcript</h4>
                 <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-accent font-bold">Dr. Sharma</span>
                      <p className="text-sm text-white/80 bg-white/5 p-3 rounded-2xl rounded-tl-sm w-11/12 border border-white/5">
                        Please make sure you stay hydrated. Are you experiencing any body ache?
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[10px] text-white/40 font-bold">You (Translated from Hindi)</span>
                      <p className="text-sm text-white/90 bg-[#00C896]/20 border border-[#00C896]/30 p-3 rounded-2xl rounded-tr-sm w-11/12">
                        Yes, a little bit in my legs.
                      </p>
                    </div>
                 </div>
               </section>
            </div>
            
            {/* Disclaimer float */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/90 to-transparent pt-10">
               <p className="text-[10px] text-white/30 text-center italic">Notes are auto-generated. Review before saving to records.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ControlButton({ 
  icon, 
  isActive, 
  onClick, 
  dangerOff = false,
  tooltip,
  accent = false,
  badge
}: { 
  icon: React.ReactNode, 
  isActive: boolean, 
  onClick: () => void,
  dangerOff?: boolean,
  tooltip: string,
  accent?: boolean,
  badge?: number
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
          isActive 
            ? accent 
              ? "bg-[#3B82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              : "bg-white/10 text-white hover:bg-white/20" 
            : dangerOff 
              ? "bg-[#EF4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
              : "bg-white/5 text-white/50 hover:bg-white/10"
        )}
      >
        {icon}
        {badge && (
          <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#060F1E] -mr-1 -mt-1">
            {badge}
          </div>
        )}
      </button>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {tooltip}
      </div>
    </div>
  );
}
