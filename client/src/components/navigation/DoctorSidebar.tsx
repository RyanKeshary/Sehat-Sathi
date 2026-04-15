"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  CalendarClock, 
  Banknote, 
  HeartHandshake, 
  Settings,
  BadgeCheck,
  LogOut
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useMobile } from "@/hooks/useMobile";

// Navigation configuration for the doctor dashboard
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", shortLabel: "Home", href: "/dashboard/doctor" },
  { icon: ClipboardList, label: "Today's Queue", shortLabel: "Queue", href: "/dashboard/doctor#queue" },
  { icon: CalendarClock, label: "Schedule", shortLabel: "Schedule", href: "/dashboard/doctor#schedule" },
  { icon: Banknote, label: "Earnings", shortLabel: "Earnings", href: "/dashboard/doctor#earnings" },
  { icon: Settings, label: "Settings", shortLabel: "Settings", href: "/dashboard/doctor/settings" },
];

/** ─── Desktop Doctor Sidebar ────────────────────────────── */
function DesktopDoctorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0A1A2F] border-r border-white/5 flex-col fixed left-0 top-0 z-40 hidden md:flex">
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

/** ─── Mobile Bottom Nav for Doctors ─────────────────────── */
function MobileDoctorBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[9990] md:hidden"
      style={{
        height: '64px',
        background: '#0A1A2F',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 active:bg-white/5 rounded-lg transition-colors"
            >
              <item.icon
                size={24}
                className={cn(
                  "transition-colors",
                  isActive ? "text-[#00C896]" : "text-white/50"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium truncate max-w-[56px] text-center leading-tight",
                  isActive ? "text-[#00C896]" : "text-white/40"
                )}
              >
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** ─── Main Export ────────────────────────────────────────── */
export default function DoctorSidebar() {
  const isMobile = useMobile();

  return (
    <>
      <DesktopDoctorSidebar />
      {isMobile && <MobileDoctorBottomNav />}
    </>
  );
}
