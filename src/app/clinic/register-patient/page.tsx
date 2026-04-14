"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Activity, 
  ShieldCheck, 
  Check, 
  Search, 
  Plus, 
  QrCode, 
  Printer, 
  RefreshCcw,
  Languages,
  MessageCircle,
  Stethoscope,
  Heart,
  Droplet,
  Wind,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const Stepper = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center gap-4 mb-10">
    {[1, 2, 3].map((step) => (
      <div key={step} className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all",
          currentStep >= step ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white border-2 border-slate-100 text-slate-300"
        )}>
          {currentStep > step ? <Check size={18} /> : step}
        </div>
        {step < 3 && <div className={cn("w-12 h-0.5 rounded-full transition-all", currentStep > step ? "bg-primary" : "bg-slate-100")} />}
      </div>
    ))}
  </div>
);

// --- Page Component ---

export default function PatientRegistration() {
  const [step, setStep] = useState(1);
  const [isAssisted, setIsAssisted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (c: string) => {
    setSelectedConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const addAllergy = (e: any) => {
    if (e.key === 'Enter' && e.target.value) {
      setAllergies([...allergies, e.target.value]);
      e.target.value = '';
    }
  };

  const handleRegister = () => {
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-sky-50 font-inter py-12 px-6 flex items-center justify-center overflow-x-hidden">
      
      <div className={cn(
        "bg-white rounded-[40px] shadow-2xl shadow-sky-900/10 p-12 transition-all duration-500 w-full max-w-[760px] relative overflow-hidden",
        isAssisted ? "text-[22px] high-contrast" : "text-base"
      )}>
        
        {/* ASSISTED MODE TOGGLE */}
        {!isSuccess && (
          <div className="absolute top-8 right-8 flex items-center gap-3">
             <span className={cn("text-[10px] font-black uppercase tracking-widest", isAssisted ? "text-primary" : "text-slate-300")}>Assisted Mode</span>
             <button 
               onClick={() => setIsAssisted(!isAssisted)}
               className={cn("w-12 h-6 rounded-full relative transition-all", isAssisted ? "bg-primary" : "bg-slate-100")}
             >
                <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm", isAssisted ? "left-7" : "left-1")} />
             </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
               key="form"
               initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.5 }}
            >
               <h1 className="text-3xl font-black text-sky-900 mb-2 leading-none">New Patient Registration</h1>
               <p className="text-sm font-bold text-slate-400 mb-10">Assisting medical intake for clinic operations</p>

               <Stepper currentStep={step} />

               {/* STAGE 1: PERSONAL DETAILS */}
               {step === 1 && (
                 <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Patient Full Name</label>
                       <input 
                         className={cn("w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 outline-none focus:border-primary/30 transition-all font-bold", isAssisted ? "h-[60px]" : "h-14")} 
                         placeholder="e.g. Mrs. Priya Sharma"
                       />
                    </div>
                    <div>
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Date of Birth</label>
                       <input type="date" className={cn("w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 outline-none focus:border-primary/30 transition-all font-bold", isAssisted ? "h-[60px]" : "h-14")} />
                    </div>
                    <div>
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                       <div className={cn("flex bg-slate-50 p-1 rounded-2xl border border-slate-100", isAssisted ? "h-[60px]" : "h-14")}>
                          {["Male", "Female", "Other"].map(g => (
                            <button key={g} className={cn("flex-1 rounded-xl text-xs font-black uppercase tracking-widest transition-all", g === "Female" ? "bg-white text-primary shadow-sm" : "text-slate-400")}>{g}</button>
                          ))}
                       </div>
                    </div>
                    <div>
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Mobile Number</label>
                       <div className="relative">
                          <input className={cn("w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 outline-none focus:border-primary/30 transition-all font-bold", isAssisted ? "h-[60px]" : "h-14")} placeholder="+91 98XXX XXXXX" />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg">
                             <MessageCircle size={10} /> WhatsApp
                          </div>
                       </div>
                    </div>
                    <div>
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Village / Ward</label>
                       <div className="relative">
                          <input className={cn("w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 outline-none focus:border-primary/30 transition-all font-bold", isAssisted ? "h-[60px]" : "h-14")} placeholder="Start typing village..." />
                          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                       </div>
                    </div>
                    <div>
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">District</label>
                       <div className="relative">
                          <select className={cn("w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 outline-none appearance-none font-bold", isAssisted ? "h-[60px]" : "h-14")}>
                             <option>Nashik</option>
                             <option>Pune</option>
                          </select>
                          <RefreshCcw size={16} className="absolute right-12 top-1/2 -translate-y-1/2 text-primary animate-spin" />
                          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                       </div>
                    </div>
                    <div className="col-span-2 mt-4 space-y-4">
                       <button className="w-full h-14 border-2 border-slate-100 text-slate-400 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                          <ShieldCheck size={20} /> Prefill via Aadhaar biometric/OTP
                       </button>
                       <div className="flex gap-4">
                          <button onClick={() => setStep(2)} className="flex-1 h-16 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                             Next: Health Profile
                          </button>
                       </div>
                    </div>
                 </div>
               )}

               {/* STAGE 2: HEALTH PROFILE */}
               {step === 2 && (
                 <div className="space-y-10">
                    <div>
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Known Conditions</label>
                       <div className="grid grid-cols-4 gap-4">
                          {[
                            { n: "Diabetes", i: Droplet },
                            { n: "Hypertension", i: Heart },
                            { n: "Respiratory", i: Wind },
                            { n: "General OPD", i: Stethoscope },
                          ].map(c => (
                            <button 
                              key={c.n}
                              onClick={() => toggleCondition(c.n)}
                              className={cn(
                                "flex flex-col items-center justify-center h-[110px] rounded-3xl border-2 transition-all gap-3",
                                selectedConditions.includes(c.n) ? "bg-primary border-primary text-white shadow-lg" : "bg-white border-slate-100 text-slate-400 hover:border-primary/20"
                              )}
                            >
                               <c.i size={32} />
                               <span className="text-[10px] font-black uppercase tracking-widest">{c.n}</span>
                            </button>
                          ))}
                       </div>
                    </div>

                    <div>
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Drug Allergies (Type & Press Enter)</label>
                       <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-wrap gap-2 focus-within:border-primary/30 transition-all">
                          <AnimatePresence>
                             {allergies.map((a, i) => (
                               <motion.div 
                                 key={a}
                                 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                                 className="px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 text-[11px] font-black uppercase rounded-xl flex items-center gap-2"
                               >
                                  {a} <X size={14} className="cursor-pointer" onClick={() => setAllergies(allergies.filter(x => x !== a))} />
                               </motion.div>
                             ))}
                          </AnimatePresence>
                          <input 
                            onKeyDown={addAllergy}
                            className="bg-transparent border-0 outline-none font-bold text-sm min-w-[200px]" 
                            placeholder="e.g. Penicillin..." 
                          />
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <button onClick={() => setStep(1)} className="h-16 px-8 border-2 border-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-50">Back</button>
                       <button onClick={() => setStep(3)} className="flex-1 h-16 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Next: Finalize</button>
                    </div>
                 </div>
               )}

               {/* STAGE 3: CONSENT & REGISTER */}
               {step === 3 && (
                 <div className="space-y-10">
                    <div className="p-8 bg-sky-50 rounded-[32px] border border-sky-100">
                       <h4 className="font-black text-sky-900 mb-6 uppercase tracking-widest text-xs">Patient Consents</h4>
                       <div className="space-y-4">
                          {[
                            "I consent to sharing my clinical records with Sehat Sathi.",
                            "I agree to my mobile number being used for health reminders.",
                            "I authorize the clinic to create/access my ABHA ID."
                          ].map((text, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-sky-200">
                               <p className="text-sm font-bold text-slate-600 pr-8">{text}</p>
                               <button className="w-12 h-6 bg-primary rounded-full relative"><div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full shadow-sm" /></button>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <button onClick={() => setStep(2)} className="h-16 px-8 border-2 border-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-50">Back</button>
                       <button 
                         onClick={handleRegister}
                         className="flex-1 h-16 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-lg"
                       >
                          Complete Registration & Sync ABHA
                       </button>
                    </div>
                 </div>
               )}
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
               <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-8 border-4 border-white shadow-xl">
                  <motion.svg 
                    width="64" height="64" viewBox="0 0 64 64" fill="none"
                  >
                     <motion.path
                       d="M14 34L26 46L50 20"
                       stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
                       initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                     />
                  </motion.svg>
               </div>
               
               <h2 className="text-3xl font-black text-sky-900 mb-2">Registration Successful!</h2>
               <p className="text-sm font-bold text-slate-400 mb-10">Patient records are now cryptographically locked to the ABHA vault.</p>

               <div className="w-full bg-[#FAFCFF] border-2 border-sky-100 rounded-[32px] p-8 flex items-center gap-8 mb-10 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8" />
                  <div className="aspect-square w-32 bg-white rounded-2xl border border-sky-100 shadow-sm flex items-center justify-center p-4">
                     <QrCode size={80} className="text-sky-900 opacity-20" />
                  </div>
                  <div className="flex-1">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Patient Wallet ID</span>
                     <h4 className="text-xl font-black text-sky-900 leading-none mb-4">Mrs. Priya Sharma</h4>
                     <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-[#8A6D3B] uppercase tracking-widest leading-none">ABHA Identity</span>
                        <span className="text-lg font-black text-primary mono tracking-widest leading-none">88-3301-4402-1119</span>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4 w-full">
                  <button className="flex-1 h-14 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                     <Printer size={20} /> Print Health QR Card
                  </button>
                  <button onClick={() => { setIsSuccess(false); setStep(1); }} className="h-14 px-8 border-2 border-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-50 active:scale-95 transition-all">
                     New Register
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .mono { font-family: 'Roboto Mono', monospace; }
        .high-contrast input::placeholder { color: #94A3B8; }
        .high-contrast input { font-size: 22px !important; color: #000 !important; }
        .high-contrast label { font-size: 14px !important; color: #475569 !important; }
      `}</style>
    </div>
  );
}
