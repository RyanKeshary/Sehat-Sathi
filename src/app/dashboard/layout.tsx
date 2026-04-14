"use client";

import { Sidebar } from '@/components/dashboard/Sidebar';
import DoctorSidebar from '@/components/navigation/DoctorSidebar';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDoctorDashboard = pathname.startsWith('/dashboard/doctor');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {isDoctorDashboard ? <DoctorSidebar /> : <Sidebar />}
      <div className={isDoctorDashboard ? "ml-64 min-h-screen" : "md:ml-[260px] min-h-screen"}>
        {children}
      </div>
    </div>
  );
}
