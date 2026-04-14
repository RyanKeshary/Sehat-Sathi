"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Share2, CheckCircle2, ShieldCheck, Download, Activity, Sun, Moon, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/utils/cn";
import { RecordEntry } from "@/lib/records-data";

export default function RecordDetailViewer({ record }: { record: RecordEntry }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Viewer Header */}
      <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between shrink-0">
         <div>
            <h2 className="text-xl font-bold font-display">{record.title}</h2>
            <div className="text-white/60 text-sm mt-1">
              Recorded on {record.date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Export PDF">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 bg-[#00C896] hover:bg-[#00C896]/90 text-[#060F1E] rounded-lg transition-colors flex items-center gap-2 font-bold text-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 p-6 relative">
         {record.type === "PRESCRIPTION" && <PrescriptionView data={record.data} doctorName={record.doctorName} date={record.date} />}
         {record.type === "LAB_REPORT" && <LabReportView data={record.data} doctorName={record.doctorName} />}
         {record.type === "VITALS" && <VitalsView data={record.data} />}
         {record.type === "VACCINATION" && <VaccinationView data={record.data} />}
      </div>
    </motion.div>
  );
}

// ------ Sub Views ------

function PrescriptionView({ data, doctorName, date }: { data: any, doctorName: string, date: Date }) {
  const [filled, setFilled] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
         {/* Simple Medical Cross Watermark */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
            <div className="w-64 h-24 bg-[#0A2540] relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-64 bg-[#0A2540] " />
            </div>
         </div>

         {/* Rx Header */}
         <div className="border-b-2 border-slate-100 pb-6 mb-6 flex justify-between items-start relative z-10">
            <div>
              <h3 className="font-display font-bold text-[#0A2540] text-2xl">{doctorName}</h3>
              <p className="text-slate-500 font-medium text-sm">MBBS, MD (General Medicine)</p>
              <p className="text-slate-400 text-xs mt-1">{data.hospital}</p>
            </div>
            <div className="text-right">
              {data.abdmLinked && (
                 <div className="inline-flex items-center gap-1 bg-[#00C896]/10 text-[#00C896] px-2 py-1 rounded text-xs font-bold mb-2">
                   <ShieldCheck className="w-3 h-3" /> ABDM Verified
                 </div>
              )}
              <div className="text-slate-500 font-mono text-sm">{date.toLocaleDateString("en-GB")}</div>
            </div>
         </div>

         <div className="text-5xl font-serif text-slate-200 italic mb-6">Rx</div>

         {/* Medications Table */}
         <div className="space-y-6 relative z-10">
            {data.medications.map((med: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                 <div className="flex justify-between items-center mb-3">
                   <div className="font-bold text-slate-800 text-lg">{med.name}</div>
                   <div className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs font-bold font-mono">{med.duration}</div>
                 </div>
                 
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest">Dose</span>
                      <span className="text-sm font-semibold">{med.dose}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest">Frequency</span>
                      <div className="flex items-center gap-1 mt-0.5 text-amber-500">
                         {med.freq === "BD" && <><Sun className="w-4 h-4"/><Moon className="w-4 h-4"/></>}
                         {med.freq === "OD" && <Sun className="w-4 h-4"/>}
                         {med.freq === "SOS" && <span className="text-sm font-semibold text-rose-500">As Needed</span>}
                         {!["BD","OD","SOS"].includes(med.freq) && <span className="text-sm font-semibold">{med.freq}</span>}
                      </div>
                    </div>
                 </div>
                 
                 <div className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-200">
                    <span className="font-bold">Instructions:</span> {med.instructions}
                 </div>
              </div>
            ))}
         </div>

         {/* Footer */}
         <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-end">
            <div className="text-xs text-slate-400 italic">This prescription is valid for {data.validDays} days.</div>
            <div className="text-center">
               <div className="font-title text-2xl text-blue-900/60 -rotate-6 mb-1 opacity-60">Dr. P. Sharma</div>
               <div className="w-32 h-px bg-slate-300 mx-auto" />
               <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Digital Signature</div>
            </div>
         </div>
      </div>

      <div className="mt-6 flex justify-end">
         <button 
           onClick={() => setFilled(!filled)}
           className={cn(
             "px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2",
             filled ? "bg-[#00C896] text-white shadow-lg" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
           )}
         >
           <CheckCircle2 className="w-5 h-5" /> Mark as Filled
         </button>
      </div>
    </div>
  );
}

function LabReportView({ data, doctorName }: { data: any, doctorName: string }) {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
         <div className="bg-slate-100 border-b border-slate-200 p-3 flex justify-between items-center shrink-0">
           <div className="font-mono text-xs font-bold text-slate-500">Report ID: {data.reportId}</div>
           <div className="text-xs font-bold text-slate-600">{doctorName}</div>
         </div>
         
         {/* Mock Embedded Viewer */}
         <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 p-8 shadow-sm">
               <h3 className="text-center font-display font-bold text-2xl mb-8">LABORATORY REPORT</h3>
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold text-slate-600">Test Parameter</th>
                      <th className="py-3 px-4 font-bold text-slate-600">Observed Value</th>
                      <th className="py-3 px-4 font-bold text-slate-600">Reference Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.highlights.map((item: any, i: number) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="py-4 px-4 font-medium text-slate-800">{item.parameter}</td>
                        <td className="py-4 px-4">
                           <span className={cn(
                             "px-2 py-1 rounded font-bold",
                             item.isAbnormal ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                           )}>
                             {item.value}
                           </span>
                           {item.isAbnormal && <AlertTriangle className="w-4 h-4 text-red-500 inline-block ml-2 mb-0.5" />}
                        </td>
                        <td className="py-4 px-4 text-slate-500">{item.ref}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
               
               <div className="mt-12 text-xs text-slate-400 text-center italic">
                 End of report. Digitally verified by NABL accredited lab.
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function VitalsView({ data }: { data: any }) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
       <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
             <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
               <Activity className="w-5 h-5 text-[#3B82F6]" /> Blood Pressure Trend
             </h3>
             <div className="flex gap-4 text-sm font-medium">
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#3B82F6] rounded-full"/> Systolic</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00C896] rounded-full"/> Diastolic</div>
             </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                  cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3'}}
                />
                <Line type="monotone" dataKey="sys" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="dia" stroke="#00C896" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
}

function VaccinationView({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto shadow-sm">
       <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
       </div>
       <h3 className="text-2xl font-bold font-display text-slate-800 mb-2">{data.vaccineName}</h3>
       <div className="space-y-4 mt-6">
         <div>
           <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Batch Number</p>
           <p className="font-mono text-slate-800 font-medium">{data.batchNo}</p>
         </div>
         <div>
           <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Status</p>
           <p className="text-[#00C896] font-bold">Administered successfully</p>
         </div>
         {data.nextDueDate && (
           <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-800 text-sm mt-4">
             <span className="font-bold">Next due:</span> {data.nextDueDate}
           </div>
         )}
       </div>
    </div>
  );
}
