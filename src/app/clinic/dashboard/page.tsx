"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Bell, 
  ShieldCheck, 
  Plus, 
  Download, 
  Phone, 
  Check, 
  Activity, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  LayoutDashboard,
  FileText,
  Settings,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const CountUp = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
};

const Sparkline = ({ color = "#0891B2" }) => (
  <svg width="40" height="24" viewBox="0 0 40 24" fill="none" className="ml-auto">
    <motion.path
      d="M1 23L6 18L11 21L16 12L21 16L26 4L31 8L36 1"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    />
  </svg>
);

const KPICard = ({ label, value, delta, color, trend = "up", pulsing = false }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "bg-white p-5 rounded-2xl border border-sky-100 shadow-sm relative overflow-hidden",
      pulsing && "ring-offset-2 ring-2 ring-red-500/20 critical-pulse"
    )}
  >
    <div className="flex items-center justify-between mb-4">
       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
          <Activity size={20} />
       </div>
       <Sparkline />
    </div>
    <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">{label}</p>
    <div className="flex items-end gap-3">
       <h3 className="text-4xl font-black text-sky-900 leading-none">
          <CountUp value={value} />
       </h3>
       {delta && (
         <div className={cn("px-2 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5", trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
            {trend === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {delta}
         </div>
       )}
    </div>
  </motion.div>
);

const FeedItem = ({ event }: { event: any }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    className="py-3 px-4 border-b border-slate-100 last:border-0 relative overflow-hidden group"
  >
     <motion.div 
       initial={{ backgroundColor: "rgba(253,246,178,0.8)" }}
       animate={{ backgroundColor: "rgba(255,255,255,0)" }}
       transition={{ duration: 1 }}
       className="absolute inset-0 z-0"
     />
     <div className="flex gap-4 relative z-10">
        <span className="text-[11px] font-black text-primary mono min-w-[50px]">{event.time}</span>
        <p className="text-[13px] font-bold text-slate-600 tracking-tight leading-relaxed">{event.text}</p>
     </div>
  </motion.div>
);

const NavItem = ({ icon: Icon, label, active = false }: any) => (
  <div className={cn(
    "flex items-center gap-4 px-6 py-4 cursor-pointer transition-all border-l-4",
    active ? "bg-sky-50 border-primary text-primary" : "border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600"
  )}>
    <Icon size={20} />
    <span className="text-sm font-black uppercase tracking-widest">{label}</span>
  </div>
);

// --- Main Page Component ---

export default function ClinicDashboard() {
  const [events, setEvents] = useState([
    { id: "1", time: "14:28", text: "New ABHA registration completed: Mrs. Anjali" },
    { id: "2", time: "14:24", text: "Dr. Nair joined consultation room #02" },
    { id: "3", time: "14:15", text: "Emergency SOS triggered: Patient 4421-M (Resolved)" },
    { id: "4", time: "14:02", text: "Automated follow-up reminders sent to 14 patients" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      setEvents(prev => [{ id: Date.now().toString(), time: timeStr, text: "System heartbeat check: Compliance integrity ✓" }, ...prev.slice(0, 5)]);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-[#FDFEFE] font-inter overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-[260px] bg-white border-r border-sky-100 flex flex-col shrink-0">
        <div className="p-8 pb-12 flex items-center gap-3">
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <ShieldCheck />
           </div>
           <div>
              <h2 className="text-xl font-black text-sky-900 leading-none">CityCare</h2>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Ops Console</p>
           </div>
        </div>

        <nav className="flex-1 space-y-1">
           <NavItem icon={LayoutDashboard} label="Dashboard" active />
           <NavItem icon={Users} label="Patients" />
           <NavItem icon={AlertTriangle} label="Escalations" />
           <NavItem icon={Bell} label="Reminders" />
           <NavItem icon={ShieldCheck} label="Compliance" />
           <NavItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-8 border-t border-slate-50">
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-200">
              <Check size={14} /> DPDPA Compliant
           </div>
           <button className="text-[13px] font-bold text-slate-400 mt-6 hover:text-red-500 transition-colors">Log out Console</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-10 bg-[#FAFCFF] flex flex-col gap-10">
        
        <header className="flex justify-between items-center">
           <div>
              <h1 className="text-2xl font-black text-sky-900 leading-none mb-2">Clinic Operations Dashboard</h1>
              <p className="text-sm font-bold text-slate-400">Welcome back, Admin. System status: <span className="text-emerald-500">Normal</span></p>
           </div>
           <div className="flex gap-4">
              <button className="h-12 px-6 bg-white border border-sky-100 text-sky-900 font-black rounded-xl text-sm shadow-sm flex items-center gap-2 hover:bg-slate-50"><Download size={18} /> Daily Export</button>
              <button className="h-12 px-6 bg-primary text-white font-black rounded-xl text-sm shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-[1.02] transition-all"><Plus size={18} /> New Registration</button>
           </div>
        </header>

        {/* TOP KPI ROW */}
        <section className="grid grid-cols-4 gap-4">
           <KPICard label="Consultations" value={28} delta="4" color="bg-primary/10 text-primary" />
           <KPICard label="Follow-Ups" value={14} delta="2" color="bg-amber-100 text-amber-600" />
           <KPICard label="Non-Adherence" value={7} delta="3" trend="down" color="bg-orange-100 text-orange-600" />
           <KPICard label="Critical Escalations" value={3} pulsing color="bg-red-100 text-red-600" />
        </section>

        {/* THREE-COLUMN LAYOUT */}
        <section className="grid grid-cols-12 gap-6">
           
           {/* COL 1: ESCALATION QUEUE */}
           <div className="col-span-4 bg-white border border-sky-100 rounded-3xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                 <h4 className="text-[13px] font-black text-sky-900 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" /> Escalation Queue
                 </h4>
                 <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black rounded uppercase">7 Open</span>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[460px] no-scrollbar p-6 space-y-4">
                 {[
                   { n: "Ramesh Jain", t: "Med missed", d: "2 days", c: "red" },
                   { n: "Anita Singh", t: "BP High Alarm", d: "12h ago", c: "amber" },
                   { n: "Sunil Verma", t: "No-Show Video", d: "3h ago", c: "sky-200" },
                   { n: "Dinesh K.", t: "Critical SpO2", d: "Just now", c: "red" },
                 ].map((esc, i) => (
                   <div key={i} className={cn("p-4 rounded-2xl border bg-slate-50/20 flex items-center gap-6", `border-l-[6px] border-${esc.c}-500`)}>
                      <div className="flex-1">
                         <h5 className="font-black text-sky-900 text-sm">{esc.n}</h5>
                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{esc.t}</span>
                         <p className="text-[11px] font-black text-amber-600 mt-1 uppercase tracking-tighter">{esc.d} overdue</p>
                      </div>
                      <div className="flex gap-2">
                         <button className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all"><Phone size={14} /></button>
                         <button className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-all"><Check size={14} /></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* COL 2: TODAY'S SCHEDULE */}
           <div className="col-span-4 bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                 <h4 className="text-[13px] font-black text-sky-900 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={16} className="text-primary" /> Today's Schedule
                 </h4>
              </div>
              <div className="p-2 space-y-1">
                 {[
                   { t: "14:30", n: "Priya Sharma", s: "ready", active: true },
                   { t: "15:00", n: "Sunil Verma", s: "waiting" },
                   { t: "15:30", n: "Rajesh K.", s: "ready" },
                   { t: "14:00", n: "Anjali M.", s: "completed" },
                 ].sort((a,b) => a.t.localeCompare(b.t)).map((slot, i) => (
                   <div key={i} className={cn("p-4 rounded-2xl flex items-center gap-4 transition-all", slot.active && "bg-sky-50 shadow-sm")}>
                      <span className="text-xs font-black text-primary mono min-w-[40px]">{slot.t}</span>
                      <div className="flex-1 flex items-center gap-3">
                         <div className="w-8 h-8 bg-slate-100 rounded-full border border-white flex items-center justify-center text-[10px] font-black">{slot.n[0]}</div>
                         <h5 className="text-[13px] font-black text-sky-900">{slot.n}</h5>
                         <div className={cn("w-1.5 h-1.5 rounded-full", slot.s === "ready" ? "bg-emerald-500" : slot.s === "waiting" ? "bg-amber-500" : "bg-slate-300")} />
                      </div>
                      {slot.s === "completed" ? (
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Completed ✓</span>
                      ) : (
                        <button className="px-3 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Join Call</button>
                      )}
                   </div>
                 ))}
              </div>
           </div>

           {/* COL 3: LIVE ACTIVITY FEED */}
           <div className="col-span-4 bg-sky-50 border border-sky-100 rounded-3xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-6 border-b border-sky-200 bg-sky-100/30">
                 <h4 className="text-[13px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} /> Live Activity Feed
                 </h4>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar bg-white/50 backdrop-blur-sm">
                 <AnimatePresence initial={false}>
                    {events.map((event) => (
                      <FeedItem key={event.id} event={event} />
                    ))}
                 </AnimatePresence>
              </div>
           </div>

        </section>

        {/* BOTTOM QUICK ACTIONS */}
        <section className="grid grid-cols-3 gap-6 mb-10">
           {[
             { l: "Send Bulk Reminders", i: Bell, c: "amber", n: "Notify 24 patients" },
             { l: "Register New Patient", i: Users, c: "teal", n: "Quick Intake Form" },
             { l: "Compliance Report", i: FileText, c: "slate", n: "Audit Hub Export" },
           ].map(action => (
             <div key={action.l} className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm hover:translate-y-1 transition-all flex items-center gap-6 group cursor-pointer">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110", `bg-${action.c}-500 shadow-${action.c}-900/10 text-white`)}>
                   <action.i size={28} />
                </div>
                <div>
                   <h4 className="text-lg font-black text-sky-900 leading-none mb-1">{action.l}</h4>
                   <p className="text-xs font-bold text-slate-400">{action.n}</p>
                </div>
             </div>
           ))}
        </section>

      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .mono { font-family: 'Roboto Mono', monospace; }
        @keyframes critical-pulse {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.5); }
          70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .critical-pulse {
          animation: critical-pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
