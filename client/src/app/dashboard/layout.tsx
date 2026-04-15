"use client";

import Sidebar from '@/components/dashboard/Sidebar';
import DoctorSidebar from '@/components/navigation/DoctorSidebar';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDoctorDashboard = pathname.startsWith('/dashboard/doctor');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {isDoctorDashboard ? <DoctorSidebar /> : <Sidebar />}
      {/* md:ml-[260px] for desktop sidebar offset, pb-20 md:pb-0 for mobile bottom nav clearance */}
      <div className={isDoctorDashboard ? "md:ml-64 min-h-screen" : "md:ml-[260px] min-h-screen pb-20 md:pb-0"}>
        {children}
      </div>
    </div>
  );
}
