"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  Users, 
  Clock, 
  Video, 
  Mic2, 
  PhoneCall, 
  Search,
  Settings,
  FileText,
  UserCheck,
  LogOut,
  ShieldCheck,
  ChevronRight,
  MoreVertical,
  Cross,
  Check,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const MiniRadialGauge = ({ score }: { score: number }) => {
  const size = 48;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashoffset = circumference - (score / 10) * circumference;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
        <motion.circle 
          cx={size/2} cy={size/2} r={radius} 
          fill="none" stroke="#0891B2" strokeWidth={strokeWidth} 
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[11px] font-black text-sky-900">{score}</span>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, badge }: any) => (
  <div className={cn(
    "flex items-center gap-3 h-11 px-6 cursor-pointer transition-all border-l-4",
    active ? "bg-sky-50 border-primary text-primary" : "border-transparent text-slate-500 hover:bg-slate-50"
  )}>
    <Icon className="w-5 h-5" />
    <span className="text-[15px] font-bold flex-1">{label}</span>
    {badge && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black rounded-full">{badge}</span>}
  </div>
);

// --- Page Component ---

export default function DoctorDashboard() {
  const [status, setStatus] = useState<"available" | "oncall" | "onbreak">("available");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [queue, setQueue] = useState([
    { id: "1", initials: "RJ", name: "Ramesh Jain", info: "45M · Fever & Headache", type: "Video", conn: "green", wait: "12m", lang: "Hindi", abha: "91-4502-8831-0027", score: 6 },
    { id: "2", initials: "SP", name: "Sita Patel", info: "32F · Respiratory", type: "Voice", conn: "amber", wait: "8m", lang: "Gujarati", abha: "12-XXXX-XXXX-XX01", score: 4 },
    { id: "3", initials: "AK", name: "Anil Kumar", info: "58M · Diabetes Checkup", type: "Video", conn: "green", wait: "15m", lang: "English", abha: "44-XXXX-XXXX-XX82", score: 2 },
    { id: "4", initials: "MK", name: "Meena Kumari", info: "27F · Gastric issues", type: "IVR", conn: "red", wait: "22m", lang: "Tamil", abha: "77-XXXX-XXXX-XX14", score: 8 },
    { id: "5", initials: "RB", name: "Rahul Bose", info: "41M · Hypertension", type: "Video", conn: "green", wait: "5m", lang: "Bengali", abha: "33-XXXX-XXXX-XX55", score: 5 },
  ]);

  const cycleStatus = () => {
    const states: ("available" | "oncall" | "onbreak")[] = ["available", "oncall", "onbreak"];
    const nextIndex = (states.indexOf(status) + 1) % states.length;
    setStatus(states[nextIndex]);
  };

  return (
    <div className="flex h-screen bg-[#FAFCFF] font-inter overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-[240px] bg-white border-r border-sky-100 flex flex-col pt-8">
        <div className="px-6 mb-10 flex flex-col items-center">
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20 rotate-45">
             <Cross className="w-6 h-6 -rotate-45" />
           </div>
           <h2 className="text-base font-black text-sky-900 leading-tight text-center">Dr. Meera Nair</h2>
           <p className="text-[13px] font-bold text-slate-400">MBBS, MD (Specialist)</p>
        </div>

        <div className="px-4 mb-8">
          <button 
            onClick={cycleStatus}
            className={cn(
              "w-full h-11 rounded-full flex items-center justify-center gap-2 border-[1.5px] transition-all duration-300 relative overflow-hidden group",
              status === "available" ? "bg-primary border-primary" :
              status === "oncall" ? "bg-emerald-600 border-emerald-600" : "bg-slate-400 border-slate-400"
            )}
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-[12px] font-black uppercase tracking-widest">
              {status === "available" ? "Available" : status === "oncall" ? "On Call" : "On Break"}
            </span>
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <NavItem icon={Users} label="Queue" active badge="5" />
          <NavItem icon={UserCheck} label="My Patients" />
          <NavItem icon={FileText} label="Prescriptions" />
          <NavItem icon={Activity} label="Reports" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-6 border-t border-slate-50 flex flex-col gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 rounded-lg">
             <ShieldCheck className="w-3.5 h-3.5 text-primary" />
             <span className="text-[9px] font-black uppercase tracking-widest text-primary">DPDPA Certified</span>
           </div>
           <button className="flex items-center gap-2 text-[13px] font-black text-red-400 px-3 hover:text-red-600">
             <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
      </aside>

      {/* CENTRE CONTENT */}
      <main className="flex-1 flex flex-col">
        <header className="p-8 pb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-1">
              <h1 className="text-2xl font-black text-sky-900">Patient Queue</h1>
              <span className="px-3 py-1 bg-red-100 text-red-600 text-[11px] font-black rounded-full uppercase tracking-widest">
                5 Patients Waiting
              </span>
            </div>
            <div className="flex gap-2 mt-4">
               {["All", "Ready", "Voice Only", "IVR Only"].map((f, i) => (
                 <button 
                  key={f} 
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-black transition-all",
                    i === 0 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-slate-400 border border-sky-100 hover:border-primary/40"
                  )}
                 >
                   {f}
                 </button>
               ))}
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 border border-sky-100 rounded-xl shadow-sm cursor-pointer hover:border-primary/20 transition-all">
             <div className="w-10 h-10 bg-sky-50 text-primary flex items-center justify-center rounded-lg"><Clock className="w-5 h-5" /></div>
             <div className="pr-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avg Wait Time</p>
                <p className="text-[15px] font-black text-sky-900 leading-none">6 Minutes</p>
             </div>
          </div>
        </header>

        {/* LIVE STATS ROW */}
        <div className="grid grid-cols-4 gap-4 px-8 mb-4">
           {[
             { label: "Patients Waiting", value: "5", color: "text-sky-700 bg-sky-50" },
             { label: "Completed Today", value: "12", color: "text-emerald-700 bg-emerald-50" },
             { label: "Active Sessions", value: "1", color: "text-primary bg-primary/5" },
             { label: "2G Fallback", value: "1 Patient", color: "text-amber-700 bg-amber-50" },
           ].map(stat => (
             <div key={stat.label} className={cn("p-4 rounded-xl border border-sky-100/50 flex flex-col gap-1", stat.color)}>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none">{stat.label}</span>
                <span className="text-xl font-black">{stat.value}</span>
             </div>
           ))}
        </div>

        {/* QUEUE LIST */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 no-scrollbar">
          <Reorder.Group axis="y" values={queue} onReorder={setQueue} className="flex flex-col gap-3">
            {queue.map((p, i) => (
              <Reorder.Item 
                key={p.id} 
                value={p}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className={cn(
                  "bg-white p-6 rounded-[20px] border border-sky-100 flex items-center gap-6 group transition-all cursor-grab active:cursor-grabbing hover:shadow-xl hover:shadow-sky-900/5",
                  i === 0 && "border-t-[3.5px] border-t-primary"
                )}>
                  <div className="relative">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl">
                      {p.initials}
                    </div>
                    <div className={cn(
                      "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-[3px] border-white",
                      p.conn === "green" ? "bg-emerald-500" : p.conn === "amber" ? "bg-amber-500" : "bg-red-500"
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                       <h3 className="text-lg font-black text-sky-900">{p.name}</h3>
                       <div className="px-2.5 py-0.5 bg-sky-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                         {p.type} Only
                       </div>
                    </div>
                    <p className="text-[15px] font-bold text-slate-500">{p.info}</p>
                    <div className="flex gap-2 mt-3">
                       <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                         <Clock className="w-3.5 h-3.5" /> {p.wait} wait
                       </div>
                       <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                         <Search className="w-3.5 h-3.5" /> {p.lang}
                       </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                     {i === 0 ? (
                       <button className="h-12 px-6 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                        Start Case <ChevronRight className="w-4 h-4" />
                       </button>
                     ) : (
                       <button 
                        onClick={() => setSelectedPatient(p)}
                        className="h-12 px-6 bg-white border border-primary text-primary font-black rounded-xl hover:bg-primary/5 transition-all"
                       >
                        View Brief
                       </button>
                     )}
                     <button className="h-12 w-12 flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors">
                       <MoreVertical className="w-6 h-6" />
                     </button>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </main>

      {/* RIGHT DETAIL PANEL */}
      <AnimatePresence>
        {selectedPatient && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedPatient(null)}
               className="fixed inset-0 bg-sky-900/10 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-[400px] bg-white border-l border-sky-100 fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl"
            >
               <div className="p-8 border-b border-slate-50 flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <button onClick={() => setSelectedPatient(null)} className="p-2 text-slate-300 hover:text-slate-500"><X /></button>
                    <div className="px-4 py-1.5 bg-[#D4AF37]/10 text-[#8A6D3B] text-[11px] font-black rounded-lg mono tracking-widest border border-[#D4AF37]/20 uppercase">
                      ABHA: {selectedPatient.abha}
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                     <div className="w-20 h-20 bg-primary/5 rounded-[24px] flex items-center justify-center text-primary font-black text-3xl">
                       {selectedPatient.initials}
                     </div>
                     <div>
                       <h2 className="text-2xl font-black text-sky-900 leading-tight">{selectedPatient.name}</h2>
                       <p className="text-[17px] font-bold text-slate-400">Female · 45 years · Mumbai</p>
                     </div>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                  <div className="bg-white border-2 border-primary/20 rounded-2xl overflow-hidden mb-8">
                     <div className="bg-primary/5 px-6 py-4 flex items-center justify-between border-b border-primary/10">
                       <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em]">AI SOAP Brief</h4>
                       <MiniRadialGauge score={selectedPatient.score} />
                     </div>
                     <div className="p-6 flex flex-col gap-6">
                        <section>
                           <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Subjective</h5>
                           <p className="text-[15px] font-bold text-slate-600 leading-relaxed italic">
                             "Patient reports high fever starting 48h ago. Associated with sharp headache and mild nausea."
                           </p>
                        </section>
                        <section>
                           <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Relevant History</h5>
                           <div className="flex gap-2">
                             {["Hypothyroidism", "Seasonal flu (2025)"].map(tag => (
                               <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest rounded-lg">{tag}</span>
                             ))}
                           </div>
                        </section>
                        <section>
                           <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Known Allergies</h5>
                           <div className="flex gap-2">
                             <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 text-[11px] font-black uppercase tracking-widest rounded-lg">Pollen</span>
                             <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 text-[11px] font-black uppercase tracking-widest rounded-lg">Sulfa drugs</span>
                           </div>
                        </section>
                     </div>
                  </div>
               </div>

               <div className="p-8 pt-4 border-t border-slate-50">
                  <button className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 group overflow-hidden relative">
                    <Video className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Start Consultation Now</span>
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                  </button>
               </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mono { font-family: 'Roboto Mono', monospace; }
      `}</style>
    </div>
  );
}
