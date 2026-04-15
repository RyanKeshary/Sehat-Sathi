'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Calendar, 
  RefreshCw, 
  Activity, 
  TrendingDown, 
  CloudOff, 
  Cloud,
  Clock,
  ChevronRight,
  Phone,
  MessageCircle,
  FileText,
  FileSpreadsheet,
  Stethoscope,
  Globe,
  Settings2,
  AlertCircle,
  HeartPulse,
  Brain,
  Check
} from 'lucide-react';
import { useOnlineStatus, useOfflineSync } from '@/hooks/use-offline';
import { ToastNotification } from '@/components/ui/ToastNotification';
import Link from 'next/link';

// Mock Data
const mockStats = {
  nextAppointment: { days: 2, hours: 4, doctor: "Dr. Anjali Sharma" },
  healthRecords: { total: 5, online: 3, offline: 2 },
  aiConsultations: 4,
  lastVitals: { value: "120/80", unit: "mmHg", trend: "down" }
};

const mockAppointments = [
  {
    id: 1,
    doctor: "Dr. Anjali Sharma",
    specialization: "Cardiologist",
    dateLabel: "Tomorrow, 10:30 AM",
    status: "Confirmed",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    doctor: "Dr. Vikram Singh",
    specialization: "General Physician",
    dateLabel: "Apr 28, 2:00 PM",
    status: "Pending",
    avatar: "https://i.pravatar.cc/150?img=11"
  }
];

const mockSymptomChecks = [
  { id: 1, date: "Today, 9:00 AM", symptom: "Mild Headache & Fever", triage: "Self-care", color: "bg-green-100 text-green-700 border-green-200" },
  { id: 2, date: "Oct 12, 2024", symptom: "Persistent Cough", triage: "Schedule visit", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: 3, date: "Sep 28, 2024", symptom: "Chest Pain tightness", triage: "Emergency", color: "bg-red-100 text-red-700 border-red-200" },
];

const mockRecords = [
  { id: 1, title: "Cardiology Prescription", date: "Oct 15, 2024", type: "prescription", offline: true },
  { id: 2, title: "Complete Blood Count", date: "Sep 10, 2024", type: "lab", offline: false },
  { id: 3, title: "General Consultation Notes", date: "Aug 22, 2024", type: "note", offline: true },
];

export default function PatientDashboard() {
  const isOnline = useOnlineStatus();
  const { isSyncing, syncData } = useOfflineSync();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [dbStatus, setDbStatus] = useState("initialized"); // For offline fallback effect
  const [wasOffline, setWasOffline] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (isOnline && wasOffline) {
      // Transition from offline to online -> trigger sync
      const doSync = async () => {
        const res = await syncData();
        if (res.success) {
          setToastMessage(`${res.syncedRecords} records synced successfully ✓`);
          setToastVisible(true);
          setWasOffline(false);
        }
      };
      doSync();
    }
  }, [isOnline, wasOffline, syncData]);

  // Staggered variants for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const BrainAnimation = () => (
    <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }} 
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute inset-0 bg-[#00C896] rounded-full blur-xl"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <div className="w-16 h-16 rounded-full border border-[#00C896]/30 flex items-center justify-center bg-white shadow-lg">
           <Brain size={32} className="text-[#00C896]" />
        </div>
      </motion.div>
      {/* Nodes */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#00C896] rounded-full"
          style={{
            top: `${50 + 40 * Math.sin((i * Math.PI) / 2)}%`,
            left: `${50 + 40 * Math.cos((i * Math.PI) / 2)}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-slate-500 text-sm font-medium">
              {currentDate || "Loading date..."}
            </span>
            <div className="bg-blue-50 border border-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
              <Activity size={12} />
              Tip: Stay hydrated today
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#0A2540] flex items-center gap-2" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            Good morning, Ranjit <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
          </h1>
        </div>
        
        <Link href="/room" className="bg-[#00C896] hover:bg-[#00b084] text-white px-5 py-3 rounded-xl font-semibold shadow-[0_4px_14px_0_rgba(0,200,150,0.39)] transition-all flex items-center justify-center gap-2 group">
          <Video size={18} className="group-hover:scale-110 transition-transform" />
          Start Consultation
        </Link>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={cardVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Next Appt</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 mb-1">
              {mockStats.nextAppointment.days}d {mockStats.nextAppointment.hours}h
            </div>
            <div className="text-sm text-slate-500">
              with <Link href="/dashboard/appointments" className="text-indigo-600 font-medium hover:underline">{mockStats.nextAppointment.doctor}</Link>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <RefreshCw size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Records</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 mb-1">
              {mockStats.healthRecords.total} <span className="text-lg font-medium text-slate-400">total</span>
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-1.5">
              <span>{mockStats.healthRecords.online} online</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="flex items-center gap-1"><CloudOff size={12} className="text-amber-500"/>{mockStats.healthRecords.offline} offline</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Brain size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">AI Checks</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 mb-1">
              {mockStats.aiConsultations}
            </div>
            <div className="text-sm text-slate-500">
              completed this month
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <HeartPulse size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Last Vitals</span>
          </div>
          <div>
            <div className="flex items-end gap-2 mb-1">
              <div className="text-2xl font-bold text-slate-800">
                {mockStats.lastVitals.value}
              </div>
              <div className="text-sm font-medium text-emerald-500 flex items-center mb-1">
                <TrendingDown size={14} className="mr-0.5" /> 5%
              </div>
            </div>
            <div className="text-sm text-slate-500">
              Blood Pressure ({mockStats.lastVitals.unit})
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column - 60% */}
        <div className="flex-1 lg:w-3/5 space-y-8">
          
          {/* Upcoming Appointments */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Upcoming Appointments</h2>
              <Link href="/dashboard/appointments" className="text-sm text-[#00C896] font-medium hover:underline flex items-center">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {mockAppointments.map((appt) => {
                return (
                  <div key={appt.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img src={appt.avatar} alt={appt.doctor} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" />
                      <div>
                        <h3 className="font-bold text-slate-800">{appt.doctor}</h3>
                        <p className="text-sm text-slate-500 mb-2">{appt.specialization}</p>
                        <div className="flex items-center gap-3 text-xs font-medium">
                          <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                            <Clock size={14} />
                            {appt.dateLabel}
                          </span>
                          <span className={`px-2 py-1 rounded-md flex items-center gap-1.5 ${appt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {appt.status === 'Confirmed' ? <Check size={12} /> : <AlertCircle size={12} />}
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <Link 
                        href="/room"
                        className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 bg-[#00C896] text-white hover:bg-[#00b084]"
                      >
                        <Video size={16} />
                        Join Call
                      </Link>
                      <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                        Reschedule
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Recent Symptom Checks */}
          <section>
             <h2 className="text-lg font-bold text-slate-800 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Recent Symptom Checks</h2>
             <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm relative">
                <div className="absolute left-[39px] top-8 bottom-8 w-px bg-slate-200 hidden md:block"></div>
                <div className="space-y-6">
                  {mockSymptomChecks.map((check, idx) => (
                    <div key={check.id} className="flex gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 hidden md:flex text-indigo-500">
                        <Brain size={18} />
                      </div>
                      <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                          <h4 className="font-semibold text-slate-800">{check.symptom}</h4>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border whitespace-nowrap w-fit ${check.color}`}>
                            {check.triage}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Clock size={12} /> {check.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </section>

        </div>

        {/* Right Column - 40% */}
        <div className="flex-1 lg:w-2/5 space-y-6">
          
          {/* Quick Symptom Check Action Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 shadow-lg text-white text-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00C896] rounded-full blur-[80px] opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-[60px] opacity-20"></div>
            
            <div className="relative z-10">
              <BrainAnimation />
              
              <h3 className="text-xl font-bold mb-2">Quick Symptom Check</h3>
              <p className="text-indigo-100 text-sm font-medium mb-6 font-inter">
                Feeling unwell? Describe your symptoms in any language.
              </p>
              
              <div className="bg-white/10 p-1 rounded-xl flex items-center justify-between mb-4 border border-white/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 pl-3 text-sm">
                  <Globe size={16} className="text-[#00C896]" />
                  <span>Language</span>
                </div>
                <select className="bg-transparent text-white font-medium text-sm p-2 outline-none cursor-pointer appearance-none text-right pr-4">
                  <option className="text-slate-900">English (India)</option>
                  <option className="text-slate-900">हिंदी (Hindi)</option>
                  <option className="text-slate-900">తెలుగు (Telugu)</option>
                </select>
              </div>
              
              <Link href="/symptom-checker" className="w-full bg-[#00C896] hover:bg-[#00b084] text-white py-3.5 rounded-xl font-semibold shadow-[0_4px_14px_0_rgba(0,200,150,0.39)] transition-colors flex items-center justify-center">
                Check Symptoms
              </Link>
            </div>
          </div>

          {/* Health Records Summary */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Health Records</h2>
              <Link href="/dashboard/records" className="text-xs text-indigo-600 font-medium hover:underline">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {mockRecords.map(record => (
                <div key={record.id} className="group flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    record.type === 'prescription' ? 'bg-blue-50 text-blue-500' :
                    record.type === 'lab' ? 'bg-purple-50 text-purple-500' : 'bg-orange-50 text-orange-500'
                  }`}>
                    {record.type === 'prescription' ? <FileText size={18} /> : 
                     record.type === 'lab' ? <FileSpreadsheet size={18} /> : <Stethoscope size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{record.title}</h4>
                    <p className="text-xs text-slate-500">{record.date}</p>
                  </div>
                  {record.offline ? (
                    <div className="shrink-0 text-slate-400 group-hover:text-[#00C896] transition-colors" title="Available offline">
                      <CloudOff size={16} />
                    </div>
                  ) : (
                    <div className="shrink-0 text-slate-400 transition-colors" title="Cloud only">
                      <Cloud size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ASHA Worker Card */}
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-600">
              <Stethoscope size={64} />
            </div>
            <div className="relative z-10">
              <h2 className="text-sm font-bold justify-between flex text-emerald-900 mb-4 uppercase tracking-wider" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Your Assigned ASHA
              </h2>
              
              <div className="flex items-center gap-3 mb-4">
                <img src="https://i.pravatar.cc/150?img=44" alt="Sita Devi" className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Sita Devi</h3>
                  <p className="text-emerald-700 text-sm font-medium">Community Health Worker</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <a href="tel:+919876543210" className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  <Phone size={16} className="text-emerald-600" />
                  Call
                </a>
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={16} />
                  Home Visit
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <ToastNotification 
        message={toastMessage} 
        isVisible={toastVisible} 
        onClose={() => setToastVisible(false)} 
      />

      <style jsx global>{`
        @keyframes wave {
          0% { transform: rotate( 0.0deg) }
          10% { transform: rotate(14.0deg) }  
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate( 0.0deg) }  
          100% { transform: rotate( 0.0deg) }
        }
        .animate-wave {
          animation: wave 2.5s infinite;
        }
      `}</style>
    </div>
  );
}
