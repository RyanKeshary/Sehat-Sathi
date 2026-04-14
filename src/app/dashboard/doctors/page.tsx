"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  MessageCircle, 
  Video,
  Clock,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { cn } from "@/utils/cn";

const DOCTORS = [
  {
    id: 1,
    name: "Dr. Anjali Sharma",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 124,
    experience: "12 years",
    location: "Mumbai / Online",
    languages: ["English", "Hindi"],
    fee: "₹500",
    nextSlot: "Today, 4:00 PM",
    verified: true,
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    name: "Dr. Vikram Singh",
    specialty: "General Physician",
    rating: 4.8,
    reviews: 89,
    experience: "8 years",
    location: "Delhi / Online",
    languages: ["Hindi", "English", "Punjabi"],
    fee: "₹300",
    nextSlot: "Today, 6:30 PM",
    verified: true,
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    name: "Dr. Priya Das",
    specialty: "Pediatrician",
    rating: 4.9,
    reviews: 210,
    experience: "15 years",
    location: "Kolkata / Online",
    languages: ["Bengali", "English", "Hindi"],
    fee: "₹450",
    nextSlot: "Tomorrow, 10:00 AM",
    verified: true,
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 4,
    name: "Dr. Ramesh Babu",
    specialty: "Dermatologist",
    rating: 4.7,
    reviews: 67,
    experience: "10 years",
    location: "Bangalore / Online",
    languages: ["Telugu", "Kannada", "English"],
    fee: "₹400",
    nextSlot: "Today, 5:15 PM",
    verified: true,
    avatar: "https://i.pravatar.cc/150?img=12"
  }
];

const SPECIALTIES = ["All", "General Physician", "Cardiologist", "Pediatrician", "Dermatologist", "Gastroenterologist"];

export default function FindDoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const filteredDoctors = DOCTORS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#0A2540] mb-2">Find Your Doctor</h1>
        <p className="text-slate-500 font-medium">Connect with certified specialists across India via high-definition video.</p>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search doctors, specialties, or conditions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00C896]/20 focus:border-[#00C896] transition-all font-medium text-slate-700 shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {SPECIALTIES.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={cn(
                "whitespace-nowrap px-5 py-3 rounded-2xl font-bold text-sm transition-all",
                selectedSpecialty === spec 
                  ? "bg-[#0A2540] text-white shadow-lg" 
                  : "bg-white text-slate-500 border border-slate-200 hover:border-[#00C896]"
              )}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-[#00C896]/30 transition-all shadow-sm hover:shadow-xl"
          >
            <div className="flex gap-6">
              <div className="relative shrink-0">
                <img src={doc.avatar} alt={doc.name} className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-50 group-hover:scale-105 transition-transform" />
                {doc.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-[#00C896] text-white p-1 rounded-full border-2 border-white shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-[#0A2540] truncate">{doc.name}</h2>
                    <p className="text-[#00C896] font-bold text-sm mb-2">{doc.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-sm font-black">
                    <Star className="w-4 h-4 fill-current" /> {doc.rating}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {doc.experience} exp.
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <MapPin className="w-3.5 h-3.5" /> {doc.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {doc.languages.map(lang => (
                    <span key={lang} className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-slate-100">
                      {lang}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Fee</p>
                    <p className="text-lg font-black text-[#0A2540]">{doc.fee}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button className="px-6 py-3 bg-[#00C896] text-[#060F1E] rounded-xl font-bold text-sm shadow-lg shadow-[#00C896]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                      <Video className="w-4 h-4 fill-current" /> Instant Video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#0A2540]">No doctors found</h3>
          <p className="text-slate-500">Try adjusting your search terms or specialty filters.</p>
        </div>
      )}
    </div>
  );
}
