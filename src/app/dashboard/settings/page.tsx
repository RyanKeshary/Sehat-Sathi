"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Shield, 
  Globe, 
  Bell, 
  Lock, 
  CreditCard, 
  Smartphone,
  ChevronRight,
  LogOut,
  BadgeCheck,
  Languages
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);

  const sections = [
    {
      id: "profile",
      title: "Personal Profile",
      icon: User,
      description: "Manage your personal information and contact details.",
      items: [
        { label: "Phone Number", value: "+91 98XXX XXX10" },
        { label: "Home Address", value: "Bhatinda, Punjab" }
      ]
    },
    {
       id: "abha",
       title: "ABHA Card & Records",
       icon: BadgeCheck,
       description: "Your digital health ID and data sharing preferences.",
       items: [
         { label: "ABHA Number", value: "91-1234-5678-9012" },
         { label: "Sync Status", value: "Fully Synced" }
       ]
    },
    {
      id: "language",
      title: "Language & Regional",
      icon: Languages,
      description: "Choose your primary language for consultation and AI chat.",
      items: [
        { label: "Current Language", value: language === "en" ? "English" : "हिंदी" }
      ]
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#0A2540] mb-2">Account Settings</h1>
        <p className="text-slate-500 font-medium">Fine-tune your Sehat Sathi experience and manage privacy.</p>
      </div>

      <div className="space-y-6">
        {/* User Card */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm">
           <div className="w-16 h-16 rounded-full bg-[#0A2540] flex items-center justify-center text-white text-2xl font-black">
              RS
           </div>
           <div className="flex-1">
              <h2 className="text-xl font-bold text-[#0A2540]">Ranjit Singh</h2>
              <p className="text-slate-400 font-medium text-sm">Patient ID: #SATHI-2024-91</p>
           </div>
           <button className="px-6 py-2.5 bg-slate-100 text-[#0A2540] rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
              Edit
           </button>
        </div>

        {/* Setting Sections */}
        {sections.map((section) => (
          <div key={section.id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
             <div className="p-6 border-b border-slate-50 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0A2540]">
                   <section.icon className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-bold text-[#0A2540]">{section.title}</h3>
                   <p className="text-xs text-slate-400 font-medium">{section.description}</p>
                </div>
             </div>
             <div className="p-2">
                {section.items.map((item, i) => (
                  <button 
                    key={i}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors text-left group"
                  >
                     <span className="text-sm font-bold text-slate-700">{item.label}</span>
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-400 group-hover:text-[#00C896] transition-colors">{item.value}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                     </div>
                  </button>
                ))}
             </div>
          </div>
        ))}

        {/* Toggles Group */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-6 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                    <Bell className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-indigo-900">Health Alerts</h3>
                    <p className="text-xs text-indigo-700/60 font-medium">Get notifications for medications and appointments.</p>
                 </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-200",
                  notifications ? "bg-[#00C896]" : "bg-slate-200"
                )}
              >
                 <div className={cn(
                   "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200",
                   notifications ? "left-7" : "left-1"
                 )} />
              </button>
           </div>
        </div>

        {/* Dangerous Actions */}
        <div className="pt-4 flex items-center justify-between px-4">
           <button className="flex items-center gap-2 text-red-500 font-bold text-sm hover:opacity-70 transition-opacity">
              <LogOut className="w-4 h-4" /> Sign Out
           </button>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Sehat Sathi v2.4.1</p>
        </div>
      </div>
    </div>
  );
}
