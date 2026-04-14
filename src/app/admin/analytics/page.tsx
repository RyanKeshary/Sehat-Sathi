"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Line, 
  Doughnut 
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { 
  Building2, 
  TrendingUp, 
  Check, 
  Users, 
  Activity, 
  ChevronRight, 
  ArrowDownRight, 
  Globe,
  Milestone,
  IndianRupee,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

interface KpiProps {
  label: string;
  value: string;
  trend?: string;
  color?: string;
  icon: React.ElementType;
}

// Register ChartJS
if (typeof window !== "undefined") {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
}

// --- Sub-components ---

const CountUp = ({ value, duration = 1.2 }: { value: string | number, duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const target = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;

  useEffect(() => {
    let start = 0;
    const end = target;
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 60);
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [target, duration]);

  const formatted = typeof value === "string" 
    ? value.replace(/[0-9.]+/, displayValue.toLocaleString())
    : displayValue.toLocaleString();

  return <>{formatted}</>;
};

const KpiCard = ({ label, value, trend, color = "text-sky-900", icon: Icon }: KpiProps) => (
  <div className="bg-white p-6 rounded-[32px] border border-sky-100 shadow-sm flex flex-col justify-between h-[160px]">
     <div className="flex justify-between items-start">
        <div className="w-10 h-10 bg-sky-50 rounded-2xl flex items-center justify-center text-primary">
           <Icon size={20} />
        </div>
        {trend && (
           <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 uppercase tracking-widest pl-2">
              {trend} <TrendingUp size={12} />
           </span>
        )}
     </div>
     <div className="mt-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{label}</span>
        <h3 className={cn("text-2xl font-black mono", color)}>
           <CountUp value={value} />
        </h3>
     </div>
  </div>
);

// --- Page Component ---

export default function AnalyticsDashboard() {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setMapLoaded(true), 500);
  }, []);

  const lineData = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Consultations',
        data: [1200, 1500, 2100, 2400, 3100, 3800, 4200, 4800, 5600, 6200, 7100, 8450],
        borderColor: '#0891B2',
        backgroundColor: 'rgba(8, 145, 178, 0.05)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'MRR (₹)',
        data: [0.8, 1.2, 1.5, 1.8, 2.1, 2.4, 2.8, 3.1, 3.4, 3.6, 3.9, 4.2],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      }
    ]
  };

  const donutData = {
    labels: ['Diabetes', 'Hypertension', 'Respiratory', 'General OPD'],
    datasets: [{
      data: [38, 28, 18, 16],
      backgroundColor: ['#0891B2', '#10B981', '#F59E0B', '#64748B'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="min-h-screen bg-[#F8FBFC] font-inter p-10 flex flex-col gap-10 max-w-[1440px] mx-auto w-full pb-32">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-black text-sky-900 leading-none mb-2">Analytics & BI Dashboard</h1>
            <div className="flex items-center gap-2">
               <Target size={14} className="text-primary" />
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Sehat Sathi Series A Tracker</span>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="px-6 py-2.5 bg-white border border-sky-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-900 transition-all flex items-center gap-2 shadow-sm">
               Download Report <Globe size={14} />
            </button>
            <button className="px-6 py-2.5 bg-sky-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-900/20 hover:scale-[1.02] active:scale-95 transition-all">
               Custom Date Range
            </button>
         </div>
      </div>

      {/* TOP KPI ROW */}
      <div className="grid grid-cols-5 gap-6">
         <KpiCard label="Total Consultations" value="28450" trend="+12%" icon={Activity} />
         <KpiCard label="Active Patients" value="8230" trend="+8%" icon={Users} />
         <KpiCard label="Platform MRR" value="₹4.2L" color="text-[#A68F42]" icon={IndianRupee} />
         <KpiCard label="Annual Churn" value="2.1%" trend="↓ 1.2%" icon={ArrowDownRight} color="text-red-500" />
         <div className="bg-white p-6 rounded-[32px] border border-sky-100 shadow-sm flex flex-col justify-between h-[160px]">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Follow-Up Adherence</span>
            <div className="flex justify-between items-end">
               <h3 className="text-2xl font-black text-sky-900 mono">76%</h3>
               <div className="relative w-14 h-14 flex items-center justify-center -mb-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
                     <motion.circle 
                       cx="50" cy="50" r="40" fill="transparent" stroke="#0891B2" strokeWidth="12" 
                       strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.76)}
                       initial={{ strokeDashoffset: 251.2 }}
                       animate={{ strokeDashoffset: 251.2 * (1 - 0.76) }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                     />
                  </svg>
                  <span className="absolute text-[10px] font-black text-primary">76%</span>
               </div>
            </div>
         </div>
      </div>

      {/* CHART ROW */}
      <div className="grid grid-cols-12 gap-8">
         <div className="col-span-7 bg-white rounded-[40px] border border-sky-100 shadow-xl shadow-sky-900/5 p-10 h-[500px] flex flex-col">
            <h3 className="text-sm font-black text-sky-900 uppercase tracking-widest mb-8">Consultations & MRR — 12 Month Trend</h3>
            <div className="flex-1">
               <Line 
                 data={lineData} 
                 options={{
                   responsive: true,
                   maintainAspectRatio: false,
                   plugins: { legend: { display: false } },
                   scales: {
                     y: { grid: { color: '#F1F5F9' }, ticks: { font: { weight: 'bold', size: 10 } } },
                     y1: { position: 'right', grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } },
                     x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } }
                   }
                 }} 
               />
            </div>
            <div className="flex gap-6 mt-8">
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary rounded-full" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultations</span></div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#D4AF37] rounded-full" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform MRR</span></div>
            </div>
         </div>

         <div className="col-span-5 bg-white rounded-[40px] border border-sky-100 shadow-xl shadow-sky-900/5 p-10 flex flex-col overflow-hidden relative">
            <h3 className="text-sm font-black text-sky-900 uppercase tracking-widest mb-8">Active Clinics by State</h3>
            <div className="flex-1 bg-sky-50 rounded-[32px] p-6 flex items-center justify-center relative overflow-hidden">
               <AnimatePresence>
                  {mapLoaded && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                      className="relative w-full h-[300px] flex flex-col items-center justify-center gap-4"
                    >
                       <Globe size={120} className="text-primary/20" />
                       <div className="text-center">
                          <p className="text-xs font-black text-sky-900">Maharashtra — 28 Clinics</p>
                          <p className="text-[10px] font-bold text-slate-400">Total Patients: 52,430</p>
                       </div>
                       {[30, 45, 60, 20].map((left, i) => (
                         <motion.div 
                           key={i}
                           initial={{ scale: 0, opacity: 0 }}
                           animate={{ scale: 1, opacity: 0.3 }}
                           transition={{ delay: i * 0.1, type: "spring" }}
                           className="absolute w-8 h-8 bg-primary rounded-full blur-xl"
                           style={{ left: `${20 + i * 15}%`, top: `${30 + i * 10}%` }}
                         />
                       ))}
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
            <div className="mt-8 flex justify-between items-center">
               <div className="flex gap-2">
                  <div className="w-3 h-3 bg-sky-50 rounded-sm" />
                  <div className="w-3 h-3 bg-sky-200 rounded-sm" />
                  <div className="w-3 h-3 bg-primary rounded-sm shadow-md" />
                  <div className="w-3 h-3 bg-sky-900 rounded-sm" />
               </div>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Facility Density Heatmap</span>
            </div>
         </div>
      </div>

      {/* BREAKDOWN ROW */}
      <div className="grid grid-cols-3 gap-8">
         <div className="bg-white p-10 rounded-[40px] border border-sky-100 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">Disease Verticals</h3>
            <div className="flex-1 flex flex-col items-center gap-8">
               <div className="w-48 h-48">
                  <Doughnut 
                    data={donutData} 
                    options={{ 
                      cutout: '75%', 
                      plugins: { legend: { display: false } },
                      maintainAspectRatio: false
                    }} 
                  />
               </div>
               <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full">
                  {donutData.labels.map((l, i) => (
                    <div key={l} className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: donutData.datasets[0].backgroundColor[i] }} />
                       <span className="text-[10px] font-bold text-slate-500 uppercase leading-none">{l} ({donutData.datasets[0].data[i]}%)</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[40px] border border-sky-100 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">Consultation Mode</h3>
            <div className="space-y-12 flex-1 flex flex-col justify-center">
               <div className="h-10 w-full bg-slate-50 rounded-2xl flex overflow-hidden border border-slate-100">
                  <div className="h-full bg-primary flex items-center justify-center text-[10px] font-black text-white" style={{ width: '62%' }}>62% Video</div>
                  <div className="h-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-white" style={{ width: '24%' }}>24% Voice</div>
                  <div className="h-full bg-slate-400 flex items-center justify-center text-[10px] font-black text-white" style={{ width: '14%' }}>14% IVR</div>
               </div>
               <div className="space-y-4">
                  {[
                    { l: "Full-Fidelity Video", v: "62%", c: "bg-primary" },
                    { l: "AI Voice Bridge", v: "24%", c: "bg-amber-500" },
                    { l: "Asynchronous IVR", v: "14%", c: "bg-slate-400" },
                  ].map(item => (
                    <div key={item.l} className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <div className={cn("w-2 h-2 rounded-full", item.c)} />
                          <span className="text-[10px] font-black text-sky-900 uppercase tracking-widest">{item.l}</span>
                       </div>
                       <span className="text-xs font-black text-primary mono">{item.v}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[40px] border border-sky-100 shadow-sm flex flex-col h-[400px]">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">Intake Language</h3>
           <div className="flex-1 flex items-end gap-3 h-full pb-6">
              {[
                { l: "Hindi", v: 100, c: "bg-primary" },
                { l: "Marathi", v: 70, c: "bg-primary/40" },
                { l: "Gujarati", v: 45, c: "bg-primary/20" },
                { l: "Bengali", v: 30, c: "bg-primary/10" },
                { l: "Telugu", v: 20, c: "bg-primary/10" },
                { l: "English", v: 15, c: "bg-primary/10" },
              ].map(item => (
                <div key={item.l} className="flex-1 flex flex-col items-center gap-4 h-full justify-end">
                   <motion.div 
                     initial={{ height: 0 }} 
                     animate={{ height: `${item.v}%` }} 
                     className={cn("w-full rounded-t-xl relative group", item.c)}
                   >
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{item.l}</div>
                   </motion.div>
                </div>
              ))}
           </div>
         </div>
      </div>

      {/* SERIES A TRACKER */}
      <div className="bg-white p-10 rounded-[40px] border-t-4 border-t-primary border-sky-100 shadow-xl shadow-sky-900/10">
         <div className="flex justify-between items-center mb-16">
            <h3 className="text-lg font-black text-sky-900 tracking-tight">Institutional Funding Milestone Tracker</h3>
            <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-1 rounded-full">Road to Series A</span>
         </div>

         <div className="relative">
            {/* Horizontal Line */}
            <div className="absolute top-[32px] left-8 right-8 h-1 bg-slate-100 z-0">
               <motion.div initial={{ width: 0 }} animate={{ width: "80%" }} className="h-full bg-primary" />
            </div>

            <div className="flex justify-between relative z-10">
               {[
                 { l: "50+ Clinics", s: "94 Clinics", d: "Completed", i: Building2, c: true },
                 { l: "3 States", s: "6 States", d: "Completed", i: Globe, c: true },
                 { l: "ABDM Gold", s: "84% Complete", d: "In Progress", i: Milestone, p: true },
                 { l: "₹5L MRR", s: "₹4.2L / ₹5L", d: "Pending", i: Target },
                 { l: "Series A Round", s: "Q4 2026", d: "Future", i: Milestone },
               ].map((node, i) => (
                 <div key={i} className="flex flex-col items-center text-center w-48">
                    <div className={cn(
                      "w-16 h-16 rounded-[24px] flex items-center justify-center transition-all",
                      node.c ? "bg-[#D4AF37] text-white shadow-xl shadow-[#D4AF37]/20" : 
                      node.p ? "bg-primary text-white shadow-xl shadow-primary/40 animate-pulse-gentle" : 
                      "bg-white border-2 border-slate-100 text-slate-300"
                    )}>
                       {node.c ? <Check size={24} /> : <node.i size={24} />}
                    </div>
                    <div className="mt-6">
                       <h4 className={cn("text-xs font-black uppercase tracking-widest", node.c || node.p ? "text-sky-900" : "text-slate-400")}>{node.l}</h4>
                       <p className={cn("text-[10px] font-bold mt-1", node.p ? "text-primary" : "text-slate-400")}>{node.s}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="mt-16 flex justify-between items-center pt-8 border-t border-slate-50">
            <div className="flex gap-4">
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#D4AF37]" /><span className="text-[10px] font-black text-slate-400 uppercase">Achieved</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[10px] font-black text-slate-400 uppercase">Focus Milestone</span></div>
            </div>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-all">
               View Full Strategic Roadmap <ChevronRight size={14} />
            </button>
         </div>
      </div>

      <style jsx global>{`
        .mono { font-family: 'Roboto Mono', monospace; }
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
