"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cross, 
  ShieldCheck, 
  Stethoscope, 
  Lock, 
  Eye, 
  EyeOff, 
  Info,
  CheckCircle2,
  Building2,
  ArrowRight,
  Shield,
  FileCheck,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const CountdownRing = ({ duration = 90, onComplete }: { duration?: number; onComplete?: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const size = 32;
  const strokeWidth = 3;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const offset = circumference - (timeLeft / duration) * circumference;

  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle 
          cx={center} cy={center} r={radius} 
          fill="none" stroke="rgba(8,145,178,0.1)" strokeWidth={strokeWidth} 
        />
        <circle 
          cx={center} cy={center} r={radius} 
          fill="none" stroke="#0891B2" strokeWidth={strokeWidth} 
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 linear"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-primary">{timeLeft}s</span>
    </div>
  );
};

const OTPInput = ({ count = 6, onComplete, error }: { count?: number; onComplete: (val: string) => void; error?: boolean }) => {
  const [values, setValues] = useState<string[]>(Array(count).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newValues = [...values];
    newValues[index] = val.slice(-1);
    setValues(newValues);

    if (val && index < count - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValues.every(v => v !== "")) {
      onComplete(newValues.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <motion.div 
      animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="flex gap-2 justify-center"
    >
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={cn(
            "w-12 h-14 bg-white border-2 rounded-xl text-center text-xl font-bold transition-all outline-none",
            error ? "border-red-300 bg-red-50 text-red-500" : v ? "border-primary bg-primary/5 text-primary" : "border-sky-100",
            "focus:border-primary focus:ring-4 focus:ring-primary/10"
          )}
        />
      ))}
    </motion.div>
  );
};

// --- Page Component ---

export default function DoctorLogin() {
  const [view, setView] = useState<"form" | "otp" | "success">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showAbhaModal, setShowAbhaModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    mci: ""
  });

  const handleLogin = () => {
    // Basic validation simulate
    if (formData.identifier && formData.password) {
      setView("otp");
    }
  };

  const handleOtpComplete = (otp: string) => {
    if (otp === "123456") {
      setView("success");
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-6 selection:bg-primary/20">
      <div className="w-full max-w-[480px]">
        <AnimatePresence mode="wait">
          {view === "form" && (
            <motion.div
              key="login-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white p-9 rounded-[32px] border border-sky-100 shadow-[0_8px_40px_rgba(8,145,178,0.10)]"
            >
              {/* TOP SECTION */}
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 rotate-3">
                  <Cross className="text-white w-9 h-9 rotate-45" />
                </div>
                <h1 className="text-3xl font-black text-sky-900 tracking-tight mb-2">Doctor Login</h1>
                <p className="text-slate-500 font-medium text-base">Only for registered medical practitioners</p>
              </div>

              {/* TRUST BADGES */}
              <div className="grid grid-cols-3 gap-3 mb-10">
                {[
                  { label: "ABDM Partner", icon: Shield },
                  { label: "MCI Verified", icon: FileCheck },
                  { label: "DPDPA Certified", icon: ShieldCheck },
                ].map((badge) => (
                  <div key={badge.label} className="p-3 bg-sky-50 border border-sky-100 rounded-xl flex flex-col items-center gap-2 text-center group">
                    <badge.icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold text-sky-900/60 uppercase tracking-tighter leading-none">{badge.label}</span>
                  </div>
                ))}
              </div>

              {/* FORM */}
              <div className="flex flex-col gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-sky-900/40 uppercase tracking-widest pl-1">Email or Mobile</label>
                  <input
                    type="text"
                    placeholder="dr.name@hospital.com"
                    value={formData.identifier}
                    onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-sky-100 bg-slate-50/50 outline-none focus:border-primary focus:ring-[6px] focus:ring-primary/10 transition-all font-medium text-sky-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-sky-900/40 uppercase tracking-widest pl-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-sky-100 bg-slate-50/50 outline-none focus:border-primary focus:ring-[6px] focus:ring-primary/10 transition-all font-medium text-sky-900 pr-12"
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 pl-1">
                    <label className="text-xs font-black text-sky-900/40 uppercase tracking-widest">MCI Reg Number</label>
                    <div className="group relative">
                      <Info className="w-3.5 h-3.5 text-slate-300" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-sky-900 text-white text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 text-center shadow-xl">
                        Required under Telemedicine Practice Guidelines 2020
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-sky-900" />
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="MCI-12345"
                    value={formData.mci}
                    onChange={(e) => setFormData({...formData, mci: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-sky-100 bg-slate-50/50 outline-none focus:border-primary focus:ring-[6px] focus:ring-primary/10 transition-all font-medium text-sky-900"
                  />
                </div>

                <button 
                  onClick={() => setShowAbhaModal(true)}
                  className="w-full py-3.5 border border-sky-100 bg-white rounded-xl shadow-sm hover:border-primary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                   <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8A6D3B] flex items-center justify-center p-[1px]">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                      </div>
                   </div>
                   <span className="text-sm font-bold text-primary">Verify via ABHA Professional ID</span>
                </button>

                <button 
                  onClick={handleLogin}
                  className="w-full h-[52px] bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group mt-4"
                >
                  Secure Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-center text-sm font-bold text-primary/60 hover:text-primary cursor-pointer transition-colors mt-2">
                  Not registered? Join Sehat Sathi as a Doctor
                </p>
              </div>
            </motion.div>
          )}

          {view === "otp" && (
            <motion.div
              key="otp-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-9 rounded-[32px] border border-sky-100 shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-8 text-primary">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-sky-900 mb-2">Two-Factor Authentication</h2>
              <p className="text-slate-500 text-sm mb-10 max-w-[280px]">Enter the 6-digit secure code sent to your Aadhaar-linked mobile ending in <b className="text-sky-900">8291</b></p>
              
              <OTPInput count={6} onComplete={handleOtpComplete} error={isError} />
              
              <p className="mt-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Safe. Secure. Encrypted.
              </p>

              <button 
                onClick={() => setView("form")}
                className="mt-8 text-sm font-bold text-primary opacity-60 hover:opacity-100 transition-opacity"
              >
                Go back to credentials
              </button>
            </motion.div>
          )}

          {view === "success" && (
            <motion.div
              key="success-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center w-full"
            >
              <div className="bg-white p-10 rounded-[32px] border border-sky-100 shadow-2xl w-full flex flex-col items-center gap-8">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white"
                    >
                      <CheckCircle2 className="w-14 h-14" />
                    </motion.div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-emerald-500 rounded-full -z-10"
                    />
                  </div>

                  <div className="text-center">
                    <h2 className="text-2xl font-black text-sky-900">Verification Successful</h2>
                    <p className="text-slate-500 text-sm mt-1">Credentials and identity have been validated.</p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { text: "MCI Verified ✓", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                      { text: "ABHA Linked ✓", color: "text-primary bg-primary/5 border-primary/20" },
                      { text: "DPDPA Consent Active ✓", color: "text-sky-600 bg-sky-50 border-sky-100" },
                    ].map((badge, i) => (
                      <motion.span
                        key={badge.text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className={cn("px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide border", badge.color)}
                      >
                        {badge.text}
                      </motion.span>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full p-6 bg-white border border-sky-100 border-l-[4px] border-l-primary rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-primary">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-base font-bold text-sky-900">City General Hospital</h4>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">OPD Block B, Room 402</p>
                      </div>
                    </div>
                  </motion.div>

                  <button className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 group transition-transform hover:translate-y-[-2px]">
                    Enter Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ABHA VERIFY MODAL */}
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
              className="w-full max-w-[400px] bg-white rounded-[32px] overflow-hidden shadow-2xl relative z-10 p-8 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-sky-900 mb-2">ABHA Verification</h3>
              <p className="text-slate-500 text-sm mb-8">Verification code sent to your registered mobile for secure doctor authentication.</p>
              
              <OTPInput count={6} onComplete={() => setShowAbhaModal(false)} />

              <div className="mt-10 flex flex-col items-center gap-4">
                <CountdownRing onComplete={() => console.log("Expired")} />
                <button className="text-xs font-black text-primary uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                  Resend OTP in 90s
                </button>
              </div>

              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-12">Authorized ABDM Professional Identity</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
