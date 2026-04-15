import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import BottomNav from '../components/organisms/BottomNav';
import Button from '../components/atoms/Button';
import { 
  Heart, Calendar, Baby, Apple, 
  ChevronRight, Activity, AlertTriangle, Info
} from 'lucide-react';

const MaternalHealthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDF2F8] pb-24">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-10 p-10 bg-gradient-to-br from-[#BE185D] to-[#9D174D] rounded-[3rem] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold mb-4 uppercase tracking-widest border border-white/20">
              <Baby size={12} />
              <span>Pregnancy Journey</span>
            </div>
            <h2 className="text-4xl font-display font-bold mb-3 leading-tight">Maternal Care</h2>
            <p className="text-pink-100 mb-8 max-w-sm text-lg">Week 24 of your journey. You and baby are doing great!</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="white" className="text-[#BE185D]" onClick={() => alert("Vitals logger opening...")}>Log Vitals</Button>
              <Button variant="ghost" className="text-white border-white border hover:bg-white/10" onClick={() => alert("Loading care plan...")}>View Plan</Button>
            </div>
          </div>
          <Heart className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 text-white/10 -mr-20 opacity-40" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Growth Tracker */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#FBCFE8] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-[#1A2332] mb-6 flex items-center gap-2">
              <div className="p-2 bg-pink-100 rounded-lg text-[#BE185D]">
                <Baby size={22} />
              </div>
              Baby's Growth
            </h3>
            <div className="flex items-center gap-4 p-6 bg-[#FDF2F8] rounded-[2rem] border border-[#FBCFE8]">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm">🌽</div>
              <div>
                <p className="text-xs font-bold text-[#8A9BB0] uppercase tracking-wider mb-1">Current Size</p>
                <p className="text-lg font-bold text-[#1A2332]">Like a Corn</p>
                <p className="text-xs text-[#BE185D] font-bold">11.8 inches • 1.3 lbs</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-[#4A5A72] leading-relaxed">
              Baby is starting to develop white blood cells to help fight off infections. Their eyes will soon begin to open!
            </p>
          </div>

          {/* Danger Signs Alert */}
          <div className="bg-[#FDEDEC] p-8 rounded-[2.5rem] border border-[#FADBD8] shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-bold text-[#C0392B] mb-6 flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle size={22} />
              </div>
              Danger Signs
            </h3>
            <ul className="space-y-3 relative z-10">
              {[
                'Severe headache',
                'Blurred vision',
                'Sudden swelling of hands/face',
                'Decreased baby movement'
              ].map(sign => (
                <li key={sign} className="text-sm text-[#C0392B] flex items-center gap-3 font-bold bg-white/50 p-2 rounded-xl border border-red-100/50">
                   <div className="w-2 h-2 rounded-full bg-[#C0392B]" /> {sign}
                </li>
              ))}
            </ul>
            <div className="mt-8 relative z-10">
              <Button 
                variant="danger" 
                className="w-full py-4 text-xs tracking-widest uppercase font-black shadow-lg shadow-red-200"
                onClick={() => navigate('/consultation')}
              >
                Immediate SOS Consultation
              </Button>
            </div>
            <AlertTriangle className="absolute bottom-0 right-0 w-32 h-32 text-red-500/5 -mr-8 -mb-8" />
          </div>

          {/* Reminders */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#1A2332]">Upcoming Milestones</h3>
              <button className="text-sm font-bold text-[#BE185D] hover:underline">Full Schedule</button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'ANC Checkup 3', date: '21st April', desc: 'Focus on Blood Sugar and BP', icon: <Activity size={20} /> },
                { title: 'Tetanus Shot', date: '25th April', desc: 'Booster Dose #2', icon: <Calendar size={20} /> }
              ].map(event => (
                <div 
                  key={event.title} 
                  className="bg-white p-6 rounded-2xl border border-[#D4DCE8] flex items-center justify-between shadow-sm hover:border-[#BE185D] hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => alert(`Details for ${event.title}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FDF2F8] flex items-center justify-center text-[#BE185D] group-hover:bg-[#BE185D] group-hover:text-white transition-colors duration-300">
                      {event.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#1A2332]">{event.title}</h4>
                      <p className="text-xs text-[#8A9BB0] font-medium">{event.date} • {event.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-[#D4DCE8] group-hover:text-[#BE185D] group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          <div className="md:col-span-2 bg-gradient-to-r from-[#E6F7EE] to-white p-8 rounded-[2.5rem] border border-[#D4DCE8] shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white border border-[#D4DCE8] flex items-center justify-center text-success shadow-sm shadow-success/10">
              <Apple size={40} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-success font-bold text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                Nutrition Guide <Info size={16} />
              </h3>
              <p className="text-sm text-[#4A5A72] mb-4 font-medium leading-relaxed">
                Focus on <b>Iron</b> and <b>Folic Acid</b> this week. Adding green leafy vegetables and seasonal fruits will help both you and baby.
              </p>
              <Button 
                size="sm" 
                variant="primary"
                className="bg-success hover:bg-success-dark border-none"
                onClick={() => navigate('/education')}
              >
                Read Nutritional Tips
              </Button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MaternalHealthPage;
