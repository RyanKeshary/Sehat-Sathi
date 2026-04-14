'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Stethoscope, Building2, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const ROLES = [
  {
    id: 'patient',
    title: 'Patient',
    description: 'Access 24/7 AI health support, book specialist consultations, and manage digital records.',
    icon: User,
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-500/10',
    href: '/dashboard',
    features: ['AI Symptom Checker', 'Video Consultation', 'Offline Records']
  },
  {
    id: 'doctor',
    title: 'Healthcare Professional',
    description: 'Reach patients in remote areas, manage appointments, and use AI-assisted diagnosis tools.',
    icon: Stethoscope,
    color: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-500/10',
    href: '/doctor/dashboard',
    features: ['E-Prescription', 'Bhashini AI Tools', 'Case Management']
  },
  {
    id: 'admin',
    title: 'Health Official',
    description: 'Monitor public health trends, manage vaccine distribution, and oversee rural healthcare data.',
    icon: Building2,
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-500/10',
    href: '/admin',
    features: ['Regional Analytics', 'Resource Allocation', 'ABDM Oversight']
  }
];

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-[#060F1E] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl w-full relative z-10 flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <Link href="/" className="inline-flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 relative">
                 <Image src="/assets/images/sehat sathi logo .png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="font-bold text-sm tracking-tight">Sehat Sathi</span>
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-6 tracking-tight leading-[1.1]">
            How would you like to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400">Join Us?</span>
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            Select your role to access personalized healthcare tools designed for the unique needs of India.
          </p>
        </motion.div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-20">
          {ROLES.map((role, idx) => (
            <RoleCard key={role.id} role={role} index={idx} />
          ))}
        </div>

        {/* Trust Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 items-center border-t border-white/5 pt-10"
        >
           <div className="flex items-center gap-2 text-white/40">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">DPDPA 2023 Compliant</span>
           </div>
           <div className="flex items-center gap-2 text-white/40">
              <HeartPulse className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">ABDM Integrated</span>
           </div>
           <div className="flex items-center gap-2 text-white/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest">System Operational</span>
           </div>
        </motion.div>

      </div>
    </div>
  );
}

function RoleCard({ role, index }: { role: typeof ROLES[0], index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Link href={role.href} className="flex flex-col h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] hover:border-white/20 transition-all shadow-2xl relative overflow-hidden">
        
        {/* Glow corner */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-20 transition-opacity blur-[40px]`} />
        
        {/* Icon Header */}
        <div className={`w-14 h-14 rounded-2xl ${role.bg} flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform`}>
          <role.icon className={`w-7 h-7 bg-gradient-to-br ${role.color} text-transparent bg-clip-text`} />
        </div>

        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          {role.title}
          <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </h3>
        
        <p className="text-white/50 text-base mb-8 flex-1 leading-relaxed">
          {role.description}
        </p>

        {/* Feature List */}
        <ul className="space-y-3 mb-4">
          {role.features.map(feature => (
            <li key={feature} className="flex items-center gap-2 text-xs font-bold text-white/30 group-hover:text-white/60 transition-colors uppercase tracking-wider">
               <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${role.color}`} />
               {feature}
            </li>
          ))}
        </ul>

      </Link>
    </motion.div>
  );
}
