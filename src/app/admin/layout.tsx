"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Server, 
  MessageSquare, 
  Settings,
  Bell,
  Search,
  LogOut,
  Cross
} from "lucide-react";
import { cn } from "@/utils/cn";

const ADMIN_LINKS = [
  { name: "Overview", href: "/admin", icon: BarChart3 },
  { name: "Physician Verification", href: "/admin/verifications", icon: ShieldCheck },
  { name: "Beneficiary Records", href: "/admin/beneficiaries", icon: Users },
  { name: "System Health", href: "/admin/system", icon: Server },
  { name: "Support Desk", href: "/admin/support", icon: MessageSquare },
  { name: "Configuration", href: "/admin/config", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-sans text-slate-900">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-[#1E293B] flex flex-col shrink-0 fixed inset-y-0 z-50">
        <div className="p-8 pb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00C896] flex items-center justify-center shadow-lg shadow-[#00C896]/20">
             <Cross className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-xl tracking-tight">SEHAT ADMIN</h1>
            <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Clinical Service Desk</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
           {ADMIN_LINKS.map((link) => {
             const isActive = pathname === link.href;
             return (
               <Link 
                 key={link.href}
                 href={link.href}
                 className={cn(
                   "flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all",
                   isActive 
                    ? "bg-[#00C896] text-[#060F1E] shadow-xl shadow-[#00C896]/10" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                 )}
               >
                 <link.icon className={cn("w-5 h-5", isActive ? "text-[#060F1E]" : "text-slate-500")} />
                 {link.name}
               </Link>
             );
           })}
        </nav>

        <div className="p-6 border-t border-slate-800">
           <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 font-bold text-sm transition-colors">
              <LogOut className="w-5 h-5" /> Logout
           </button>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 ml-72 flex flex-col min-h-screen">
         {/* Top Header */}
         <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div className="relative w-96">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
               <input 
                 type="text" 
                 placeholder="Search clinical registries..." 
                 className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#00C896]"
               />
            </div>
            <div className="flex items-center gap-6">
               <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
               </button>
               <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                  <div className="text-right">
                     <p className="text-sm font-bold text-slate-900">Anand Kumar</p>
                     <p className="text-[10px] font-black text-[#00C896] uppercase">System Admin</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                     AK
                  </div>
               </div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-8">
            {children}
         </div>
      </main>
    </div>
  );
}
