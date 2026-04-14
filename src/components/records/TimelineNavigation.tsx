"use client";

import React from "react";
import { Pill, FlaskConical, HeartPulse, Syringe, Cloud, Smartphone } from "lucide-react";
import { cn } from "@/utils/cn";
import { RecordEntry } from "@/lib/records-data";

export default function TimelineNavigation({ 
  records, 
  activeId, 
  onSelect 
}: { 
  records: RecordEntry[], 
  activeId: string, 
  onSelect: (id: string) => void 
}) {
  // Sort descending
  const sortedRecords = [...records].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Group by year
  const grouped: Record<string, RecordEntry[]> = {};
  sortedRecords.forEach(r => {
    const year = r.date.getFullYear().toString();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(r);
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "PRESCRIPTION": return <Pill className="w-4 h-4 text-white" />;
      case "LAB_REPORT": return <FlaskConical className="w-4 h-4 text-white" />;
      case "VITALS": return <HeartPulse className="w-4 h-4 text-white" />;
      case "VACCINATION": return <Syringe className="w-4 h-4 text-white" />;
      default: return <Pill className="w-4 h-4 text-white" />;
    }
  };

  const formatShortDate = (d: Date) => {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <div className="relative pl-6">
      {/* Vertical Timeline Line */}
      <div className="absolute left-6 top-2 bottom-0 w-px bg-slate-200" />

      {Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a)).map(year => (
        <div key={year} className="mb-8">
          <div className="text-[#00C896] font-bold text-lg mb-4 bg-white relative z-10 inline-block pr-4 pb-1">
            {year}
          </div>
          
          <div className="space-y-6">
            {grouped[year].map(record => {
              const isActive = record.id === activeId;
              
              return (
                <div 
                  key={record.id}
                  onClick={() => onSelect(record.id)}
                  className={cn(
                    "relative ml-6 p-4 rounded-xl cursor-pointer transition-all border",
                    isActive 
                      ? "bg-[#00C896]/5 border-[#00C896]/30 shadow-sm border-l-4 border-l-[#00C896]" 
                      : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 border-l-4 border-l-transparent"
                  )}
                >
                  {/* Timeline Dot & Icon */}
                  <div className={cn(
                    "absolute -left-[37px] top-4 w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 ring-4 ring-white",
                    isActive ? "bg-[#00C896] scale-110" : "bg-slate-400"
                  )}>
                    {getIcon(record.type)}
                  </div>

                  <div className="flex justify-between items-start mb-1">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                       {formatShortDate(record.date)}
                     </span>
                     
                     {record.syncStatus === "SYNCED" ? (
                       <div className="flex items-center gap-1 text-[#00C896] bg-[#00C896]/10 px-1.5 py-0.5 rounded text-[10px] font-bold">
                         <Cloud className="w-3 h-3" /> Synced
                       </div>
                     ) : (
                       <div className="flex items-center gap-1 text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded text-[10px] font-bold">
                         <Smartphone className="w-3 h-3" /> Offline
                       </div>
                     )}
                  </div>

                  <h3 className="text-sm font-medium text-[#0A2540]">{record.title}</h3>
                  <p className="text-xs text-[#0A2540]/60 mt-1">{record.doctorName}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {records.length === 0 && (
         <div className="text-slate-400 text-sm italic">No records to display.</div>
      )}
    </div>
  );
}
