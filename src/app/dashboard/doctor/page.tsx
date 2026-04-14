"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  AlertCircle, 
  Play, 
  FileText,
  TrendingUp,
  MapPin,
  ChevronRight,
  Globe,
  Heart
} from "lucide-react";
import { cn } from "@/utils/cn";
import DoctorSidebar from "@/components/navigation/DoctorSidebar";
import { MOCK_QUEUE, MOCK_DOCTOR_STATS, MOCK_EARNINGS } from "@/lib/doctor-data";
import PatientBriefDrawer from "@/components/dashboard/PatientBriefDrawer";

export default function DoctorDashboardPage() {
  const [activePatientId, setActivePatientId] = useState<string | null>(null);

  const stats = [
    { label: "Today", value: "8 Consultations", icon: Users },
    { label: "Next", value: "in 12 minutes", icon: Clock },
    { label: "This week", value: "34 Patients", icon: TrendingUp },
    { label: "Avg Rating", value: "4.8 ⭐", icon: Star },
  ];

  return (
    <div className="p-8 relative min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
           <div>
              <h1 className="text-2xl font-display font-bold text-[#0A2540]">Good Morning, Dr. Priya</h1>
              <p className="text-slate-500 font-medium">You have 8 consultations scheduled for today.</p>
           </div>
           <div className="flex gap-2">
              <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-bold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> 10:42 AM
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {stats.map((stat, i) => (
             <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#0A2540]">
                   <stat.icon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-lg font-bold text-[#0A2540]">{stat.value}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="flex gap-8 flex-1 overflow-hidden">
          {/* Main Content Area: Today's Queue */}
          <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-display font-bold text-[#0A2540] flex items-center gap-2">
                Today's Queue
                <span className="text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">8 Active</span>
              </h2>
            </div>

            <div className="space-y-4">
              {MOCK_QUEUE.map((item, idx) => (
                <div 
                  key={item.id}
                  className={cn(
                    "bg-white border border-slate-200 p-6 rounded-2xl hover:border-[#00C896]/30 transition-all group relative",
                    item.isUrgent ? "ring-2 ring-red-500/20 border-red-200" : ""
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                       <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center relative flex-shrink-0">
                          <Users className="w-7 h-7 text-slate-400" />
                          <div className={cn(
                            "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                            item.triageLevel === "RED" ? "bg-red-500" : item.triageLevel === "YELLOW" ? "bg-amber-500" : "bg-emerald-500"
                          )} title={item.triageCategory} />
                       </div>
                       <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                             <h3 className="font-bold text-[#0A2540] text-lg">{item.patientName}</h3>
                             <span className="text-xs font-mono font-bold text-slate-400">{item.appointmentTime}</span>
                             {item.isUrgent && (
                               <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest animate-pulse">Urgent</span>
                             )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-700 italic">"{item.symptoms.original}"</p>
                            <p className="text-xs text-slate-400 italic">Translation: {item.symptoms.translated}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col lg:items-end gap-3 shrink-0">
                       <div className="flex items-center gap-4 text-xs font-medium">
                          <span className="text-slate-400">Wait Time: <span className="text-[#0A2540] font-bold">{item.waitTime}</span></span>
                          <span className={cn(
                            "px-3 py-1 rounded-full font-bold",
                            item.triageLevel === "RED" ? "bg-red-50 text-red-600" : item.triageLevel === "YELLOW" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                          )}>{item.triageCategory}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setActivePatientId(item.id)}
                            className="px-4 py-2 rounded-xl text-[#0A2540] font-bold text-sm bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2"
                          >
                             <FileText className="w-4 h-4" /> View Brief
                          </button>
                          <button className="px-4 py-2 rounded-xl bg-[#00C896] text-[#060F1E] font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_4px_10px_rgba(0,200,150,0.2)]">
                             <Play className="w-4 h-4 fill-current" /> Start Consultation
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Patient Brief Drawer integrated into the layout flow */}
          <PatientBriefDrawer 
            activePatientId={activePatientId} 
             onClose={() => setActivePatientId(null)} 
          />
        </div>
    </div>
  );
}
