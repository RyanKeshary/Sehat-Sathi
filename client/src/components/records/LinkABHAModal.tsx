"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Smartphone, Mail, CheckCircle2, ChevronRight, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";

type Step = "EXPLAIN" | "METHOD" | "AADHAAR" | "ADDRESS" | "SUCCESS";

export default function LinkABHAModal({ 
  isOpen, 
  onClose, 
  onLinkSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onLinkSuccess: () => void; 
}) {
  const [step, setStep] = useState<Step>("EXPLAIN");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [abhaAddress, setAbhaAddress] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNext = () => {
    if (step === "EXPLAIN") setStep("METHOD");
  };

  const handleAadhaarVerify = () => {
    if (!isOtpSent) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setIsOtpSent(true);
      }, 1500);
    } else {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setStep("SUCCESS");
        setTimeout(onLinkSuccess, 2000);
      }, 2000);
    }
  };

  const handleAddressVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep("SUCCESS");
      setTimeout(onLinkSuccess, 2000);
    }, 2000);
  };

  const reset = () => {
    setStep("EXPLAIN");
    setAadhaar("");
    setOtp("");
    setIsOtpSent(false);
    setAbhaAddress("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => { onClose(); reset(); }}
            className="absolute inset-0 bg-[#0A2540]/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
             <div className="flex items-center justify-between p-6 border-b border-slate-100">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">ABDM</div>
                 <h2 className="text-xl font-display font-bold text-slate-800">Link ABHA ID</h2>
               </div>
               <button onClick={() => { onClose(); reset(); }} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>

             <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
               <AnimatePresence mode="wait">
                 {step === "EXPLAIN" && (
                   <motion.div 
                     key="explain"
                     initial={{ opacity: 0, x: 20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                     <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
                        <ShieldCheck className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">Ayushman Bharat Health Account</h3>
                        <p className="text-indigo-700/80 text-sm leading-relaxed">
                          Your ABHA ID is a 14-digit number that uniquely identifies you in India's digital healthcare ecosystem.
                        </p>
                     </div>

                     <div className="space-y-4">
                        <ExplanationItem 
                          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                          title="Unified Health History"
                          description="Link records from different hospitals and labs in one place."
                        />
                        <ExplanationItem 
                          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                          title="Easy Doctor Access"
                          description="Share your history with doctors instantly for better diagnosis."
                        />
                        <ExplanationItem 
                          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                          title="Secure & Private"
                          description="You control who sees your records and can revoke access anytime."
                        />
                     </div>

                     <button 
                       onClick={handleNext}
                       className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-8"
                     >
                       Let's Get Started <ChevronRight className="w-5 h-5" />
                     </button>
                   </motion.div>
                 )}

                 {step === "METHOD" && (
                   <motion.div 
                     key="method"
                     initial={{ opacity: 0, x: 20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-4"
                   >
                     <p className="text-slate-600 text-sm font-medium mb-4 text-center">How would you like to link your account?</p>
                     
                     <button 
                       onClick={() => setStep("AADHAAR")}
                       className="w-full p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left group"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                              <Smartphone className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-800">Use Aadhaar OTP</h4>
                              <p className="text-sm text-slate-500">Quickest way to link or create your ABHA.</p>
                           </div>
                        </div>
                     </button>

                     <button 
                       onClick={() => setStep("ADDRESS")}
                       className="w-full p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left group"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                              <Mail className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-800">Enter ABHA Address</h4>
                              <p className="text-sm text-slate-500">Already have an address? (e.g. name@abdm)</p>
                           </div>
                        </div>
                     </button>
                   </motion.div>
                 )}

                 {step === "AADHAAR" && (
                   <motion.div 
                     key="aadhaar"
                     initial={{ opacity: 0, x: 20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Aadhaar Number</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000"
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value.replace(/[^0-9]/g, "").slice(0, 12))}
                            disabled={isOtpSent}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-mono text-lg tracking-widest outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        </div>
                     </div>

                     {isOtpSent && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }} 
                         animate={{ height: "auto", opacity: 1 }}
                         className="space-y-4"
                       >
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">OTP Sent to Linked Mobile</label>
                            <input 
                              type="text" 
                              placeholder="Enter 6-digit OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-mono text-lg tracking-widest text-center outline-none focus:border-indigo-500 transition-colors"
                            />
                            <p className="text-xs text-slate-400 mt-2 text-center">Didn't receive? <button className="text-indigo-600 font-bold">Resend in 30s</button></p>
                          </div>
                       </motion.div>
                     )}

                     <button 
                       onClick={handleAadhaarVerify}
                       disabled={isVerifying || (isOtpSent && otp.length < 6) || (!isOtpSent && aadhaar.length < 12)}
                       className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                       {isVerifying ? (
                         <div className="w-5 h-5 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                       ) : isOtpSent ? "Verify & Link" : "Send OTP"}
                     </button>
                   </motion.div>
                 )}

                 {step === "ADDRESS" && (
                   <motion.div 
                     key="address"
                     initial={{ opacity: 0, x: 20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-6"
                   >
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">ABHA Address / PHR ID</label>
                        <input 
                          type="text" 
                          placeholder="yourname@abdm"
                          value={abhaAddress}
                          onChange={(e) => setAbhaAddress(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-medium text-lg outline-none focus:border-indigo-500 transition-colors"
                        />
                     </div>

                     <button 
                       onClick={handleAddressVerify}
                       disabled={isVerifying || abhaAddress.length < 5}
                       className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                       {isVerifying ? (
                         <div className="w-5 h-5 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                       ) : "Verify & Link"}
                     </button>
                   </motion.div>
                 )}

                 {step === "SUCCESS" && (
                   <motion.div 
                     key="success"
                     initial={{ opacity: 0, scale: 0.9 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     className="text-center py-10"
                   >
                     <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
                     </div>
                     <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">ABHA Linked Successfully!</h3>
                     <p className="text-slate-500">Your health records are now synced with your ABHA ID.</p>
                     
                     <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left">
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                           <ShieldCheck className="w-4 h-4" /> Consent Manager
                        </div>
                        <p className="text-sm text-slate-600 mb-4">You have 0 pending requests. All future requests will appear here for your approval.</p>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ExplanationItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 mt-1">{icon}</div>
      <div>
        <h4 className="font-bold text-slate-800 leading-none mb-1">{title}</h4>
        <p className="text-sm text-slate-500 leading-snug">{description}</p>
      </div>
    </div>
  );
}
