"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  User, 
  Activity, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  History, 
  AlertCircle, 
  ChevronDown, 
  Globe, 
  Layers,
  Search,
  Check,
  X,
  Languages,
  Clock,
  MessageCircle,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const PerformanceStrip = () => (
  <div className="bg-sky-50 border-l-[6px] border-primary p-6 rounded-[28px] mb-8 flex items-center justify-between shadow-sm">
     <div className="flex gap-12">
        <div>
           <div className="flex justify-between items-center text-[10px] font-black text-primary uppercase tracking-widest mb-2">
              <span>Cases Resolved Today</span>
              <span>14 / 20</span>
           </div>
           <div className="w-[180px] h-2 bg-primary/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} className="h-full bg-primary" />
           </div>
        </div>
        <div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Handle Time</p>
           <h4 className="text-xl font-black text-sky-900 mono">4:32</h4>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-3 py-1.5 bg-white border border-sky-100 text-[10px] font-black text-primary uppercase tracking-widest rounded-xl">Coverage: 3 Clinics</div>
        </div>
     </div>
     <div className="flex items-center gap-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">My Cases Only</span>
        <button className="w-12 h-6 bg-slate-200 rounded-full relative"><div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" /></button>
     </div>
  </div>
);

const ScriptShimmer = () => (
  <div className="space-y-4 py-2 opacity-20">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-3.5 bg-slate-300 rounded-full w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer -translate-x-full" />
      </div>
    ))}
  </div>
);

// --- Page Component ---

export default function SharedOpsDesk() {
  const [selectedClinic, setSelectedClinic] = useState("All");
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tone, setTone] = useState("Gentle");
  const [isShimmering, setIsShimmering] = useState(false);
  const [outcome, setOutcome] = useState<string | null>(null);

  const [cases, setCases] = useState([
    { id: "1", clinic: "CityCare", patient: "Ramesh Jain", alert: "Med Refill", sev: "Critical", d: 9, agent: null },
    { id: "2", clinic: "CarePlus", patient: "Priya Sharma", alert: "Lab Overdue", sev: "High", d: 5, agent: "Anjali M." },
    { id: "3", clinic: "MediLink", patient: "Sunil Verma", alert: "Follow-Up", sev: "Medium", d: 2, agent: null },
    { id: "4", clinic: "CityCare", patient: "Anita Singh", alert: "BP Alarm", sev: "Critical", d: 11, agent: null },
    { id: "5", clinic: "CarePlus", patient: "Rajesh K.", alert: "Med Refill", sev: "Medium", d: 4, agent: "Anjali M." },
  ]);

  const handleClaim = (id: string) => {
    setClaimingId(id);
    setTimeout(() => {
      setClaimedIds([...claimedIds, id]);
      setCases(prev => prev.map(c => c.id === id ? { ...c, agent: "Ryan (Me)" } : c));
      setClaimingId(null);
      setSelectedId(id);
    }, 600);
  };

  const handleToneChange = (t: string) => {
    setTone(t);
    setIsShimmering(true);
    setTimeout(() => setIsShimmering(false), 800);
  };

  const selectedCase = cases.find(c => c.id === (selectedId || claimingId));

  return (
    <div className="h-screen bg-white font-inter flex overflow-hidden">
      
      {/* COLUMN 1: CLINIC SIDEBAR */}
      <aside className="w-[220px] border-r border-sky-100 flex flex-col shrink-0">
         <div className="p-6 border-b border-sky-50">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Partner Clinics</h2>
            <button className="w-full flex justify-between items-center p-3 bg-sky-50 rounded-xl border border-sky-100 mb-6">
               <span className="text-[11px] font-black text-sky-900 uppercase">All Clinics</span>
               <span className="px-2 py-0.5 bg-sky-900 text-white text-[9px] font-black rounded-full">12</span>
            </button>
         </div>
         <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
            {[
              { n: "CityCare", c: "Nashik, MH", b: 7 },
              { n: "CarePlus", c: "Pune, MH", b: 3 },
              { n: "MediLink", c: "Satara, MH", b: 2 },
            ].map(clinic => (
              <button 
                key={clinic.n}
                onClick={() => setSelectedClinic(clinic.n)}
                className={cn(
                  "w-full p-4 rounded-xl border border-sky-50 text-left transition-all relative overflow-hidden group",
                  selectedClinic === clinic.n ? "bg-sky-50 border-l-[4px] border-l-primary" : "hover:bg-slate-50"
                )}
              >
                 <h3 className="text-sm font-black text-sky-900 mb-1">{clinic.n} Clinic</h3>
                 <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">{clinic.c}</span>
                    <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[9px] font-black rounded-md border border-red-100">{clinic.b}</span>
                 </div>
              </button>
            ))}
         </div>
      </aside>

      {/* COLUMN 2: MAIN TABLE */}
      <main className="flex-1 p-10 overflow-hidden flex flex-col bg-[#FAFCFF]">
         <PerformanceStrip />
         
         <div className="bg-white rounded-[32px] border border-sky-100 shadow-xl shadow-sky-900/5 overflow-hidden flex flex-col flex-1">
            <div className="grid grid-cols-[120px_1.5fr_1.2fr_100px_1.2fr_1fr] px-8 py-5 bg-sky-50 border-b border-sky-100">
               {["Clinic", "Patient", "Alert", "Severity", "Overdue", "Agent"].map((h, i) => (
                 <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</span>
               ))}
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar">
               {cases.map((c, i) => {
                 const isClaiming = claimingId === c.id;
                 const isClaimed = claimedIds.includes(c.id);
                 return (
                   <div 
                     key={c.id}
                     onClick={() => isClaimed && setSelectedId(c.id)}
                     className={cn(
                       "grid grid-cols-[120px_1.5fr_1.2fr_100px_1.2fr_1fr] px-8 h-[64px] items-center border-b border-sky-50 transition-all cursor-pointer relative group",
                       !c.agent && !isClaiming ? "bg-amber-50/50" : "hover:bg-slate-50",
                       selectedId === c.id && "ring-2 ring-primary/20 z-10"
                     )}
                   >
                      {/* Claim Sweep Overlay */}
                      <AnimatePresence>
                        {isClaiming && (
                          <motion.div 
                            initial={{ clipPath: "inset(0 100% 0 0)" }}
                            animate={{ clipPath: "inset(0 0% 0 0)" }}
                            className="absolute inset-0 bg-sky-50 z-0 pointer-events-none transition-all duration-500"
                          />
                        )}
                      </AnimatePresence>

                      <div className="relative z-10">
                         <span className={cn(
                           "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest",
                           c.clinic === "CityCare" ? "bg-primary/10 text-primary" : "bg-sky-900/10 text-sky-900"
                         )}>{c.clinic}</span>
                      </div>
                      <div className="flex items-center gap-3 relative z-10">
                         <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">{c.patient[0]}</div>
                         <span className="text-sm font-black text-sky-900">{c.patient}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500 relative z-10">{c.alert}</span>
                      <div className="flex items-center gap-2 relative z-10">
                         {c.sev === "Critical" && <div className="w-2 h-2 bg-red-500 rounded-full animate-red-pulse" />}
                         <span className={cn("text-[10px] font-black uppercase tracking-widest", c.sev === "Critical" ? "text-red-500" : "text-sky-900")}>{c.sev}</span>
                      </div>
                      <div className="flex items-center gap-3 relative z-10 pr-8">
                         <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className={cn("h-full", c.d > 7 ? "bg-red-500 w-[80%]" : "bg-primary w-[30%]")} />
                         </div>
                         <span className="text-xs font-black mono text-slate-400">{c.d}d</span>
                      </div>
                      <div className="relative z-10">
                         {c.agent ? (
                           <motion.div 
                             initial={{ scale: 0, opacity: 0 }} 
                             animate={{ scale: 1, opacity: 1 }}
                             transition={{ type: "spring", damping: 12, stiffness: 200 }}
                             className="flex items-center gap-2"
                           >
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black">{c.agent[0]}</div>
                              <span className="text-[10px] font-black text-primary uppercase truncate w-14">{c.agent}</span>
                           </motion.div>
                         ) : !isClaiming ? (
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleClaim(c.id); }}
                             className="px-4 py-2 bg-white border-2 border-amber-400 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 hover:text-white transition-all shadow-sm active:scale-95"
                           >
                              Take This ◉
                           </button>
                         ) : (
                           <span className="text-[10px] font-black text-slate-300 uppercase animate-pulse">Assigning...</span>
                         )}
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </main>

      {/* COLUMN 3: DETAIL PANEL */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}
            className="w-[320px] bg-white border-l border-sky-100 shrink-0 flex flex-col z-50 shadow-2xl overflow-hidden"
          >
             <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 flex flex-col pb-32">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl">{selectedCase?.patient[0]}</div>
                      <div>
                         <h3 className="text-lg font-black text-sky-900 leading-tight">{selectedCase?.patient}</h3>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Hindi</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Type 2 Diabetes</span>
                         </div>
                      </div>
                   </div>
                   <button onClick={() => setSelectedId(null)} className="text-slate-300 hover:text-sky-900 transition-colors"><X size={20} /></button>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                   <AlertCircle size={18} className="text-amber-500" />
                   <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">9 Days Overdue Medication Refill</span>
                </div>

                {/* AI SCRIPT */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-sky-900 uppercase tracking-widest flex items-center gap-2"><FileText size={14} className="text-primary" /> Call Script</span>
                      <div className="flex bg-slate-50 p-0.5 rounded-lg border border-slate-100">
                         {["Gentle", "Firm", "Urgent"].map(t => (
                           <button 
                             key={t}
                             onClick={() => handleToneChange(t)}
                             className={cn(
                               "px-2.5 py-1 text-[8px] font-black uppercase rounded-md transition-all",
                               tone === t ? "bg-primary text-white" : "text-slate-400"
                             )}
                           >{t}</button>
                         ))}
                      </div>
                   </div>
                   <div className="bg-white border-t-4 border-t-primary border border-sky-100 rounded-2xl p-6 shadow-sm min-h-[140px] relative overflow-hidden">
                      {isShimmering ? (
                        <ScriptShimmer />
                      ) : (
                        <p className="text-[15px] font-medium text-slate-700 leading-relaxed">
                           "Hello Mr. <span className="text-primary font-black underline cursor-pointer">{selectedCase?.patient}</span>, I am calling from <span className="text-primary font-black underline cursor-pointer">{selectedCase?.clinic} Clinic</span> to follow up on your <span className="text-primary font-black underline cursor-pointer">Metformin</span> supply."
                        </p>
                      )}
                      {isShimmering && <div className="absolute inset-0 bg-white/40 z-10" />}
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                   </div>
                </div>

                {/* Checklist */}
                <div className="space-y-3">
                   {["Verify identity", "Check pill count", "Confirm next visit", "Sync ABHA Consent"].map(item => (
                     <div key={item} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-50 hover:border-sky-100 transition-all cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border-2 border-slate-200 flex items-center justify-center group-hover:border-primary transition-all shadow-sm">
                           {item === "Verify identity" && <Check size={12} className="text-primary" />}
                        </div>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{item}</span>
                     </div>
                   ))}
                </div>
             </div>

             {/* BOTTOM ACTIONS */}
             <div className="absolute bottom-0 inset-x-0 p-6 bg-white border-t border-sky-50 shadow-reverse flex flex-col gap-4 z-20">
                <button className="w-full h-14 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                   <Phone size={20} /> Begin IVR Connection
                </button>
                
                {/* Outcomes */}
                <div className="grid grid-cols-4 gap-2">
                   {[
                     { l: "Attend", c: "bg-emerald-500", st: "Will Attend" },
                     { l: "No Ans", c: "bg-amber-500", st: "No Answer" },
                     { l: "Declined", c: "bg-slate-400", st: "Declined" },
                     { l: "SOS", c: "bg-red-500", st: "Emergency" }
                   ].map(chip => (
                     <button 
                       key={chip.l}
                       onClick={() => setOutcome(chip.st)}
                       className={cn(
                         "h-10 rounded-xl text-[9px] font-black uppercase text-white transition-all flex flex-col items-center justify-center leading-none",
                         outcome === chip.st ? "ring-4 ring-offset-2 ring-slate-100" : "opacity-80 hover:opacity-100",
                         chip.c
                       )}
                     >
                        <span>{chip.l}</span>
                     </button>
                   ))}
                </div>

                {outcome && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                     <textarea className="w-full h-20 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs outline-none focus:border-primary/20" placeholder="Post-call clinical notes..." />
                     <button className="w-full h-10 bg-sky-900 text-white font-black text-[10px] uppercase rounded-xl tracking-widest shadow-lg shadow-sky-900/10">Log Formal Outcome</button>
                  </motion.div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .mono { font-family: 'Roboto Mono', monospace; }
        @keyframes red-pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .animate-red-pulse { animation: red-pulse 1.5s infinite; }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
          width: 200%;
          height: 1000%;
          top: -500%;
          left: -50%;
        }
        .shadow-reverse {
          box-shadow: 0 -4px 12px rgba(0,0,0,0.03);
        }
      `}</style>
    </div>
  );
}
