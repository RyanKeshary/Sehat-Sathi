"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Wifi, WifiOff } from "lucide-react";

export default function NotFound() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center p-6 font-inter">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[560px] bg-white p-10 rounded-[24px] border border-sky-100 shadow-[0_4px_24px_rgba(8,145,178,0.08)] text-center"
      >
        {isOffline ? (
          <>
            {/* OFFLINE STATE */}
            <div className="relative w-20 h-20 mx-auto mb-8">
              <WifiOff className="w-20 h-20 text-amber-400" />
              {[20, 36, 52].map((r, i) => (
                <motion.div
                  key={r}
                  animate={{ opacity: [0.8, 0.2, 0.8] }}
                  transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sky-200"
                  style={{ width: r * 2, height: r * 2 }}
                />
              ))}
            </div>
            <h2 className="text-2xl font-black text-sky-900 mb-3">
              You&apos;re offline — but Sehat Sathi is still with you.
            </h2>
            <p className="text-base text-slate-500 mb-8">
              Some features are available offline. Reconnect when you can for full access.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-left">
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-3">Available Offline</p>
              {["Health Records", "Medication Reminders", "Today's Schedule"].map(item => (
                <div key={item} className="flex items-center gap-2 py-1.5">
                  <span className="text-emerald-600">✓</span>
                  <span className="text-sm font-bold text-emerald-800">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-3">Needs Connection</p>
              {["Video Consultations", "New Record Sync", "AI Symptom Check"].map(item => (
                <div key={item} className="flex items-center gap-2 py-1.5">
                  <span className="text-amber-500">○</span>
                  <span className="text-sm font-bold text-amber-700">{item}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* 404 STATE */}
            <div className="w-20 h-20 mx-auto mb-8 bg-sky-50 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-sky-900 mb-3">
              This page doesn&apos;t exist
            </h2>
            <p className="text-base text-slate-500 mb-8">
              The page you&apos;re looking for may have been moved or doesn&apos;t exist. Let&apos;s get you back on track.
            </p>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-left mb-8">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Quick Navigation</p>
              {[
                { label: "Symptom Check", href: "/symptom-checker" },
                { label: "My Health Records", href: "/records" },
                { label: "Book Consultation", href: "/waiting-room" },
              ].map(link => (
                <Link key={link.href} href={link.href} className="flex items-center gap-2 py-2 text-sm font-bold text-primary hover:underline">
                  → {link.label}
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-3 mt-8">
          <Link
            href="/"
            className="flex-1 h-14 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <Home size={18} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="h-14 px-6 bg-white border border-sky-100 rounded-2xl text-slate-500 font-black flex items-center gap-2 hover:border-primary/30 transition-all"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
