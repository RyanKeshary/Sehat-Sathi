import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, FileText, Users, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const BottomNav = () => {
  const { t } = useLanguage();

  const navItems = [
    { icon: <Home size={22} />, label: 'Home', path: '/dashboard' },
    { icon: <MessageSquare size={22} />, label: 'Consult', path: '/consultation' },
    { icon: <FileText size={22} />, label: 'Records', path: '/records' },
    { icon: <Users size={22} />, label: 'Family', path: '/family' },
    { icon: <MoreHorizontal size={22} />, label: 'More', path: '/settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4DCE8] px-2 pt-2 pb-safe z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 min-w-[64px] transition-colors
              ${isActive ? 'text-[#1A6FA3]' : 'text-[#8A9BB0]'}
            `}
          >
            <div className="flex items-center justify-center p-1">
              {item.icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
