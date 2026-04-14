'use client';

import { useState, useEffect } from 'react';
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
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useOnlineStatus, useOfflineSync } from '@/hooks/use-offline';
import OfflineSyncIndicator from '../ui/OfflineSyncIndicator';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Symptom Checker', href: '/symptom-checker', icon: Brain },
  { name: 'Find Doctors', href: '/dashboard/doctors', icon: Stethoscope },
  { name: 'My Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Health Records', href: '/dashboard/records', icon: Folder },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

function getAvatarColor(name: string) {
  const colors = ["#00C896", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Sidebar() {
  const pathname = usePathname();
  const isOnline = useOnlineStatus();
  const { isSyncing, syncData } = useOfflineSync();
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
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#0A2540] border-r border-white/5 flex flex-col z-40 hidden md:flex">
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
              className={`flex items-center gap-3 px-3 py-3 w-full rounded-md transition-all duration-150 ease-in-out font-medium text-[14px] ${
                isActive 
                  ? 'bg-[#00C896]/12 text-white border-l-2 border-[#00C896]' 
                  : 'text-white/55 hover:text-white/90 border-l-2 border-transparent'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-white/55'} />
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
