'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Video, ChevronLeft, Search, Filter, Check, MoreVertical } from 'lucide-react';
import Link from 'next/link';

const APPOINTMENTS = [
  {
    id: 1,
    doctor: "Dr. Anjali Sharma",
    specialization: "Cardiologist",
    date: "Oct 15, 2024",
    time: "10:30 AM",
    status: "Confirmed",
    type: "Video",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    doctor: "Dr. Vikram Singh",
    specialization: "General Physician",
    date: "Oct 22, 2024",
    time: "02:00 PM",
    status: "Pending",
    type: "In-Person",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    doctor: "Dr. Priya Das",
    specialization: "Dermatologist",
    date: "Sep 28, 2024",
    time: "04:15 PM",
    status: "Completed",
    type: "Video",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

export default function AppointmentsPage() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#0A2540]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>My Appointments</h1>
            <p className="text-sm text-slate-500">Manage your scheduled consultations</p>
          </div>
        </div>
        
        <Link href="/consult" className="bg-[#00C896] hover:bg-[#00b084] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#00C896]/30 text-sm">
          Book New Consultation
        </Link>
      </div>

      {/* Tabs / Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
            {['Upcoming', 'Completed', 'Cancelled'].map((tab, i) => (
              <button key={tab} className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${i === 0 ? 'bg-white text-[#0A2540] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {tab}
              </button>
            ))}
         </div>
         
         <div className="flex items-center gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="Search by doctor..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-[#00C896] transition-colors" />
           </div>
           <button className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
             <Filter size={18} />
           </button>
         </div>
      </div>

      {/* Appointment List */}
      <div className="space-y-4">
        {APPOINTMENTS.map((appt, idx) => (
          <motion.div 
            key={appt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#00C896]/50 transition-all hover:shadow-lg relative overflow-hidden"
          >
            {/* Success Bar */}
            <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${appt.status === 'Confirmed' ? 'bg-[#00C896]' : appt.status === 'Pending' ? 'bg-amber-400' : 'bg-slate-300'}`} />

            <div className="flex flex-col md:flex-row gap-6 md:items-center">
               <div className="flex items-center gap-4 flex-1">
                  <img src={appt.avatar} className="w-16 h-16 rounded-full border-2 border-slate-100" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 text-lg">{appt.doctor}</h3>
                      <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded ${appt.type === 'Video' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                        {appt.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 mb-2">{appt.specialization}</p>
                    <div className="flex flex-wrap gap-4 text-xs font-bold">
                       <span className="flex items-center gap-1.5 text-slate-600">
                          <Calendar size={14} className="text-slate-400" /> {appt.date}
                       </span>
                       <span className="flex items-center gap-1.5 text-slate-600">
                          <Clock size={14} className="text-slate-400" /> {appt.time}
                       </span>
                    </div>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                     <span className={`text-xs font-bold px-3 py-1 rounded-full ${appt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                       {appt.status}
                     </span>
                  </div>
                  
                  {appt.status === 'Confirmed' && (
                    <Link href="/room" className="bg-[#00C896] hover:bg-[#00b084] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2">
                       <Video size={16} /> Join Now
                    </Link>
                  )}
                  
                  <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                    <MoreVertical size={18} />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
