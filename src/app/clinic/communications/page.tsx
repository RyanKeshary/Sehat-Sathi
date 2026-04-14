"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  MessageCircle, 
  Phone, 
  Mail, 
  Search, 
  Plus, 
  X, 
  Check, 
  Clock, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  History,
  PenSquare,
  Globe,
  CheckCheck,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const TemplateDrawer = ({ open, onClose }: { open: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-sky-950/20 backdrop-blur-md z-[200]" 
        />
        <motion.div 
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-[450px] bg-white border-l border-sky-100 shadow-2xl z-[201] p-8 overflow-y-auto no-scrollbar"
        >
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-black text-sky-900 leading-none uppercase tracking-widest">Template Library</h3>
             <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={20} className="text-slate-400" /></button>
          </div>
          
          <div className="space-y-4">
             {[
               { t: "Medication Reminder", l: "Follow your prescribed dosage of {DRUG} after meals.", lang: "Marathi" },
               { t: "Lab Result Ready", l: "Your {TEST} reports are ready. View them in Sehat Sathi app.", lang: "Hindi" },
               { t: "Follow-Up Visit", l: "Your appointment with {DOCTOR} is tomorrow at 10:00 AM.", lang: "Bengali" },
               { t: "Health Tip: Fasting", l: "During Navratri fasting, please maintain hydration and monitor BP.", lang: "Gujarati" },
             ].map((temp, i) => (
               <div key={i} className="bg-[#FAFCFF] border border-sky-100 rounded-[28px] p-6 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{temp.t}</span>
                     <span className="px-2 py-0.5 bg-sky-50 text-[9px] font-black uppercase text-sky-400 rounded-md border border-sky-100">{temp.lang}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-4 italic leading-relaxed">"{temp.l}"</p>
                  <button className="w-full h-10 border border-primary/20 text-primary font-black text-[11px] uppercase tracking-widest rounded-xl group-hover:bg-primary group-hover:text-white transition-all">Insert Template</button>
               </div>
             ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// --- Page Component ---

export default function CommunicationCentre() {
  const [tab, setTab] = useState("Scheduled");
  const [selectedDate, setSelectedDate] = useState(14);
  const [showDrawer, setShowDrawer] = useState(false);
  const [channel, setChannel] = useState("WhatsApp");

  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="h-screen bg-[#F8FBFC] font-inter flex flex-col overflow-hidden relative">
      
      {/* HEADER TABS */}
      <header className="h-[76px] bg-white border-b border-sky-100 px-8 flex items-center justify-between shrink-0">
         <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {["Scheduled", "Sent History", "Compose"].map(t => (
              <button 
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                  tab === t ? "bg-white text-primary shadow-lg shadow-primary/10" : "text-slate-400 hover:text-primary"
                )}
              >
                 {t}
              </button>
            ))}
         </div>
         {tab === "Compose" && (
            <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               WhatsApp API: Active ✓
            </div>
         )}
      </header>

      <main className="flex-1 overflow-hidden p-8 flex flex-col">
         
         {/* SCHEDULED TAB */}
         {tab === "Scheduled" && (
           <div className="flex h-full gap-8">
              {/* LEFT: Monthly Calendar */}
              <div className="w-[45%] bg-white rounded-[40px] border border-sky-100 shadow-sm p-8 flex flex-col">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black text-sky-900 uppercase tracking-widest flex items-center gap-2">
                       <CalendarIcon size={20} className="text-primary" /> April 2026
                    </h3>
                    <div className="flex gap-2">
                       <button className="p-2 hover:bg-slate-50 rounded-xl"><ChevronLeft size={20} /></button>
                       <button className="p-2 hover:bg-slate-50 rounded-xl"><ChevronRight size={20} /></button>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-7 gap-y-6 flex-1 place-items-center mb-8">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                      <span key={d} className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{d}</span>
                    ))}
                    {dates.map(d => (
                      <div 
                        key={d} 
                        onClick={() => setSelectedDate(d)}
                        className="relative w-10 h-10 flex flex-col items-center cursor-pointer group"
                      >
                         <AnimatePresence>
                           {selectedDate === d && (
                             <motion.div 
                               initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                               className="absolute inset-0 bg-primary rounded-full z-0" 
                             />
                           )}
                         </AnimatePresence>
                         <span className={cn(
                           "relative z-10 text-sm font-black transition-colors pt-2",
                           selectedDate === d ? "text-white" : "text-slate-600 group-hover:text-primary"
                         )}>{d}</span>
                         <div className="flex gap-0.5 mt-auto relative z-10 pb-1">
                            {d % 3 === 0 && <div className="w-1 h-1 bg-teal-400 rounded-full" />}
                            {d % 5 === 0 && <div className="w-1 h-1 bg-amber-400 rounded-full" />}
                            {d % 7 === 0 && <div className="w-1 h-1 bg-slate-400 rounded-full" />}
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="flex gap-6 mt-auto pt-8 border-t border-slate-50 justify-center">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-teal-400 rounded-full" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">WhatsApp</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-400 rounded-full" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">IVR Call</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-400 rounded-full" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">SMS</span></div>
                 </div>
              </div>

              {/* RIGHT: List */}
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-10">
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-4">Reminders for Apr {selectedDate}</h4>
                 {[
                   { n: "Priya Sharma", t: "WhatsApp", p: "Your Vildagliptin refill is due tomorrow...", h: "09:00 AM", c: "WhatsApp" },
                   { n: "Ramesh Jain", t: "IVR Call", p: "Automated call for medication adherence...", h: "11:30 AM", c: "IVR" },
                   { n: "Sunil Verma", t: "WhatsApp", p: "Blood Sugar laboratory results available...", h: "14:45 PM", c: "WhatsApp" },
                 ].map((r, i) => (
                   <div key={i} className="bg-white p-6 rounded-[32px] border border-sky-100 shadow-sm flex items-center gap-6 group hover:border-primary/20 transition-all">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                        r.c === "WhatsApp" ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"
                      )}>
                        {r.c === "WhatsApp" ? <MessageCircle size={24} /> : <Phone size={24} />}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-1">
                            <h5 className="font-black text-sky-900 leading-none">{r.n}</h5>
                            <span className="text-[11px] font-black text-primary mono leading-none tracking-widest">{r.h}</span>
                         </div>
                         <p className="text-sm font-medium text-slate-500 italic truncate max-w-[300px]">"{r.p}"</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <button className="p-2 text-slate-300 hover:text-primary transition-colors"><PenSquare size={18} /></button>
                         <button className="px-4 py-2 bg-sky-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">Send Now</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         )}

         {/* SENT HISTORY TAB */}
         {tab === "Sent History" && (
           <div className="flex-1 flex flex-col gap-6">
              <div className="flex gap-2">
                 {["All", "WhatsApp", "IVR", "SMS", "Failed"].map(f => (
                   <button key={f} className={cn(
                     "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                     f === "All" ? "bg-sky-900 border-sky-900 text-white" : "bg-white border-slate-100 text-slate-400 hover:border-primary/20 hover:text-primary"
                   )}>{f}</button>
                 ))}
              </div>
              
              <div className="bg-white rounded-[32px] border border-sky-100 shadow-sm overflow-hidden flex flex-col flex-1">
                 <div className="grid grid-cols-[80px_1.5fr_2fr_1.5fr_1fr_100px] gap-4 px-8 py-5 bg-sky-50 border-b border-sky-100">
                    {["", "Patient", "Preview", "Timestamp", "Status", ""].map((h, i) => (
                      <span key={i} className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</span>
                    ))}
                 </div>
                 <div className="flex-1 overflow-y-auto no-scrollbar">
                    {[
                      { n: "Anita Singh", c: "WhatsApp", p: "Appointment reminder: 2:00 PM", h: "Today, 09:15", s: "Read ✓✓", st: "Read" },
                      { n: "Rajesh Kumar", c: "IVR", p: "Alert: Follow-up required for lab...", h: "Today, 08:30", s: "Delivered ✓", st: "Delivered" },
                      { n: "Sita Devi", c: "WhatsApp", p: "Health Survey Invitation Link...", h: "Yesterday", s: "Failed ✗", st: "Failed" },
                      { n: "Vikram S.", c: "SMS", p: "Registration successful. Welcome...", h: "Yesterday", s: "Delivered ✓", st: "Delivered" },
                    ].map((row, i) => (
                      <div key={i} className={cn("grid grid-cols-[80px_1.5fr_2fr_1.5fr_1fr_100px] gap-4 px-8 h-16 items-center border-b border-sky-50 transition-all", row.st === "Failed" && "bg-red-50/20")}>
                         <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center",
                           row.c === "WhatsApp" ? "text-emerald-500" : row.c === "IVR" ? "text-amber-500" : "text-slate-400"
                         )}>
                            {row.c === "WhatsApp" ? <MessageCircle size={20} /> : row.c === "IVR" ? <Phone size={20} /> : <Mail size={20} />}
                         </div>
                         <span className="text-sm font-black text-sky-900">{row.n}</span>
                         <span className="text-xs font-medium text-slate-500 italic truncate opacity-60">"{row.p}"</span>
                         <span className="text-xs font-bold text-slate-400">{row.h}</span>
                         <div>
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                              row.st === "Read" ? "text-teal-500" : row.st === "Delivered" ? "text-emerald-500" : "text-red-500"
                            )}>
                               {row.st === "Read" && <CheckCheck size={14} className="text-teal-400" />} {row.s}
                            </span>
                         </div>
                         <div className="flex justify-end pr-4 transition-all duration-300">
                            {row.st === "Failed" ? (
                              <button className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-200 hover:bg-amber-100">Retry</button>
                            ) : (
                              <MoreVertical size={18} className="text-slate-300" />
                            )}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
         )}

         {/* COMPOSE TAB */}
         {tab === "Compose" && (
           <div className="flex-1 bg-white rounded-[40px] border border-sky-100 shadow-sm p-10 flex flex-col max-w-[900px] mx-auto w-full overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-10">
                 {/* Left Col: Recipient & Channel */}
                 <div className="space-y-8">
                    <div>
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Recipient</label>
                       <div className="relative group">
                          <input className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 outline-none focus:border-primary/30 transition-all font-bold placeholder:text-slate-300" placeholder="Search patient name or ABHA ID..." />
                          <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                       </div>
                    </div>

                    <div>
                       <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Communication Channel</label>
                       <div className="grid grid-cols-3 gap-4">
                          {[
                            { n: "WhatsApp", i: MessageCircle, c: "emerald" },
                            { n: "IVR Call", i: Phone, c: "amber" },
                            { n: "SMS", i: Mail, c: "slate" },
                          ].map(item => (
                            <button 
                              key={item.n}
                              onClick={() => setChannel(item.n)}
                              className={cn(
                                "flex flex-col items-center justify-center h-[120px] rounded-3xl border-2 transition-all gap-3",
                                channel === item.n ? `bg-primary border-primary text-white shadow-xl shadow-primary/20` : "bg-white border-slate-100 text-slate-400 hover:border-primary/20"
                              )}
                            >
                               <item.i size={32} />
                               <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.n}</span>
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Right Col: Message */}
                 <div className="space-y-8">
                    <div className="flex justify-between items-end">
                       <div>
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Language & Templates</label>
                          <div className="flex gap-3">
                             <div className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                                <Globe size={16} className="text-slate-400" />
                                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">English</span>
                             </div>
                             <button 
                               onClick={() => setShowDrawer(true)}
                               className="h-12 border-2 border-primary/20 text-primary px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all"
                             >
                                <History size={16} /> Use Template
                             </button>
                          </div>
                       </div>
                    </div>

                    <div>
                       <div className="flex justify-between items-center mb-3">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Message Content</label>
                          <span className="text-[10px] font-black text-slate-300 mono uppercase tracking-widest">0 / 4096</span>
                       </div>
                       <textarea 
                         className="w-full h-[200px] bg-slate-50 border border-slate-100 rounded-[32px] p-8 outline-none focus:border-primary/30 transition-all font-medium text-slate-700 leading-relaxed resize-none"
                         placeholder="Type your clinical message here... use {PATIENT} for names."
                       />
                    </div>
                 </div>
              </div>

              <div className="mt-auto pt-10 border-t border-slate-50 flex gap-4">
                 <button className="flex-1 h-14 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                    Send Now
                 </button>
                 <button className="h-14 px-10 border-2 border-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-50 active:scale-95 transition-all">
                    Schedule for Later
                 </button>
              </div>
           </div>
         )}

      </main>

      <TemplateDrawer open={showDrawer} onClose={() => setShowDrawer(false)} />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .mono { font-family: 'Roboto Mono', monospace; }
      `}</style>
    </div>
  );
}
