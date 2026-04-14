"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, CameraOff, Mic, MicOff, Volume2, VolumeX, 
  Settings, CheckCircle2, XCircle, ChevronDown, ChevronUp, User
} from "lucide-react";
import { cn } from "@/utils/cn";

export default function WaitingRoom({ onJoin, sessionId }: { onJoin: () => void, sessionId: string }) {
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(80);
  
  const [checks, setChecks] = useState({
    cam: false,
    mic: false,
    speaker: false,
    net: false,
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes

  useEffect(() => {
    // Stagger checks animation
    const runChecks = async () => {
      await new Promise(r => setTimeout(r, 600)); setChecks(p => ({ ...p, cam: true }));
      await new Promise(r => setTimeout(r, 600)); setChecks(p => ({ ...p, mic: true }));
      await new Promise(r => setTimeout(r, 600)); setChecks(p => ({ ...p, speaker: true }));
      await new Promise(r => setTimeout(r, 600)); setChecks(p => ({ ...p, net: true }));
    };
    runChecks();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const allPassed = checks.cam && checks.mic && checks.speaker && checks.net;
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#060F1E] to-[#0A2540] flex items-center justify-center p-6 pb-20 pt-20 overflow-y-auto">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Column: Video Preview */}
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-video rounded-2xl bg-black overflow-hidden mb-6 group">
            {/* Animated Ring Border */}
            {camOn && (
              <div className="absolute inset-0 rounded-2xl border-2 border-[#00C896]/50 shadow-[0_0_20px_rgba(0,200,150,0.2)] animate-pulse pointer-events-none" />
            )}
            
            {/* Mock Video Feed */}
            {camOn ? (
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center relative">
                 <User className="w-24 h-24 text-white/10" />
                 <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                   You
                 </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900">
                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <CameraOff className="w-8 h-8 text-white/50" />
                </div>
                <span className="text-white/50 text-sm">Camera is off</span>
              </div>
            )}
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex gap-2">
               <button 
                onClick={() => setMicOn(!micOn)}
                className={cn("w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors", micOn ? "bg-black/50 text-white hover:bg-black/70" : "bg-[#EF4444] text-white")}
               >
                 {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
               </button>
               <button 
                onClick={() => setCamOn(!camOn)}
                className={cn("w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors", camOn ? "bg-black/50 text-white hover:bg-black/70" : "bg-[#EF4444] text-white")}
               >
                 {camOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
               </button>
            </div>
          </div>

          <div className="w-full bg-white/5 rounded-2xl p-5 border border-white/10">
            <h3 className="font-bold text-white/80 mb-4 text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Device Checklist
            </h3>
            <div className="space-y-3">
              <CheckItem label="Camera" status={checks.cam ? "pass" : "pending"} detail={camOn ? "Integrated Camera" : "Off"} />
              <CheckItem label="Microphone" status={checks.mic ? "pass" : "pending"} detail={micOn ? "Default Mic" : "Muted"} />
              <CheckItem label="Speaker" status={checks.speaker ? "pass" : "pending"} detail="Default Output" />
              <CheckItem label="Internet" status={checks.net ? "pass" : "pending"} detail="Good (12 Mbps)" />
            </div>
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-display font-bold mb-2">Ready to join?</h1>
          <p className="text-white/50 mb-8">Consultation ID: {sessionId}</p>

          {/* Doctor Info */}
          <div className="bg-[#0A2540] rounded-2xl p-6 border border-white/10 mb-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 border-2 border-white/20">
                <span className="font-bold text-xl">PS</span>
              </div>
              <div>
                 <h2 className="text-xl font-bold font-display">Dr. Priya Sharma</h2>
                 <p className="text-accent text-sm font-semibold">General Medicine</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3 relative z-10">
               <div className="w-2 h-2 rounded-full bg-accent mt-1.5 animate-pulse shrink-0" />
               <p className="text-white/70 text-sm leading-relaxed">
                 Dr. Priya Sharma will join in approximately <span className="text-white font-bold">{minutes}m {seconds}s</span>
               </p>
            </div>
          </div>

          <button
            disabled={!allPassed}
            onClick={onJoin}
            className={cn(
              "w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all",
              allPassed 
                ? "bg-accent text-[#060F1E] glow-green hover:scale-[1.02] active:scale-[0.98]" 
                : "bg-white/10 text-white/30 cursor-not-allowed"
            )}
          >
            {allPassed ? "Join Consultation" : "Checking Devices..."}
          </button>

          {/* Connection Settings Expandable */}
          <div className="mt-8">
             <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 text-white/40 text-xs hover:text-white/70 transition-colors mx-auto"
             >
                <Settings className="w-3.5 h-3.5" />
                Connection Settings
                {showSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
             </button>
             
             <AnimatePresence>
                {showSettings && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                     <div className="pt-4 text-center text-xs text-white/40 font-mono flex flex-wrap justify-center gap-2">
                        <span className="bg-white/5 py-1 px-2 rounded">Codec: VP9</span>
                        <span className="bg-white/5 py-1 px-2 rounded">Adaptive Bitrate</span>
                        <span className="bg-white/5 py-1 px-2 rounded">Res: 480p</span>
                        <span className="bg-white/5 py-1 px-2 rounded text-[#00C896]">TURN active</span>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

function CheckItem({ label, status, detail }: { label: string, status: "pending" | "pass" | "fail", detail: string }) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-3">
         {status === "pending" && <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />}
         {status === "pass" && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-4 h-4 text-[#00C896]" /></motion.div>}
         {status === "fail" && <XCircle className="w-4 h-4 text-[#EF4444]" />}
         <span className={cn("text-sm", status === "pending" ? "text-white/50" : "text-white/90")}>{label}</span>
       </div>
       <span className="text-xs text-white/40 font-mono">{detail}</span>
    </div>
  );
}
