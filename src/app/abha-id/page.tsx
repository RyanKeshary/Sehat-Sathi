"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, 
  Download, 
  Printer, 
  Building2, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Info, 
  AlertCircle,
  Plus,
  ArrowRight,
  Droplet,
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const ConsentCard = ({ clinic, onRevoke }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm mb-4 flex items-center justify-between group hover:border-primary/30 transition-all">
    <div className="flex items-center gap-4">
       <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-primary border border-sky-100">
          <Building2 size={24} />
       </div>
       <div>
          <h4 className="text-lg font-black text-sky-900 leading-tight mb-1">{clinic.name}</h4>
          <p className="text-sm font-bold text-slate-400 mb-2 tracking-tight">Access granted: {clinic.date}</p>
          <div className="flex flex-wrap gap-1.5">
             {clinic.types.map((t: string) => (
               <span key={t} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded border border-slate-100">{t}</span>
             ))}
          </div>
       </div>
    </div>
    <button 
      onClick={onRevoke}
      className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-100 active:scale-90 transition-all"
    >
       Revoke Access
    </button>
  </div>
);

// --- Page Component ---

export default function AbhaIdentity() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [seconds, setSeconds] = useState(85629); // 23:47:09 approx

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-inter pb-24 relative overflow-hidden">
      
      {/* TOP HEADER */}
      <header className="h-16 bg-white border-b border-sky-100 px-6 flex items-center justify-center sticky top-0 z-[100] backdrop-blur-xl bg-white/80">
        <h1 className="text-lg font-black text-sky-900 tracking-tight">My Health Identity</h1>
      </header>

      <main className="pt-8 px-4 max-w-[600px] mx-auto">
        
        {/* IDENTITY CARD */}
        <section className="bg-white p-7 px-8 rounded-[32px] border border-sky-100 border-t-[6px] border-t-primary shadow-xl shadow-sky-900/10 mb-8 flex transition-all hover:shadow-2xl hover:shadow-sky-900/15">
           <div className="flex-1 pr-6">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 bg-primary/5 rounded-[20px] ring-2 ring-primary/10 flex items-center justify-center text-primary font-black text-xl">PS</div>
                 <div>
                    <h2 className="text-[22px] font-black text-sky-900 leading-none mb-1.5">Mrs. Priya Sharma</h2>
                    <p className="text-[13px] font-bold text-slate-400">ABDM Health Account Holder</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest leading-none">ABHA Identity Number</span>
                    <span className="text-xl font-black text-primary mono tracking-widest select-all">56-4231-7821-9234</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-100 flex items-center gap-1">
                       <Droplet size={12} /> B+
                    </span>
                    <span className="px-2.5 py-1 bg-sky-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-sky-100 flex items-center gap-1">
                       <Languages size={12} /> Hindi
                    </span>
                    <span className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">Diabetes T2</span>
                 </div>
              </div>
           </div>
           
           <div className="w-[160px] flex flex-col items-center justify-center border-l border-slate-50 pl-6">
              <div className="aspect-square w-full bg-slate-50 rounded-2xl p-4 relative mb-3 border border-slate-100">
                 <QrCode className="w-full h-full text-sky-900 opacity-20" />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg transform scale-125">
                       <ShieldCheck className="text-primary w-6 h-6" />
                    </div>
                 </div>
              </div>
              <p className="text-[11px] font-black text-primary uppercase tracking-widest text-center leading-tight">Scan for Health Vault Access</p>
           </div>
        </section>

        {/* ACTIONS ROW */}
        <div className="flex gap-4 mb-12">
           <button 
             onClick={() => setIsSheetOpen(true)}
             className="flex-1 h-14 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
           >
              <QrCode size={20} /> Share with Doctor
           </button>
           <button className="h-14 px-6 border-2 border-primary/20 text-primary font-black rounded-2xl flex items-center justify-center hover:bg-primary/5 transition-all">
              <Download size={20} />
           </button>
           <button className="h-14 px-6 border-2 border-slate-100 text-slate-400 font-black rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all">
              <Printer size={20} />
           </button>
        </div>

        {/* CONSENT HUB */}
        <section className="mb-12">
            <div className="flex flex-col mb-8">
               <h3 className="text-xl font-black text-sky-900">Data Sharing Consents</h3>
               <p className="text-sm font-bold text-slate-400">Total 2 clinics currently have active access</p>
            </div>

            <div className="space-y-0">
               <ConsentCard 
                clinic={{ name: "City Care General Hospital", date: "10 Mar 2026", types: ["Consultations", "Prescriptions"] }}
                onRevoke={() => alert("Revoke Process Initiated")}
               />
               <ConsentCard 
                clinic={{ name: "Dr. Nair's Diabetes Clinic", date: "02 Feb 2026", types: ["Lab Results", "E-Prescriptions"] }}
                onRevoke={() => alert("Revoke Process Initiated")}
               />
            </div>

            <button className="w-full h-14 border-2 border-dashed border-primary/30 text-primary font-black rounded-2xl flex items-center justify-center gap-3 mt-4 hover:border-primary/60 hover:bg-primary/5 transition-all group">
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={18} />
               </div>
               Add New Provider Consent
            </button>
        </section>

        {/* EXPLAINER CARD */}
        <section className="bg-emerald-50 p-6 rounded-[24px] border border-emerald-100 flex gap-4 items-start">
           <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Info size={24} />
           </div>
           <div>
              <h5 className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-2">Privacy & Security</h5>
              <p className="text-[14px] font-bold text-emerald-700 leading-relaxed">
                 Your QR contains no personal data — it is a secure key to your encrypted ABHA vault. Only doctors you consent to can view your history.
              </p>
           </div>
        </section>

      </main>

      {/* SHARE BOTTOM SHEET */}
      <AnimatePresence>
        {isSheetOpen && (
          <div className="fixed inset-0 z-[1000] flex items-end justify-center px-4 overflow-hidden">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsSheetOpen(false)}
               className="absolute inset-0 bg-sky-950/40 backdrop-blur-sm"
             />
             <motion.div
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="w-full max-w-[500px] h-[580px] bg-white rounded-t-[40px] p-10 shadow-2xl relative z-10 flex flex-col items-center"
             >
                <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-8" />
                
                <button 
                  onClick={() => setIsSheetOpen(false)}
                  className="absolute top-8 right-8 p-2 bg-slate-50 rounded-full text-slate-300 hover:text-sky-900 transition-colors"
                >
                   <X size={24} />
                </button>

                <div className="text-center mb-10">
                   <h3 className="text-2xl font-black text-sky-900 mb-2">Clinical QR Access</h3>
                   <p className="text-sm font-bold text-slate-500">Share this with your doctor to open records</p>
                </div>

                <div className="aspect-square w-full max-w-[280px] bg-sky-50 rounded-[32px] p-10 border-2 border-primary/10 mb-10 relative">
                   <QrCode className="w-full h-full text-primary opacity-20" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl transform scale-150">
                        <QrCode size={40} className="text-primary" />
                     </div>
                   </div>
                </div>

                <div className="flex flex-col items-center gap-6 w-full">
                   <div className="flex flex-col items-center gap-1">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Access Key Expires In</span>
                      <span className="text-2xl font-black text-primary mono tracking-widest">{formatTime(seconds)}</span>
                   </div>
                   <button className="w-full h-14 bg-sky-50 text-sky-900 font-black rounded-2xl flex items-center justify-center gap-3 group active:bg-primary/5 transition-all">
                      <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" /> Copy One-Time Share Link
                   </button>
                   <p className="text-[11px] font-bold text-slate-400 opacity-60">Expires once scanned by a verified HCP</p>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .mono { font-family: 'Roboto Mono', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
