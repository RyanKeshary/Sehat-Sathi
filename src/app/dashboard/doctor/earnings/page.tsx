"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  ArrowUpRight, 
  Heart, 
  Download, 
  Info,
  BadgeCheck,
  ChevronRight,
  TrendingUp,
  History,
  Users,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/utils/cn";
import DoctorSidebar from "@/components/navigation/DoctorSidebar";
import { MOCK_EARNINGS } from "@/lib/doctor-data";

export default function DoctorEarningsPage() {
  const currentTotal = "₹12,500";
  const monthlyRuralValue = "₹4,200"; // Notionally saved value for community

  return (
    <div className="p-8 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-8">
           <div>
              <h1 className="text-2xl font-display font-bold text-[#0A2540]">Earnings & Payouts</h1>
              <p className="text-slate-500 font-medium">Transparent tracking of your professional fees and service.</p>
           </div>
           <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" /> Download Statement
              </button>
           </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-[#0A2540] rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Wallet className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                 <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Available to Payout</p>
                 <div className="text-4xl font-display font-black mb-4">{currentTotal}</div>
                 <button className="w-full py-3 bg-[#00C896] text-[#060F1E] font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Withdraw Funds <ArrowUpRight className="w-4 h-4" />
                 </button>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Monthly Service Value</p>
                 <div className="text-3xl font-display font-black text-[#0A2540]">{monthlyRuralValue}</div>
                 <p className="text-[10px] text-[#00C896] font-bold mt-1 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" /> Contributed to Rural Health
                 </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs font-medium">
                 <Info className="w-3.5 h-3.5" />
                 This value represents free consultations for rural areas.
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between">
              <div>
                 <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Next Payout</p>
                 <div className="text-2xl font-display font-bold">20 April 2026</div>
                 <p className="text-sm font-medium text-white/80 mt-1">Automatic transfer to linked bank</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                 <BadgeCheck className="w-4 h-4 text-white" />
                 <span className="text-xs font-bold">Verification: Active</span>
              </div>
           </div>
        </div>

        {/* Detailed Transactions Table */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-[#0A2540] flex items-center gap-2">
                 <History className="w-5 h-5 text-slate-400" />
                 Transaction History
              </h3>
              <div className="flex gap-2">
                 <select className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-3 text-sm font-bold text-slate-600 outline-none">
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                 </select>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type / Duration</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Receipt</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {MOCK_EARNINGS.map((tx) => (
                       <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                             <span className="text-sm font-medium text-slate-600">{tx.date}</span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                   <Users className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold text-[#0A2540]">{tx.patient}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <span className={cn(
                                   "text-[10px] font-black uppercase tracking-widest",
                                   tx.isRural ? "text-[#00C896]" : "text-indigo-500"
                                )}>
                                   {tx.isRural ? "Rural Service" : "Standard Call"}
                                </span>
                                <span className="text-xs text-slate-400">{tx.duration}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-sm font-black text-[#0A2540]">{tx.fee}</span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <div className={cn(
                                   "w-2 h-2 rounded-full",
                                   tx.paymentStatus === "Paid" ? "bg-[#00C896]" : tx.paymentStatus === "Free-Rural" ? "bg-[#00C896]/50" : "bg-amber-500"
                                )} />
                                <span className="text-xs font-bold text-slate-600">{tx.paymentStatus}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className="p-2 text-slate-400 hover:text-[#00C896] transition-colors rounded-lg hover:bg-[#00C896]/5">
                                <Download className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                 View All Transactions <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Service Recognition Banner */}
        <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex items-center gap-8 shadow-sm">
           <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shrink-0 border border-emerald-100 shadow-lg">
              <Heart className="w-10 h-10 text-[#00C896] fill-[#00C896]" />
           </div>
           <div>
              <h4 className="text-xl font-display font-bold text-emerald-900 mb-1">Honoring Your Service</h4>
              <p className="text-emerald-700 font-medium leading-relaxed">
                 You have completed <span className="font-bold">12 free rural consultations</span> this month. Sehat Sathi honors your commitment to healthcare equity. These contributions are marked as "Community Service" in your professional profile.
              </p>
           </div>
           <div className="hidden lg:block shrink-0 px-6 py-3 bg-white border border-emerald-100 rounded-2xl">
              <div className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Profile Badge</div>
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                 <ShieldCheck className="w-5 h-5" />
                 Rural Guardian
              </div>
           </div>
        </div>
    </div>
  );
}
