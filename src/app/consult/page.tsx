'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Star, Filter, Heart, ChevronDown, Check, ArrowRight, Video, 
  Calendar, MapPin, SearchIcon, FileText, ChevronUp, X, UploadCloud,
  ChevronLeft, ChevronRight, Mic, CreditCard, Stethoscope, ArrowLeft, Plus
} from 'lucide-react';
import { mockDoctors, specialties } from './mockData';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ConsultPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSpecialty, setActiveSpecialty] = useState("All");
  
  // Skeleton Loading State
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter States
  const [feeRange, setFeeRange] = useState(2000);
  const [freeForRural, setFreeForRural] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    languages: true,
    availability: true,
    rating: false,
    experience: false,
    fee: true
  });

  const toggleFilter = (key: string) => {
    setExpandedFilters(p => ({ ...p, [key]: !p[key] }));
  };

  const resetAll = () => {
    setFeeRange(2000);
    setFreeForRural(false);
    setActiveSpecialty("All");
  };

  // Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-20">
      
      {/* Header & Search */}
      <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100 px-4 md:px-8 py-3 h-[80px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden md:block">
             <ArrowLeft size={20} className="text-slate-600" />
           </button>
           <div className="font-bold text-[#0A2540] text-xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Doctor Discovery
           </div>
        </div>
        
        <div className="flex-1 max-w-[600px] relative">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00C896] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by specialization, name, or symptom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#00C896] focus:ring-4 focus:ring-[#00C896]/10 rounded-full py-3.5 pl-12 pr-4 outline-none transition-all text-sm font-inter"
            />
          </div>
          
          {/* Live Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 z-50 max-h-[300px] overflow-y-auto"
              >
                <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Specialists</div>
                <div className="px-2 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-sm flex justify-between">
                  <span>Cardiologist</span>
                  <span className="text-slate-400">12 matches</span>
                </div>
                <div className="px-3 py-2 mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Doctors</div>
                <div className="px-2 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-sm flex gap-3 items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600 font-bold">P</div>
                  <span>Dr. Priya Sharma</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Placeholder for header balance */}
        <div className="w-[100px] hidden md:block"></div>
      </header>

      {/* Specialty Quick Filters */}
      <div className="bg-white border-b border-slate-100 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar pb-2">
          <div className="flex gap-3 whitespace-nowrap px-1">
            {specialties.map(spec => {
              const active = activeSpecialty === spec;
              return (
                <button
                  key={spec}
                  onClick={() => setActiveSpecialty(spec)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    active 
                      ? 'bg-[#0A2540] text-white shadow-md transform scale-[1.02]' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0A2540]/30 hover:bg-slate-50'
                  }`}
                >
                  {spec}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-[280px] shrink-0 bg-white rounded-2xl border border-slate-200 p-5 sticky top-[160px] max-h-[calc(100vh-180px)] overflow-y-auto hidden md:block">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Filters</h3>
            <button onClick={resetAll} className="text-xs font-semibold text-[#00C896] hover:underline">Reset All</button>
          </div>
          
          <div className="space-y-6 divide-y divide-slate-100">
            {/* Consultation Fee */}
            <div className="pt-4 first:pt-0">
              <button onClick={() => toggleFilter('fee')} className="flex items-center justify-between w-full mb-4">
                <span className="font-semibold text-slate-800 text-sm">Consultation Fee</span>
                {expandedFilters['fee'] ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>
              <AnimatePresence>
                {expandedFilters['fee'] && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-4 cursor-pointer" onClick={() => setFreeForRural(!freeForRural)}>
                      <span className="text-sm font-semibold text-emerald-800">Free for rural patients</span>
                      <div className={`w-10 h-6 rounded-full transition-colors relative ${freeForRural ? 'bg-[#00C896]' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${freeForRural ? 'left-5' : 'left-1'}`} />
                      </div>
                    </div>
                    <div>
                      <input 
                        type="range" 
                        min="0" max="2000" step="100" 
                        value={feeRange} 
                        onChange={e => setFeeRange(Number(e.target.value))}
                        className="w-full accent-[#00C896]" 
                      />
                      <div className="flex justify-between text-xs font-medium text-slate-500 mt-2">
                        <span>₹0</span>
                        <span className="text-[#00C896] font-bold">Up to ₹{feeRange}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Languages */}
            <div className="pt-4">
              <button onClick={() => toggleFilter('languages')} className="flex items-center justify-between w-full mb-3">
                <span className="font-semibold text-slate-800 text-sm">Languages</span>
                {expandedFilters['languages'] ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>
              <AnimatePresence>
                {expandedFilters['languages'] && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden space-y-2.5 pb-2">
                    {['English / English', 'हिंदी / Hindi', 'मराठी / Marathi', 'తెలుగు / Telugu'].map(lang => (
                      <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded border border-slate-300 group-hover:border-[#00C896] flex items-center justify-center transition-colors">
                          <Check size={14} className="text-[#00C896] opacity-0" />
                        </div>
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{lang}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Availability */}
            <div className="pt-4">
              <button onClick={() => toggleFilter('availability')} className="flex items-center justify-between w-full mb-3">
                <span className="font-semibold text-slate-800 text-sm">Availability</span>
                {expandedFilters['availability'] ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>
              <AnimatePresence>
                {expandedFilters['availability'] && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden space-y-2 pb-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="availability" className="accent-[#00C896] w-4 h-4 cursor-pointer" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-medium">Anytime</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="availability" className="accent-[#00C896] w-4 h-4 cursor-pointer" defaultChecked />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-medium">Today</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="availability" className="accent-[#00C896] w-4 h-4 cursor-pointer" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-medium">This Week</span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </aside>

        {/* Grid Area */}
        <div className="flex-1 w-full">
          <div className="mb-6 flex justify-between items-center hidden md:flex">
             <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
               {activeSpecialty === 'All' ? 'Available Doctors' : `${activeSpecialty}s`}
             </h2>
             <span className="text-sm text-slate-500 font-medium">{mockDoctors.length} results</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-100 rounded-lg mb-4"></div>
                  <div className="h-6 bg-slate-100 rounded w-1/3 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-slate-200 rounded-lg flex-1"></div>
                    <div className="h-10 bg-slate-200 rounded-lg flex-1"></div>
                  </div>
                </div>
              ))
            ) : (
              mockDoctors.map((doc, idx) => (
                <motion.div 
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col group transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img src={doc.avatar} alt={doc.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-50 shadow-sm" />
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                        doc.status === 'online' ? 'bg-[#00C896]' : doc.status === 'busy' ? 'bg-amber-400' : 'bg-slate-400'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#0A2540] truncate leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{doc.name}</h3>
                      <p className="text-[#00C896] text-sm font-medium">{doc.specialization}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{doc.experience} Years Exp.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex items-center gap-1.5">
                      <Star size={16} className="text-amber-400 fill-amber-400" />
                      <span className="font-bold text-sm text-slate-700">{doc.rating}</span>
                      <span className="text-xs text-slate-400">({doc.reviews} Reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.languages.slice(0, 2).map(lang => (
                        <span key={lang} className="text-[10px] font-semibold tracking-wide uppercase bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {lang}
                        </span>
                      ))}
                      {doc.languages.length > 2 && (
                        <span className="text-[10px] font-semibold tracking-wide uppercase bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          +{doc.languages.length - 2} more
                        </span>
                      )}
                    </div>
                    {doc.rural && (
                      <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 w-fit px-2 py-1 rounded-md mt-1 flex items-center gap-1 border border-emerald-100">
                        <Check size={12} /> Serves Rural Patients
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                       <span className="font-bold text-slate-800 text-lg">
                         {doc.fee === 0 ? <span className="text-[#00C896]">Free</span> : `₹${doc.fee}`}
                         <span className="text-xs font-normal text-slate-400"> / session</span>
                       </span>
                       <span className={`text-[11px] font-bold px-2 py-1 rounded-md border ${
                         doc.nextSlot.includes('Today') ? 'text-emerald-700 border-emerald-200 bg-emerald-50' :
                         doc.nextSlot.includes('Tomorrow') ? 'text-amber-700 border-amber-200 bg-amber-50' :
                         'text-slate-600 border-slate-200 bg-slate-50'
                       }`}>
                         {doc.nextSlot}
                       </span>
                    </div>

                    <div className="flex gap-2">
                       <button 
                         onClick={() => setSelectedDoctor(doc)}
                         className="flex-1 border border-[#0A2540] text-[#0A2540] hover:bg-slate-50 py-2.5 rounded-xl text-sm font-bold transition-colors"
                       >
                         View Profile
                       </button>
                       <button 
                         onClick={() => setSelectedDoctor({...doc, openBooking: true})}
                         className="flex-1 bg-[#00C896] hover:bg-[#00b084] text-white py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_14px_0_rgba(0,200,150,0.39)] transition-all overflow-hidden relative group/btn"
                       >
                         <span className="relative z-10 flex items-center justify-center gap-1.5 transition-transform group-hover/btn:-translate-x-1">
                           Book Now
                           <ArrowRight size={14} className="opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 group-hover/btn:ml-0 transition-all" />
                         </span>
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            {/* Infinite Scroll Area Placeholder */}
            {!isLoading && (
              <div className="col-span-full py-8 flex justify-center">
                <div className="inline-flex items-center gap-2 text-slate-400">
                   <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                   <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedDoctor && (
        <DoctorProfileModal 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
          initialBookingOpen={selectedDoctor.openBooking}
        />
      )}
    </div>
  );
}

// Subcomponent: Doctor Profile Modal
function DoctorProfileModal({ doctor, onClose, initialBookingOpen }: { doctor: any, onClose: () => void, initialBookingOpen?: boolean }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookingStep, setBookingStep] = useState(initialBookingOpen ? 1 : 0);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [success, setSuccess] = useState(false);

  // Lock body scroll when mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const proceedToSummary = () => {
    setBookingStep(3);
  };
  
  const handleConfirm = () => {
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1, scale: typeof window !== 'undefined' && window.innerWidth >= 640 ? 1 : 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white w-full h-full sm:h-[85vh] sm:max-h-[800px] sm:max-w-[900px] sm:rounded-[2rem] overflow-hidden flex flex-col relative z-20 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-colors">
           <X size={20} />
        </button>

        {success ? (
           <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-emerald-50/50">
             <motion.div 
               initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
               className="w-24 h-24 bg-[#00C896] rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-[#00C896]/30"
             >
               <Check size={48} strokeWidth={3} />
             </motion.div>
             <h2 className="text-3xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Consultation Confirmed!</h2>
             <p className="text-slate-600 mb-8 max-w-md mx-auto">Your telemedicine session with {doctor.name} has been booked. A confirmation SMS has been sent.</p>
             
             <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-sm mb-8 text-left shadow-sm">
               <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                 <span className="text-sm font-medium text-slate-500">Date & Time</span>
                 <span className="font-bold text-slate-800">{selectedSlot}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium text-slate-500">Total Fee</span>
                 <span className="font-bold text-[#00C896] text-lg">{doctor.fee === 0 ? 'Free' : `₹${doctor.fee}`}</span>
               </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
               <button onClick={onClose} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-3.5 rounded-xl font-bold transition-all">
                 Return to List
               </button>
               <Link href="/room" className="bg-[#00C896] hover:bg-[#00b084] text-white px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00C896]/30">
                 Join Room Now <ArrowRight size={18} />
               </Link>
             </div>
             
             {/* Confetti mock */}
             <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-multiply opacity-50">
               {[...Array(20)].map((_, i) => (
                 <motion.div
                   key={i}
                   className="absolute text-[#00C896]"
                   initial={{ 
                     top: '100%', 
                     left: `${Math.random() * 100}%`,
                     rotate: 0,
                     scale: Math.random() * 1 + 0.5 
                   }}
                   animate={{ 
                     top: '-10%',
                     rotate: 360,
                   }}
                   transition={{ 
                     duration: Math.random() * 2 + 2, 
                     delay: Math.random() * 0.5,
                     ease: "easeOut" 
                   }}
                 >
                   <Plus size={24} />
                 </motion.div>
               ))}
             </div>
           </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            {/* Left/Top Content Area */}
            <div className={`flex-1 overflow-y-auto ${bookingStep > 0 ? 'hidden md:block' : ''}`}>
              <div className="h-[200px] relative w-full shrink-0">
                <img src={doctor.avatar.replace('150', '800')} alt={doctor.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{doctor.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className="bg-[#00C896]/20 text-[#00C896] backdrop-blur-md px-3 py-1 rounded-md text-sm font-bold border border-[#00C896]/30">
                      {doctor.specialization}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      {doctor.rating} ({doctor.reviews})
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex gap-6 border-b border-slate-200 mb-6 relative">
                  {['overview', 'experience', 'reviews'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 font-semibold text-sm capitalize relative transition-colors ${activeTab === tab ? 'text-[#00C896]' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00C896]" />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                         <div>
                           <h4 className="font-bold text-slate-800 mb-2">About The Doctor</h4>
                           <p className="text-slate-600 text-sm leading-relaxed">
                             {doctor.name} is a highly experienced {doctor.specialization.toLowerCase()} dedicated to providing comprehensive care. 
                             They specialize in remote diagnosis and management of chronic conditions, heavily supporting rural patients via the Sehat Sathi platform.
                           </p>
                         </div>
                         <div>
                           <h4 className="font-bold text-slate-800 mb-3">Consultation Approaches</h4>
                           <div className="flex flex-wrap gap-2">
                             <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-xs font-bold border border-indigo-100"><Video size={14} /> Video Call</div>
                             <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-lg text-xs font-bold border border-amber-100"><Mic size={14} /> Voice Call</div>
                             <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold border border-blue-100"><FileText size={14} /> Chat & Reports</div>
                           </div>
                         </div>
                      </div>
                    )}
                    {activeTab === 'experience' && (
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="w-px bg-slate-200 shrink-0 ml-2 relative">
                            <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-[#00C896]"></div>
                            <div className="absolute top-16 -left-1.5 w-3 h-3 rounded-full bg-slate-300"></div>
                          </div>
                          <div className="space-y-8">
                            <div>
                              <h5 className="font-bold text-slate-800">Senior Consultant</h5>
                              <p className="text-sm font-medium text-slate-500">Apollo Hospitals • 2018 - Present</p>
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-800">MBBS, MD ({doctor.specialization})</h5>
                              <p className="text-sm font-medium text-slate-500">AIIMS Delhi • 2010 - 2015</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'reviews' && (
                      <div className="space-y-4">
                         <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="flex gap-0.5"><Star size={12} className="fill-amber-400 text-amber-400"/><Star size={12} className="fill-amber-400 text-amber-400"/><Star size={12} className="fill-amber-400 text-amber-400"/><Star size={12} className="fill-amber-400 text-amber-400"/><Star size={12} className="fill-amber-400 text-amber-400"/></div>
                               <span className="font-bold text-slate-800 text-xs">A week ago</span>
                            </div>
                            <p className="text-sm text-slate-600">"Very patient and understanding. Doctor listened to all my symptoms carefully over the video call and prescribed medicines that were easily available locally."</p>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="flex gap-0.5"><Star size={12} className="fill-amber-400 text-amber-400"/><Star size={12} className="fill-amber-400 text-amber-400"/><Star size={12} className="fill-amber-400 text-amber-400"/><Star size={12} className="fill-amber-400 text-amber-400"/><Star size={12} className="text-slate-300"/></div>
                               <span className="font-bold text-slate-800 text-xs">2 weeks ago</span>
                            </div>
                            <p className="text-sm text-slate-600">"Good consultation, network was a bit patchy but the doctor called back immediately."</p>
                         </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Booking Sidebar */}
            <div className={`w-full md:w-[360px] md:border-l border-slate-100 bg-[#F8FAFC] flex flex-col shrink-0 overflow-y-auto ${bookingStep === 0 ? 'hidden md:flex' : 'flex h-full'}`}>
              <div className="p-6 flex-1">
                {bookingStep === 0 && (
                  <div className="h-full flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-[#00C896]/10 text-[#00C896] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar size={28} />
                    </div>
                    <h3 className="font-bold text-xl text-slate-800 mb-2">Ready to consult?</h3>
                    <p className="text-sm text-slate-500 mb-8 mx-auto">Book a telemedicine session right now. Appointments available for {doctor.nextSlot}.</p>
                    <button 
                      onClick={() => setBookingStep(1)}
                      className="w-full bg-[#00C896] hover:bg-[#00b084] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#00C896]/30 transition-transform hover:-translate-y-1"
                    >
                      Start Booking Flow
                    </button>
                    <div className="mt-4 text-xs font-semibold text-slate-400 flex items-center justify-center gap-1">
                      <Check size={14} /> Cancel anytime before 2 hours
                    </div>
                  </div>
                )}

                {bookingStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                      <button onClick={() => setBookingStep(0)} className="text-slate-400 hover:text-slate-800 md:hidden"><ChevronLeft size={20}/></button>
                      <h3 className="font-bold text-lg text-slate-800">Step 1: Select Time</h3>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-slate-800 text-sm">October 2024</span>
                        <div className="flex gap-2">
                          <button className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400"><ChevronLeft size={14}/></button>
                          <button className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600"><ChevronRight size={14}/></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                        <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                         {Array(10).fill(0).map((_, i) => <div key={i} className="aspect-square flex items-center justify-center text-sm font-medium text-slate-300 rounded-lg">{i + 1}</div>)}
                         <div className="aspect-square flex items-center justify-center text-sm font-bold text-[#00C896] bg-[#00C896]/10 border border-[#00C896] rounded-lg cursor-pointer">11</div>
                         {Array(4).fill(0).map((_, i) => <div key={i+20} className="aspect-square flex items-center justify-center text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer">{i + 12}</div>)}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Available Slots</span>
                      <div className="grid grid-cols-2 gap-2">
                        {['09:00 AM', '11:30 AM', '02:00 PM', '04:15 PM'].map(time => (
                          <button 
                            key={time}
                            onClick={() => setSelectedSlot(`Oct 11, ${time}`)}
                            className={`py-2 rounded-lg text-sm font-bold border transition-colors ${
                              selectedSlot.includes(time) ? 'bg-[#0A2540] text-white border-[#0A2540]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#0A2540]'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      disabled={!selectedSlot}
                      onClick={() => setBookingStep(2)}
                      className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        selectedSlot ? 'bg-[#0A2540] text-white hover:bg-[#113a65]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}

                {bookingStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                      <button onClick={() => setBookingStep(1)} className="text-slate-400 hover:text-slate-800"><ChevronLeft size={20}/></button>
                      <h3 className="font-bold text-lg text-slate-800">Step 2: Details</h3>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-2">Describe your concern</label>
                      <div className="relative">
                        <textarea 
                          rows={4}
                          placeholder="e.g. Having severe headache for 3 days..."
                          className="w-full bg-white border border-slate-200 focus:border-[#00C896] rounded-xl p-3 outline-none resize-none text-sm font-medium text-slate-700"
                        />
                        <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100">
                          <Mic size={16} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-2">Upload Records (Optional)</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl bg-white p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                        <UploadCloud size={24} className="text-slate-400 mb-2" />
                        <span className="text-sm font-bold text-[#00C896]">Tap to upload files</span>
                        <span className="text-xs text-slate-500 mt-1">Prescriptions, Lab Results, X-Rays</span>
                      </div>
                    </div>

                    <button 
                      onClick={proceedToSummary}
                      className="w-full bg-[#0A2540] text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      Review Booking <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}

                {bookingStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                      <button onClick={() => setBookingStep(2)} className="text-slate-400 hover:text-slate-800"><ChevronLeft size={20}/></button>
                      <h3 className="font-bold text-lg text-slate-800">Step 3: Confirm</h3>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <img src={doctor.avatar} className="w-12 h-12 rounded-full" />
                        <div>
                          <h4 className="font-bold text-slate-800">{doctor.name}</h4>
                          <span className="text-xs font-semibold text-slate-500">{doctor.specialization}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Session Time</span>
                        <span className="font-bold text-slate-800">{selectedSlot}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Consultation Fee</span>
                        <span className="font-bold text-slate-800 text-base">{doctor.fee === 0 ? 'Free' : `₹${doctor.fee}`}</span>
                      </div>
                      
                      {doctor.fee > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-medium">Platform Fee</span>
                          <span className="font-bold text-slate-800 text-base">₹50</span>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-200 border-dashed flex justify-between items-center">
                        <span className="font-bold text-slate-800 uppercase tracking-widest text-xs">Total</span>
                        <span className="font-bold text-[#00C896] text-xl">{doctor.fee === 0 ? 'Free' : `₹${doctor.fee + 50}`}</span>
                      </div>
                    </div>

                    {doctor.fee > 0 ? (
                      <button onClick={handleConfirm} className="w-full bg-[#00C896] text-white py-3.5 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2">
                        <CreditCard size={18} /> Pay & Confirm Booking
                      </button>
                    ) : (
                      <button onClick={handleConfirm} className="w-full bg-[#0A2540] text-white py-3.5 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2">
                        <Check size={18} /> Confirm Free Consultation
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
