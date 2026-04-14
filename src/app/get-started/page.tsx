'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Stethoscope, 
  Check, 
  ArrowRight, 
  Smartphone, 
  Shield, 
  Wifi, 
  Globe, 
  Upload,
  ArrowLeft,
  Loader2,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Data Constants
const STATES_DATA = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Solapur"],
  "Delhi": ["Central Delhi", "New Delhi", "South Delhi", "North Delhi", "East Delhi"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Dharwad", "Belagavi", "Mangaluru"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Vellore"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Darjeeling"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Prayagraj"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tezpur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"]
};

const LANGUAGES = [
  { id: 'hi', name: 'Hindi', native: 'हिंदी' },
  { id: 'en', name: 'English', native: 'English' },
  { id: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { id: 'bn', name: 'Bengali', native: 'বাংলা' },
  { id: 'mr', name: 'Marathi', native: 'मराठी' },
  { id: 'te', name: 'Telugu', native: 'తెలుగు' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { id: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { id: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { id: 'ur', name: 'Urdu', native: 'اردو' }
];

const SPECIALIZATIONS = [
  "General Physician", "Cardiologist", "Neurologist", "Dermatologist", 
  "Pediatrician", "Gynecologist", "Orthopedic Surgeon", "Psychiatrist",
  "Ophthalmologist", "ENT Specialist", "Endocrinologist", "Oncologist",
  "Urologist", "Nephrologist", "Gastroenterologist", "Pulmonologist",
  "Radiologist", "Pathologist", "Anesthesiologist", "Dentist"
];

const TESTIMONIALS = [
  { quote: "Sehat Sathi ne meri bahut madad ki. Ab main apne ghar se hi bade doctor se baat kar sakta hoon.", name: "Ramesh Kumar", location: "Bihar", lang: "Hindi" },
  { quote: "एथून मला तज्ज्ञ डॉक्टरांशी संपर्क साधणे सोपे झाले आहे. औषधे वेळेवर मिळतात.", name: "Sunita Deshmukh", location: "Maharashtra", lang: "Marathi" },
  { quote: "ਹੁਣ ਸਾਨੂੰ ਸ਼ਹਿਰ ਜਾਣ ਦੀ ਲੋੜ ਨਹੀਂ। ਡਾਕਟਰ ਫੋਨ 'ਤੇ ਹੀ ਸਭ ਸਮਝਾ ਦਿੰਦੇ ਹਨ।", name: "Gurjit Singh", location: "Punjab", lang: "Punjabi" }
];

const TRUST_MESSAGES = [
  "Dr. Priya just joined from Mumbai",
  "Ramesh booked a consultation",
  "Sunita's records synced",
  "Aarav got an AI triage report",
  "Clinic in Siliguri went online",
  "500+ consultations today"
];

export default function RegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    mobile: '',
    otp: ['', '', '', '', '', ''],
    state: '',
    district: '',
    dob: { day: '', month: '', year: '' },
    languages: [] as string[],
    specialization: '',
    regNumber: '',
    fee: '',
    freeRural: false,
    consents: { terms: false, dpdpa: false, sms: false }
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-redirect on success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push(formData.role === 'doctor' ? '/dashboard/doctor' : '/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router, formData.role]);

  // Handle OTP inputs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    
    // Auto-verify if full
    if (newOtp.every(d => d !== '')) {
      setTimeout(() => setIsOtpVerified(true), 800);
    }
  };

  const handleLangToggle = (langId: string) => {
    const current = [...formData.languages];
    if (current.includes(langId)) {
      setFormData({ ...formData, languages: current.filter(id => id !== langId) });
    } else {
      setFormData({ ...formData, languages: [...current, langId] });
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const isStep1Valid = formData.role && formData.fullName && formData.mobile.length === 10 && isOtpVerified;
  
  const isStep2Valid = formData.role === 'patient' 
    ? (formData.state && formData.district && formData.dob.day && formData.languages.length > 0)
    : (formData.specialization && formData.regNumber && formData.fee && formData.languages.length > 0);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#060F1E] flex flex-col md:flex-row relative">
      
      {/* Right Panel */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 bg-[#060F1E] relative overflow-hidden animated-bg border-r border-white/5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10 transition-transform hover:scale-105 w-fit">
          <div className="w-10 h-10 relative">
            <Image src="/assets/images/sehat sathi logo .png" alt="Logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-2xl tracking-tight text-white">Sehat Sathi</span>
            <span className="text-[10px] uppercase tracking-widest text-[#00C896] font-bold">Health for Bharat</span>
          </div>
        </Link>

        {/* Dynamic Illustration */}
        <div className="relative flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Signal Rings */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-[#00C896]/30 rounded-full signal-ring" />
              <div className="absolute w-64 h-64 border-2 border-[#00C896]/20 rounded-full signal-ring" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Stylized Device */}
            <motion.div 
              initial={{ rotateY: 20 }}
              animate={{ rotateY: 10 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 4 }}
              className="w-64 h-[440px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl relative overflow-hidden z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-emerald-900/20" />
              {/* Fake Video Call UI */}
              <div className="absolute top-10 left-0 right-0 p-4 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-2 border border-white/20" />
                <div className="h-2 w-20 bg-white/40 rounded-full mx-auto" />
              </div>
              <div className="absolute bottom-10 left-0 right-0 px-6 flex justify-around">
                <div className="w-10 h-10 rounded-full bg-red-500/80 flex items-center justify-center"><Smartphone className="w-4 h-4 text-white" /></div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/80 flex items-center justify-center"><Wifi className="w-4 h-4 text-white" /></div>
              </div>
            </motion.div>

            {/* Floating Chips */}
            <div className="absolute top-10 -left-16 glass px-4 py-2 rounded-2xl flex items-center gap-2 border-white/10 float-1 z-20">
              <Shield className="w-4 h-4 text-[#00C896]" />
              <span className="text-xs font-bold text-white/90">🔒 Encrypted</span>
            </div>
            <div className="absolute bottom-20 -right-20 glass px-4 py-2 rounded-2xl flex items-center gap-2 border-white/10 float-2 z-20">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white/90">📡 Offline Ready</span>
            </div>
            <div className="absolute top-1/2 -right-32 glass px-4 py-2 rounded-2xl flex items-center gap-2 border-white/10 float-3 z-20">
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white/90">🌏 10+ Languages</span>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="relative h-24 overflow-hidden mb-12">
          <TestimonialSwitcher />
        </div>

        {/* Marquee Trust Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-white/5 border-t border-white/5 overflow-hidden flex items-center">
          <div className="marquee flex whitespace-nowrap gap-12">
            {[...TRUST_MESSAGES, ...TRUST_MESSAGES].map((msg, i) => (
              <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-[#00C896]/60">
                {msg}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white p-6 md:p-16 overflow-y-auto z-10">
        <div className="max-w-xl mx-auto">
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-10 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-[#0A2540] mb-2">Create Your Account</h1>
                  <p className="text-gray-500">Join India's most advanced rural health platform.</p>
                </div>

                {/* Step Indicator */}
                <div className="relative flex justify-between items-center mb-12 px-2">
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-100 -translate-y-1/2 z-0" />
                  <div 
                    className="absolute top-1/2 left-0 h-[2px] bg-[#00C896] -translate-y-1/2 z-0 transition-all duration-500" 
                    style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                  />
                  
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        step === s ? 'bg-[#00C896] text-white shadow-lg shadow-emerald-200 ring-4 ring-emerald-50' : 
                        step > s ? 'bg-[#00C896] text-white' : 'bg-white border-2 border-gray-200 text-gray-400'
                      }`}>
                        {step > s ? <Check className="w-5 h-5" /> : s}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Steps */}
                <div className="min-h-[400px]">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <RoleCard 
                          selected={formData.role === 'patient'}
                          onClick={() => setFormData({ ...formData, role: 'patient' })}
                          title="I'm a Patient"
                          subtitle="Find doctors, check symptoms, manage health records."
                          icon={<User className="w-6 h-6" />}
                        />
                        <RoleCard 
                          selected={formData.role === 'doctor'}
                          onClick={() => setFormData({ ...formData, role: 'doctor' })}
                          title="I'm a Doctor"
                          subtitle="Provide consultations, manage appointments."
                          icon={<Stethoscope className="w-6 h-6" />}
                        />
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">Full Name</label>
                          <input 
                            type="text" 
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 focus:border-[#00C896] outline-none transition-colors"
                            placeholder="e.g. Rahul Sharma"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">Mobile Number</label>
                          <div className="flex gap-2">
                            <div className="bg-gray-100 border-2 border-gray-100 rounded-2xl px-4 py-4 font-bold text-gray-600">+91</div>
                            <div className="relative flex-1">
                              <input 
                                type="tel" 
                                maxLength={10}
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 focus:border-[#00C896] outline-none transition-colors"
                                placeholder="9876543210"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                              />
                              {!isOtpSent && formData.mobile.length === 10 && (
                                <button 
                                  onClick={() => setIsOtpSent(true)}
                                  className="absolute right-3 top-2 bottom-2 px-4 bg-[#0A2540] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                                >
                                  Send OTP
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {isOtpSent && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="space-y-4"
                          >
                            <label className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">Verify OTP</label>
                            <div className="flex justify-between gap-2">
                              {formData.otp.map((digit, index) => (
                                <input
                                  key={index}
                                  ref={el => { otpRefs.current[index] = el; }}
                                  type="text"
                                  maxLength={1}
                                  className={`w-full h-14 bg-gray-100 rounded-xl text-center text-xl font-bold border-2 transition-all ${
                                    isOtpVerified ? 'border-emerald-500 bg-emerald-50' : 'border-transparent focus:border-[#00C896] focus:bg-white'
                                  }`}
                                  value={digit}
                                  onChange={(e) => handleOtpChange(index, e.target.value)}
                                />
                              ))}
                            </div>
                            {isOtpVerified && <div className="text-emerald-500 text-sm font-bold flex items-center gap-1 justify-center"><Check className="w-4 h-4" /> Verified</div>}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      {formData.role === 'patient' ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <Dropdown 
                              label="State" 
                              options={Object.keys(STATES_DATA)} 
                              value={formData.state}
                              onChange={(v: string) => setFormData({ ...formData, state: v, district: '' })}
                            />
                            <Dropdown 
                              label="District" 
                              options={formData.state ? STATES_DATA[formData.state as keyof typeof STATES_DATA] : []} 
                              value={formData.district}
                              onChange={(v: string) => setFormData({ ...formData, district: v })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">Date of Birth</label>
                            <div className="grid grid-cols-3 gap-3">
                              <select 
                                className="bg-gray-100 p-3 rounded-xl border-none outline-none text-sm"
                                value={formData.dob.day}
                                onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, day: e.target.value } })}
                              >
                                <option value="">Day</option>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                              <select 
                                className="bg-gray-100 p-3 rounded-xl border-none outline-none text-sm"
                                value={formData.dob.month}
                                onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, month: e.target.value } })}
                              >
                                <option value="">Month</option>
                                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                              <select 
                                className="bg-gray-100 p-3 rounded-xl border-none outline-none text-sm"
                                value={formData.dob.year}
                                onChange={(e) => setFormData({ ...formData, dob: { ...formData.dob, year: e.target.value } })}
                              >
                                <option value="">Year</option>
                                {Array.from({ length: 80 }, (_, i) => 2024 - i).map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-4">
                            <Dropdown 
                              label="Primary Specialization" 
                              options={SPECIALIZATIONS} 
                              value={formData.specialization}
                              onChange={(v: string) => setFormData({ ...formData, specialization: v })}
                            />
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">Registration Number (MCI/NMC)</label>
                              <input 
                                type="text" 
                                className="w-full bg-gray-100 rounded-2xl px-5 py-4 text-gray-900 border-none outline-none"
                                placeholder="MCI-123456"
                                value={formData.regNumber}
                                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">Consultation Fee</label>
                                <div className="relative">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</div>
                                  <input 
                                    type="number" 
                                    className="w-full bg-gray-100 rounded-2xl pl-10 pr-5 py-4 text-gray-900 border-none outline-none"
                                    placeholder="500"
                                    value={formData.fee}
                                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col justify-end">
                                <label className="flex items-center gap-3 cursor-pointer group pb-4">
                                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.freeRural ? 'bg-[#00C896]' : 'bg-gray-200'}`} onClick={() => setFormData({ ...formData, freeRural: !formData.freeRural })}>
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.freeRural ? 'translate-x-6' : 'translate-x-0'}`} />
                                  </div>
                                  <span className="text-xs font-bold text-gray-500">Free rural consults</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">Languages You Speak</label>
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map(lang => (
                            <button
                              key={lang.id}
                              onClick={() => handleLangToggle(lang.id)}
                              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                                formData.languages.includes(lang.id)
                                  ? 'bg-emerald-50 border-[#00C896] text-[#00C896]'
                                  : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                              }`}
                            >
                              {lang.native} <span className="opacity-50 font-normal text-[10px] ml-1">{lang.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="bg-gray-50 rounded-3xl p-6 border-2 border-dashed border-gray-200 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Review Your Details</h4>
                        <div className="grid grid-cols-2 gap-y-4">
                          <div><div className="text-[10px] text-gray-400 font-bold uppercase">Name</div><div className="font-bold text-[#0A2540]">{formData.fullName}</div></div>
                          <div><div className="text-[10px] text-gray-400 font-bold uppercase">Role</div><div className="font-bold text-[#0A2540] capitalize">{formData.role}</div></div>
                          <div><div className="text-[10px] text-gray-400 font-bold uppercase">Phone</div><div className="font-bold text-[#0A2540]">{formData.mobile.slice(0,2)}×××××{formData.mobile.slice(-3)}</div></div>
                          <div><div className="text-[10px] text-gray-400 font-bold uppercase">Languages</div><div className="font-bold text-[#0A2540]">{formData.languages.length} Selected</div></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <ConsentItem 
                          checked={formData.consents.terms} 
                          onChange={(v: boolean) => setFormData({ ...formData, consents: { ...formData.consents, terms: v } })}
                          label="I agree to the Terms of Service and Privacy Policy" 
                        />
                        <ConsentItem 
                          checked={formData.consents.dpdpa} 
                          onChange={(v: boolean) => setFormData({ ...formData, consents: { ...formData.consents, dpdpa: v } })}
                          label="I consent to my health data being processed as per DPDPA 2023" 
                        />
                        <ConsentItem 
                          checked={formData.consents.sms} 
                          onChange={(v: boolean) => setFormData({ ...formData, consents: { ...formData.consents, sms: v } })}
                          label="Keep me updated via SMS/WhatsApp (Optional)" 
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="mt-12 flex gap-4">
                  {step > 1 && (
                    <button 
                      onClick={prevStep}
                      className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                  )}
                  <button 
                    disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : (!formData.consents.terms || !formData.consents.dpdpa || isSubmitting)}
                    onClick={step === 3 ? handleSubmit : nextStep}
                    className={`flex-1 h-[56px] rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                      (step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : (formData.consents.terms && formData.consents.dpdpa))
                        ? 'bg-[#00C896] text-white shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
                    ) : step === 3 ? (
                      <><div className="bg-white/20 p-1 rounded-lg"><Image src="/assets/images/sehat sathi logo .png" alt="S" width={20} height={20} className="invert" /></div> Create My Free Account</>
                    ) : (
                      <>Next <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-50">
                  <svg className="w-12 h-12 text-[#00C896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path className="animate-[check-draw_0.6s_ease-out_forwards_0.2s]" style={{ strokeDasharray: 100, strokeDashoffset: 100 }} d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-4xl font-display font-bold text-[#0A2540] mb-4">Welcome to Sehat Sathi! 🎉</h2>
                <p className="text-gray-500 mb-10">Your health journey starts here. Connecting you to your personalized dashboard...</p>
                <div className="max-w-xs mx-auto h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    className="h-full bg-[#00C896]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function RoleCard({ selected, onClick, title, subtitle, icon }: { selected: boolean; onClick: () => void; title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer group ${
        selected ? 'bg-emerald-50/50 border-[#00C896] shadow-xl shadow-emerald-50' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${
        selected ? 'bg-[#00C896] text-white shadow-emerald-200 shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
      }`}>
        {icon}
      </div>
      <h3 className={`font-bold transition-colors ${selected ? 'text-emerald-800' : 'text-[#0A2540]'}`}>{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mt-1">{subtitle}</p>
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-[#00C896] rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

function Dropdown({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
      <select 
        className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0A2540] outline-none appearance-none cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function ConsentItem({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div 
        onClick={() => onChange(!checked)}
        className={`mt-1 shrink-0 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
          checked ? 'bg-[#00C896] border-[#00C896]' : 'border-gray-200 group-hover:border-gray-300'
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className={`text-xs leading-relaxed transition-colors ${checked ? 'text-gray-700' : 'text-gray-400'}`}>
        {label}
      </span>
    </label>
  );
}

function TestimonialSwitcher() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center"
      >
        <p className="text-white/80 font-medium italic mb-2 tracking-wide leading-relaxed">
          "{TESTIMONIALS[index].quote}"
        </p>
        <div className="text-[10px] font-bold text-[#00C896] uppercase tracking-widest">
          {TESTIMONIALS[index].name} · {TESTIMONIALS[index].location}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
