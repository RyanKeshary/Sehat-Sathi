'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Brain,
  Stethoscope,
  Calendar,
  FolderOpen as Folder,
  Settings,
  Copy,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useOnlineStatus } from '@/hooks/use-offline';
import OfflineSyncIndicator from '../ui/OfflineSyncIndicator';
import { useMobile } from '@/hooks/useMobile';

// Navigation configuration for the patient dashboard
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Symptom Checker', href: '/symptom-checker', icon: Brain },
  { name: 'Find Doctors', href: '/dashboard/doctors', icon: Stethoscope },
  { name: 'My Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Health Records', href: '/dashboard/records', icon: Folder },
  { name: 'DocVault', href: '/dashboard/docvault', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

// First 5 items for the mobile bottom nav
const mobileNavItems = navItems.slice(0, 5);

function getAvatarColor(name: string) {
  const colors = ["#00C896", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/** ─── Desktop Sidebar ───────────────────────────────────── */
function DesktopSidebar() {
  const pathname = usePathname();
  const isOnline = useOnlineStatus();
  const [copied, setCopied] = useState(false);

  const patient = {
    name: "Ranjit Singh",
    abha: "91-1234-5678-9012"
  };

  const initials = patient.name.split(' ').map(n => n[0]).join('');

  const copyAbha = () => {
    navigator.clipboard.writeText(patient.abha);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#0A2540] border-r border-white/5 flex-col z-40 hidden md:flex">
      <div className="p-6 pb-8 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ 
              background: `linear-gradient(135deg, ${getAvatarColor(patient.name)}, ${getAvatarColor(patient.name + "x")})` 
            }}
          >
            {initials}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-white font-[600] text-[16px] truncate" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {patient.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5 opacity-50 hover:opacity-100 transition-opacity">
              <span className="font-mono text-[12px] truncate text-white">
                ABHA: {patient.abha}
              </span>
              <button onClick={copyAbha} className="shrink-0 text-white hover:text-[#00C896] transition-colors">
                {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 w-full rounded-md transition-all duration-150 ease-in-out font-medium text-[14px]",
                isActive 
                  ? 'bg-[#00C896]/12 text-[#00C896] border-l-2 border-[#00C896]' 
                  : 'text-white/55 hover:text-white/90 border-l-2 border-transparent hover:bg-white/5'
              )}
            >
              <Icon size={20} className={isActive ? 'text-[#00C896]' : 'text-white/55'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 flex items-center justify-center">
        <OfflineSyncIndicator />
      </div>
    </aside>
  );
}

/** ─── Mobile Bottom Navigation Bar ──────────────────────── */
function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[9990] md:hidden"
      style={{
        height: '64px',
        background: '#0A2540',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 active:bg-white/5 rounded-lg transition-colors"
            >
              <Icon
                size={24}
                className={cn(
                  "transition-colors",
                  isActive ? "text-[#00C896]" : "text-white/50"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium truncate max-w-[60px] text-center leading-tight",
                  isActive ? "text-[#00C896]" : "text-white/40"
                )}
              >
                {item.name === 'Symptom Checker' ? 'Symptoms' : item.name.split(' ')[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** ─── Main Export ────────────────────────────────────────── */
export default function Sidebar() {
  const isMobile = useMobile();

  return (
    <>
      <DesktopSidebar />
      {isMobile && <MobileBottomNav />}
    </>
  );
}
