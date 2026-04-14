"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, type UserRole } from "@/context/AuthContext";
import {
  Activity, Bell, Building2, ChevronRight, CreditCard,
  Database, FileText, Heart, Home, LayoutDashboard,
  LogOut, MessageSquare, Phone, Settings, ShieldCheck,
  Stethoscope, TrendingUp, UserCheck, Users, Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  patient: [
    { label: "Home", href: "/", icon: Home },
    { label: "Symptom Check", href: "/symptom-checker", icon: Activity },
    { label: "Voice Intake", href: "/voice-intake", icon: Phone },
    { label: "My Records", href: "/records", icon: FileText },
    { label: "Reminders", href: "/reminders", icon: Heart },
    { label: "ABHA Identity", href: "/abha-id", icon: ShieldCheck },
    { label: "Health Passport", href: "/passport", icon: UserCheck },
  ],
  doctor: [
    { label: "Patient Queue", href: "/doctor/dashboard", icon: Users, badge: "5" },
    { label: "Live Consult", href: "/doctor/consultation", icon: Stethoscope },
    { label: "SOAP Notes", href: "/doctor/post-consultation", icon: FileText },
    { label: "Patient History", href: "/doctor/history", icon: Database },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  clinic_ops: [
    { label: "Dashboard", href: "/clinic/dashboard", icon: LayoutDashboard },
    { label: "Escalations", href: "/clinic/escalations", icon: Activity, badge: "3" },
    { label: "Call Prep", href: "/clinic/call-prep", icon: Phone },
    { label: "Register Patient", href: "/clinic/register-patient", icon: UserCheck },
    { label: "Communications", href: "/clinic/communications", icon: MessageSquare },
    { label: "Shared Ops", href: "/clinic/ops-desk", icon: Users },
    { label: "Compliance", href: "/clinic/compliance", icon: ShieldCheck },
  ],
  admin: [
    { label: "Clinics", href: "/admin/clinics", icon: Building2 },
    { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { label: "System Health", href: "/admin/health", icon: Wifi },
    { label: "IVR Flow", href: "/admin/ivr-flow", icon: Phone },
    { label: "Billing", href: "/admin/clinics", icon: CreditCard },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  patient: "Patient Portal",
  doctor: "Doctor Dashboard",
  clinic_ops: "Clinic Operations",
  admin: "Platform Admin",
};

const ROLE_COLORS: Record<UserRole, string> = {
  patient: "bg-primary",
  doctor: "bg-emerald-600",
  clinic_ops: "bg-sky-700",
  admin: "bg-sky-900",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, role, setRole } = useAuth();
  const pathname = usePathname();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navItems = NAV_ITEMS[role];

  return (
    <div className="flex h-screen bg-[#FAFCFF] font-inter overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[240px] bg-white border-r border-sky-100 flex flex-col shrink-0 z-50">
        {/* BRANDING */}
        <div className="p-6 border-b border-sky-50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg transition-transform group-hover:scale-105", ROLE_COLORS[role])}>
              SS
            </div>
            <div>
              <h2 className="text-base font-black text-sky-900 leading-none">Sehat Sathi</h2>
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.15em]">{ROLE_LABELS[role]}</span>
            </div>
          </Link>
        </div>

        {/* NAV ITEMS */}
        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 h-11 px-4 rounded-xl transition-all relative group",
                  isActive
                    ? "bg-primary/5 text-primary shadow-sm ring-1 ring-primary/10"
                    : "text-slate-400 hover:text-sky-900 hover:bg-sky-50/50"
                )}
              >
                <item.icon size={18} />
                <span className="text-[12px] font-black uppercase tracking-widest flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[9px] font-black rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ROLE SWITCHER */}
        <div className="p-4 border-t border-sky-50">
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 transition-all group"
            >
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-black", ROLE_COLORS[role])}>
                {user.initials}
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-[11px] font-black text-sky-900 uppercase tracking-tight leading-none">{user.name}</h4>
                <p className="text-[9px] font-bold text-slate-400 leading-tight mt-0.5">{user.subtitle}</p>
              </div>
              <ChevronRight size={14} className={cn("text-slate-300 transition-transform", showRoleSwitcher && "rotate-90")} />
            </button>
            <AnimatePresence>
              {showRoleSwitcher && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute left-0 right-0 bottom-full mb-2 bg-white border border-sky-100 rounded-xl shadow-2xl shadow-sky-900/10 overflow-hidden z-[100]"
                >
                  <div className="p-2">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] px-3 py-1 block">Switch Role</span>
                    {(["patient", "doctor", "clinic_ops", "admin"] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => { setRole(r); setShowRoleSwitcher(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
                          r === role ? "bg-primary/5 text-primary" : "text-slate-500 hover:bg-sky-50"
                        )}
                      >
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-black", ROLE_COLORS[r])}>
                          {r[0].toUpperCase()}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{ROLE_LABELS[r]}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-2 p-2 bg-sky-50 rounded-lg border border-sky-100 flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-primary" />
            <span className="text-[8px] font-black text-primary uppercase tracking-[0.15em]">DPDPA Compliant</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="h-14 bg-white/85 backdrop-blur-xl border-b border-sky-100 px-6 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              {pathname.split("/").filter(Boolean).join(" / ") || "Home"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-sky-50 transition-all text-slate-400 hover:text-primary"
            >
              <Bell size={20} />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
