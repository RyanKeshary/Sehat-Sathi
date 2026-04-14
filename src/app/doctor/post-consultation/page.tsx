"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Check, 
  Lock, 
  Plus, 
  Info, 
  Stethoscope, 
  Activity, 
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FlaskConical,
  Beaker
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const VitalCell = ({ label, unit, value, onChange, disabled }: any) => (
  <div className="flex flex-col gap-2 p-4 bg-white border border-sky-100 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
    <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</span>
    <div className="flex items-end gap-2">
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full text-xl font-black text-sky-900 bg-transparent outline-none disabled:opacity-50" 
      />
      <span className="text-[13px] font-bold text-slate-300 mb-1 shrink-0">{unit}</span>
    </div>
  </div>
);

const ICD10Tooltip = ({ text, code, visible }: { text: string; code: string; visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 8 }}
        transition={{ type: "spring", damping: 15 }}
        className="absolute -top-12 left-0 z-50 px-3 py-1.5 bg-sky-900 text-white rounded-lg shadow-xl shadow-sky-900/20 flex items-center gap-2 whitespace-nowrap"
      >
        <span className="text-[11px] font-black uppercase tracking-widest opacity-60">ICD-10:</span>
        <span className="text-sm font-black">{code}</span>
        <div className="absolute -bottom-1 left-4 w-2 h-2 bg-sky-900 rotate-45" />
      </motion.div>
    )}
  </AnimatePresence>
);

const MedicationRow = ({ med, update, disabled }: any) => {
  const [frequencies, setFrequencies] = useState({ M: med.m, A: med.a, N: med.n });

  return (
    <div className="grid grid-cols-12 gap-4 py-4 border-b border-slate-50 last:border-0 group">
      <div className="col-span-4 relative">
         <input 
          type="text" 
          placeholder="Medication Name" 
          defaultValue={med.name}
          disabled={disabled}
          className="w-full h-11 px-4 bg-sky-50 border border-sky-100 rounded-xl font-bold text-sky-900 outline-none focus:border-primary transition-all disabled:bg-slate-50/50" 
         />
      </div>
      <div className="col-span-2">
         <input 
          type="text" 
          placeholder="Dosage" 
          defaultValue={med.dosage}
          disabled={disabled}
          className="w-full h-11 px-4 bg-sky-50 border border-sky-100 rounded-xl font-bold text-sky-900 outline-none focus:border-primary transition-all disabled:bg-slate-50/50" 
         />
      </div>
      <div className="col-span-2 flex gap-1">
         {['M', 'A', 'N'].map(f => (
           <button 
             key={f}
             disabled={disabled}
             onClick={() => setFrequencies({...frequencies, [f]: !frequencies[f as keyof typeof frequencies]})}
             className={cn(
               "flex-1 h-11 rounded-lg text-[10px] font-black transition-all border",
               frequencies[f as keyof typeof frequencies] ? "bg-primary text-white border-primary" : "bg-white text-slate-300 border-slate-100"
             )}
           >
             {f}
           </button>
         ))}
      </div>
      <div className="col-span-1">
         <input 
          type="text" 
          placeholder="Days" 
          defaultValue={med.days}
          disabled={disabled}
          className="w-full h-11 px-3 bg-sky-50 border border-sky-100 rounded-xl font-black text-primary text-center outline-none focus:border-primary transition-all disabled:bg-slate-50/50" 
         />
      </div>
      <div className="col-span-3">
         <input 
          type="text" 
          placeholder="Instructions..." 
          defaultValue={med.instr}
          disabled={disabled}
          className="w-full h-11 px-4 bg-sky-50 border border-sky-100 rounded-xl font-bold text-sky-900 outline-none focus:border-primary transition-all disabled:bg-slate-50/50 text-sm" 
         />
      </div>
    </div>
  );
};

// --- Page Component ---

export default function PostConsultation() {
  const [isLocked, setIsLocked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [assessment, setAssessment] = useState("Suspected viral rhinitis. Rule out bacterial sinusitis.");
  
  const keywords = {
    "rhinitis": "J31.0",
    "sinusitis": "J32.9",
    "fever": "R50.9"
  };

  const currentMatch = Object.entries(keywords).find(([k]) => assessment.toLowerCase().includes(k)) || null;

  useEffect(() => {
    if (currentMatch) {
      setShowTooltip(true);
      const timer = setTimeout(() => setShowTooltip(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [assessment]);

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-inter pb-20 selection:bg-primary/20">
      
      {/* TOP HEADER */}
      <header className="fixed top-0 inset-x-0 h-16 bg-white border-b border-sky-100 px-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-6">
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronLeft /></button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-sky-900 leading-none">Consultation Notes</h1>
              <div className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-200">AI-Drafted — Review Required</div>
            </div>
            <p className="text-[13px] font-bold text-slate-400 mt-1">Patient: Mrs. Priya Sharma · 42F</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-[#D4AF37]/10 text-[#8A6D3B] text-[11px] font-black rounded-lg mono tracking-widest border border-[#D4AF37]/20 uppercase">
          ABHA: 88-3301-4402-1119
        </div>
      </header>

      <main className="pt-24 px-8 max-w-[1000px] mx-auto flex flex-col gap-8">
        
        {/* STEPPER */}
        <div className="flex items-center gap-4 px-4 py-6 bg-white border border-sky-100 rounded-[24px] shadow-sm">
           {[
             { l: "Subjective", s: "done" },
             { l: "Objective", s: "active" },
             { l: "Assessment", s: "todo" },
             { l: "Plan", s: "todo" }
           ].map((step, i) => (
             <div key={step.l} className="flex-1 flex items-center gap-3 group">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all",
                  step.s === "done" ? "bg-emerald-500 text-white" : 
                  step.s === "active" ? "bg-primary text-white border-4 border-primary/20" : "bg-slate-100 text-slate-400"
                )}>
                  {step.s === "done" ? <Check size={18} /> : i + 1}
                </div>
                <span className={cn("text-sm font-black uppercase tracking-widest", step.s === "active" ? "text-primary" : "text-slate-400")}>{step.l}</span>
                {i < 3 && <div className="flex-1 h-px bg-slate-100 mx-2" />}
             </div>
           ))}
        </div>

        {/* SECTION 1: SUBJECTIVE */}
        <section className="bg-white p-8 rounded-[32px] border border-sky-100 border-l-[6px] border-l-primary shadow-xl shadow-sky-900/5 relative overflow-hidden">
           <div className="flex items-start justify-between mb-6">
              <h3 className="text-xl font-black text-sky-900">Subjective — Patient's Words</h3>
              <FileText className="text-primary/20 w-8 h-8" />
           </div>
           <div className="relative">
             <textarea 
              disabled={isLocked}
              defaultValue="Patient reports persistent high-grade fever for 3 days, dry cough, and mild breathlessness upon exertion. No previous history of asthma or respiratory illness."
              className="w-full h-32 p-6 bg-sky-50 rounded-2xl border border-sky-100 text-[17px] font-medium text-slate-700 outline-none focus:border-primary transition-all resize-none leading-relaxed" 
             />
             <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
               <AlertTriangle className="w-4 h-4 text-amber-600" />
               <span className="text-[12px] font-black text-amber-700 uppercase tracking-widest">AI-transcribed — please review and correct errors.</span>
             </div>
           </div>
        </section>

        {/* SECTION 2: OBJECTIVE */}
        <section className="bg-white p-8 rounded-[32px] border border-sky-100 shadow-xl shadow-sky-900/5">
           <h3 className="text-xl font-black text-sky-900 mb-8">Objective Vitals</h3>
           <div className="grid grid-cols-3 gap-6">
              <VitalCell label="Blood Pressure" unit="mmHg" value="128/84" disabled={isLocked} />
              <VitalCell label="Temperature" unit="°F" value="101.2" disabled={isLocked} />
              <VitalCell label="SpO2" unit="%" value="97" disabled={isLocked} />
              <VitalCell label="Weight" unit="kg" value="68.5" disabled={isLocked} />
              <VitalCell label="Height" unit="cm" value="162" disabled={isLocked} />
              <VitalCell label="Heart Rate" unit="bpm" value="88" disabled={isLocked} />
           </div>
        </section>

        {/* SECTION 3: ASSESSMENT */}
        <section className="bg-white p-8 rounded-[32px] border border-sky-100 shadow-xl shadow-sky-900/5 relative">
          <h3 className="text-xl font-black text-sky-900 mb-8">Clinical Assessment</h3>
          <div className="relative">
             <ICD10Tooltip text={currentMatch?.[0] || ""} code={currentMatch?.[1] || ""} visible={showTooltip} />
             <textarea 
               value={assessment}
               onChange={(e) => setAssessment(e.target.value)}
               disabled={isLocked}
               className="w-full h-32 p-6 bg-white border border-slate-100 rounded-2xl text-[17px] font-bold text-sky-900 outline-none focus:border-primary transition-all resize-none leading-relaxed shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]" 
             />
          </div>
          <div className="mt-8 flex flex-col gap-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Suggested Diagnoses</span>
             <div className="flex gap-2">
                {["Acute Rhinitis", "Viral Infection", "Type 2 Diabetes"].map(chip => (
                  <button 
                  key={chip} 
                  disabled={isLocked}
                  onClick={() => setAssessment(prev => prev + " " + chip)}
                  className="px-4 py-2 bg-sky-50 border border-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-all"
                  >
                    + {chip}
                  </button>
                ))}
             </div>
          </div>
        </section>

        {/* SECTION 4: E-PRESCRIPTION */}
        <section className="bg-white p-8 rounded-[32px] border border-sky-100 shadow-2xl shadow-sky-900/10">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-sky-900">E-Prescription</h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                 <ShieldCheck className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Digital Prescription ✓</span>
              </div>
           </div>

           <div className="mb-8">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50/50 rounded-xl mb-4">
                 <div className="col-span-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Drug Name / Form</div>
                 <div className="col-span-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">Dosage</div>
                 <div className="col-span-2 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Freq (M/A/N)</div>
                 <div className="col-span-1 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Days</div>
                 <div className="col-span-3 text-[11px] font-black text-slate-400 uppercase tracking-widest">Instructions</div>
              </div>
              <MedicationRow med={{ name: "Paracetamol 500mg (Tab)", dosage: "1 Tab", m: true, a: true, n: true, days: 5, instr: "Take after food" }} disabled={isLocked} />
              <MedicationRow med={{ name: "Amoxicillin 250mg (Cap)", dosage: "1 Cap", m: true, a: false, n: true, days: 7, instr: "Maintain 12h interval" }} disabled={isLocked} />
              
              <button disabled={isLocked} className="mt-6 flex items-center gap-2 text-primary font-black text-[13px] uppercase tracking-widest hover:opacity-80 transition-opacity">
                <Plus size={16} /> Add Medication
              </button>
           </div>

           <div className="pt-8 border-t border-slate-50">
              <h4 className="text-[13px] font-black text-slate-400 uppercase tracking-widest mb-6">Ordered Lab Tests</h4>
              <div className="grid grid-cols-4 gap-4">
                 {["HbA1c", "Lipid Profile", "CBC", "Creatinine"].map(test => (
                   <label key={test} className="flex items-center gap-3 p-4 bg-sky-50 rounded-2xl border border-sky-100 cursor-pointer hover:border-primary transition-all group">
                     <input type="checkbox" disabled={isLocked} className="w-5 h-5 rounded border-sky-200 text-primary focus:ring-primary" />
                     <span className="text-sm font-black text-sky-900">{test}</span>
                   </label>
                 ))}
              </div>
           </div>
        </section>

        {/* FINALIZE BUTTON */}
        <div className="mt-12 mb-20">
           <AnimatePresence mode="wait">
             {!isLocked ? (
               <motion.button 
                key="finalize"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsLocked(true)}
                className="w-full h-16 border-[2.5px] border-[#D4AF37] bg-white text-sky-900 font-black text-xl rounded-2xl shadow-xl shadow-yellow-900/5 hover:bg-[#D4AF37]/5 transition-all flex items-center justify-center gap-4 group"
               >
                 <Lock className="w-6 h-6 group-hover:scale-110 transition-transform" />
                 Finalize & Lock Consultation Record
               </motion.button>
             ) : (
               <motion.div 
                key="locked"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-10"
               >
                  <div className="w-full h-16 bg-emerald-500 text-white font-black text-xl rounded-2xl flex items-center justify-center gap-4 shadow-xl shadow-emerald-500/20">
                    <ShieldCheck className="w-7 h-7" />
                    Locked ✓ — Records Linked to ABHA
                  </div>
                  
                  <div className="w-full flex justify-between items-end border-t border-slate-200 pt-10 px-8">
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time of Completion</span>
                        <span className="text-xl font-black text-sky-900">14 April 2026, 06:12 AM</span>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <div className="h-12 flex items-center px-4 bg-slate-50 italic text-slate-400 rounded-lg border-b-2 border-slate-200">
                          Dr. Meera Nair, MBBS, MD
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Digitally Signed</span>
                     </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

      </main>

      <AnimatePresence>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 bg-sky-50/40 pointer-events-none z-[60] backdrop-blur-[0.5px]"
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .mono { font-family: 'Roboto Mono', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
