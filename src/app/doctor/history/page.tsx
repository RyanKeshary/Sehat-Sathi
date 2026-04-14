"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Heart, Activity, Pill, FlaskConical,
  Calendar, ShieldCheck, ChevronRight, Eye,
  Download, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  id: string;
  date: string;
  type: "consultation" | "lab" | "prescription" | "vitals" | "vaccination";
  title: string;
  provider: string;
  facility: string;
  details: string;
  fhirResource: string;
  tags: string[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  consultation: Activity,
  lab: FlaskConical,
  prescription: Pill,
  vitals: Heart,
  vaccination: ShieldCheck,
};

const COLOR_MAP: Record<string, string> = {
  consultation: "bg-primary/10 text-primary border-primary/20",
  lab: "bg-emerald-50 text-emerald-600 border-emerald-100",
  prescription: "bg-amber-50 text-amber-600 border-amber-100",
  vitals: "bg-red-50 text-red-500 border-red-100",
  vaccination: "bg-purple-50 text-purple-600 border-purple-100",
};

const TIMELINE_DATA: TimelineEntry[] = [
  {
    id: "1", date: "12 Apr 2026", type: "consultation",
    title: "Follow-Up — Diabetes Management",
    provider: "Dr. Meera Nair", facility: "CityCare Multispeciality, Nashik",
    details: "HbA1c reviewed (6.8%). Medication adjusted — Metformin increased to 1000mg BD. Follow-up in 3 months.",
    fhirResource: "Encounter/enc-2026-0412", tags: ["Diabetes Type 2", "SOAP Note"],
  },
  {
    id: "2", date: "10 Apr 2026", type: "lab",
    title: "HbA1c Lab Report",
    provider: "SRL Diagnostics", facility: "Nashik Branch",
    details: "HbA1c: 6.8% (Target: <7.0%). Fasting Glucose: 132 mg/dL. Post-Prandial: 186 mg/dL.",
    fhirResource: "DiagnosticReport/dr-2026-0410", tags: ["HbA1c", "Glucose Panel"],
  },
  {
    id: "3", date: "05 Apr 2026", type: "prescription",
    title: "E-Prescription — Metformin Adjustment",
    provider: "Dr. Meera Nair", facility: "CityCare Multispeciality",
    details: "Metformin 1000mg BD (increased from 500mg). Glimepiride 2mg OD. Vitamin D3 60K weekly.",
    fhirResource: "MedicationRequest/mr-2026-0405", tags: ["Metformin", "Glimepiride"],
  },
  {
    id: "4", date: "28 Mar 2026", type: "vitals",
    title: "Routine Vitals Check",
    provider: "ANM Worker — Sita Devi", facility: "PHC Sinnar",
    details: "BP: 134/86 mmHg. Weight: 72kg. SpO2: 97%. Heart Rate: 78 bpm.",
    fhirResource: "Observation/obs-2026-0328", tags: ["BP Elevated", "Weight Stable"],
  },
  {
    id: "5", date: "15 Mar 2026", type: "consultation",
    title: "Telemedicine Consult — Respiratory",
    provider: "Dr. Anil Kapoor", facility: "eSanjeevani Network",
    details: "Seasonal cold and mild bronchitis. Prescribed Azithromycin 500mg x3 days + steam inhalation.",
    fhirResource: "Encounter/enc-2026-0315", tags: ["Bronchitis", "Teleconsult"],
  },
  {
    id: "6", date: "01 Feb 2026", type: "vaccination",
    title: "COVID-19 Booster (Covaxin)",
    provider: "PHC Sinnar", facility: "District Nashik",
    details: "Covaxin booster dose administered. No adverse reactions observed. Certificate synced with CoWIN.",
    fhirResource: "Immunization/imm-2026-0201", tags: ["COVID-19", "Booster"],
  },
];

export default function FHIRTimeline() {
  const [selected, setSelected] = useState<TimelineEntry | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? TIMELINE_DATA : TIMELINE_DATA.filter(e => e.type === filter);

  return (
    <div className="min-h-screen bg-[#FAFCFF] font-inter">
      <div className="max-w-[900px] mx-auto px-8 py-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-black text-sky-900 mb-1">Patient History</h1>
            <p className="text-sm font-bold text-slate-400">FHIR R4 Timeline · Mrs. Priya Sharma</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-[#D4AF37]/10 text-[#8A6D3B] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#D4AF37]/20" style={{ fontFamily: "'Roboto Mono', monospace" }}>
              ABHA: 91-4502-8831-0027
            </div>
            <button className="h-10 px-4 bg-white border border-sky-100 rounded-xl flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:border-primary/30 transition-all">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-2 mb-8">
          <Filter size={14} className="text-slate-300" />
          {["all", "consultation", "lab", "prescription", "vitals", "vaccination"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
                filter === f
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-white text-slate-400 border-sky-100 hover:border-primary/30"
              )}
            >
              {f === "all" ? "All Records" : f}
            </button>
          ))}
        </div>

        {/* TIMELINE */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-sky-100" />

          <div className="flex flex-col gap-6">
            {filtered.map((entry, i) => {
              const Icon = ICON_MAP[entry.type];
              const colorClass = COLOR_MAP[entry.type];

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-6 group cursor-pointer"
                  onClick={() => setSelected(entry)}
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 shrink-0">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border transition-all group-hover:scale-110 group-hover:shadow-lg",
                      colorClass
                    )}>
                      <Icon size={20} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white p-6 rounded-2xl border border-sky-100 group-hover:shadow-xl group-hover:shadow-sky-900/5 transition-all group-hover:-translate-y-0.5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base font-black text-sky-900 leading-tight">{entry.title}</h3>
                        <p className="text-[13px] font-bold text-slate-400 mt-1">{entry.provider} · {entry.facility}</p>
                      </div>
                      <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest shrink-0">{entry.date}</span>
                    </div>
                    <p className="text-[14px] font-medium text-slate-500 leading-relaxed mb-4">{entry.details}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {entry.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-sky-50 text-primary text-[9px] font-black uppercase tracking-widest rounded border border-sky-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                        {entry.fhirResource}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DETAIL PANEL */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-sky-900/10 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[420px] bg-white z-[201] shadow-2xl border-l border-sky-100 flex flex-col"
            >
              <div className="p-8 border-b border-sky-50">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">FHIR Resource Detail</span>
                  <button onClick={() => setSelected(null)} className="text-slate-300 hover:text-slate-500 transition-colors">✕</button>
                </div>
                <h2 className="text-xl font-black text-sky-900 mb-2">{selected.title}</h2>
                <p className="text-sm font-bold text-slate-400">{selected.provider}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Clinical Details</label>
                  <p className="text-[15px] font-medium text-slate-600 leading-relaxed bg-sky-50 p-4 rounded-xl border border-sky-100">{selected.details}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Metadata</label>
                  <div className="space-y-3">
                    {[
                      { k: "Resource", v: selected.fhirResource },
                      { k: "Date", v: selected.date },
                      { k: "Facility", v: selected.facility },
                      { k: "Type", v: selected.type },
                    ].map(row => (
                      <div key={row.k} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                        <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{row.k}</span>
                        <span className="text-[13px] font-bold text-sky-900">{row.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <div>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block">ABHA Verified</span>
                    <span className="text-[12px] font-bold text-emerald-600">Record linked to Ayushman Bharat Health Account</span>
                  </div>
                </div>
              </div>
              <div className="p-8 pt-4 border-t border-sky-50 flex gap-3">
                <button className="flex-1 h-12 bg-primary text-white font-black rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/20">
                  <Eye size={16} /> View Full Record
                </button>
                <button className="h-12 px-4 bg-sky-50 border border-sky-100 rounded-xl text-primary font-black text-sm">
                  <Download size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
