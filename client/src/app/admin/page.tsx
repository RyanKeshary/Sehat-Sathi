"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Activity, 
  Database, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Map
} from "lucide-react";
import { cn } from "@/utils/cn";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

const MOCK_PLATFORM_DATA = [
  { name: "Mon", users: 1200, consults: 400 },
  { name: "Tue", users: 1500, consults: 550 },
  { name: "Wed", users: 1400, consults: 480 },
  { name: "Thu", users: 1800, consults: 700 },
  { name: "Fri", users: 2100, consults: 850 },
  { name: "Sat", users: 2400, consults: 900 },
  { name: "Sun", users: 2600, consults: 1100 },
];

const STATS = [
  { label: "Total Beneficiaries", value: "482,931", growth: "+12.5%", icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Clinical Consultations", value: "24,802", growth: "+8.2%", icon: Activity, color: "bg-emerald-50 text-emerald-600" },
  { label: "ABDM Linked Records", value: "312,109", growth: "+15.1%", icon: Database, color: "bg-purple-50 text-purple-600" },
  { label: "System Uptime", value: "99.98%", growth: "Stable", icon: Clock, color: "bg-amber-50 text-amber-600" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Platform Status Banner */}
      <div className="bg-[#0A2540] rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C896] rounded-full blur-[120px] opacity-20 -mr-32 -mt-32" />
         <div className="relative z-10">
            <h2 className="text-3xl font-display font-black mb-2">Platform Health: Robust</h2>
            <p className="text-slate-400 font-medium">Regional clusters in North and Central India are operating at peak capacity.</p>
         </div>
         <div className="flex gap-4 relative z-10 shrink-0">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl text-center">
               <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Active Now</p>
               <p className="text-2xl font-black">4,209</p>
            </div>
            <div className="bg-[#00C896] px-6 py-4 rounded-2xl text-center text-[#060F1E]">
               <p className="text-[10px] font-black uppercase tracking-widest mb-1">Server Load</p>
               <p className="text-2xl font-black">12%</p>
            </div>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {STATS.map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm"
           >
              <div className="flex justify-between items-start mb-6">
                 <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                 </div>
                 <div className={cn(
                   "text-xs font-bold px-2 py-1 rounded-lg",
                   stat.growth.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
                 )}>
                    {stat.growth}
                 </div>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
           </motion.div>
         ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Traffic Chart */}
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold text-slate-900">Clinical Traffic & Beneficiary Growth</h3>
               <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
               </select>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_PLATFORM_DATA}>
                     <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorConsults" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#00C896" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#00C896" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ fontWeight: 'bold' }}
                     />
                     <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                     <Area type="monotone" dataKey="consults" stroke="#00C896" fillOpacity={1} fill="url(#colorConsults)" strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Alerts & Critical Actions */}
         <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
               <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6">Pending Verifications</h3>
               <div className="space-y-4">
                  {[
                    { name: "Dr. Sandeep K.", specialty: "Neurologist", time: "2h ago" },
                    { name: "Dr. Meera Patel", specialty: "GP", time: "5h ago" },
                    { name: "Dr. Harish Singh", specialty: "Oncologist", time: "1d ago" },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#1E293B] text-white rounded-lg flex items-center justify-center font-bold text-xs">
                             {doc.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold">{doc.specialty}</p>
                          </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#00C896] transition-colors" />
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                  View All Registry
               </button>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-[2rem] p-6 shadow-sm">
               <div className="flex items-center gap-3 text-red-600 mb-4">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold">Security Alert</h3>
               </div>
               <p className="text-xs text-red-700 font-medium leading-relaxed">
                  3 failed login attempts detected on Cluster-A (UP Region). Secondary authentication protocols active.
               </p>
               <button className="mt-4 text-[10px] font-black uppercase text-red-600 tracking-widest hover:underline">
                  Investigate Cluster
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
