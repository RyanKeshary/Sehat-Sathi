"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Pill, 
  Clock, 
  Calendar, 
  Video, 
  Stethoscope, 
  FlaskConical,
  AlertCircle,
  ChevronDown,
  MessageCircle,
  CheckCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const ConfettiBurst = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: 0, 
            scale: 0.8, 
            x: Math.cos((i * 60) * (Math.PI / 180)) * 60, 
            y: Math.sin((i * 60) * (Math.PI / 180)) * 60 
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 w-3 h-3 bg-emerald-500 rounded-full"
        />
      ))}
    </div>
  );
};

const MedCard = ({ med, onTake }: { med: any; onTake: (id: string) => void }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isTaking, setIsTaking] = useState(false);

  const handleTake = () => {
    setIsTaking(true);
    setTimeout(() => {
      setShowConfetti(true);
      onTake(med.id);
      setIsTaking(false);
      setTimeout(() => setShowConfetti(false), 800);
    }, 400);
  };

  return (
    <motion.div 
      whileTap={{ scale: med.status === "upcoming" ? 0.97 : 1 }}
      className={cn(
        "bg-white p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden mb-4",
        med.status === "taken" ? "border-emerald-500/30 bg-emerald-50/5" : 
        med.status === "overdue" ? "border-amber-500/20 border-l-[4px] border-l-amber-500" :
        med.status === "skipped" ? "bg-red-50 border-red-100" : "border-sky-100"
      )}
    >
      <div className="flex items-center gap-4 relative">
         <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${med.color}15`, color: med.color }}>
            <Pill size={24} className={cn(med.status === "taken" && "text-emerald-500")} />
         </div>
         <div className="flex-1">
            <div className="flex items-center gap-2">
               <h3 className="text-lg font-black text-sky-900 leading-none">{med.name}</h3>
               {med.status === "skipped" && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest rounded">Skipped</span>}
            </div>
            <p className="text-sm font-bold text-slate-500 mt-1">{med.dosage} · {med.note}</p>
            <div className="flex items-center gap-1.5 mt-2">
               <Clock size={12} className={cn(med.status === "overdue" ? "text-amber-500" : "text-primary")} />
               <span className={cn("text-xs font-black mono tracking-tight", med.status === "overdue" ? "text-amber-600" : "text-primary")}>
                {med.time} {med.status === "overdue" && "(Overdue)"}
               </span>
            </div>
         </div>
         <div className="relative">
            <ConfettiBurst visible={showConfetti} />
            <AnimatePresence mode="wait">
              {med.status === "taken" ? (
                <motion.div 
                  key="taken"
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="px-4 py-2 bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-2"
                >
                  <Check size={14} /> Taken
                </motion.div>
              ) : (
                <motion.button
                  key="upcoming"
                  onClick={handleTake}
                  className={cn(
                    "px-4 py-2 font-black text-xs uppercase tracking-widest rounded-xl border-2 transition-all",
                    med.status === "overdue" ? "border-amber-500 text-amber-600 hover:bg-amber-50" : "border-primary text-primary hover:bg-primary/5"
                  )}
                >
                   {isTaking ? "..." : "Take Now"}
                </motion.button>
              )}
            </AnimatePresence>
         </div>
      </div>
    </motion.div>
  );
};

// --- Page Component ---

export default function Reminders() {
  const [meds, setMeds] = useState([
    { id: "1", name: "Metformin", dosage: "500mg", note: "After meals", time: "6:00 AM", color: "#0891B2", status: "taken" },
    { id: "2", name: "Amlodipine", dosage: "5mg", note: "Before bed", time: "8:00 AM", color: "#059669", status: "taken" },
    { id: "3", name: "Vildagliptin", dosage: "50mg", note: "With food", time: "1:30 PM", color: "#0891B2", status: "upcoming" },
    { id: "4", name: "Multi-Vitamin", dosage: "1 Tab", note: "Daily", time: "10:00 AM", color: "#EAB308", status: "overdue" },
    { id: "5", name: "Antacid", dosage: "10ml", note: "For recovery", time: "昨天", color: "#EF4444", status: "skipped" }
  ]);

  const [chatOpen, setChatOpen] = useState(false);

  const toggleTake = (id: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, status: "taken" } : m));
  };

  const completedCount = meds.filter(m => m.status === "taken").length;
  const progressPercent = (completedCount / 5) * 100;

  return (
    <div className="min-h-screen bg-[#FDFEFE] font-inter pb-24">
      
      {/* TOP HEADER */}
      <header className="h-[64px] bg-white border-b border-sky-100 px-6 flex items-center justify-between sticky top-0 z-[100] backdrop-blur-xl bg-white/80">
        <h1 className="text-lg font-black text-sky-900 tracking-tight">Today's Health Plan</h1>
        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Tue, 14 Apr</span>
      </header>

      <main className="px-5 pt-8">
        
        {/* TODAY'S PROGRESS CARD */}
        <section className="bg-white p-6 rounded-[24px] border border-sky-100 shadow-xl shadow-sky-900/5 mb-10 flex items-center gap-8">
           <div className="relative w-[120px] h-[120px] flex items-center justify-center flex-shrink-0">
             <svg className="w-full h-full -rotate-90">
               <circle cx="60" cy="60" r="54" fill="none" stroke="#F1F5F9" strokeWidth="10" />
               <motion.circle 
                 cx="60" cy="60" r="54" fill="none" stroke="#0891B2" strokeWidth="10" strokeLinecap="round"
                 initial={{ strokeDashoffset: 339 }}
                 animate={{ strokeDashoffset: 339 - (339 * progressPercent) / 100 }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 strokeDasharray="339"
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-sky-900 leading-none">{completedCount} <span className="text-lg text-slate-300">/ 5</span></span>
                <span className="text-[10px] font-black uppercase text-slate-400 mt-1">Doses Taken</span>
             </div>
           </div>
           <div>
              <div className="flex items-center gap-1.5 mb-1">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                 <span className="text-emerald-600 font-black uppercase tracking-widest text-xs">On Track</span>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-3 leading-tight tracking-tight">1 medication due in 2 hours</p>
              <div className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20 w-fit">
                Streak: 12 days ✓
              </div>
           </div>
        </section>

        {/* MEDICATION SECTION */}
        <section className="mb-12">
           <h2 className="text-xl font-black text-sky-900 mb-6">Today's Medications</h2>
           {meds.map(med => <MedCard key={med.id} med={med} onTake={toggleTake} />)}
        </section>

        {/* FOLLOW-UPS SECTION */}
        <section className="mb-12">
            <h2 className="text-xl font-black text-sky-900 mb-6">Upcoming Appointments</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-5 px-5">
               {[
                 { date: "Fri, 17 Apr", doc: "Dr. Meera Nair", specialty: "Video Call", icon: Video, status: "upcoming" },
                 { date: "Mon, 20 Apr", doc: "Metropolis Lab", specialty: "Blood Work", icon: FlaskConical, status: "upcoming" },
                 { date: "10 Apr", doc: "Eye Clinic", specialty: "Retina Scan", icon: Stethoscope, status: "missed" },
               ].map((appt, i) => (
                 <div key={i} className={cn(
                   "w-[200px] flex-shrink-0 p-5 rounded-[24px] border relative overflow-hidden",
                   appt.status === "missed" ? "bg-amber-50 border-amber-100 opacity-80" : "bg-white border-sky-100 shadow-lg shadow-sky-900/5 transition-all hover:-translate-y-1"
                 )}>
                    <div className="px-2.5 py-1 bg-sky-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg w-fit mb-4">
                      {appt.date}
                    </div>
                    {appt.status === "missed" && (
                       <span className="absolute top-5 right-5 text-amber-600"><AlertCircle size={16} /></span>
                    )}
                    <h4 className="text-lg font-black text-sky-900 leading-tight mb-1">{appt.doc}</h4>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                       <appt.icon size={12} /> {appt.specialty}
                    </p>
                    {appt.status === "missed" ? (
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Missed — Please reschedule</p>
                    ) : (
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Confirm Attendance →</button>
                    )}
                 </div>
               ))}
            </div>
        </section>

        {/* WHATSAPP LOG ACCORDION */}
        <section className="mb-20">
            <button 
              onClick={() => setChatOpen(!chatOpen)}
              className="w-full flex items-center justify-between p-6 bg-white border border-sky-100 rounded-[24px] shadow-sm active:scale-[0.99] transition-all"
            >
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                     <MessageCircle size={20} />
                  </div>
                  <div className="text-left">
                     <h4 className="text-sm font-black text-sky-900">WhatsApp Reminder Log</h4>
                     <p className="text-xs font-bold text-slate-400">Automated bot notifications</p>
                  </div>
               </div>
               <ChevronDown className={cn("text-slate-300 transition-all", chatOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {chatOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                   <div className="p-6 bg-slate-50 border-x border-b border-sky-100 rounded-b-[24px] flex flex-col gap-4">
                      <div className="max-w-[85%] bg-white p-4 rounded-b-2xl rounded-tr-2xl shadow-sm border border-slate-100 relative">
                         <p className="text-sm font-medium text-slate-700 leading-relaxed mb-2">Good morning Priya! 💊 Time for your Metformin (500mg). Please take it after your breakfast.</p>
                         <div className="flex items-center justify-end gap-1">
                            <span className="text-[10px] font-bold text-slate-300 tracking-tighter">06:05 AM</span>
                            <CheckCheck size={12} className="text-sky-500" />
                         </div>
                      </div>
                      <div className="max-w-[85%] bg-white p-4 rounded-b-2xl rounded-tr-2xl shadow-sm border border-slate-100 relative">
                         <p className="text-sm font-medium text-slate-700 leading-relaxed mb-2">Notice: You missed your Retina Scan appointment today at Eye Clinic. Type 'YES' if you want me to reschedule it for you.</p>
                         <div className="flex items-center justify-end gap-1">
                            <span className="text-[10px] font-bold text-slate-300 tracking-tighter">10:30 AM</span>
                            <CheckCheck size={12} className="text-sky-500" />
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
        </section>

      </main>

      <style jsx global>{`
        .mono { font-family: 'Roboto Mono', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
