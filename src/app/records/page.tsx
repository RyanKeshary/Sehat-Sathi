"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Beaker, 
  Pill, 
  AlertCircle, 
  Share2, 
  QrCode, 
  ShieldCheck, 
  ChevronDown, 
  Calendar, 
  User, 
  ChevronRight,
  TrendingUp,
  Download,
  Check,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const LabChart = ({ data, color = "#0891B2", label }: { data: number[]; color?: string; label: string }) => {
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d * 10)}`).join(" ");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end mb-1">
         <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
         <span className="text-xl font-black text-sky-900">{data[data.length-1]} <span className="text-xs text-slate-300">mg/dL</span></span>
      </div>
      <div className="h-24 bg-sky-50 rounded-xl relative overflow-hidden border border-sky-100">
         {/* Reference Band */}
         <div className="absolute inset-x-0 top-1/4 h-1/2 bg-emerald-500/5 border-y border-emerald-500/10" />
         <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => (
              <circle key={i} cx={(i / (data.length - 1)) * 100} cy={100 - (d * 10)} r="2" fill={color} />
            ))}
         </svg>
      </div>
    </div>
  );
};

const TimelineCard = ({ consul }: any) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative pl-12 pb-12 last:pb-0 group"
    >
      {/* Node */}
      <div className="absolute left-[3px] top-6 w-4 h-4 bg-primary rounded-full ring-4 ring-white shadow-sm flex items-center justify-center z-10">
         <div className="w-1.5 h-1.5 bg-white rounded-full" />
      </div>

      {/* Card */}
      <div className={cn(
        "bg-white p-6 rounded-[24px] border border-sky-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-sky-900/5",
        expanded && "ring-2 ring-primary/10 border-primary/20"
      )}>
        <div className="flex justify-between items-start mb-4">
           <div className="px-3 py-1 bg-sky-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5">
             <Calendar className="w-3.5 h-3.5" /> {consul.date}
           </div>
           <div className={cn(
             "px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest",
             consul.status === "Attended" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
           )}>
             {consul.status === "Attended" ? "Attended ✓" : "MISSED ⚠"}
           </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
           <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-primary font-black text-sm">
             {consul.docInitials}
           </div>
           <div>
             <h4 className="text-sm font-black text-sky-900 leading-none mb-1">{consul.docName}</h4>
             <p className="text-[11px] font-bold text-slate-400 font-black uppercase tracking-widest">{consul.specialty}</p>
           </div>
        </div>

        <h3 className="text-lg font-black text-sky-900 mb-1">{consul.complaint}</h3>
        <p className="text-sm font-bold text-slate-500 mb-6">{consul.diagnosis}</p>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] font-black text-primary uppercase tracking-[0.2em] group"
        >
          {expanded ? "Collapse Recap ↑" : "Expand Full SOAP ↓"}
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-180")} />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-8 mt-6 border-t border-slate-50 grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Prescription</h5>
                    <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 space-y-2">
                       {consul.rx.map((med: string) => (
                         <div key={med} className="flex items-center gap-2 text-xs font-bold text-sky-900">
                           <Pill className="w-3.5 h-3.5 text-primary opacity-40" /> {med}
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor's Note</h5>
                    <p className="text-[13px] font-medium text-slate-600 italic leading-relaxed">
                      {consul.note}
                    </p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- Page Component ---

export default function RecordTimeline() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Consultations", "Lab Results", "Prescriptions", "Allergies"];

  return (
    <div className="min-h-screen bg-[#FDFEFE] font-inter pb-20">
      
      {/* TOP HEADER */}
      <header className="h-[64px] bg-white border-b border-sky-100 px-8 flex items-center justify-between sticky top-0 z-[100] backdrop-blur-xl bg-white/80">
        <div className="flex items-center gap-4">
           <History className="w-5 h-5 text-primary" />
           <h1 className="text-xl font-black text-sky-900">Patient Record</h1>
           <span className="text-slate-300 text-xl font-thin mx-2">—</span>
           <span className="text-lg font-bold text-slate-500">Mrs. Priya Sharma</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-3 py-1 bg-[#D4AF37]/10 text-[#8A6D3B] text-[10px] font-black rounded-lg mono tracking-widest border border-[#D4AF37]/20">ABHA: 88-3301-4402-1119</div>
           <div className="px-3 py-1 bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-widest rounded-lg border border-emerald-100 flex items-center gap-1.5">
             <ShieldCheck className="w-3.5 h-3.5" /> Offline Cache ✓
           </div>
           <button className="flex items-center gap-2 text-primary font-black text-[12px] uppercase tracking-widest hover:bg-primary/5 px-4 py-2 rounded-xl transition-all">
             <Share2 className="w-4 h-4" /> Export
           </button>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto pt-10 px-8">
        
        {/* PATIENT PROFILE CARD */}
        <section className="bg-white p-8 rounded-[32px] border border-sky-100 border-t-[4px] border-t-primary shadow-xl shadow-sky-900/5 mb-8 flex gap-10">
           <div className="w-20 h-20 bg-primary/5 rounded-[24px] flex items-center justify-center text-primary font-black text-3xl">
              PS
           </div>
           <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-12">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Full Name / Gender</p>
                 <p className="text-lg font-black text-sky-900">Priya Sharma <span className="text-slate-400 font-bold ml-2">42F</span></p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Conditions</p>
                 <div className="flex gap-2">
                    <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">Diabetes T2</span>
                    <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">Hypertension</span>
                 </div>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">National Health ID</p>
                 <p className="text-base font-black text-sky-900 mono">ABHA: 88-3301-4402-1119</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Allergies</p>
                 <div className="flex gap-2">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-200">Penicillin</span>
                 </div>
              </div>
           </div>
           <button className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-[20px] flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all self-center">
              <QrCode size={28} />
           </button>
        </section>

        {/* TAB BAR */}
        <div className="sticky top-[64px] bg-white border-b border-sky-50 z-50 mb-10 flex">
           {tabs.map((tab, i) => (
             <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={cn(
                "relative px-8 py-5 text-[13px] font-black uppercase tracking-widest transition-colors",
                activeTab === i ? "text-primary" : "text-slate-400 hover:text-slate-600"
              )}
             >
               {tab}
               {activeTab === i && (
                 <motion.div 
                  layoutId="tabUnderline"
                  className="absolute bottom-0 inset-x-0 h-[3px] bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 />
               )}
             </button>
           ))}
        </div>

        {/* CONTENT TABS */}
        <AnimatePresence mode="wait">
           {activeTab === 0 && (
             <motion.div 
              key="consul-tab"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="relative"
             >
                <div className="absolute left-[10px] top-6 bottom-0 w-1 bg-sky-200" />
                <div className="flex flex-col gap-2">
                   {[
                     { 
                       date: "14 April 2026", docName: "Dr. Meera Nair", docInitials: "MN", specialty: "MD, General Physician", 
                       complaint: "High Fever & Headache", diagnosis: "Viral Rhinitis (J31.0)", status: "Attended",
                       rx: ["Paracetamol 500mg (Tab)", "Amoxicillin 250mg (Cap)"],
                       note: "Patient responded well to initial vitals check. Suspected viral origin. Maintain hydration."
                     },
                     { 
                       date: "02 March 2026", docName: "Dr. Anil Kumar", docInitials: "AK", specialty: "Endocrinologist", 
                       complaint: "Routine Diabetes Check", diagnosis: "Diabetes Melitus T2 (E11.9)", status: "Attended",
                       rx: ["Metformin 500mg (Tab)", "Gliclazide 80mg (Tab)"],
                       note: "Blood sugar levels stabilized. Advised lifestyle modifications and diet chart."
                     },
                     { 
                       date: "15 Jan 2026", docName: "Virtual Host", docInitials: "VH", specialty: "Automatic Follow-up", 
                       complaint: "Post-Flu Verification", diagnosis: "Patient No-Show", status: "MISSED",
                       rx: [],
                       note: "System-triggered follow-up was missed. Rescheduling recommended via app notification."
                     },
                   ].map((c, i) => (
                     <TimelineCard key={i} consul={c} />
                   ))}
                </div>
             </motion.div>
           )}
           {activeTab === 1 && (
             <motion.div 
              key="labs-tab"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-2 gap-8"
             >
                <div className="bg-white p-8 rounded-[32px] border border-sky-100 shadow-xl shadow-sky-900/5 space-y-10">
                   <LabChart label="HbA1c (Glucated Haemoglobin)" data={[6.2, 6.8, 6.4, 7.1, 8.2, 7.8]} />
                   <LabChart label="FBS (Fasting Blood Sugar)" data={[95, 110, 105, 120, 140, 130]} />
                   <LabChart label="Creatinine" data={[0.8, 0.9, 0.85, 1.1, 1.05, 1.0]} />
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-sky-100 shadow-xl shadow-sky-900/5 flex flex-col justify-between">
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><TrendingUp /></div>
                         <h3 className="text-xl font-black text-sky-900 leading-tight">Metabolic Health Trend</h3>
                      </div>
                      <p className="text-[15px] font-bold text-slate-500 leading-relaxed italic">
                        "Overall glycemic control has improved over the last 30 days following diet adjustments, but monitoring remains critical."
                      </p>
                      <div className="flex flex-col gap-3">
                         {[
                           { t: "Glucose Stability", v: "82% in Range", c: "bg-emerald-50 text-emerald-600" },
                           { t: "Kidney Function", v: "Normal", c: "bg-emerald-50 text-emerald-600" },
                           { t: "Weight Log", v: "-0.5kg Lost", c: "bg-blue-50 text-blue-600" },
                         ].map(stat => (
                           <div key={stat.t} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.t}</span>
                              <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", stat.c)}>{stat.v}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <button className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3">
                     <Download size={20} /> Download PDF Report
                   </button>
                </div>
             </motion.div>
           )}
           {activeTab === 2 && (
             <motion.div 
               key="prescriptions-tab"
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
               className="bg-white p-10 rounded-[32px] border border-sky-100 shadow-xl text-center space-y-4"
             >
               <Pill className="w-16 h-16 text-slate-200 mx-auto" />
               <h3 className="text-xl font-black text-sky-900">Active Prescriptions</h3>
               <p className="text-slate-500 font-medium">You currently have 2 active digital prescriptions mapped to your ABHA.</p>
             </motion.div>
           )}
           {activeTab === 3 && (
             <motion.div 
               key="allergies-tab"
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
               className="bg-white p-10 rounded-[32px] border border-sky-100 shadow-xl text-center space-y-4"
             >
               <AlertCircle className="w-16 h-16 text-slate-200 mx-auto" />
               <h3 className="text-xl font-black text-sky-900">Recorded Allergies</h3>
               <p className="text-slate-500 font-medium">1 identified allergy (Penicillin). Information is synced with ABDM network.</p>
             </motion.div>
           )}
        </AnimatePresence>

      </main>

      <style jsx global>{`
        .mono { font-family: 'Roboto Mono', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
