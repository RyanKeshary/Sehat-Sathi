import React, { useState } from 'react';
import Navbar from '../components/organisms/Navbar';
import BottomNav from '../components/organisms/BottomNav';
import Input from '../components/atoms/Input';
import { 
  Play, BookOpen, Search, Info, 
  ChevronRight, Filter, Video, FileText, Sparkles
} from 'lucide-react';

const CategoryBtn = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm ${
      active ? 'bg-primary text-white shadow-primary/30' : 'bg-white text-[#4A5A72] border border-[#D4DCE8] hover:border-primary hover:text-primary'
    }`}
  >
    {children}
  </button>
);

const ContentCard = ({ type, title, category, duration, image }) => (
  <div className="bg-white rounded-[2rem] overflow-hidden border border-[#D4DCE8] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group flex flex-col h-full">
    <div className="relative h-48 bg-gray-100 overflow-hidden">
      {/* Visual representation */}
      <div className="absolute inset-0 flex items-center justify-center text-[#8A9BB0]/20 group-hover:scale-110 transition-transform duration-700">
        {type === 'video' ? <Video size={80} /> : <FileText size={80} />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      {type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-colors">
          <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center text-primary shadow-2xl group-hover:scale-110 transition-transform">
            <Play size={28} fill="currentColor" className="ml-1" />
          </div>
        </div>
      )}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-sm">
        {category}
      </div>
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-lg font-bold">
        {duration}
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <h4 className="text-base font-bold text-[#1A2332] mb-4 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{title}</h4>
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-[10px] font-black text-[#8A9BB0] uppercase tracking-widest flex items-center gap-1">
          {type === 'video' ? <Video size={12} /> : <FileText size={12} />} {type}
        </span>
        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  </div>
);

const HealthEducationHub = () => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Hygiene', 'Maternal', 'Nutrition', 'Diseases', 'First Aid'];

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <header className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-light rounded-full text-primary text-[10px] font-bold mb-4 uppercase tracking-widest">
            <Sparkles size={12} />
            <span>Curated Health Knowledge</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-[#1A2332] mb-3">Health Education Hub</h2>
          <p className="text-[#8A9BB0] font-medium leading-relaxed">Essential knowledge to keep your family healthy and prevent seasonal illnesses.</p>
        </header>

        {/* Search & Filter */}
        <div className="mb-12 flex flex-col items-center">
          <div className="w-full max-w-3xl mb-8 relative">
            <Input 
              placeholder="Search for 'Clean Water', 'Nurtition', 'Baby Care'..." 
              leftIcon={<Search size={22} className="text-primary" />} 
              wrapperClassName="shadow-xl rounded-[2.5rem] overflow-hidden border-none"
              className="py-6 pl-14 text-lg border-none"
            />
          </div>
          <div className="flex overflow-x-auto gap-3 no-scrollbar pb-2 w-full justify-start md:justify-center">
            {categories.map(c => (
              <CategoryBtn key={c} active={filter === c} onClick={() => setFilter(c)}>{c}</CategoryBtn>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-[#1A2332]">Recommended for You</h3>
            <button className="text-sm font-bold text-primary group flex items-center gap-1">
              Explore All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ContentCard 
              type="video" 
              category="Hygiene" 
              title="Proper Handwashing Techniques for Families" 
              duration="3:45" 
            />
            <ContentCard 
              type="article" 
              category="Nutrition" 
              title="Importance of Iron-Rich Foods in Pregnancy" 
              duration="5 min read" 
            />
            <ContentCard 
              type="video" 
              category="Prevention" 
              title="Preventing Malaria During Monsoon Season" 
              duration="2:15" 
            />
            <ContentCard 
              type="article" 
              category="First Aid" 
              title="What to do in case of a Minor Burn" 
              duration="3 min read" 
            />
          </div>
        </section>

        {/* Knowledge Paths */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-primary to-[#155a84] p-10 rounded-[3rem] text-white flex justify-between items-center group cursor-pointer shadow-xl hover:shadow-primary/20 transition-all">
            <div className="max-w-[70%]">
              <h4 className="text-2xl font-display font-bold mb-3">Mother & Child Journey</h4>
              <p className="text-blue-100 text-sm opacity-90 leading-relaxed">A comprehensive 6-course certification program designed specifically for new mothers in rural communities.</p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/20 px-4 py-2 rounded-full border border-white/20 group-hover:bg-white group-hover:text-primary transition-all">
                Learn More <ArrowRight size={14} />
              </div>
            </div>
            <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-inner">
              <BookOpen size={36} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-success to-success-dark p-10 rounded-[3rem] text-white flex justify-between items-center group cursor-pointer shadow-xl hover:shadow-success/20 transition-all">
            <div className="max-w-[70%]">
              <h4 className="text-2xl font-display font-bold mb-3">Clean Village Guide</h4>
              <p className="text-green-100 text-sm opacity-90 leading-relaxed">Community leaders' essential guide to maintaining health and sanitation protocols in the village.</p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/20 px-4 py-2 rounded-full border border-white/20 group-hover:bg-white group-hover:text-success transition-all">
                Learn More <ArrowRight size={14} />
              </div>
            </div>
            <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-inner">
              <Info size={36} />
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default HealthEducationHub;
