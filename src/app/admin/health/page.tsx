"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, 
  Activity, 
  Database, 
  MessageSquare, 
  Zap, 
  Globe, 
  Shield, 
  Layers, 
  Cpu, 
  Cloud,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pause,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const ArcGauge = ({ percentage, color = "text-primary" }: { percentage: number, color?: string }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-20 flex items-center justify-center pt-4 overflow-hidden">
      <svg className="w-full h-full transform -rotate-180" viewBox="0 0 100 60">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={0} className="text-slate-100 opacity-30" />
        <motion.circle 
          cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" 
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={color}
        />
      </svg>
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
         <span className="text-lg font-black text-sky-900 mono">{percentage}%</span>
      </div>
    </div>
  );
};

const ServiceCard = ({ name, icon: Icon, status, uptime, latency }: any) => {
  const isOutage = status === "Outage";
  const isDegraded = status === "Degraded";

  return (
    <motion.div 
      className={cn(
        "bg-white rounded-[28px] border border-sky-100 p-6 flex flex-col shadow-sm transition-all duration-500",
        isOutage ? "bg-red-50 border-red-200 shadow-lg shadow-red-950/5 ring-2 ring-red-500/20" : "hover:shadow-md"
      )}
    >
       <div className="flex justify-between items-start mb-6">
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", isOutage ? "bg-red-500 text-white" : "bg-sky-50 text-sky-900")}>
             <Icon size={20} />
          </div>
          <div className={cn(
            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
            isOutage ? "bg-red-100 text-red-700" : isDegraded ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
          )}>
             <div className={cn("w-1.5 h-1.5 rounded-full", isOutage ? "bg-red-500 animate-pulse" : isDegraded ? "bg-amber-500" : "bg-emerald-500")} />
             {status}
          </div>
       </div>

       <h3 className="text-sm font-black text-sky-900 mb-1">{name}</h3>
       <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-black text-sky-900 mono">{uptime}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">Uptime (30d)</span>
       </div>

       <div className="flex justify-between items-end">
          <ArcGauge percentage={parseFloat(uptime)} color={isOutage ? "text-red-500" : isDegraded ? "text-amber-500" : "text-primary"} />
          <div className="flex flex-col items-end gap-1 pb-4">
             <div className="flex items-end gap-1 h-8 opacity-40">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={cn("w-1.5 rounded-t-[2px]", isOutage ? "bg-red-500" : "bg-primary")} style={{ height: `${20 + Math.random() * 80}%` }} />
                ))}
             </div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{latency}ms Latency</span>
          </div>
       </div>
    </motion.div>
  );
};

const IndiaMapPlaceholder = () => {
  return (
    <div className="relative w-full h-[240px] bg-sky-50 rounded-[32px] overflow-hidden flex items-center justify-center group">
       <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
       <div className="relative z-10 flex flex-col items-center gap-4">
          <Globe size={80} className="text-primary/20 group-hover:text-primary/40 transition-colors" />
          <div className="px-4 py-2 bg-white/50 backdrop-blur-md rounded-2xl border border-sky-100 text-[10px] font-black text-primary uppercase tracking-widest">
             Geospatial Engagement: India
          </div>
       </div>
       {/* Animated state-like blobs */}
       {[30, 45, 60, 20].map((left, i) => (
         <motion.div 
           key={i}
           initial={{ opacity: 0, scale: 0 }}
           animate={{ opacity: [0.2, 0.5, 0.2], scale: 1 }}
           transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
           className="absolute w-12 h-12 bg-primary rounded-full blur-2xl"
           style={{ left: `${left}%`, top: `${30 + i * 15}%` }}
         />
       ))}
    </div>
  );
};

// --- Page Component ---

export default function PlatformHealth() {
  const [status, setStatus] = useState("Operational"); // "Operational", "Degraded", "Outage"
  const [alerts, setAlerts] = useState([
    { id: 1, type: "WARN", msg: "WebRTC Jitter spike detected in Pune region", time: "07:19:12" },
    { id: 2, type: "INFO", msg: "BullMQ queue 'med-notifications' cleared bottleneck", time: "07:18:45" },
    { id: 3, type: "ERROR", msg: "ABHA OAuth Handshake failed for client 9821", time: "07:17:30" },
  ]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const newAlert = {
        id: Date.now(),
        type: Math.random() > 0.8 ? "ERROR" : "INFO",
        msg: "System heartbeat acknowledged - AWS-MUM-1",
        time: new Date().toLocaleTimeString('en-GB')
      };
      setAlerts(prev => [newAlert, ...prev.slice(0, 15)]);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-inter overflow-hidden flex flex-col">
      
      {/* GLOBAL STATUS STRIP */}
      <motion.div 
        animate={{ 
          backgroundColor: status === "Operational" ? "#ECFDF5" : status === "Degraded" ? "#FFFBEB" : "#FEF2F2",
          borderLeftColor: status === "Operational" ? "#10B981" : status === "Degraded" ? "#F59E0B" : "#EF4444"
        }}
        className="h-16 shrink-0 flex items-center justify-between px-10 border-l-[6px] shadow-sm relative z-50 transition-colors duration-700"
      >
         <div className="flex items-center gap-6">
            {status === "Operational" ? <CheckCircle2 className="text-emerald-500" /> : status === "Degraded" ? <AlertTriangle className="text-amber-500" /> : <XCircle className="text-red-500" />}
            <h1 className={cn(
              "text-lg font-black uppercase tracking-tight",
              status === "Operational" ? "text-emerald-700" : status === "Degraded" ? "text-amber-700" : "text-red-700"
            )}>
              {status === "Operational" ? "All Systems Operational" : status === "Degraded" ? "Degraded — Latency Alert" : "Outage Detected — HAPI FHIR Service"}
            </h1>
         </div>
         <div className="flex gap-4">
            <div className="bg-white/50 px-4 py-1 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Update: Just Now</div>
            <div className="flex bg-white/50 p-1 rounded-lg border border-sky-100/50">
               {["Operational", "Degraded", "Outage"].map(s => (
                 <button 
                  key={s} onClick={() => setStatus(s)}
                  className={cn("px-2 py-0.5 text-[8px] font-black uppercase rounded transition-all", status === s ? "bg-sky-900 text-white" : "text-slate-400")}
                 >{s}</button>
               ))}
            </div>
         </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden p-10 gap-10">
         
         {/* LEFT GRID: SERVICES */}
         <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-3 gap-6 pb-20">
            <ServiceCard name="WebRTC / Mediasoup" icon={Activity} status="Operational" uptime="99.98%" latency={48} />
            <ServiceCard name="FastAPI Shared Desk" icon={Layers} status="Operational" uptime="99.99%" latency={22} />
            <ServiceCard name="HAPI FHIR Gateway" icon={Database} status={status === "Outage" ? "Outage" : "Operational"} uptime="94.12%" latency={312} />
            <ServiceCard name="Redis / BullMQ" icon={Cpu} status="Operational" uptime="100%" latency={1.2} />
            <ServiceCard name="WhatsApp API" icon={MessageSquare} status={status === "Degraded" ? "Degraded" : "Operational"} uptime="99.8%" latency={84} />
            <ServiceCard name="Bhashini Translation" icon={Globe} status="Operational" uptime="99.95%" latency={145} />
            <ServiceCard name="Claude AI API" icon={Zap} status="Operational" uptime="99.99%" latency={1200} />
            <ServiceCard name="ABHA OAuth Hub" icon={Shield} status="Operational" uptime="99.9%" latency={56} />
            <ServiceCard name="AWS Mumbai Core" icon={Cloud} status="Operational" uptime="100%" latency={2.4} />

            {/* SPECIAL METRICS */}
            <div className="col-span-2 bg-white rounded-[40px] border border-sky-100 shadow-sm p-10 flex flex-col gap-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Regional Performance & Cost Monitor</h3>
                  <div className="flex gap-6">
                     <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Claude Tokens (Quota)</span>
                        <div className="w-32 h-2 bg-slate-50 border border-sky-100 rounded-full overflow-hidden relative">
                           <motion.div initial={{ width: 0 }} animate={{ width: "62%" }} className="h-full bg-primary" />
                           <div className="absolute right-[10%] top-0 bottom-0 w-[1px] bg-red-400" />
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-10">
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">2G Fallback Rate (By Hour)</label>
                     <div className="flex items-end gap-2 h-32 pl-2">
                        {[4, 8, 12, 18, 22, 14, 10, 8, 15, 20, 25, 12].map((v, i) => (
                          <div key={i} className="flex-1 bg-sky-100 rounded-t-lg relative group">
                             <motion.div 
                               initial={{ height: 0 }} animate={{ height: `${v}%` }}
                               className="absolute bottom-0 inset-x-0 bg-primary rounded-t-lg" 
                             />
                             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity">{v}%</div>
                          </div>
                        ))}
                     </div>
                  </div>
                  <IndiaMapPlaceholder />
               </div>
            </div>

            {/* KANBAN */}
            <div className="col-span-1 bg-white rounded-[40px] border border-sky-100 shadow-sm p-8 flex flex-col gap-6">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Incidents</h3>
               <div className="space-y-4">
                  {[
                    { t: "FHIR Handshake Timeout", st: "Open", sv: "Critical", c: "bg-red-50 text-red-600 border-red-200" },
                    { t: "WhatsApp Jitter (Pune)", st: "Investigating", sv: "High", c: "bg-amber-50 text-amber-600 border-amber-200" },
                  ].map((inc, i) => (
                    <div key={i} className={cn("p-4 rounded-2xl border flex flex-col gap-2", inc.c)}>
                       <div className="flex justify-between items-start">
                          <span className="text-[9px] font-black uppercase tracking-widest">{inc.sv} Severity</span>
                          <span className="text-[9px] font-bold opacity-60">14m open</span>
                       </div>
                       <h4 className="text-xs font-black leading-tight">{inc.t}</h4>
                       <div className="flex gap-2 mt-2">
                          <span className="px-1.5 py-0.5 bg-white/50 rounded text-[8px] font-black uppercase tracking-widest">System-Wide</span>
                       </div>
                    </div>
                  ))}
                  <div className="text-center py-4 border-2 border-dashed border-slate-100 rounded-2xl">
                     <span className="text-[9px] font-black text-slate-300 uppercase">Drop ticket here to resolve</span>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: LIVE FEED */}
         <div className="w-[360px] bg-white rounded-[40px] border border-sky-100 shadow-xl shadow-sky-900/5 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-sky-50 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <h3 className="text-[11px] font-black text-sky-900 uppercase tracking-[0.2em]">Monitoring Feed</h3>
               </div>
               <button onClick={() => setIsPaused(!isPaused)} className="text-slate-300 hover:text-primary transition-all">
                  {isPaused ? <Play size={18} /> : <Pause size={18} />}
               </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-4">
               <AnimatePresence mode="popLayout">
                  {alerts.map((a, i) => (
                    <motion.div 
                      key={a.id}
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ type: "spring", damping: 20, stiffness: 200 }}
                      className={cn(
                        "p-4 rounded-2xl border flex flex-col gap-2 relative overflow-hidden",
                        a.type === "ERROR" ? "bg-red-50 border-red-100" : "bg-white border-sky-50 shadow-sm",
                        i === 0 && !isPaused && "ring-2 ring-primary/10"
                      )}
                    >
                       {/* Flash Effect on New */}
                       {i === 0 && !isPaused && (
                         <motion.div 
                           initial={{ opacity: 0.8 }} animate={{ opacity: 0 }}
                           transition={{ duration: 1.5 }}
                           className="absolute inset-0 bg-sky-100 pointer-events-none" 
                         />
                       )}
                       <div className="flex justify-between items-center">
                          <span className="mono text-[10px] text-slate-400 font-bold">{a.time}</span>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                            a.type === "ERROR" ? "bg-red-200 text-red-800" : a.type === "WARN" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
                          )}>{a.type}</span>
                       </div>
                       <p className="text-xs font-bold text-slate-700 leading-relaxed">{a.msg}</p>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>

      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .mono { font-family: 'Roboto Mono', monospace; }
      `}</style>
    </div>
  );
}
