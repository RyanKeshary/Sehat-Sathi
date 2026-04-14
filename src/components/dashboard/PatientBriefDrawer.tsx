"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Activity, 
  AlertTriangle, 
  FileText, 
  LineChart as LineChartIcon,
  Stethoscope,
  Pill,
  ShieldCheck,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { cn } from "@/utils/cn";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const MOCK_VITALS = [
  { date: "10:00", temp: 101.2 },
  { date: "10:15", temp: 102.1 },
  { date: "10:30", temp: 101.8 },
  { date: "10:45", temp: 101.5 },
];

export default function PatientBriefDrawer({ 
  activePatientId, 
  onClose 
}: { 
  activePatientId: string | null, 
  onClose: () => void 
}) {
  return (
    <AnimatePresence>
      {activePatientId && (
        <motion.div
           initial={{ width: 0, opacity: 0 }}
           animate={{ width: 440, opacity: 1 }}
           exit={{ width: 0, opacity: 0 }}
           className="h-full bg-white border-l border-slate-200 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] shrink-0 flex flex-col z-10 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-[#0A2540] flex items-center justify-center text-white">
                 <Stethoscope className="w-5 h-5" />
               </div>
               <div>
                  <h2 className="font-display font-bold text-[#0A2540]">Clinical Brief</h2>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Sehat AI Augmented</p>
               </div>
             </div>
             <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
             >
               <X className="w-5 h-5" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
             {/* Chief Complaint */}
             <section>
               <div className="flex items-center gap-2 mb-3">
                 <FileText className="w-4 h-4 text-indigo-500" />
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Chief Complaint</h3>
               </div>
               <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <p className="text-sm font-medium text-slate-700 italic mb-2">"छाती में तेज दर्द हो रहा है और सांस फूल रही है।"</p>
                  <p className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded inline-block">AI Translation: Severe chest pain and breathlessness.</p>
               </div>
             </section>

             {/* AI Analysis Cards */}
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-red-600 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase">Triage</span>
                  </div>
                  <div className="text-lg font-bold text-red-700">RED</div>
                  <p className="text-[10px] text-red-600/70 font-medium">Immediate cardiac evaluation required.</p>
               </div>
               <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase">Confidence</span>
                  </div>
                  <div className="text-lg font-bold text-indigo-700">92%</div>
                  <p className="text-[10px] text-indigo-600/70 font-medium">Based on 14 clinical markers.</p>
               </div>
             </div>

             {/* Vitals Trend */}
             <section>
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                   <TrendingUp className="w-4 h-4 text-[#00C896]" />
                   <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Temperature Trend</h3>
                 </div>
                 <div className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Spike detected
                 </div>
               </div>
               <div className="h-40 w-full bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_VITALS}>
                      <XAxis dataKey="date" hide />
                      <YAxis domain={['auto', 'auto']} hide />
                      <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="temp" 
                        stroke="#EF4444" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
               </div>
             </section>

             {/* Medications & Allergies */}
             <section className="space-y-4">
                <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Pill className="w-3 h-3" /> Current Medications
                   </h4>
                   <div className="flex flex-wrap gap-2">
                      {["Amlodipine 5mg", "Atorvastatin 10mg"].map(med => (
                        <span key={med} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">{med}</span>
                      ))}
                   </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <AlertTriangle className="w-3 h-3" /> Allergies
                   </h4>
                   <div className="flex flex-wrap gap-2">
                      <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">Sulfa Drugs</span>
                      <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">Peanuts</span>
                   </div>
                </div>
             </section>

             {/* Records History Summary */}
             <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" /> ABHA History
                  </h3>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Full Profile</button>
                </div>
                <div className="space-y-2">
                  {[
                    { title: "Lipid Profile", date: "Jan 12", type: "Lab" },
                    { title: "ECG Summary", date: "Dec 05", type: "Test" }
                  ].map((rec, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                             <FileText className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                             <div className="text-xs font-bold text-slate-800">{rec.title}</div>
                             <div className="text-[10px] text-slate-400">{rec.type}</div>
                          </div>
                       </div>
                       <div className="text-[10px] font-mono font-bold text-slate-400">{rec.date}</div>
                    </div>
                  ))}
                </div>
             </section>
          </div>

          {/* Action Bottom */}
          <div className="p-6 border-t border-slate-100 shrink-0 bg-slate-50/30">
             <button className="w-full py-4 rounded-xl bg-[#00C896] text-[#060F1E] font-bold shadow-[0_4px_15px_rgba(0,200,150,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
               Accept & Start Call
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
