"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  ChevronDown, 
  Check, 
  RefreshCcw, 
  MessageCircle, 
  User, 
  Clock, 
  AlertCircle,
  Globe,
  Sparkles,
  UserCheck,
  ChevronUp,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const ScriptShimmer = () => (
  <div className="space-y-6 py-4 opacity-30">
    <div className="h-4 bg-sky-50 rounded-full w-full relative overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/50 to-transparent animate-shimmer -translate-x-full" />
    </div>
    <div className="h-4 bg-sky-50 rounded-full w-3/4 relative overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/50 to-transparent animate-shimmer -translate-x-full" />
    </div>
    <div className="h-4 bg-sky-50 rounded-full w-5/6 relative overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/50 to-transparent animate-shimmer -translate-x-full" />
    </div>
  </div>
);

const MergeFieldPopover = ({ field, value, onSave, onClose }: any) => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }} 
    animate={{ scale: 1, opacity: 1 }} 
    exit={{ scale: 0.8, opacity: 0 }}
    transition={{ type: "spring", damping: 15, stiffness: 300 }}
    className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-sky-100 rounded-2xl shadow-2xl p-4 z-[100]"
  >
     <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Edit {field}</span>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition-colors"><X size={14} /></button>
     </div>
     <input 
       autoFocus
       defaultValue={value}
       onKeyDown={(e) => e.key === 'Enter' && onSave(e.currentTarget.value)}
       className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-3 text-sm font-bold text-sky-900 outline-none focus:border-primary/30 transition-all"
     />
     <div className="mt-3 flex justify-end">
        <button onClick={() => onSave((document.activeElement as HTMLInputElement).value)} className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20">Save</button>
     </div>
  </motion.div>
);

// --- Page Component ---

export default function AIPrepScreen() {
  const [tone, setTone] = useState("Gentle");
  const [isShimmering, setIsShimmering] = useState(false);
  const [isCulturalOpen, setIsCulturalOpen] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [checklist, setChecklist] = useState([true, true, true, false]);
  const [fieldValues, setFieldValues] = useState({
    PATIENT_NAME: "Priya Sharma",
    DRUG_NAME: "Metformin",
    CLINIC_NAME: "CityCare",
    DOCTOR_NAME: "Dr. Nair",
    TEST_NAME: "HbA1c Lab Test"
  });

  const handleToneChange = (t: string) => {
    if (tone === t) return;
    setTone(t);
    setIsShimmering(true);
    setTimeout(() => setIsShimmering(false), 900);
  };

  const updateField = (field: string, val: string) => {
    setFieldValues(prev => ({ ...prev, [field]: val }));
    setEditingField(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-inter overflow-x-hidden pb-32">
      
      {/* TOP HEADER */}
      <header className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-md border-b border-sky-100 z-[100] px-10 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400"><ChevronDown size={20} className="rotate-90" /></button>
            <h1 className="text-xl font-black text-sky-900 leading-none">Call Prep — Mrs. Priya Sharma</h1>
            <div className="px-3 py-1 bg-sky-50 border border-sky-100 text-[10px] font-black text-sky-400 uppercase tracking-widest rounded-lg">Est. 3–5 min</div>
         </div>
         <button className="h-12 px-8 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Phone size={20} /> Begin IVR Call
         </button>
      </header>

      <main className="max-w-[1240px] mx-auto pt-32 px-10 grid grid-cols-12 gap-8">
         
         {/* PATIENT CONTEXT CARD */}
         <div className="col-span-12 bg-white rounded-[40px] border border-sky-100 shadow-xl shadow-sky-900/5 overflow-hidden">
            <div className="h-1.5 bg-primary w-full" />
            <div className="p-10">
               <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-6">
                     <div className="w-[64px] h-[64px] bg-primary/10 rounded-[24px] flex items-center justify-center text-primary font-black text-2xl">PS</div>
                     <div>
                        <h2 className="text-3xl font-black text-sky-900 leading-none mb-2">Mrs. Priya Sharma</h2>
                        <div className="flex items-center gap-3">
                           <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Age 45 • Female</span>
                           <span className="px-2.5 py-1 bg-sky-50 border border-sky-100 text-[10px] font-black text-sky-900 uppercase tracking-widest rounded-lg">Hindi</span>
                           <span className="px-2.5 py-1 bg-primary/5 border border-primary/10 text-[10px] font-black text-primary uppercase tracking-widest rounded-lg">Diabetes Type 2</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                     <div className="w-10 h-10 bg-white rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 font-black"><User size={20} /></div>
                     <div className="text-right">
                        <h4 className="text-sm font-black text-sky-900 mb-0.5">Dr. Ajay Nair</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Consult: Apr 02</p>
                     </div>
                  </div>
               </div>

               <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20"><AlertCircle size={20} /></div>
                     <h3 className="text-lg font-black text-amber-900 leading-none tracking-tight">⚠ {fieldValues.TEST_NAME} Missed — 18 Days Overdue</h3>
                  </div>
                  <div className="flex gap-4">
                     {[
                       { l: "Medication Adherence", v: "82%", c: "text-primary" },
                       { l: "Follow-Ups", v: "5 / 7", c: "text-emerald-500" },
                       { l: "Last Contact", v: "8d ago", c: "text-amber-600" },
                     ].map(chip => (
                       <div key={chip.l} className="bg-white border border-amber-200/50 px-5 py-3 rounded-2xl flex flex-col items-center">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{chip.l}</span>
                          <span className={cn("text-sm font-black mono", chip.c)}>{chip.v}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* LEFT COLUMN: SCRIPT */}
         <div className="col-span-8 space-y-8">
            <div className="bg-white rounded-[40px] border border-sky-100 shadow-2xl shadow-sky-900/10 p-10 relative">
               <div className="flex justify-between items-center mb-10">
                  <div className="flex flex-col gap-1">
                     <h3 className="text-xl font-black text-sky-900 tracking-tight leading-none">AI-Generated Call Script</h3>
                     <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Powered by Claude 3.5 Sonnet</span>
                     </div>
                  </div>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-1">
                     {[
                       { t: "Gentle", c: "bg-emerald-500" },
                       { t: "Firm", c: "bg-amber-500" },
                       { t: "Urgent", c: "bg-red-500" }
                     ].map(t => (
                       <button 
                         key={t.t}
                         onClick={() => handleToneChange(t.t)}
                         className={cn(
                           "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ring-offset-2",
                           tone === t.t ? `${t.c} text-white shadow-lg` : "text-slate-400 hover:text-slate-600 border border-transparent"
                         )}
                       >
                          {t.t} {tone === t.t && "✓"}
                       </button>
                     ))}
                  </div>
               </div>

               <div className={cn("min-h-[280px] relative rounded-3xl p-4 transition-opacity", isShimmering ? "opacity-40 pointer-events-none" : "opacity-100")}>
                  {isShimmering ? (
                    <ScriptShimmer />
                  ) : (
                    <div className="text-[17px] text-slate-700 leading-[1.8] font-medium whitespace-pre-line space-y-6">
                       <p>
                        "Namaste Mrs. <span className="relative group inline-block">
                          <span onClick={() => setEditingField('PATIENT_NAME')} className="text-primary font-black underline cursor-pointer hover:bg-primary/5 rounded-md px-1">{fieldValues.PATIENT_NAME}</span>
                          <AnimatePresence>
                             {editingField === 'PATIENT_NAME' && (
                               <MergeFieldPopover 
                                 field="Patient Name" 
                                 value={fieldValues.PATIENT_NAME} 
                                 onSave={(v: string) => updateField('PATIENT_NAME', v)} 
                                 onClose={() => setEditingField(null)} 
                               />
                             )}
                          </AnimatePresence>
                        </span>, I am calling from <span className="relative group inline-block">
                          <span onClick={() => setEditingField('CLINIC_NAME')} className="text-primary font-black underline cursor-pointer hover:bg-primary/5 rounded-md px-1">{fieldValues.CLINIC_NAME}</span>
                          <AnimatePresence>
                             {editingField === 'CLINIC_NAME' && (
                               <MergeFieldPopover 
                                 field="Clinic Name" 
                                 value={fieldValues.CLINIC_NAME} 
                                 onSave={(v: string) => updateField('CLINIC_NAME', v)} 
                                 onClose={() => setEditingField(null)} 
                               />
                             )}
                          </AnimatePresence>
                        </span> Clinic on behalf of <span className="relative group inline-block">
                          <span onClick={() => setEditingField('DOCTOR_NAME')} className="text-primary font-black underline cursor-pointer hover:bg-primary/5 rounded-md px-1">{fieldValues.DOCTOR_NAME}</span>
                          <AnimatePresence>
                             {editingField === 'DOCTOR_NAME' && (
                               <MergeFieldPopover 
                                 field="Doctor Name" 
                                 value={fieldValues.DOCTOR_NAME} 
                                 onSave={(v: string) => updateField('DOCTOR_NAME', v)} 
                                 onClose={() => setEditingField(null)} 
                               />
                             )}
                          </AnimatePresence>
                        </span>."
                       </p>
                       <p>
                        "We noticed that your clinical tracking shows your <span className="relative group inline-block">
                          <span onClick={() => setEditingField('TEST_NAME')} className="text-primary font-black underline cursor-pointer hover:bg-primary/5 rounded-md px-1">{fieldValues.TEST_NAME}</span>
                          <AnimatePresence>
                             {editingField === 'TEST_NAME' && (
                               <MergeFieldPopover 
                                 field="Test Name" 
                                 value={fieldValues.TEST_NAME} 
                                 onSave={(v: string) => updateField('TEST_NAME', v)} 
                                 onClose={() => setEditingField(null)} 
                               />
                             )}
                          </AnimatePresence>
                        </span> is now 18 days overdue. Monitoring your sugar levels is critical to managing your Diabetes effectively."
                       </p>
                       <p>
                        "Can we schedule a home-collection for the blood test tomorrow morning? Also, please confirm if you are continuing your <span className="relative group inline-block">
                          <span onClick={() => setEditingField('DRUG_NAME')} className="text-primary font-black underline cursor-pointer hover:bg-primary/5 rounded-md px-1">{fieldValues.DRUG_NAME}</span>
                          <AnimatePresence>
                             {editingField === 'DRUG_NAME' && (
                               <MergeFieldPopover 
                                 field="Drug Name" 
                                 value={fieldValues.DRUG_NAME} 
                                 onSave={(v: string) => updateField('DRUG_NAME', v)} 
                                 onClose={() => setEditingField(null)} 
                               />
                             )}
                          </AnimatePresence>
                        </span> dosage as prescribed."
                       </p>
                    </div>
                  )}
               </div>

               <button className="mt-10 flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-widest hover:translate-x-1 transition-all">
                  Regenerate Script <RefreshCcw size={14} className="animate-spin-slow" />
               </button>
            </div>

            {/* CULTURAL CONTEXT */}
            <div className="bg-sky-50 rounded-[32px] border border-sky-100 overflow-hidden">
               <button 
                 onClick={() => setIsCulturalOpen(!isCulturalOpen)}
                 className="w-full flex items-center justify-between p-8 hover:bg-sky-100/50 transition-all"
               >
                  <div className="flex items-center gap-4">
                     <Globe size={20} className="text-primary" />
                     <h3 className="text-lg font-black text-sky-900 tracking-tight">Cultural Context — Nashik, Maharashtra</h3>
                  </div>
                  {isCulturalOpen ? <ChevronUp size={24} className="text-slate-400" /> : <ChevronDown size={24} className="text-slate-400" />}
               </button>
               <AnimatePresence>
                  {isCulturalOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-8 space-y-4"
                    >
                       <div className="flex gap-4 p-4 bg-white rounded-2xl border border-sky-100">
                          <span className="w-6 h-6 bg-sky-50 rounded-full flex items-center justify-center text-[10px] font-black text-primary shrink-0">1</span>
                          <p className="text-sm font-bold text-slate-600 leading-relaxed">Refer to the patient as "Maushi" or "Mataji" if appropriate for age to establish trust.</p>
                       </div>
                       <div className="flex gap-4 p-4 bg-white rounded-2xl border border-sky-100">
                          <span className="w-6 h-6 bg-sky-50 rounded-full flex items-center justify-center text-[10px] font-black text-primary shrink-0">2</span>
                          <p className="text-sm font-bold text-slate-600 leading-relaxed">Patient might mention Navratri fasting; discuss its impact on sugar medication dosage.</p>
                       </div>
                       <div className="flex gap-4 p-4 bg-white rounded-2xl border border-sky-100">
                          <span className="w-6 h-6 bg-sky-50 rounded-full flex items-center justify-center text-[10px] font-black text-primary shrink-0">3</span>
                          <p className="text-sm font-bold text-slate-600 leading-relaxed">Emphasize family well-being as a motivator for clinical adherence.</p>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>

         {/* RIGHT COLUMN: CHECKLIST */}
         <div className="col-span-4 space-y-8">
            <div className="bg-white rounded-[40px] border border-sky-100 shadow-xl shadow-sky-900/5 p-8">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Pre-Call Checklist</h3>
                  <span className="text-[11px] font-black text-primary mono tracking-widest leading-none">{checklist.filter(Boolean).length} / 4 Done</span>
               </div>
               
               <div className="space-y-4 mb-8">
                  {[
                    "Review previous lab trends",
                    "Check current medication stock",
                    "Verify Hindi language preference",
                    "Review doctor's specific notes"
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        const next = [...checklist];
                        next[i] = !next[i];
                        setChecklist(next);
                      }}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group",
                        checklist[i] ? "border-emerald-100 bg-emerald-50/10" : "border-slate-50 bg-slate-50/30 hover:border-sky-100"
                      )}
                    >
                       <div className={cn(
                         "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                         checklist[i] ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-white border-slate-200 group-hover:border-primary/40"
                       )}>
                          {checklist[i] && <Check size={14} strokeWidth={4} />}
                       </div>
                       <span className={cn("text-sm font-bold transition-all", checklist[i] ? "text-slate-800" : "text-slate-400")}>{item}</span>
                    </div>
                  ))}
               </div>

               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${(checklist.filter(Boolean).length / 4) * 100}%` }}
                    className="h-full bg-primary" 
                  />
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-sky-100 shadow-xl shadow-sky-900/5 p-8 flex items-center gap-6">
               <div className="w-16 h-16 bg-sky-50 rounded-[20px] flex items-center justify-center text-primary shrink-0">
                  <span className="text-xl font-black">AI</span>
               </div>
               <div>
                  <h4 className="text-sm font-black text-sky-900 uppercase tracking-widest leading-tight">IVR Optimization</h4>
                  <p className="text-xs font-bold text-slate-400 leading-normal">Claude has optimized the script's rhythm for IVR delivery.</p>
               </div>
            </div>
         </div>

      </main>

      <style jsx global>{`
        .mono { font-family: 'Roboto Mono', monospace; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
