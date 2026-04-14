"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  WifiOff, 
  Search, 
  Home, 
  Headset, 
  RefreshCcw, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Menu,
  ChevronRight,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const GlobalNav = () => (
  <nav className="h-20 w-full bg-white border-b border-sky-100 flex items-center justify-between px-10 fixed top-0 z-[100]">
     <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">SS</div>
        <div className="hidden md:block">
           <h3 className="text-lg font-black text-sky-900 leading-none">Sehat Sathi</h3>
           <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-40">Digital Health Network</span>
        </div>
     </div>
     <div className="flex items-center gap-8">
        <div className="flex items-center gap-6">
           {["Clinics", "Network", "About"].map(item => (
             <span key={item} className="text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-primary transition-all">{item}</span>
           ))}
        </div>
        <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center text-primary/40"><Menu size={20} /></div>
     </div>
  </nav>
);

const OfflineIllustration = () => (
  <motion.div 
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="relative w-24 h-24 mb-6"
  >
     <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-primary border-2 border-sky-100 relative z-10">
           <WifiOff size={24} />
        </div>
        {[20, 36, 52].map((r, i) => (
          <motion.div
            key={r}
            initial={{ opacity: 0.8, scale: 0.8 }}
            animate={{ opacity: [0.8, 0.1, 0.8], scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            className={cn(
               "absolute rounded-full border border-sky-200",
               i === 2 && "border-amber-400/50"
            )}
            style={{ width: r * 2, height: r * 2 }}
          />
        ))}
     </div>
  </motion.div>
);

const NotFoundIllustration = () => (
  <motion.div 
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="relative w-24 h-24 mb-6 flex items-center justify-center"
  >
     <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center text-primary border-2 border-sky-100 relative">
        <Stethoscope size={32} />
        <motion.div 
          animate={{ rotate: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-8 h-8 bg-white border border-sky-100 rounded-lg shadow-md flex items-center justify-center text-primary font-black text-xl"
        >
          ?
        </motion.div>
     </div>
  </motion.div>
);

// --- Page Component ---

export default function ErrorPageDemo() {
  const [state, setState] = useState<"offline" | "404">("offline");

  return (
    <div className="min-h-screen bg-[#FAFCFF] flex flex-col items-center justify-center font-inter pt-24 pb-12">
      
      <GlobalNav />

      {/* STATE TOGGLE */}
      <div className="fixed bottom-10 flex gap-1 p-1.5 bg-sky-900 rounded-[20px] shadow-2xl z-50">
         <button 
           onClick={() => setState("offline")}
           className={cn("px-6 py-2 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all", state === "offline" ? "bg-white text-sky-900" : "text-white/40 hover:text-white")}
         >
           Offline Mode
         </button>
         <button 
           onClick={() => setState("404")}
           className={cn("px-6 py-2 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all", state === "404" ? "bg-white text-sky-900" : "text-white/40 hover:text-white")}
         >
           404 Not Found
         </button>
      </div>

      <AnimatePresence mode="wait">
         <motion.div 
           key={state}
           initial={{ opacity: 0, scale: 0.95, y: 10 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: -10 }}
           transition={{ duration: 0.3 }}
           className="w-full max-w-[560px] px-6"
         >
            <div className="bg-white p-10 md:p-14 rounded-[40px] border border-sky-100 shadow-[0_40px_100px_rgba(8,145,178,0.12)] flex flex-col items-center text-center">
               
               {state === "offline" ? (
                 <>
                    <OfflineIllustration />
                    <h2 className="text-2xl font-black text-sky-900 tracking-tight mb-4">You&apos;re offline — but Sehat Sathi is still with you.</h2>
                    <p className="text-sm font-bold text-slate-500 mb-10 leading-relaxed max-w-[340px]">We lost connection to our medical cloud, but your local clinical tools remain active.</p>
                    
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                       <div className="bg-emerald-50 rounded-[20px] border border-emerald-100 p-5 text-left">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-4">What&apos;s Available</span>
                          <ul className="space-y-3">
                             {["Health Records", "Medication List", "Today's Schedule"].map(item => (
                               <li key={item} className="flex items-center gap-2 text-[11px] font-black text-emerald-700">
                                  <CheckCircle2 size={14} className="opacity-50" /> {item}
                               </li>
                             ))}
                          </ul>
                       </div>
                       <div className="bg-amber-50 rounded-[20px] border border-amber-100 p-5 text-left">
                          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-4">Re-sync Needed</span>
                          <ul className="space-y-3">
                             {["Video Consultations", "New Record Sync"].map(item => (
                               <li key={item} className="flex items-center gap-2 text-[11px] font-black text-amber-700">
                                  <XCircle size={14} className="opacity-50" /> {item}
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>

                    <button className="w-full h-14 bg-primary text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mb-4">
                       View My Health Records <ChevronRight size={18} />
                    </button>
                    
                    <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline mb-8">
                       <RefreshCcw size={14} /> Retry Connection
                    </button>

                    <div className="flex items-center gap-3">
                       <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Checking for connection...</span>
                    </div>
                 </>
               ) : (
                 <>
                    <NotFoundIllustration />
                    <h2 className="text-2xl font-black text-sky-900 tracking-tight mb-4">This page doesn&apos;t exist — but your health records do.</h2>
                    <p className="text-sm font-bold text-slate-500 mb-10 leading-relaxed max-w-[340px]">We couldn&apos;t find the specific medical module you were looking for. Let&apos;s get you back to the network.</p>
                    
                    <div className="w-full space-y-4 mb-4">
                       <button className="w-full h-14 bg-primary text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                          <Home size={18} /> Return to Home
                       </button>
                       <button className="w-full h-14 bg-white border-2 border-slate-100 text-slate-400 font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:text-sky-900 hover:border-sky-100 transition-all">
                          <Headset size={18} /> Contact Health Support
                       </button>
                    </div>

                    <p className="text-[11px] font-black text-primary uppercase tracking-widest mt-6">Need help? Call 1800-888-9999</p>
                 </>
               )}

            </div>
            
            {/* SHARED FOOTER */}
            <div className="mt-12 flex flex-col items-center gap-2 opacity-30">
               <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic">SS</div>
               <p className="text-[11px] font-black uppercase tracking-widest text-slate-900">Your health, our responsibility.</p>
            </div>
         </motion.div>
      </AnimatePresence>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

    </div>
  );
}
