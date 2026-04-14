"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Settings2,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/utils/cn";
import DoctorSidebar from "@/components/navigation/DoctorSidebar";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type SlotStatus = "CONFIRMED" | "AVAILABLE" | "BLOCKED";

export default function DoctorSchedulePage() {
  const [view, setView] = useState<"Day" | "Week" | "Month">("Week");

  return (
    <div className="p-8 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-8 shrink-0">
           <div>
              <h1 className="text-2xl font-display font-bold text-[#0A2540]">Schedule Management</h1>
              <p className="text-slate-500 font-medium">Manage your clinical availability and upcoming appointments.</p>
           </div>
           <div className="flex gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-1 flex">
                 {["Day", "Week", "Month"].map((v) => (
                   <button 
                     key={v}
                     onClick={() => setView(v as any)}
                     className={cn(
                       "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                       view === v ? "bg-[#0A2540] text-white shadow-md" : "text-slate-500 hover:text-slate-800"
                     )}
                   >
                     {v}
                   </button>
                 ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#00C896] text-[#060F1E] rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#00C896]/20">
                <Plus className="w-4 h-4" /> Add Slot
              </button>
           </div>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] shadow-sm flex flex-col overflow-hidden">
           {/* Calendar Header Row */}
           <div className="grid grid-cols-8 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="p-4 border-r border-slate-100 flex items-center justify-center">
                 <Settings2 className="w-5 h-5 text-slate-400" />
              </div>
              {DAYS.map((day, i) => (
                <div key={day} className="p-4 text-center border-r border-slate-100 last:border-0 relative">
                   <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{day}</div>
                   <div className={cn(
                     "text-lg font-bold text-[#0A2540]",
                     i === 1 ? "text-indigo-600" : "" // Today highlight (Tue)
                   )}>
                      {13 + i}
                   </div>
                   {i === 1 && (
                     <div className="absolute bottom-1 left-1/2 -translate-x-1-2 w-1 h-1 bg-indigo-600 rounded-full" />
                   )}
                </div>
              ))}
           </div>

           {/* Calendar Grid Body */}
           <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              <div className="grid grid-cols-8 relative min-h-full">
                 {/* Time Column */}
                 <div className="border-r border-slate-100 bg-slate-50/30">
                    {HOURS.map((hour) => (
                      <div key={hour} className="h-20 border-b border-slate-100/50 flex items-start justify-center pt-2">
                         <span className="text-[10px] font-black text-slate-400">
                           {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                         </span>
                      </div>
                    ))}
                 </div>

                 {/* Day Columns */}
                 {DAYS.map((day, colIdx) => (
                    <div key={day} className="border-r border-slate-100 last:border-0 relative h-full">
                       {HOURS.map((hour) => (
                         <div key={hour} className="h-20 border-b border-slate-100/30 group cursor-pointer hover:bg-slate-50/50 transition-colors" />
                       ))}

                       {/* Mock Appointments */}
                       {colIdx === 1 && ( // Today (Tuesday)
                          <>
                             <div className="absolute top-[80px] left-1 right-1 h-[76px] bg-[#0A2540] rounded-xl p-2 shadow-lg border-l-4 border-l-indigo-400 z-10 group cursor-pointer">
                                <div className="text-[10px] font-black text-white/40 uppercase mb-0.5">09:00 - 10:00</div>
                                <div className="text-[11px] font-bold text-white leading-tight">Consult: Rahul K.</div>
                                <div className="mt-1 flex gap-1">
                                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                </div>
                             </div>
                             <div className="absolute top-[320px] left-1 right-1 h-[156px] bg-[#00C896]/10 border border-[#00C896]/30 border-dashed rounded-xl p-3 z-10">
                                <div className="text-[10px] font-black text-[#00C896] uppercase mb-1">AVAILABLE</div>
                                <div className="text-xs font-bold text-[#00C896]/70 italic">Click to block time</div>
                             </div>
                          </>
                       )}

                       {colIdx === 3 && ( // Thursday
                          <div className="absolute top-[160px] left-1 right-1 h-[76px] bg-slate-100 border border-slate-200 rounded-xl p-2 opacity-60">
                             <div className="text-[10px] font-black text-slate-400 uppercase mb-0.5">10:00 - 11:00</div>
                             <div className="text-[11px] font-bold text-slate-400">Personal Block</div>
                          </div>
                       )}
                    </div>
                 ))}
                 
                 {/* Current Time Indicator Line */}
                 <div className="absolute w-full top-[140px] border-t-2 border-indigo-500 z-20 pointer-events-none flex items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 -ml-1 border-2 border-white" />
                 </div>
              </div>
           </div>
        </div>

        {/* Schedule Controls Form Area */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 shrink-0">
           <div className="lg:col-span-2 bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1">
                 <h4 className="text-lg font-display font-bold text-indigo-900 mb-2">Recurring Availability</h4>
                 <p className="text-sm text-indigo-700/70 font-medium">Set your standard clinical hours. Changes apply for next week onwards.</p>
              </div>
              <div className="flex gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 text-center">Notice</label>
                    <select className="bg-white border border-indigo-200 rounded-xl px-4 py-2 font-bold text-sm text-indigo-600 outline-none">
                       <option>2 Hours</option>
                       <option>4 Hours</option>
                       <option>Instant</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 text-center">Max Daily</label>
                    <input type="number" defaultValue={20} className="w-16 bg-white border border-indigo-200 rounded-xl px-2 py-2 font-bold text-sm text-indigo-600 text-center outline-none" />
                 </div>
              </div>
              <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                 Save Schedule
              </button>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="font-bold text-[#0A2540] text-sm leading-tight">Vacation Mode</h4>
                 <p className="text-xs text-slate-500 mt-1">Block all appointments for selected vacation dates.</p>
                 <button className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-2 hover:underline">Activate Mode</button>
              </div>
           </div>
        </div>
    </div>
  );
}
