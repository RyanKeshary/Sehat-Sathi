"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  Pencil, 
  FlaskConical, 
  Calendar, 
  Repeat, 
  ShieldAlert,
  X,
  Check,
  ChevronRight,
  User,
  Activity,
  AlertTriangle,
  Clock,
  Layout
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const FrequencyToggle = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 h-10 rounded-lg text-xs font-black uppercase tracking-widest border transition-all",
      active ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
    )}
  >
    {label}
  </button>
);

// --- Main Page Component ---

export default function DoctorConsultation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [frequencies, setFrequencies] = useState({ M: true, A: false, N: true });

  const appendNote = (text: string) => setNotes(prev => (prev ? `${prev}\n${text}` : text));

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-[#FDFEFE] font-inter overflow-hidden split-screen">
      
      {/* LEFT PANEL: PATIENT VIDEO */}
      <section className="w-[60%] bg-[#1a2332] relative overflow-hidden group">
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.4)] z-10 pointer-events-none" />
        
        {/* TOP HUD */}
        <div className="absolute top-0 inset-x-0 h-10 bg-black/20 backdrop-blur-md z-20 px-4 flex items-center justify-between">
           <div className="text-white/60 text-[10px] font-black uppercase tracking-widest">Live Patient Feed</div>
           <div className="text-white font-black text-sm mono tracking-widest">08:42</div>
           <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Secure HD</span>
           </div>
        </div>

        {/* SIMULATED VIDEO */}
        <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
           <div className="w-40 h-40 rounded-full border-4 border-slate-700 flex items-center justify-center mb-6">
              <User className="w-20 h-20 text-slate-600" />
           </div>
           <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-sm">Waiting for feed...</p>
        </div>

        {/* SELF VIEW PIP */}
        <div className="absolute bottom-24 right-6 w-20 h-20 rounded-full border-2 border-white ring-2 ring-primary bg-slate-800 z-30 shadow-2xl flex items-center justify-center overflow-hidden">
           <div className="flex flex-col items-center gap-1 grayscale opacity-50">
             <VideoOff className="w-4 h-4 text-white" />
           </div>
        </div>

        {/* VIDEO CONTROLS */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30 px-6 h-[64px] bg-white/10 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
           <button onClick={() => setIsMuted(!isMuted)} className={cn("w-11 h-11 rounded-full flex items-center justify-center transition-all", isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20")}>
             {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
           </button>
           <button onClick={() => setIsCameraOff(!isCameraOff)} className={cn("w-11 h-11 rounded-full flex items-center justify-center transition-all", isCameraOff ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20")}>
             {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
           </button>
           <button className="w-11 h-11 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
             <Monitor size={20} />
           </button>
           <div className="w-px h-6 bg-white/10 mx-1" />
           <button className="h-11 px-6 bg-red-600 text-white font-black rounded-full flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
             <PhoneOff size={18} /> END
           </button>
        </div>
      </section>

      {/* RIGHT PANEL: CLINICAL SIDEBAR */}
      <section className="w-[40%] bg-white border-l border-sky-100 flex flex-col relative z-40">
        
        {/* SECTION 1: PATIENT CONTEXT */}
        <div className="p-6 border-b border-slate-50 shrink-0">
           <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-black text-sky-900 leading-none mb-2">Ramesh Jain</h2>
                <div className="flex items-center gap-2">
                   <span className="px-2 py-0.5 bg-sky-50 text-primary text-[10px] font-black rounded flex items-center gap-1">45M · MUMBAI</span>
                   <span className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#8A6D3B] text-[10px] font-black mono rounded border border-[#D4AF37]/20">ABHA: 91-4502-8831-0027</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">Hindi · Tamil</span>
                 <div className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">Fever · Headache</div>
              </div>
           </div>
           <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <p className="text-[13px] font-black text-amber-700 uppercase tracking-widest">⚠ Allergic to Penicillin · Sulfa Drugs</p>
           </div>
        </div>

        {/* SECTION 2: AI SOAP BRIEF */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-6">
            <div className="bg-sky-50 border-2 border-primary/20 rounded-[20px] overflow-hidden mb-8 relative">
               <div className="absolute top-3 right-4 px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-tighter rounded">AI-Generated — Confirm</div>
               <div className="p-6 flex flex-col gap-6">
                  {[
                    { l: "Subjective", c: "Patient reports high fever for 48h, sharp frontal headache, and mild nausea. No respiratory distress mentioned." },
                    { l: "Objective", c: "Simulated temp: 101.4°F. Patient appears fatigued. Heart rate elevated 95 bpm." },
                    { l: "Assessment", c: "Likely Viral Rhinitis / Flu. Rule out bacterial sinusitis." },
                    { l: "Plan", c: "Prescribe antipyretics and hydration. If symptoms worsen in 24h, secondary review required." },
                  ].map(s => (
                    <div key={s.l}>
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{s.l}</h4>
                      <p className="text-[15px] font-bold text-slate-600 leading-relaxed">{s.c}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* SECTION 3: ACTIONS ROW */}
            <div className="mb-10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-slate-100 flex-1" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Action Center</span>
                  <div className="h-px bg-slate-100 flex-1" />
               </div>
               <div className="flex justify-between">
                  {[
                    { i: Pencil, l: "Rx", c: "Prescription", color: "text-primary", onClick: () => setDrawerOpen(true) },
                    { i: FlaskConical, l: "Tests", c: "Lab Test", color: "text-emerald-500" },
                    { i: Calendar, l: "Follow", c: "Follow-Up", color: "text-blue-500" },
                    { i: Repeat, l: "Refer", c: "Referral", color: "text-purple-500" },
                    { i: ShieldAlert, l: "SOS", c: "Emergency", color: "text-red-600" },
                  ].map(action => (
                    <div key={action.c} className="flex flex-col items-center gap-2">
                       <button 
                        onClick={action.onClick}
                        className={cn("w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-lg hover:bg-white", action.color)}
                       >
                         <action.i size={20} />
                       </button>
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{action.l}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* SECTION 4: NOTES */}
            <div className="flex flex-col gap-4 mb-20">
               <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add consultation notes..."
                className="w-full h-40 bg-sky-50 border border-sky-200 rounded-2xl p-4 text-[15px] font-medium text-slate-700 outline-none focus:border-primary transition-all resize-none"
               />
               <div className="flex flex-wrap gap-2">
                  {[
                    "Prescription Issued", "Lab Test Ordered", "Follow-Up Scheduled", "No Further Action"
                  ].map(intent => (
                    <button 
                      key={intent} 
                      onClick={() => appendNote(intent)}
                      className="px-3 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                    >
                      + {intent}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: PINNED ACTION */}
        <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative overflow-hidden">
           <AnimatePresence mode="wait">
             {!isSaved ? (
                <motion.button
                  key="action-btn"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all relative overflow-hidden"
                >
                  {isSaving ? "Synchronizing with ABHA..." : "End & Save to ABHA"}
                  {isSaving && (
                     <div className="absolute inset-0 bg-white/20 animate-loading-pulse" />
                  )}
                </motion.button>
             ) : (
                <motion.div
                  key="saved-chip"
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="w-full h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl flex items-center justify-center gap-2 font-black"
                >
                  <Check className="w-5 h-5" /> Saved to ABHA Vault ✓
                </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* PRESCRIPTION DRAWER */}
        <AnimatePresence>
          {drawerOpen && (
             <div className="absolute inset-x-0 bottom-0 top-0 z-[100] flex justify-end">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setDrawerOpen(false)}
                 className="absolute inset-0 bg-sky-900/10 backdrop-blur-[2px]"
               />
               <motion.div
                 initial={{ x: "100%" }}
                 animate={{ x: 0 }}
                 exit={{ x: "100%" }}
                 className="w-full bg-white shadow-2xl overflow-hidden flex flex-col border-l border-sky-100"
               >
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="text-xl font-black text-sky-900">New Prescription</h3>
                     <button onClick={() => setDrawerOpen(false)} className="p-2 text-slate-300 hover:text-slate-500"><X /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medication Name</label>
                        <input type="text" placeholder="Start typing medication..." className="w-full h-12 px-4 bg-sky-50 border border-sky-100 rounded-xl font-bold text-sky-900 outline-none focus:border-primary" />
                     </div>

                     <div className="flex gap-4">
                        <div className="flex-1 space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosage</label>
                           <input type="text" placeholder="e.g. 500mg" className="w-full h-12 px-4 bg-sky-50 border border-sky-100 rounded-xl font-bold text-sky-900 outline-none focus:border-primary" />
                        </div>
                        <div className="flex-1 space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration (Days)</label>
                           <div className="flex items-center gap-3 h-12">
                              <input type="range" min="1" max="14" defaultValue="5" className="flex-1 accent-primary" />
                              <span className="font-black text-primary w-6 text-right">5</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequency (M/A/N)</label>
                        <div className="flex gap-2">
                           <FrequencyToggle label="Morning" active={frequencies.M} onClick={() => setFrequencies({...frequencies, M: !frequencies.M})} />
                           <FrequencyToggle label="Noon" active={frequencies.A} onClick={() => setFrequencies({...frequencies, A: !frequencies.A})} />
                           <FrequencyToggle label="Night" active={frequencies.N} onClick={() => setFrequencies({...frequencies, N: !frequencies.N})} />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructions</label>
                        <textarea placeholder="Take after food..." className="w-full h-24 p-4 bg-sky-50 border border-sky-100 rounded-xl font-bold text-sky-900 outline-none focus:border-primary transition-all resize-none" />
                     </div>

                     <button className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center font-black group-hover:scale-110 transition-transform">+</div>
                        Add Another Medication
                     </button>
                  </div>

                  <div className="p-6 border-t border-slate-50">
                     <button 
                        onClick={() => { setDrawerOpen(false); appendNote("Prescription Saved ✓"); }}
                        className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                     >
                        Save Prescription <Check size={20} />
                     </button>
                  </div>
               </motion.div>
             </div>
          )}
        </AnimatePresence>

      </section>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mono { font-family: 'Roboto Mono', monospace; }
        @keyframes loading-pulse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-pulse {
          animation: loading-pulse 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
