import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../molecules/LanguageSwitcher';
import { Bell, User, HeartPulse, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#D4DCE8] h-16 flex items-center px-4 md:px-8 shadow-sm">
      <Link to="/dashboard" className="flex items-center gap-2 group transition-transform active:scale-95">
        <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
          <HeartPulse size={24} />
        </div>
        <h1 className="text-xl font-black font-display text-[#1A2332] hidden sm:block tracking-tight">
          Sehatsetu
        </h1>
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden lg:flex">
          <LanguageSwitcher variant="compact" />
        </div>

        <button className="relative p-2 text-[#4A5A72] hover:text-primary hover:bg-primary-light rounded-xl transition-all group">
          <Bell size={22} className="group-hover:animate-bounce" />
          <span className="absolute top-1 right-1 bg-danger text-white text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-black border-2 border-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[#D4DCE8]">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-black text-[#1A2332]">
              {user?.name || 'Guest User'}
            </span>
            <span className="text-[10px] text-[#8A9BB0] font-bold uppercase tracking-widest">
              {user?.role || 'Patient'}
            </span>
          </div>
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-primary-light flex items-center justify-center text-primary font-black shadow-inner border border-primary/10 overflow-hidden">
               {user?.name?.[0] || <User size={22} />}
            </div>
            {/* Simple Menu on Hover Placeholder */}
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block transition-all">
              <div className="bg-white border border-[#D4DCE8] rounded-2xl shadow-2xl p-2 w-48">
                <button 
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center gap-3 p-3 text-sm font-bold text-[#4A5A72] hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <User size={18} /> Profile Settings
                </button>
                <button 
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 p-3 text-sm font-bold text-danger hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
