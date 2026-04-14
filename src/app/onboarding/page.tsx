"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cross, 
  Stethoscope, 
  Video, 
  Folder, 
  ChevronRight, 
  Check,
  Wifi,
  WifiOff
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Components ---

interface LanguagePillProps {
  name: string;
  selected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}

function LanguagePill({ name, selected, onSelect }: LanguagePillProps) {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    onSelect(e);
    setTimeout(() => setRipple(null), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden h-11 flex items-center justify-center px-2 rounded-full border transition-all duration-300 text-xs font-semibold select-none",
        selected 
          ? "bg-primary border-primary text-white shadow-md" 
          : "bg-white border-accent text-slate-700 hover:border-primary/30"
      )}
    >
      <AnimatePresence>
        {ripple && (
          <motion.span
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              borderRadius: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex items-center gap-1.5">
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4 rounded-full bg-white flex items-center justify-center"
          >
            <Check className="w-2.5 h-2.5 text-primary stroke-[3]" />
          </motion.div>
        )}
        <span>{name}</span>
      </div>
    </button>
  );
}

function ActionCard({ 
  icon: Icon, 
  title, 
  desc, 
  delay,
  onClick
}: { 
  icon: React.ElementType; 
  title: string; 
  desc: string; 
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileTap={{ scale: 0.97 }}
      className="w-full bg-white p-5 rounded-2xl border border-accent border-l-[3px] border-l-primary flex items-center gap-4 text-left shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
        <Icon className="w-7 h-7" />
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-bold text-[#0C4A6E]">{title}</h4>
        <p className="text-[15px] text-slate-500">{desc}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
    </motion.button>
  );
}

// --- Main Page ---

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState("English");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Basic connectivity simulation (toggles every 15s for demo)
    const interval = setInterval(() => setIsOnline(prev => !prev), 15000);
    return () => clearInterval(interval);
  }, []);

  const languages = [
    "English", "Hindi", "Marathi", "Tamil", 
    "Telugu", "Kannada", "Bengali", "Gujarati", 
    "Malayalam", "Odia", "Punjabi", "Urdu"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] flex flex-col items-center px-6 py-10 selection:bg-primary/20">
      <div className="w-full max-w-[480px] flex flex-col gap-8 pb-16">
        
        {/* LOGO BLOCK */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center gap-3"
        >
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
              <Cross className="text-white w-7 h-7 rotate-45" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0C4A6E] tracking-tight">Sehat Sathi</h1>
            <p className="text-base font-medium text-slate-500">Your health, our responsibility</p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          {/* LANGUAGE GRID */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-[20px] border border-accent shadow-sm">
            <h2 className="text-lg font-bold text-[#0C2D43] mb-5">Choose your language</h2>
            <div className="grid grid-cols-3 gap-3">
              {languages.map((lang) => (
                <LanguagePill
                  key={lang}
                  name={lang}
                  selected={selectedLang === lang}
                  onSelect={() => setSelectedLang(lang)}
                />
              ))}
            </div>
          </motion.div>

          {/* ENTRY CARDS */}
          <div className="flex flex-col gap-4">
            <ActionCard 
              delay={0.4}
              icon={Stethoscope}
              title="Symptom Check"
              desc="Instant AI triage & severity check"
              onClick={() => router.push("/symptom-checker")}
            />
            <ActionCard 
              delay={0.5}
              icon={Video}
              title="Consult a Doctor"
              desc="Book video or physical visit"
              onClick={() => router.push("/voice-intake")}
            />
            <ActionCard 
              delay={0.6}
              icon={Folder}
              title="My Health Records"
              desc="Secure FHIR-synced health vault"
              onClick={() => router.push("/records")}
            />
          </div>

          {/* ABHA LOGIN */}
          <motion.button 
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/register-abha")}
            className="w-full bg-white py-4 rounded-xl border border-primary/40 flex items-center justify-center gap-3 shadow-sm hover:bg-accent/20 transition-colors"
          >
            {/* Ayushman Emblem (Stylized Gold) */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8A6D3B] flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-[#D4AF37] rounded-full" />
              </div>
            </div>
            <span className="font-bold text-primary">Login with ABHA</span>
          </motion.button>
          
          {/* FOOTER */}
          <motion.p 
            variants={itemVariants}
            className="text-center text-sm text-slate-400 font-medium leading-relaxed px-4"
          >
            Providing your data contributes to better health outcomes. 
            Fully DPDPA compliant storage.
          </motion.p>
        </motion.div>
      </div>

      {/* CONNECTIVITY CHIP */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className={cn(
          "px-4 py-2 rounded-full glass border shadow-lg flex items-center gap-2 transition-colors duration-500",
          isOnline ? "border-emerald-200" : "border-amber-200"
        )}>
          <div className={cn(
            "w-2.5 h-2.5 rounded-full animate-pulse",
            isOnline ? "bg-emerald-500" : "bg-amber-500 shadow-[0_0_10px_#f59e0b]"
          )} />
          <span className="text-sm font-bold text-heading">
            {isOnline ? "Online" : "Offline — your records are still available"}
          </span>
          {isOnline ? <Wifi className="w-3 h-3 opacity-30" /> : <WifiOff className="w-3 h-3 opacity-30" />}
        </div>
      </motion.div>
    </div>
  );
}
