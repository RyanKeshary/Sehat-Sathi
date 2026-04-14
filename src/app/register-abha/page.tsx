"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Droplets, 
  Heart, 
  Wind, 
  Activity, 
  ShieldCheck, 
  MessageCircle,
  X,
  Smartphone,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const FloatingInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "",
  suffix
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative w-full group">
      <div className={cn(
        "flex items-center h-[52px] px-4 rounded-xl border transition-all duration-200 bg-white",
        isFocused ? "border-primary ring-2 ring-primary/10 ring-offset-2" : "border-accent",
      )}>
        <div className="flex-1 relative flex flex-col justify-center">
          <label className={cn(
            "absolute left-0 pointer-events-none transition-all duration-200 text-sm",
            (isFocused || value) ? "-top-1 text-[10px] text-primary font-bold" : "top-0 text-slate-400"
          )}>
            {label}
          </label>
          <input
            type={type}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent outline-none text-[15px] pt-2 text-[#0C2D43] font-medium placeholder:opacity-0"
            placeholder={placeholder}
          />
        </div>
        {suffix && <div className="ml-2">{suffix}</div>}
      </div>
    </div>
  );
};

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Identity", "Health Profile", "Consent"];
  
  return (
    <div className="w-full mb-12">
      <div className="flex justify-between items-center relative px-2">
        {/* Progress Line */}
        <div className="absolute top-5 left-8 right-8 h-[2px] bg-slate-200 -z-10">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep - 1) * 50}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full bg-primary"
          />
        </div>

        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isComplete = stepNum < currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center gap-3">
              <div className="relative w-10 h-10">
                <AnimatePresence mode="wait">
                  {isComplete ? (
                    <motion.div 
                      key="complete"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-sm"
                    >
                      <Check className="text-white w-5 h-5 stroke-[3]" />
                    </motion.div>
                  ) : (
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 border-white shadow-sm transition-colors duration-300",
                      isActive ? "bg-primary text-white" : "bg-white text-slate-300 border-slate-100"
                    )}>
                      {isActive && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: "100%" }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 bg-primary rounded-full -z-10 origin-bottom"
                        />
                      )}
                      {stepNum}
                    </div>
                  )}
                </AnimatePresence>
              </div>
              <span className={cn(
                "text-[13px] font-semibold transition-colors duration-300",
                isActive ? "text-primary" : "text-slate-400"
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Switch = ({ on, setOn }: { on: boolean; setOn: (val: boolean) => void }) => (
  <button 
    onClick={() => setOn(!on)}
    className={cn(
      "w-12 h-6 rounded-full transition-colors duration-300 relative px-1 flex items-center shadow-inner",
      on ? "bg-primary" : "bg-slate-200"
    )}
  >
    <motion.div 
      animate={{ x: on ? 24 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="w-4 h-4 bg-white rounded-full shadow-md"
    />
  </button>
);

// --- Main Assistant Components ---

export default function RegisterAbha() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "Male",
    mobile: "",
    village: "",
    district: "",
    state: "",
    medications: "",
    conditions: [] as string[],
    consents: [false, false, false],
  });

  const [showAbhaModal, setShowAbhaModal] = useState(false);
  const [abhaId, setAbhaId] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState(1); // 1: Aadhaar, 2: OTP

  const isConsentComplete = formData.consents.every(c => c);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-6 py-20">
      <div className="w-full max-w-[560px]">
        <Stepper currentStep={step} />

        <div className="relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-[24px] border border-[#E0F2FE] shadow-sm flex flex-col gap-6"
              >
                <div className="flex flex-col gap-4">
                  <FloatingInput 
                    label="Full Name" 
                    value={formData.name} 
                    onChange={(v: any) => setFormData({...formData, name: v})} 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingInput 
                      label="Date of Birth" 
                      type="date"
                      value={formData.dob} 
                      onChange={(v: any) => setFormData({...formData, dob: v})} 
                    />
                    <div className="bg-slate-50 rounded-xl p-1 flex border border-accent">
                      {["Male", "Female", "Other"].map(g => (
                        <button 
                          key={g} 
                          onClick={() => setFormData({...formData, gender: g})}
                          className={cn(
                            "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                            formData.gender === g ? "bg-primary text-white shadow-sm" : "text-slate-400"
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <FloatingInput 
                    label="Mobile Number" 
                    value={formData.mobile} 
                    onChange={(v: any) => setFormData({...formData, mobile: v})}
                    suffix={formData.mobile.length === 10 && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 animate-in fade-in zoom-in duration-300">
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span className="text-[10px] font-bold">WhatsApp Found ✓</span>
                      </div>
                    )}
                  />
                  <FloatingInput 
                    label="Village" 
                    value={formData.village} 
                    onChange={(v: any) => setFormData({...formData, village: v})} 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingInput 
                      label="District" 
                      value={formData.district} 
                      onChange={(v: any) => setFormData({...formData, district: v})} 
                    />
                    <FloatingInput 
                      label="State" 
                      value={formData.state} 
                      onChange={(v: any) => setFormData({...formData, state: v})} 
                    />
                  </div>
                </div>

                <div className="mt-4 pt-6 border-t border-slate-100">
                  {!abhaId ? (
                    <button 
                      onClick={() => setShowAbhaModal(true)}
                      className="w-full py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 group"
                    >
                      <ShieldCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                      Generate a new ABHA ID for me
                    </button>
                  ) : (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-emerald-700 font-bold flex items-center gap-1.5 text-sm">
                          <Check className="w-4 h-4" /> ABHA ID Created ✓
                        </span>
                        <span className="text-xs text-emerald-600 opacity-80 uppercase tracking-widest font-bold">Verified via Aadhaar</span>
                      </div>
                      <code className="text-[#D4AF37] font-black text-lg bg-black/5 px-4 py-2 rounded-lg mono">
                        {abhaId}
                      </code>
                    </div>
                  )}
                </div>

                <button 
                  onClick={nextStep}
                  disabled={!abhaId}
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all"
                >
                  Save & Continue
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-[24px] border border-[#E0F2FE] shadow-sm flex flex-col gap-8"
              >
                <div>
                  <h3 className="text-xl font-bold text-[#0C2D43] mb-6">Health Conditions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "Dia", name: "Diabetes", icon: Droplets },
                      { id: "Hyp", name: "Hypertension", icon: Heart },
                      { id: "Res", name: "Respiratory", icon: Wind },
                      { id: "Gen", name: "General OPD", icon: Activity },
                    ].map(cond => {
                      const isSelected = formData.conditions.includes(cond.id);
                      return (
                        <button
                          key={cond.id}
                          onClick={() => {
                            if (isSelected) setFormData({...formData, conditions: formData.conditions.filter(c => c !== cond.id)});
                            else setFormData({...formData, conditions: [...formData.conditions, cond.id]});
                          }}
                          className={cn(
                            "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                            isSelected 
                              ? "bg-primary/5 border-primary shadow-inner" 
                              : "bg-white border-accent hover:border-primary/20"
                          )}
                        >
                          <cond.icon className={cn("w-8 h-8", isSelected ? "text-primary" : "text-slate-300")} />
                          <span className={cn("font-bold text-sm", isSelected ? "text-primary" : "text-slate-500")}>
                            {cond.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-[15px] font-bold text-[#0C2D43] mb-3">Current Medications (Optional)</h3>
                  <textarea 
                    value={formData.medications}
                    onChange={(e) => setFormData({...formData, medications: e.target.value})}
                    placeholder="E.g. Metformin 500mg daily..."
                    className="w-full h-32 p-4 bg-slate-50 rounded-xl border border-accent outline-none focus:border-primary transition-colors text-sm font-medium resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button onClick={prevStep} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Back</button>
                  <button onClick={nextStep} className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">Next Section</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-[24px] border border-[#E0F2FE] shadow-sm flex flex-col gap-8"
              >
                <div className="flex flex-col items-center text-center">
                   {isConsentComplete ? (
                     <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                        <motion.svg width="80" height="80" viewBox="0 0 80 80" className="absolute">
                          <motion.circle 
                            cx="40" cy="40" r="38" 
                            stroke="#0891B2" strokeWidth="4" 
                            fill="none" 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6 }}
                          />
                        </motion.svg>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring" }}
                        >
                          <Check className="w-10 h-10 text-primary stroke-[4px]" />
                        </motion.div>
                     </div>
                   ) : (
                     <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                        <ShieldCheck className="w-10 h-10 text-slate-300" />
                     </div>
                   )}
                   <h3 className="text-2xl font-black text-[#0C2D43]">Finishing Up</h3>
                   <p className="text-slate-500 text-sm mt-2">Almost there. We need your consent to sync records.</p>
                </div>

                <div className="flex flex-col gap-4">
                  {[
                    "Consent to share records with linked clinicians",
                    "Allow Sehat Sathi to fetch existing health history",
                    "Accept Terms of Use & Privacy Policy (DPDPA)"
                  ].map((text, i) => (
                    <div key={text} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-sm font-bold text-slate-700 leading-tight pr-4">{text}</span>
                      <Switch 
                        on={formData.consents[i]} 
                        setOn={(v) => {
                          const c = [...formData.consents];
                          c[i] = v;
                          setFormData({...formData, consents: c});
                        }} 
                      />
                    </div>
                  ))}
                </div>

                {isConsentComplete && abhaId && (
                  <div className="flex flex-col items-center gap-2 p-6 bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-[#8A6D3B] tracking-[4px]">Verified Identity</span>
                    <span className="text-xl font-black text-[#8A6D3B] mono tracking-widest">{abhaId}</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={prevStep} className="flex-1 py-4 font-bold text-slate-400">Back</button>
                  <button 
                    disabled={!isConsentComplete}
                    className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all"
                  >
                    Finish Registration
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ABHA ID MODAL */}
      <AnimatePresence>
        {showAbhaModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAbhaModal(false)}
              className="absolute inset-0 bg-[#0C2D43]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-[400px] bg-white rounded-[32px] overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    {modalStep === 1 ? <Fingerprint /> : <Smartphone />}
                  </div>
                  <button onClick={() => setShowAbhaModal(false)} className="p-2 text-slate-300 hover:text-slate-500">
                    <X />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {modalStep === 1 ? (
                    <motion.div key="aadhaar" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}>
                      <h4 className="text-2xl font-black text-[#0C2D43] mb-2">ABHA-Aadhaar Link</h4>
                      <p className="text-slate-500 text-sm mb-8">Enter your 12-digit Aadhaar number to fetch your identity securely.</p>
                      <input 
                        type="text" 
                        maxLength={12} 
                        placeholder="0000 0000 0000"
                        className="w-full py-5 px-6 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xl font-bold mono tracking-[0.2em] outline-none focus:border-primary transition-all"
                      />
                      <button 
                        onClick={() => setModalStep(2)}
                        className="w-full py-5 bg-primary text-white font-bold rounded-[20px] mt-8 shadow-lg shadow-primary/20"
                      >
                        Request OTP
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="otp" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}>
                      <h4 className="text-2xl font-black text-[#0C2D43] mb-2">Verify OTP</h4>
                      <p className="text-slate-500 text-sm mb-8">Sent to Aadhaar-linked mobile: <b className="text-primary">******8291</b></p>
                      <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map(i => (
                          <input 
                            key={i}
                            type="text" 
                            className="w-full aspect-square rounded-2xl bg-slate-50 border border-slate-100 text-center text-2xl font-black text-primary outline-none focus:border-primary"
                            maxLength={1}
                            autoFocus={i === 1}
                          />
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          setAbhaId("91-4502-8831-0027");
                          setShowAbhaModal(false);
                          setModalStep(1);
                        }}
                        className="w-full py-5 bg-primary text-white font-bold rounded-[20px] mt-10 shadow-lg shadow-primary/20"
                      >
                        Confirm & Generate
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <p className="text-[10px] text-center text-slate-400 mt-6 uppercase tracking-widest font-black">Powered by ABDM Sandbox</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .mono {
          font-family: 'SF Mono', 'Roboto Mono', 'Fira Code', monospace;
        }
      `}</style>
    </div>
  );
}
