"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  MessageCircle, 
  Phone, 
  Check, 
  X, 
  ChevronRight, 
  AlertCircle,
  FileText,
  User,
  History,
  Globe,
  Settings,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const Toast = ({ message, visible, onHide }: { message: string, visible: boolean, onHide: () => void }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ y: -100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -100, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="fixed top-8 right-8 z-[2000] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30"
      >
        <CheckCircle2 size={20} />
        <span className="font-black text-sm uppercase tracking-widest">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

const ScriptShimmer = () => (
   <div className="space-y-4 py-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 bg-slate-100 rounded-full w-full relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer -translate-x-full" />
        </div>
      ))}
      <div className="h-4 bg-slate-100 rounded-full w-[60%] relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer -translate-x-full" />
      </div>
   </div>
);

// --- Page Component ---

export default function EscalationQueue() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tone, setTone] = useState("Gentle");
  const [isShimmering, setIsShimmering] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [patients, setPatients] = useState([
    { id: "1", n: "Ramesh Jain", t: "Medication", d: 9, doc: "Dr. Nair", lc: "12 Apr", s: "New", sev: "Critical" },
    { id: "2", n: "Priya Sharma", t: "Lab Test", d: 5, doc: "Dr. Nair", lc: "13 Apr", s: "Contacted", sev: "High" },
    { id: "3", n: "Sunil Verma", t: "Follow-Up", d: 2, doc: "City Clinic", lc: "Yesterday", s: "New", sev: "Medium" },
    { id: "4", n: "Anita Singh", t: "Medication", d: 11, doc: "Dr. Nair", lc: "10 Apr", s: "New", sev: "Critical" },
    { id: "5", n: "Rajesh Kumar", t: "Lab Test", d: 4, doc: "Diagnostic Lab", lc: "14 Apr", s: "Contacted", sev: "Medium" },
  ]);

  const selectedPatient = patients.find(p => p.id === selectedId);

  const handleToneChange = (t: string) => {
    setTone(t);
    setIsShimmering(true);
    setTimeout(() => setIsShimmering(false), 800);
  };

  const handleMarkContacted = () => {
    if (!selectedId) return;
    setPatients(prev => prev.map(p => p.id === selectedId ? { ...p, s: "Contacted" } : p));
    setSelectedId(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="h-screen bg-[#FAFCFF] font-inter flex flex-col overflow-hidden relative">
      
      {/* TOP HEADER */}
      <header className="h-[72px] bg-white border-b border-sky-100 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
           <h1 className="text-2xl font-black text-sky-900 leading-none">Escalation Queue</h1>
           <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col gap-1.5 w-[160px]">
              <div className="flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">
                 <span>9 / 26 Resolved</span>
                 <span>35%</span>
              </div>
              <div className="h-1 bg-emerald-100 rounded-full overflow-hidden">
                 <motion.div initial={{ width: 0 }} animate={{ width: "35%" }} className="h-full bg-emerald-500" />
              </div>
           </div>
        </div>
        <div className="flex items-center gap-4">
           {/* Severity Filters */}
           <div className="flex bg-slate-50 p-1 rounded-xl gap-1">
              <button className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-100">Critical</button>
              <button className="px-3 py-1.5 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg">High</button>
              <button className="px-3 py-1.5 text-teal-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Medium</button>
           </div>
           <div className="h-8 w-px bg-slate-100 mx-2" />
           {/* Type Pills */}
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20">All</button>
              <button className="px-4 py-2 bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100 rounded-xl hover:border-primary/30 hover:text-primary transition-all">Medication</button>
              <button className="px-4 py-2 bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100 rounded-xl hover:border-primary/30 hover:text-primary transition-all">Lab Test</button>
           </div>
        </div>
      </header>

      {/* MAIN TABLE SECTION */}
      <main className="flex-1 p-8 overflow-hidden flex flex-col">
         <div className="bg-white rounded-3xl border border-sky-100 flex-1 flex flex-col shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_1fr_1fr_100px] bg-sky-50 px-8 py-4 border-b border-sky-100">
               {["Patient", "Alert Type", "Days Overdue", "Doctor", "Last Contacted", "Status", ""].map((h, i) => (
                 <span key={i} className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</span>
               ))}
            </div>
            
            {/* Rows */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
               {patients.map((p, i) => (
                 <div 
                   key={p.id}
                   onClick={() => setSelectedId(p.id)}
                   className={cn(
                     "grid grid-cols-[1.5fr_1fr_1.5fr_1fr_1fr_1fr_100px] px-8 h-[64px] items-center border-b border-sky-50 transition-all cursor-pointer group",
                     i % 2 === 1 && "bg-sky-50/20",
                     selectedId === p.id ? "bg-primary/5 border-l-[4px] border-l-primary" : "hover:bg-slate-50/80"
                   )}
                 >
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">{p.n[0]}</div>
                       <span className="text-sm font-black text-sky-900">{p.n}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{p.t}</span>
                    <div className="flex items-center gap-3 pr-8">
                       <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              p.d > 7 ? "bg-red-500 w-[80%]" : p.d > 3 ? "bg-amber-500 w-[45%]" : "bg-teal-500 w-[20%]"
                            )} 
                          />
                       </div>
                       <span className={cn("text-xs font-black mono", p.d > 7 ? "text-red-500" : p.d > 3 ? "text-amber-500" : "text-teal-500")}>{p.d}d</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{p.doc}</span>
                    <span className="text-xs font-bold text-slate-400 italic">{p.lc}</span>
                    <div>
                       <span className={cn(
                         "px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border",
                         p.s === "New" ? "bg-primary/5 text-primary border-primary/20" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                       )}>
                          {p.s}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                       <Eye size={18} className="text-slate-300 hover:text-primary" />
                       <MessageCircle size={18} className="text-slate-300 hover:text-emerald-500" />
                       <Phone size={18} className="text-slate-300 hover:text-primary" />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </main>

      {/* DETAIL PANEL */}
      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedId(null)}
               className="fixed inset-0 bg-sky-950/20 backdrop-blur-[2px] z-[100]" 
            />
            <motion.div
               initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
               className="fixed right-0 top-0 bottom-0 w-[400px] bg-white border-l border-sky-100 shadow-2xl z-[101] flex flex-col overflow-hidden"
            >
               {/* Context Header */}
               <div className="p-8 border-b border-sky-50 bg-slate-50/30">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg">
                           {selectedPatient?.n[0]}
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-sky-900 leading-tight">{selectedPatient?.n}</h3>
                           <p className="text-sm font-bold text-slate-400">ABHA: 88-3301-4402-1119</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedId(null)} className="p-2 text-slate-300 hover:text-sky-900 transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  <div className="flex gap-2">
                     <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-100">Critical Priority</span>
                     <span className="px-2.5 py-1 bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">Hypertension</span>
                  </div>
               </div>

               {/* AI CALL SCRIPT */}
               <div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-[#FAFCFF] flex flex-col gap-8 pb-32">
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-black text-sky-900 uppercase tracking-widest flex items-center gap-2">
                           <FileText size={16} className="text-primary" /> AI-Generated Call Script
                        </h4>
                        <div className="flex bg-white p-1 rounded-xl border border-slate-100">
                           {["Gentle", "Firm", "Urgent"].map(t => (
                             <button
                               key={t}
                               onClick={() => handleToneChange(t)}
                               className={cn(
                                 "px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                                 tone === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-primary"
                               )}
                             >
                                {t}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm min-h-[160px]">
                        {isShimmering ? (
                          <ScriptShimmer />
                        ) : (
                          <div className="text-[15px] font-medium text-slate-700 leading-relaxed space-y-4">
                             <p>
                               Hello Mr. <span className="text-primary font-black cursor-pointer hover:underline">{selectedPatient?.n}</span>, this is a follow-up call from <span className="text-primary font-black cursor-pointer hover:underline">CityCare Clinic</span> regarding your <span className="text-primary font-black cursor-pointer hover:underline">Metformin</span> medication.
                             </p>
                             <p>
                               We noticed it's been over <span className="text-primary font-black cursor-pointer hover:underline">{selectedPatient?.d} days</span> since your last recorded dose. <span className="text-primary font-black cursor-pointer hover:underline">Dr. {selectedPatient?.doc}</span> was concerned about your glycemic progress. Is everything okay?
                             </p>
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Cultural Context */}
                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                     <div className="flex items-center gap-3 mb-2">
                        <Globe size={16} className="text-emerald-600" />
                        <span className="text-[10px] font-black uppercase text-emerald-800 tracking-widest">Cultural Context</span>
                     </div>
                     <p className="text-[13px] font-bold text-emerald-700 leading-relaxed">
                        Patient has strong preference for Hindi communication. Likely observing Navratri fasting which might impact medication timing.
                     </p>
                  </div>

                  {/* Past Contact Log */}
                  <div className="flex flex-col gap-4">
                     <h4 className="text-[11px] font-black text-sky-900 uppercase tracking-widest flex items-center gap-2">
                        <History size={16} className="text-slate-400" /> Recent Activity
                     </h4>
                     <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden text-[12px]">
                        <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center text-slate-400 font-black uppercase tracking-widest">
                           <span>12 Apr</span>
                           <span className="text-emerald-500">IVR Outcome: Busy</span>
                        </div>
                        <div className="px-4 py-2 flex justify-between items-center text-slate-400 font-black uppercase tracking-widest">
                           <span>10 Apr</span>
                           <span className="text-primary">WhatsApp Read ✓</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* BOTTOM ACTIONS */}
               <div className="absolute bottom-0 inset-x-0 p-8 bg-white/80 backdrop-blur-md border-t border-sky-50 flex flex-col gap-3">
                  <div className="flex gap-2">
                     <button className="flex-1 h-14 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                        <Phone size={20} /> Begin IVR Call
                     </button>
                     <button className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/10 active:scale-95 transition-all">
                        <MessageCircle size={24} />
                     </button>
                  </div>
                  <button 
                    onClick={handleMarkContacted}
                    className="w-full h-12 border-2 border-emerald-500/20 text-emerald-600 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all active:scale-[0.98]"
                  >
                     Mark Contacted ✓
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Toast message="Logged to audit ✓" visible={showToast} onHide={() => setShowToast(false)} />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .mono { font-family: 'Roboto Mono', monospace; }
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
      `}</style>
    </div>
  );
}
