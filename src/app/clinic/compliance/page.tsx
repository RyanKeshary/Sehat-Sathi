"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Check,
  Lock, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  AlertOctagon, 
  FileCheck, 
  Clock, 
  User, 
  FileText,
  Copy,
  Hash,
  X,
  Calendar,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const ArcGauge = ({ percentage, color = "#0891B2" }: { percentage: number; color?: string }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * percentage) / 100;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="8" />
        <motion.circle 
          cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
         <span className="text-xl font-black text-sky-900 leading-none">{percentage}%</span>
      </div>
    </div>
  );
};

const AuditRow = ({ log, i }: { log: any; i: number }) => {
  const [hovered, setHovered] = useState(false);
  const borders: Record<string, string> = {
    consultation: "border-l-teal-500",
    records: "border-l-emerald-500",
    reminders: "border-l-amber-500",
    escalations: "border-l-orange-500",
    breach: "border-l-red-500",
  };

  return (
     <div 
       onMouseEnter={() => setHovered(true)}
       onMouseLeave={() => setHovered(false)}
       className={cn(
         "grid grid-cols-[1.2fr_1fr_1.2fr_1fr_2fr_1fr_80px] px-8 h-[52px] items-center border-b border-sky-50 transition-all border-l-4",
         borders[log.type] || "border-l-transparent",
         i % 2 === 1 && "bg-sky-50/20",
         hovered && "bg-sky-50/50"
       )}
     >
        <span className="text-[13px] font-black text-primary mono">{log.time}</span>
        <div>
           <span className="px-2 py-0.5 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">{log.type}</span>
        </div>
        <div className="relative group">
           <span className="text-xs font-black text-[#8A6D3B] mono tracking-tight">{log.abha}</span>
           <Copy size={12} className="absolute -right-5 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 cursor-pointer" />
        </div>
        <span className="text-xs font-bold text-slate-500">{log.actor}</span>
        <p className="text-xs font-medium text-slate-600 truncate pr-4">{log.desc}</p>
        <div className="flex items-center gap-1.5 overflow-hidden">
           <Hash size={12} className="text-slate-300 flex-shrink-0" />
           <span className="text-[10px] text-slate-400 mono truncate">{log.hash}</span>
        </div>
        <div className="flex justify-end pr-4 cursor-help relative group">
           <Lock size={16} className="text-teal-500" />
           <motion.div 
             initial={{ scale: 0.8, opacity: 0, y: 10 }}
             whileHover={{ scale: 1, opacity: 1, y: -40 }}
             className="absolute right-0 bg-sky-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest pointer-events-none z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all border border-sky-700 shadow-xl"
           >
              Cryptographically sealed • {log.time}
           </motion.div>
        </div>
     </div>
  );
};

// --- Page Component ---

export default function ComplianceAudit() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showBreach, setShowBreach] = useState(false); // Controlled breach for demo
  const [seconds, setSeconds] = useState(258482); // ~71h

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const startExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    const step = setInterval(() => {
      setExportProgress(p => {
        if (p >= 100) { clearInterval(step); return 100; }
        return p + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#FDFEFE] font-inter overflow-hidden flex flex-col relative">
      
      {/* BREACH BANNER */}
      <AnimatePresence>
        {showBreach && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 56, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-amber-50 border-b border-amber-100 flex items-center px-8 justify-between relative z-[1001]"
          >
             <div className="flex items-center gap-3">
                <AlertOctagon size={18} className="text-amber-500 animate-pulse" />
                <p className="text-sm font-black text-amber-700 uppercase tracking-widest">
                   DPDPA Breach Notification Required — <span className="mono font-black">{formatTime(seconds)}</span> remaining
                </p>
             </div>
             <div className="flex gap-4">
                <button className="text-xs font-black text-amber-500 uppercase tracking-widest hover:underline" onClick={() => setShowBreach(false)}>Dismiss Demo</button>
                <button className="h-9 px-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-red-900/10">File Report</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="h-[72px] bg-white border-b border-sky-100 px-8 flex items-center justify-between shrink-0">
         <h1 className="text-2xl font-black text-sky-900 leading-none">Audit Trail & Compliance</h1>
         <div className="flex gap-4">
            <button 
              onClick={() => setShowBreach(!showBreach)}
              className="text-[10px] font-black text-slate-300 uppercase underline"
            >
               Toggle Breach State (Mock)
            </button>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 flex items-center gap-2">
               <ShieldCheck size={14} /> DPDPA Security Level: High
            </div>
         </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-10 flex flex-col gap-10">
         
         {/* COMPLIANCE DASHBOARD ROW */}
         <section className="grid grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm flex items-center gap-6">
               <ArcGauge percentage={96} />
               <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Consent Rate</p>
                  <h3 className="text-2xl font-black text-sky-900">DPDPA Compliance</h3>
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
               <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6 font-black text-lg">98%</div>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Record Lock SLA</p>
               <h3 className="text-2xl font-black text-sky-900">Locked On Time</h3>
            </div>
            <div className={cn(
              "p-6 rounded-3xl border transition-all duration-500 relative",
              showBreach ? "bg-white border-red-500 ring-2 ring-red-500/20 card-pulse" : "bg-white border-sky-100"
            )}>
               <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-6", showBreach ? "bg-red-500 text-white" : "bg-emerald-500 text-white")}>
                  {showBreach ? <AlertOctagon size={20} /> : <Check size={20} />}
               </div>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Breach Alerts</p>
               <h3 className={cn("text-3xl font-black", showBreach ? "text-red-600" : "text-emerald-600")}>
                  {showBreach ? "1" : "0"} Pending
               </h3>
               {showBreach && (
                  <div className="mt-4 py-1.5 px-3 bg-red-50 border border-red-100 rounded-lg text-[9px] font-black text-red-600 uppercase tracking-[0.1em] text-center">
                     Critical Notification Window Active
                  </div>
               )}
            </div>
            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
               <div className="flex justify-between items-start mb-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-primary">
                    <RefreshCw size={20} />
                  </motion.div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Syncing</span>
               </div>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">ABDM Sync Status</p>
               <h3 className="text-lg font-black text-sky-900">Last sync: 2 min ago</h3>
            </div>
         </section>

         {/* SEARCH & FILTER BAR */}
         <section className="bg-white p-4 rounded-3xl border border-sky-100 shadow-sm flex items-center gap-6">
            <div className="flex-1 h-12 bg-sky-50 rounded-2xl flex items-center px-6 gap-3 group border border-transparent focus-within:border-primary/20 transition-all">
               <Search size={18} className="text-slate-300 pointer-events-none group-focus-within:text-primary" />
               <input className="bg-transparent border-0 outline-none text-sm font-bold text-sky-900 placeholder:text-slate-300 w-full" placeholder="Search events, patient IDs, actors..." />
            </div>
            <div className="flex gap-3">
               <button className="h-12 px-6 bg-white border border-slate-100 text-slate-400 font-black rounded-xl text-xs flex items-center gap-2 hover:bg-slate-50 uppercase tracking-widest"><Calendar size={16} /> Date Range</button>
               <button className="h-12 px-6 bg-white border border-slate-100 text-slate-400 font-black rounded-xl text-xs flex items-center gap-2 hover:bg-slate-50 uppercase tracking-widest">Type <ChevronDown size={14} /></button>
               <button onClick={startExport} className="h-12 px-6 bg-primary text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all uppercase tracking-widest"><Download size={16} /> Export CSV</button>
            </div>
         </section>

         {/* AUDIT LOG TABLE */}
         <section className="bg-white rounded-[32px] border border-sky-100 shadow-xl shadow-sky-900/5 overflow-hidden flex flex-col flex-1">
            <div className="grid grid-cols-[1.2fr_1fr_1.2fr_1fr_2fr_1fr_80px] bg-sky-50 px-8 py-5 border-b border-sky-100">
               {["Timestamp", "Event Type", "Patient ABHA", "Actor", "Description", "Record Hash", "Lock"].map((h, i) => (
                 <span key={i} className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</span>
               ))}
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
               {[
                 { time: "14:42:01", type: "consultation", abha: "88-3301-4402", actor: "Dr. Nair", desc: "Live video consultation completed with patient", hash: "sha256:7f893a...cdd2" },
                 { time: "14:28:15", type: "records", abha: "92-4412-1102", actor: "Admin 02", desc: "Cryptographic seal applied to historic FHIR timeline", hash: "sha256:99a22e...bba1" },
                 { time: "14:15:22", type: "reminders", abha: "56-4231-7821", actor: "System Bot", desc: "Automated Metformin adherence reminder delivered", hash: "sha256:44b11f...00e1" },
                 { time: "13:58:04", type: "escalations", abha: "77-1123-0091", actor: "Aditya S.", desc: "Escalation ticket 4419 resolved after IVR outreach", hash: "sha256:11a99d...ff23" },
                 { time: "13:42:55", type: "consultation", abha: "88-3301-4402", actor: "Dr. Nair", desc: "SOAP note drafted and shared with ABHA vault", hash: "sha256:88e22c...aa94" },
                 { time: "13:10:12", type: "breach", abha: "00-0000-0000", actor: "Firewall", desc: "Unauthorized access attempt blocked from unknown IP", hash: "sha256:ff00ff...00ff" },
               ].map((log, i) => <AuditRow key={i} log={log} i={i} />)}
            </div>
         </section>

         <button className="w-full h-16 border-2 border-dashed border-[#D4AF37] text-[#8A6D3B] font-black uppercase tracking-[0.2em] rounded-3xl flex items-center justify-center gap-3 hover:bg-amber-50/50 hover:border-amber-400 transition-all">
            <ShieldCheck size={20} /> Generate Court-Ready Admissibility Report
         </button>

      </main>

      {/* EXPORT PROGRESS MODAL */}
      <AnimatePresence>
        {isExporting && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sky-950/40 backdrop-blur-md" onClick={() => setIsExporting(false)} />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="w-full max-w-[400px] bg-white rounded-[32px] p-10 shadow-2xl relative z-10"
            >
               <h3 className="text-2xl font-black text-sky-900 mb-2">Clinical Export</h3>
               <p className="text-sm font-bold text-slate-500 mb-10">Generating signed PDF court report...</p>
               
               <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center text-[10px] font-black text-primary uppercase tracking-widest">
                     <span>{exportProgress < 100 ? "Validating hashes..." : "Generated Ready"}</span>
                     <span>{exportProgress}%</span>
                  </div>
                  <div className="h-3 bg-sky-50 rounded-full overflow-hidden border border-sky-100">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${exportProgress}%` }}
                        className="h-full bg-primary"
                     />
                  </div>
               </div>

               {exportProgress === 100 && (
                 <motion.button 
                   initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                   className="w-full h-14 bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 mt-10"
                 >
                    <Download size={20} /> Download Court Report
                 </motion.button>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .mono { font-family: 'Roboto Mono', monospace; }
        @keyframes card-pulse {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .card-pulse {
          animation: card-pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
