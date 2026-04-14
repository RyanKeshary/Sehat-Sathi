"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  MapPin, 
  Globe, 
  Users, 
  Share2, 
  TrendingUp,
  PieChart as PieChartIcon,
  Smile
} from "lucide-react";
import { cn } from "@/utils/cn";
import DoctorSidebar from "@/components/navigation/DoctorSidebar";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const IMPACT_STORY = {
  month: "April 2026",
  patients: 34,
  districts: 8,
  rural: 18,
  emergency: 3,
  impactScore: 34
};

const RURAL_DATA = [
  { name: "Rural", value: 18, color: "#00C896" },
  { name: "Urban", value: 16, color: "#3B82F6" },
];

export default function DoctorImpactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <DoctorSidebar />

      <main className="flex-1 ml-64 p-8 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-8">
           <div>
              <h1 className="text-2xl font-display font-bold text-[#0A2540]">Community Impact</h1>
              <p className="text-slate-500 font-medium">Tracking your service across rural India.</p>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
             <Share2 className="w-4 h-4" /> Share My Impact
           </button>
        </div>

        {/* Impact Story Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A1A2F] rounded-[2rem] p-8 text-white relative overflow-hidden mb-8 shadow-2xl"
        >
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#00C896]/20 to-[#3B82F6]/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
           
           <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                       <Heart className="w-6 h-6 text-[#00C896] fill-[#00C896]" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#00C896]">Your Impact Story — {IMPACT_STORY.month}</span>
                 </div>
                 <h2 className="text-4xl font-display font-black mb-6 leading-tight">
                   This month, your expertise reached <span className="text-[#00C896]">{IMPACT_STORY.patients} patients</span> across {IMPACT_STORY.districts} districts.
                 </h2>
                 <p className="text-xl text-white/70 font-medium leading-relaxed mb-8 max-w-2xl">
                    By providing specialized care to 18 patients in remote areas of Punjab and Rajasthan, you've helped bridge the urban-rural healthcare gap. Your timely intervention in <span className="text-red-400 font-bold">3 emergency cases</span> prevented critical complications.
                 </p>
                 <div className="flex gap-4">
                    <div className="bg-white/10 border border-white/10 rounded-2xl px-6 py-4">
                       <div className="text-3xl font-black text-white">{IMPACT_STORY.impactScore}</div>
                       <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Lives Impacted</div>
                    </div>
                    <div className="bg-white/10 border border-white/10 rounded-2xl px-6 py-4">
                       <div className="text-3xl font-black text-[#00C896]">52%</div>
                       <div className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Rural Service</div>
                    </div>
                 </div>
              </div>
              <div className="hidden lg:block w-72 h-72 rounded-[3.5rem] border-8 border-white/5 overflow-hidden scale-110 rotate-3 shadow-2xl">
                 <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Smile className="w-32 h-32 text-white/20" />
                 </div>
              </div>
           </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Rural vs Urban Chart */}
           <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-display font-bold text-lg text-[#0A2540] flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-[#00C896]" />
                    Rural Service Index
                 </h3>
                 <span className="text-xs font-bold text-[#00C896] bg-emerald-50 px-2 py-1 rounded-full">+12% vs Avg</span>
              </div>
              <div className="h-64 w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                          data={RURAL_DATA} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={60} 
                          outerRadius={80} 
                          paddingAngle={8} 
                          dataKey="value"
                       >
                          {RURAL_DATA.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-3xl font-black text-[#0A2540]">52%</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Rural</div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Rural</div>
                    <div className="text-xl font-black text-[#00C896]">18</div>
                 </div>
                 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Urban</div>
                    <div className="text-xl font-black text-[#3B82F6]">16</div>
                 </div>
              </div>
           </div>

           {/* Reach Visualization Placeholder */}
           <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-display font-bold text-lg text-[#0A2540] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Geographic Reach
                 </h3>
                 <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                       <span className="w-2 h-2 rounded-full bg-[#00C896] animate-ping" /> Active Consults
                    </span>
                 </div>
              </div>
              <div className="flex-1 rounded-2xl bg-slate-100 relative overflow-hidden flex items-center justify-center group">
                 {/* Map Placeholder with visual polish */}
                 <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                 <Globe className="w-32 h-32 text-slate-300 animate-[spin_20s_linear_infinite]" />
                 <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <p className="text-sm font-bold text-slate-600">Interactive India Reach Map <br/><span className="text-xs font-medium text-slate-400">(Available in Full Production)</span></p>
                 </div>
                 
                 {/* Glowing patient dots */}
                 <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-[#00C896] rounded-full blur-[4px] animate-pulse" />
                 <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-[#3B82F6] rounded-full blur-[3px] animate-pulse delay-700" />
                 <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-red-400 rounded-full blur-[3px] animate-pulse delay-1000" />
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                 {["Punjab", "Rajasthan", "Bihar", "Odisha", "Gujarat"].map(loc => (
                   <span key={loc} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">#{loc}</span>
                 ))}
                 <span className="px-3 py-1 bg-indigo-50 rounded-lg text-xs font-bold text-indigo-600">+3 more</span>
              </div>
           </div>
        </div>

        {/* Condition Cloud and Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
           <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="font-display font-bold text-lg text-[#0A2540] mb-6">Languages Served</h3>
              <div className="space-y-4">
                 {[
                   { lang: "Hindi", count: 24, percent: 70 },
                   { lang: "Punjabi", count: 6, percent: 18 },
                   { lang: "English", count: 4, percent: 12 },
                 ].map(l => (
                   <div key={l.lang}>
                      <div className="flex justify-between text-sm font-bold mb-1">
                         <span className="text-slate-700">{l.lang}</span>
                         <span className="text-slate-400">{l.count} patients</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${l.percent}%` }}
                           className="h-full bg-indigo-500 rounded-full" 
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="font-display font-bold text-lg text-[#0A2540] mb-6">Conditions Specialized</h3>
              <div className="flex flex-wrap gap-3">
                 {[
                   { label: "Viral Fever", size: "text-xl", color: "bg-orange-50 text-orange-600" },
                   { label: "Cardiac Review", size: "text-sm", color: "bg-red-50 text-red-600" },
                   { label: "Hypertension", size: "text-lg", color: "bg-blue-50 text-blue-600" },
                   { label: "Pediatrics", size: "text-sm", color: "bg-emerald-50 text-emerald-600" },
                   { label: "Dermatology", size: "text-base", color: "bg-indigo-50 text-indigo-600" },
                 ].map(tag => (
                   <span key={tag.label} className={cn("px-4 py-2 rounded-2xl font-black transition-transform hover:scale-105 cursor-default", tag.size, tag.color)}>
                     {tag.label}
                   </span>
                 ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
