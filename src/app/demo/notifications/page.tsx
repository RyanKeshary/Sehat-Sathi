"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Settings, 
  X, 
  AlertCircle, 
  Phone, 
  ExternalLink, 
  Calendar, 
  RefreshCcw, 
  Info,
  Check,
  Smartphone,
  MessageSquare,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

type NotificationType = "Emergency" | "Escalation" | "Reminder" | "System" | "Info";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  patient?: string;
  unread: boolean;
  actionLabel?: string;
  actionIcon?: any;
}

// --- Sub-components ---

const NotificationCard = ({ item, onClick }: { item: NotificationItem, onClick: () => void }) => {
  const iconMap: Record<NotificationType, { icon: any, color: string, border: string }> = {
    Emergency: { icon: AlertCircle, color: "bg-red-500", border: "border-red-600" },
    Escalation: { icon: Phone, color: "bg-orange-500", border: "border-orange-200" },
    Reminder: { icon: Calendar, color: "bg-amber-500", border: "border-amber-200" },
    System: { icon: RefreshCcw, color: "bg-purple-500", border: "border-purple-200" },
    Info: { icon: Info, color: "bg-primary", border: "border-sky-200" }
  };

  const config = iconMap[item.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "p-4 rounded-[12px] border transition-all duration-300 relative group cursor-pointer",
        item.unread ? "bg-sky-50 border-sky-100 border-l-[3px] border-l-primary" : "bg-white border-sky-50 shadow-sm"
      )}
      onClick={onClick}
    >
       <div className="flex gap-4">
          <div className="relative">
             <div className={cn(
               "w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0",
               config.color,
               item.type === "Emergency" && "animate-pulse-red"
             )}>
                <Icon size={18} />
             </div>
             {item.unread && (
               <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary border-2 border-white rounded-full" />
             )}
          </div>
          
          <div className="flex-1">
             <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-black text-sky-900 tracking-tight leading-none truncate pr-2">{item.title}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">{item.timestamp}</span>
             </div>
             <p className="text-[12px] font-medium text-slate-600 leading-relaxed mb-3">{item.description}</p>
             
             <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                   {item.patient && (
                     <div className="px-2 py-0.5 bg-white border border-sky-100 rounded-full text-[9px] font-black text-primary uppercase">
                        {item.patient}
                     </div>
                   )}
                </div>
                {item.actionLabel && (
                   <button className={cn(
                     "text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all group-hover:gap-2",
                     item.type === "Emergency" ? "text-red-600 bg-red-100/50 px-2 py-1 rounded-lg" : "text-primary hover:text-sky-900"
                   )}>
                      {item.actionLabel} {item.actionIcon && <item.actionIcon size={12} />}
                   </button>
                )}
             </div>
          </div>
       </div>
    </motion.div>
  );
};

// --- Page Component ---

export default function NotificationCentre() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"feed" | "settings">("feed");
  const [filter, setFilter] = useState("All");
  const [unreadCount, setUnreadCount] = useState(12);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "1", type: "Emergency", title: "Non-Adherence Critical", description: "Mrs. Priya Sharma has missed HbA1c testing window by 18 days.", timestamp: "2m ago", unread: true, patient: "MRN-2402", actionLabel: "Escalate Now", actionIcon: Phone },
    { id: "2", type: "Reminder", title: "Follow-Up Scheduled", description: "Teleconsultation with Dr. Nair scheduled for 4:30 PM.", timestamp: "15m ago", unread: true, patient: "R. Sharma", actionLabel: "Join Call", actionIcon: ExternalLink },
    { id: "3", type: "System", title: "Cloud Sync Complete", description: "ABHA Health Records successfully synchronized for 124 patients.", timestamp: "1h ago", unread: false, actionLabel: "View Log" },
    { id: "4", type: "Escalation", title: "Medication Warning", description: "Patient 402 reported side effects to Metformin via WhatsApp.", timestamp: "2h ago", unread: true, patient: "K. Singh", actionLabel: "Review Chat", actionIcon: Smartphone },
    { id: "5", type: "Info", title: "Consultation Logged", description: "Prescription signed for Patient MRN-1102 (P. Kumar).", timestamp: "3h ago", unread: false, patient: "P. Kumar", actionLabel: "View Record", actionIcon: ExternalLink },
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const addNotification = () => {
    const newItem: NotificationItem = {
      id: Date.now().toString(),
      type: "Emergency",
      title: "Real-time Priority Alert",
      description: "Critical trigger detected in the escalation queue monitor.",
      timestamp: "Just now",
      unread: true,
      patient: "SYSTEM",
      actionLabel: "Acknowledge"
    };
    setNotifications(prev => [newItem, ...prev]);
    setUnreadCount(c => c + 1);
  };

  return (
    <div className="min-h-screen bg-[#F8FBFC] flex items-center justify-center font-inter p-20">
      
      {/* TRIGGER BUTTON (Representative of Nav Bell) */}
      <div className="relative group cursor-pointer" onClick={() => setIsOpen(true)}>
         <div className="w-14 h-14 bg-white border-2 border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/5 group-hover:scale-105 active:scale-95 transition-all">
            <Bell size={24} />
         </div>
         {unreadCount > 0 && (
           <motion.div 
             initial={{ scale: 0 }} animate={{ scale: 1 }}
             className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 border-4 border-white rounded-full flex items-center justify-center"
           >
              <span className="text-[10px] font-black text-white">{unreadCount}</span>
           </motion.div>
         )}
      </div>

      <p className="fixed bottom-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Click Bell to Open Integrated Notification Suite</p>

      {/* BACKDROP */}
      <AnimatePresence>
         {isOpen && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => setIsOpen(false)}
             className="fixed inset-0 bg-sky-900/10 backdrop-blur-md z-[1000]"
           />
         )}
      </AnimatePresence>

      {/* DRAWER */}
      <AnimatePresence>
         {isOpen && (
           <motion.div 
             initial={{ x: 400 }}
             animate={{ x: 0 }}
             exit={{ x: 400 }}
             transition={{ type: "spring", damping: 30, stiffness: 300 }}
             className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-[-40px_0_100px_rgba(8,145,178,0.1)] z-[1001] flex flex-col border-l border-sky-100"
           >
              {/* HEADER */}
              <div className="h-[120px] bg-white/80 backdrop-blur-md border-b border-sky-50 p-8 flex flex-col justify-center gap-4">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <h2 className="text-xl font-black text-sky-900 tracking-tight">Notifications</h2>
                       <div className="px-2 py-0.5 bg-primary/10 rounded-full text-[10px] font-black text-primary">
                          {unreadCount} Unread
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <button 
                         onClick={() => setView(view === "feed" ? "settings" : "feed")}
                         className={cn("p-2 transition-all rounded-lg hover:bg-sky-50", view === "settings" ? "bg-primary text-white" : "text-sky-900")}
                       >
                          <Settings size={20} />
                       </button>
                       <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-sky-900 rounded-lg hover:bg-slate-50 transition-all">
                          <X size={20} />
                       </button>
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-between">
                    <div className="flex gap-6">
                       {["All", "Escalations", "Reminders"].map(t => (
                         <button 
                           key={t}
                           onClick={() => setFilter(t)}
                           className={cn(
                             "text-[10px] font-black uppercase tracking-widest relative pb-1 transition-all",
                             filter === t ? "text-primary" : "text-slate-400 hover:text-sky-900"
                           )}
                         >
                            {t}
                            {filter === t && <motion.div layoutId="notif-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                         </button>
                       ))}
                    </div>
                    <button onClick={markAllRead} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Mark All Read</button>
                 </div>
              </div>

              {/* BODY FEED */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                 <AnimatePresence mode="popLayout">
                    {view === "feed" ? (
                      <motion.div 
                        key="feed"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                         {/* MOCK REAL-TIME TRIGGER */}
                         <button 
                           onClick={addNotification}
                           className="w-full py-4 border-2 border-dashed border-sky-100 rounded-[20px] text-[10px] font-black text-primary/40 uppercase tracking-widest hover:border-primary/20 hover:text-primary transition-all mb-4"
                         >
                            + Simulate Priority Trigger
                         </button>

                         {notifications.map((n, i) => (
                           <NotificationCard 
                             key={n.id} 
                             item={n} 
                             onClick={() => {
                               setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, unread: false } : notif));
                               if (n.unread) setUnreadCount(c => Math.max(0, c - 1));
                             }} 
                           />
                         ))}
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="settings"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                      >
                         <div className="bg-sky-50 rounded-[32px] p-6 border border-sky-100">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-6">Master Channel Control</h4>
                            <div className="space-y-6">
                               {[
                                 { l: "In-App Dashboard", i: Bell, c: "WhatsApp" },
                                 { l: "WhatsApp Care", i: MessageSquare, c: "WhatsApp" },
                                 { l: "SMS Alerts", i: Smartphone, c: "SMS" },
                                 { l: "IVR Phone Call", i: Volume2, c: "VOICE" },
                               ].map(ch => (
                                 <div key={ch.l} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-sky-100"><ch.i size={16} /></div>
                                       <span className="text-xs font-black text-sky-900 uppercase tracking-tight">{ch.l}</span>
                                    </div>
                                    <div className="w-10 h-6 bg-primary rounded-full flex items-center px-1 cursor-pointer">
                                       <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Category Preferences</h4>
                            {["Clinical Escalations", "Medication Adherence", "Service Thresholds"].map(cat => (
                              <div key={cat} className="flex justify-between items-center py-4 border-b border-sky-50">
                                 <span className="text-xs font-bold text-sky-900">{cat}</span>
                                 <Check size={18} className="text-primary" />
                              </div>
                            ))}
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* FOOTER */}
              <div className="p-6 border-t border-sky-50 bg-slate-50/50">
                 <button className="w-full h-12 bg-white border-2 border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 rounded-2xl hover:text-sky-900 hover:border-sky-100 transition-all">
                    Acknowledge All Clear
                 </button>
              </div>

           </motion.div>
         )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes pulse-red {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
        }
        .animate-pulse-red {
          animation: pulse-red 2s infinite ease-in-out;
        }
      `}</style>

    </div>
  );
}
