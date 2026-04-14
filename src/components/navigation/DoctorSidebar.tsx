"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  CalendarClock, 
  Wallet, 
  HeartHandshake, 
  Settings,
  BadgeCheck,
  LogOut
} from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/doctor" },
  { icon: ClipboardList, label: "Today's Queue", href: "/dashboard/doctor/queue" },
  { icon: Users, label: "Patient Records", href: "/dashboard/doctor/records" },
  { icon: CalendarClock, label: "Schedule Management", href: "/dashboard/doctor/schedule" },
  { icon: Wallet, label: "Earnings", href: "/dashboard/doctor/earnings" },
  { icon: HeartHandshake, label: "Community Impact", href: "/dashboard/doctor/impact" },
  { icon: Settings, label: "Settings", href: "/dashboard/doctor/settings" },
];

export default function DoctorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0A1A2F] border-r border-white/5 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo Area with subtle teal gradient */}
      <div className="p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#00C896]/10 blur-[50px] -translate-x-1/2 -translate-y-1/2" />
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C896] to-[#3B82F6] flex items-center justify-center">
            <HeartHandshake className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-white text-xl tracking-tight">Sehat Sathi</span>
        </Link>
      </div>

      {/* Doctor Profile */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border border-white/10" />
            <div className="absolute -bottom-1 -right-1 bg-[#060F1E] rounded-full p-0.5">
              <BadgeCheck className="w-4 h-4 text-[#3B82F6] fill-[#3B82F6]/10" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-white font-bold text-sm truncate">Dr. Priya Sharma</span>
            </div>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-tighter">NMC-183049</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar pt-6">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-gradient-to-r from-[#00C896]/10 to-transparent text-[#00C896]" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-[#00C896]" : "group-hover:text-white"
              )} />
              <span className="text-sm font-semibold">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-4 rounded-full bg-[#00C896]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 mt-auto">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-[#EF4444] transition-colors hover:bg-[#EF4444]/5 group">
          <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
