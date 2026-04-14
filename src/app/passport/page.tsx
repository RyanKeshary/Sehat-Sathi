"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, 
  Download, 
  Copy, 
  Pill, 
  ChevronRight, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  X,
  ShieldCheck,
  Activity,
  Droplet,
  Clock,
  ExternalLink,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const RefillGauge = ({ daysLeft, totalDays }: { daysLeft: number; totalDays: number }) => {
  const percentage = (daysLeft / totalDays) * 100;
  const strokeDashoffset = 251 - (251 * percentage) / 100; // 2 * PI * r (r=40)
  
  // HSL Transition: Teal (190) to Amber (45)
  const hue = daysLeft < 7 
    ? 190 - (190 - 45) * Math.max(0, (7 - daysLeft) / 7)
    : 190;
  
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle 
          cx="24" cy="24" r="20" 
          fill="none" stroke="currentColor" strokeWidth="4" 
          className="text-slate-100" 
        />
        <motion.circle 
          cx="24" cy="24" r="20" 
          fill="none" strokeWidth="4" strokeLinecap="round"
          strokeDasharray="125.6" // Half circle approx for gauge look or 251 for full
          initial={{ strokeDashoffset: 125.6 }}
          animate={{ strokeDashoffset: 125.6 - (125.6 * percentage) / 100, stroke: `hsl(${hue}, 80%, 40%)` }}
          transition={{ duration: 2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
         <span className="text-[10px] font-black leading-none">{daysLeft}</span>
         <span className="text-[6px] font-black uppercase text-slate-400">Days</span>
      </div>
    </div>
  );
};

const PrescriptionCard = ({ med, status = "active" }: any) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={cn(
      "bg-white border-sky-100 rounded-2xl shadow-sm transition-all mb-4 overflow-hidden border",
      status === "active" ? "border-t-[4px] border-t-primary" : "opacity-60 grayscale"
    )}>
      <div className="p-5 flex items-start gap-4">
         <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
            <Pill size={20} />
         </div>
         <div className="flex-1">
            <h3 className="text-lg font-black text-sky-900 leading-none mb-1">{med.name}</h3>
            <p className="text-sm font-bold text-slate-500 mb-2">{med.dosage}</p>
            {status === "active" && (
               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-sky-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg w-fit">
                  <Clock size={12} /> Next: {med.next}
               </div>
            )}
         </div>
         {status === "active" && <RefillGauge daysLeft={med.daysLeft} totalDays={med.totalDays} />}
         {status === "past" && (
           <button onClick={() => setExpanded(!expanded)} className="p-2 text-slate-300">
             <ChevronDown className={cn("transition-transform", expanded && "rotate-180")} />
           </button>
         )}
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            className="overflow-hidden bg-slate-50 px-5"
          >
            <div className="pb-5 pt-2 border-t border-slate-200 grid grid-cols-2 gap-4">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-sm font-black text-sky-900">{med.duration}</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prescribed By</p>
                  <p className="text-sm font-black text-primary">{med.doc}</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Page Component ---

export default function HealthPassport() {
  const [activeTab, setActiveTab] = useState("Prescriptions");
  const [isQROpen, setIsQROpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-inter pb-24 relative overflow-hidden">
      
      {/* TOP BAR */}
      <header className="fixed top-0 inset-x-0 h-16 bg-white border-b border-sky-100 flex items-center px-6 z-[100] backdrop-blur-xl bg-white/80">
        <div className="flex-1" />
        <h1 className="text-lg font-black text-sky-900 tracking-tight">My Health Records</h1>
        <div className="flex-1 flex justify-end">
           <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 rounded-full border border-amber-200">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              2h ago
           </div>
        </div>
      </header>

      <main className="pt-20 px-4">
        
        {/* HEALTH IDENTITY CARD */}
        <section className="bg-white p-6 rounded-[24px] border border-sky-100 shadow-xl shadow-sky-900/5 mb-8 relative">
           <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-primary/5 rounded-[20px] flex items-center justify-center text-primary font-black text-2xl">
                 PS
              </div>
              <div className="px-3 py-1 bg-red-50 text-red-600 text-xs font-black rounded-lg border border-red-100 flex items-center gap-1">
                 <Droplet className="w-3.5 h-3.5" /> B+
              </div>
           </div>

           <h2 className="text-2xl font-black text-sky-900 leading-none mb-2">Mrs. Priya Sharma</h2>
           <p className="text-base font-bold text-slate-500 mb-4 tracking-tight">Age 45 · Female</p>
           
           <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 border border-slate-100 rounded-xl group active:scale-[0.98] transition-all">
              <span className="text-[#8A6D3B] font-black mono tracking-widest text-base">ABHA: 88-3301-4402-1119</span>
              <Copy className="w-4 h-4 text-slate-300 ml-auto cursor-pointer hover:text-primary" />
           </div>

           <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">Diabetes Type 2</span>
              <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">Hypertension</span>
           </div>

           <div className="flex gap-4">
              <button 
               onClick={() => setIsQROpen(true)}
               className="flex-1 h-14 border-2 border-primary/20 text-primary font-black rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                 <QrCode size={20} /> Share
              </button>
              <button className="h-14 px-6 text-slate-400 font-black flex items-center justify-center gap-2 hover:bg-slate-50 rounded-2xl transition-all">
                 <Download size={20} /> PDF
              </button>
           </div>
        </section>

        {/* TABS INDICATOR */}
        <div className="flex gap-1 bg-sky-50 p-1.5 rounded-2xl mb-8">
           {["Consultations", "Prescriptions", "Lab Reports"].map(tab => (
             <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all",
                activeTab === tab ? "bg-white text-primary shadow-sm" : "text-slate-400"
              )}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* PRESCRIPTIONS TAB CONTENT */}
        <div className="space-y-4">
           {activeTab === "Prescriptions" ? (
             <>
               <PrescriptionCard med={{ name: "Metformin 500mg", dosage: "1 Tablet, Post Lunch", next: "1:30 PM", daysLeft: 5, totalDays: 30 }} />
               <PrescriptionCard med={{ name: "Atorvastatin 10mg", dosage: "1 Tablet, Bedtime", next: "10:00 PM", daysLeft: 12, totalDays: 30 }} />
               
               <div className="pt-6">
                  <div className="flex items-center gap-3 mb-4 text-slate-300">
                     <div className="h-px bg-slate-100 flex-1" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Completed History</span>
                     <div className="h-px bg-slate-100 flex-1" />
                  </div>
                  <PrescriptionCard status="past" med={{ name: "Amoxicillin 250mg", dosage: "1 Cap, Twice Daily", duration: "7 Days", doc: "Dr. Meera Nair" }} />
               </div>
             </>
           ) : (
             <div className="space-y-4">
                {[
                  { n: "HbA1c", r: "7.8", f: "6.5-7.5", d: "14 Apr", t: "up" },
                  { n: "FBS", r: "135", f: "70-110", d: "14 Apr", t: "down" },
                  { n: "Creatinine", r: "1.2", f: "0.7-1.3", d: "12 Mar", t: "stable" },
                ].map(test => (
                  <div key={test.n} className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex items-center gap-6">
                     <div className="flex-1">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{test.n}</h4>
                        <div className="flex items-baseline gap-2">
                           <span className={cn("text-2xl font-black", test.t === "up" ? "text-red-500" : "text-sky-900")}>{test.r}</span>
                           <span className="text-xs font-bold text-slate-300">mg/dL</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">Ref: {test.f} · {test.d}</p>
                     </div>
                     <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        test.t === "up" ? "bg-red-50 text-red-500" : test.t === "down" ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-400"
                     )}>
                        {test.t === "up" ? <TrendingUp /> : test.t === "down" ? <TrendingDown /> : <Minus />}
                     </div>
                     <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-primary group active:bg-primary active:text-white cursor-pointer">
                        <Activity size={18} />
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>

      </main>

      <footer className="fixed bottom-0 inset-x-0 z-[100]">
         <div className="bg-emerald-50 py-3 px-6 border-t border-emerald-100 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <p className="text-[11px] font-bold text-emerald-700 leading-tight">
               This record belongs to you. Private, encrypted, and portable.
            </p>
         </div>
         <div className="h-16 bg-white border-t border-sky-50 px-8 flex items-center justify-around">
            <button className="text-primary flex flex-col items-center gap-1">
               <ShieldCheck size={20} />
               <span className="text-[9px] font-black uppercase tracking-wider">Passport</span>
            </button>
            <button className="text-slate-300 flex flex-col items-center gap-1">
               <Clock size={20} />
               <span className="text-[9px] font-black uppercase tracking-wider">Visits</span>
            </button>
            <button className="text-slate-300 flex flex-col items-center gap-1">
               <Activity size={20} />
               <span className="text-[9px] font-black uppercase tracking-wider">Vitals</span>
            </button>
         </div>
      </footer>

      {/* QR OVERLAY */}
      <AnimatePresence>
        {isQROpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="w-full max-w-[400px] bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden relative"
             >
                <button 
                  onClick={() => setIsQROpen(false)}
                  className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-sky-900 transition-colors"
                >
                   <X size={20} />
                </button>
                
                <div className="text-center mb-10">
                   <h3 className="text-2xl font-black text-sky-900 mb-2">Share Record</h3>
                   <p className="text-sm font-bold text-slate-500">Scan to grant temporary access</p>
                </div>

                <div className="aspect-square w-full bg-slate-50 border-2 border-slate-100 rounded-3xl mb-10 p-10 flex items-center justify-center relative">
                   <QrCode className="w-full h-full text-sky-900 opacity-20" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center border border-slate-50 scale-150">
                         <QrCode size={32} className="text-primary" />
                      </div>
                   </div>
                   {/* Scanning animation border */}
                   <div className="absolute inset-8 border border-primary/20 rounded-2xl pointer-events-none" />
                </div>

                <div className="flex flex-col items-center gap-6">
                   <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link Expires In</span>
                      <span className="text-xl font-black text-primary mono tracking-tighter">23:47:12</span>
                   </div>
                   <button className="w-full h-14 bg-sky-50 text-sky-900 font-black rounded-2xl flex items-center justify-center gap-3">
                      <ExternalLink size={18} /> Copy Shareable Link
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .mono { font-family: 'Roboto Mono', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
