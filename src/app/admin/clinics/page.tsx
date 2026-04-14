"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Users, 
  Stethoscope, 
  Database, 
  CreditCard, 
  Settings, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  X,
  Lock,
  MessageSquare,
  Globe,
  Share2,
  FileText,
  Mail,
  MoreVertical,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const CountUp = ({ value, prefix = "" }: { value: string, prefix?: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-block"
    >
      {prefix}{value}
    </motion.span>
  );
};

const ArcGauge = ({ score }: { score: number }) => {
  const color = score < 80 ? "stroke-red-500" : score < 95 ? "stroke-amber-500" : "stroke-emerald-500";
  const circumference = 2 * Math.PI * 25;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="28" cy="28" r="25" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
        <motion.circle 
          cx="28" cy="28" r="25" fill="transparent" stroke="currentColor" strokeWidth="4" 
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={color}
        />
      </svg>
      <span className="absolute text-[10px] font-black text-slate-700">{score}%</span>
    </div>
  );
};

const AvatarStack = ({ count }: { count: number }) => {
  return (
    <div className="flex -space-x-3 overflow-hidden">
      {[1, 2, 3, 4].map((i) => (
        <motion.div 
          key={i}
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="inline-block h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center"
        >
           <span className="text-[10px] font-black text-slate-400">Dr</span>
        </motion.div>
      ))}
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        className="inline-block h-8 w-8 rounded-full border-2 border-white bg-sky-50 flex items-center justify-center"
      >
         <span className="text-[9px] font-black text-primary">+{count - 4}</span>
      </motion.div>
    </div>
  );
};

// --- Page Component ---

export default function AdminClinicPanel() {
  const [selectedClinics, setSelectedClinics] = useState<string[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const clinics = [
    { id: "1", name: "CityCare Multispeciality", plan: "Enterprise", docs: 14, patients: 4200, mrr: "42,000", abdm: "Active", dpdpa: 98, city: "Nashik" },
    { id: "2", name: "Apex Heart Centre", plan: "Professional", docs: 6, patients: 1560, mrr: "18,500", abdm: "Active", dpdpa: 89, city: "Pune" },
    { id: "3", name: "Village Seva Kendra", plan: "Basic", docs: 2, patients: 840, mrr: "4,900", abdm: "Pending", dpdpa: 72, city: "Satara" },
    { id: "4", name: "Wellness Prime", plan: "Enterprise", docs: 22, patients: 9100, mrr: "68,000", abdm: "Active", dpdpa: 96, city: "Mumbai" },
    { id: "5", name: "Dr. Nair's Clinic", plan: "Professional", docs: 4, patients: 1100, mrr: "15,000", abdm: "Active", dpdpa: 92, city: "Nagpur" },
  ];

  const handleSelect = (id: string) => {
    setSelectedClinics(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectedClinic = clinics.find(c => c.id === selectedClinicId);

  return (
    <div className="min-h-screen bg-[#F8FBFC] font-inter flex overflow-hidden">
      
      {/* LEFT SIDEBAR (MOCK) */}
      <aside className="w-[240px] border-r border-sky-100 bg-white flex flex-col shrink-0">
         <div className="p-8 border-b border-sky-50">
            <h1 className="text-xl font-black text-sky-900 leading-none mb-1">Sehat Sathi</h1>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-1.5 py-0.5 rounded">Platform Admin</span>
         </div>
         <nav className="flex-1 p-4 flex flex-col gap-1">
            {[
              { n: "Dashboard", i: TrendingUp },
              { n: "Clinics", i: Building2, s: true },
              { n: "Doctors", i: Stethoscope },
              { n: "Analytics", i: Database },
              { n: "Billing", i: CreditCard },
              { n: "Settings", i: Settings },
            ].map(item => (
              <button key={item.n} className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                item.s ? "bg-primary/5 text-primary shadow-sm ring-1 ring-primary/10" : "text-slate-400 hover:text-sky-900"
              )}>
                 <item.i size={18} />
                 <span className="text-xs font-black uppercase tracking-widest">{item.n}</span>
              </button>
            ))}
         </nav>
         <div className="p-6 border-t border-sky-50 space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-sky-900 flex items-center justify-center text-white font-black text-[10px]">RK</div>
               <div>
                  <h4 className="text-[10px] font-black text-sky-900 uppercase">Ryan Keshary</h4>
                  <p className="text-[9px] font-bold text-slate-400">Head of Operations</p>
               </div>
            </div>
            <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-center gap-2">
               <ShieldCheck size={14} className="text-primary" />
               <span className="text-[9px] font-black text-primary uppercase tracking-widest">DPDPA Compliant</span>
            </div>
         </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-10 flex flex-col max-w-[1200px] mx-auto w-full">
         
         {/* TOP KPI ROW */}
         <div className="grid grid-cols-5 gap-6 mb-10">
            {[
              { l: "Platform MRR", v: "₹4.2L", t: "↑34% MoM", tc: "text-emerald-500", g: true },
              { l: "Active Clinics", v: "94", t: "" },
              { l: "Trial Clinics", v: "12", t: "Expiring soon", tc: "text-amber-500" },
              { l: "Churned", v: "2", t: "Last 30d", tc: "text-red-500" },
              { l: "Platform ARR", v: "₹50.4L", t: "Series A Target: ₹60L", tc: "text-primary", target: 84 },
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-sky-100 shadow-sm flex flex-col justify-between h-[160px]">
                 <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{kpi.l}</span>
                    <h3 className={cn("text-2xl font-black mono", kpi.g ? "text-[#8A6D3B]" : "text-sky-900")}>
                      <CountUp value={kpi.v} />
                    </h3>
                 </div>
                 <div>
                    {kpi.target ? (
                      <div className="space-y-2">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{kpi.t}</span>
                         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "84%" }} className="h-full bg-primary" />
                         </div>
                      </div>
                    ) : (
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", kpi.tc)}>{kpi.t}</span>
                    )}
                 </div>
              </div>
            ))}
         </div>

         {/* CLINIC TABLE */}
         <div className="bg-white rounded-[40px] border border-sky-100 shadow-xl shadow-sky-900/5 overflow-hidden flex flex-col flex-1 relative">
            <div className="p-8 border-b border-sky-50 flex items-center justify-between">
               <div className="flex gap-3">
                  <div className="relative group">
                     <input className="w-[300px] h-11 bg-slate-50 border border-slate-100 rounded-xl px-10 outline-none focus:border-primary/30 transition-all font-bold text-xs" placeholder="Search clinic name, ABHA ID..." />
                     <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                  <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                     {["All", "Basic", "Professional", "Enterprise"].map(p => (
                       <button 
                         key={p} 
                         onClick={() => setFilter(p)}
                         className={cn(
                           "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                           filter === p ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-sky-900"
                         )}
                       >{p}</button>
                     ))}
                  </div>
               </div>
               <button className="h-11 px-6 bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  <Plus size={16} /> Onboard New Clinic
               </button>
            </div>

            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-sky-50 border-b border-sky-100 h-14">
                        <th className="pl-8 w-10"><input type="checkbox" className="w-4 h-4" /></th>
                        <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-4">Clinic</th>
                        <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Plan</th>
                        <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Doctors</th>
                        <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patients</th>
                        <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">MRR</th>
                        <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ABDM Status</th>
                        <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">DPDPA Score</th>
                        <th className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-8 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {clinics.map((c, i) => (
                       <tr 
                         key={c.id} 
                         onClick={() => setSelectedClinicId(c.id)}
                         className={cn(
                           "group hover:bg-sky-50/50 transition-all border-b border-sky-50 cursor-pointer h-[80px]",
                           c.plan === "Enterprise" ? "border-l-4 border-l-[#7C3AED]" : c.plan === "Professional" ? "border-l-4 border-l-primary" : "border-l-4 border-l-slate-300"
                         )}
                       >
                          <td className="pl-8"><input type="checkbox" checked={selectedClinics.includes(c.id)} onClick={(e) => { e.stopPropagation(); handleSelect(c.id); }} className="w-4 h-4 cursor-pointer" /></td>
                          <td className="pl-4">
                             <div className="flex flex-col">
                                <span className="text-sm font-black text-sky-900">{c.name}</span>
                                <span className="text-[10px] font-bold text-slate-400">{c.city}</span>
                             </div>
                          </td>
                          <td>
                             <span className={cn(
                               "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                               c.plan === "Enterprise" ? "bg-purple-100 text-purple-700 shadow-[0_0_10px_rgba(124,58,237,0.2)]" : c.plan === "Professional" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"
                             )}>{c.plan}</span>
                          </td>
                          <td className="w-[120px]"><AvatarStack count={c.docs} /></td>
                          <td>
                             <div className="flex flex-col gap-1 w-[80px]">
                                <span className="text-xs font-black text-sky-900">{c.patients}</span>
                                <div className="flex items-end gap-1 h-2 opacity-30">
                                   {[...Array(5)].map((_, i) => <div key={i} className="bg-primary w-2 rounded-t-[2px]" style={{ height: `${Math.random() * 100}%` }} />)}
                                </div>
                             </div>
                          </td>
                          <td><span className="text-xs font-black text-primary mono tracking-widest">₹{c.mrr}</span></td>
                          <td>
                             <div className={cn(
                               "px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em]",
                               c.abdm === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                             )}>
                                <div className={cn("w-1.5 h-1.5 rounded-full", c.abdm === "Active" ? "bg-emerald-500" : "bg-amber-500")} />
                                {c.abdm}
                             </div>
                          </td>
                          <td><ArcGauge score={c.dpdpa} /></td>
                          <td className="pr-8 text-right">
                             <div className="flex justify-end gap-1">
                                <button className="p-2 text-slate-300 hover:text-primary transition-colors"><Eye size={16} /></button>
                                <button className="p-2 text-slate-300 hover:text-primary transition-colors"><Edit2 size={16} /></button>
                                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* BULK ACTIONS BAR */}
            <AnimatePresence>
               {selectedClinics.length > 0 && (
                 <motion.div 
                   initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                   className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-sky-900 text-white px-8 h-14 rounded-2xl flex items-center gap-10 shadow-2xl z-[100]"
                 >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{selectedClinics.length} Selected</span>
                    <div className="flex gap-6 items-center border-l border-white/10 pl-10">
                       <button className="text-[10px] font-black uppercase tracking-widest hover:text-sky-300 transition-all flex items-center gap-2">Change Plan</button>
                       <button className="text-[10px] font-black uppercase tracking-widest hover:text-sky-300 transition-all flex items-center gap-2">Export CSV</button>
                       <button className="text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-400 transition-all flex items-center gap-2">Disable Selected</button>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

      </main>

      {/* DETAIL SIDEBAR (SLIDE-IN) */}
      <AnimatePresence>
         {selectedClinicId && (
           <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedClinicId(null)}
                className="fixed inset-0 bg-sky-950/20 backdrop-blur-sm z-[200]" 
              />
              <motion.div 
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-2xl z-[201] flex flex-col border-l border-sky-100"
              >
                 <div className="p-10 flex flex-col h-full overflow-y-auto no-scrollbar">
                    <div className="flex justify-between items-start mb-10">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300"><Building2 size={24} /></div>
                          <div>
                             <h2 className="text-xl font-black text-sky-900 leading-tight">{selectedClinic?.name}</h2>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedClinic?.city}, Maharashtra</span>
                          </div>
                       </div>
                       <button onClick={() => setSelectedClinicId(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={20} className="text-slate-300" /></button>
                    </div>

                    <div className="space-y-8">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Subscription Timeline</label>
                          <div className="relative h-1 bg-slate-100 rounded-full flex items-center justify-between mb-8">
                             <div className="absolute left-0 h-full bg-primary rounded-full w-[60%]" />
                             {[2023, 2024, 2025].map(y => (
                               <div key={y} className="relative flex flex-col items-center">
                                  <div className={cn("w-3 h-3 rounded-full border-2 border-white", y <= 2024 ? "bg-primary" : "bg-slate-200")} />
                                  <span className="absolute top-4 text-[9px] font-black text-slate-300">{y}</span>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Feature Entitlements</label>
                          <div className="grid grid-cols-2 gap-3">
                             {[
                               { n: "AI Intake", i: MessageSquare, on: true },
                               { n: "Shared Ops", i: Share2, on: true },
                               { n: "Pharmacy", i: Eye, on: false },
                               { n: "Analytics", i: Database, on: true },
                             ].map(f => (
                               <div key={f.n} className={cn(
                                 "p-4 rounded-[20px] border transition-all flex flex-col gap-3",
                                 f.on ? "bg-primary/[0.02] border-primary/20 shadow-sm" : "bg-slate-50 border-slate-100 grayscale opacity-60"
                               )}>
                                  <div className="flex justify-between items-center">
                                     <f.i size={16} className={f.on ? "text-primary" : "text-slate-300"} />
                                     <div className={cn("w-8 h-4 rounded-full relative", f.on ? "bg-primary" : "bg-slate-200")}>
                                        <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", f.on ? "left-4.5" : "left-0.5")} />
                                     </div>
                                  </div>
                                  <span className={cn("text-[9px] font-black uppercase tracking-widest", f.on ? "text-primary" : "text-slate-400")}>{f.n}</span>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="pt-10 border-t border-slate-100 flex flex-col gap-3">
                          <button className="h-14 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                             Upgrade to Enterprise
                          </button>
                          <button className="h-14 border-2 border-slate-100 text-slate-400 font-black rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-95 transition-all">
                             Disable Account
                          </button>
                       </div>
                    </div>
                 </div>
              </motion.div>
           </>
         )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .mono { font-family: 'Roboto Mono', monospace; }
        @keyframes rollUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
