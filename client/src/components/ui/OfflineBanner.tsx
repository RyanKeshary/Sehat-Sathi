"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi, Info } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);
  const { addToast } = useToastStore();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (hasBeenOffline) {
        addToast("Back online! Syncing your data...", "success");
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      setHasBeenOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    // Initial check
    if (!navigator.onLine) handleOffline();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [hasBeenOffline, addToast]);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[min(90%,480px)]"
        >
          <div className="bg-[#0A2540] border-l-4 border-[#F59E0B] rounded-xl p-4 shadow-2xl flex items-center gap-4">
            <motion.div
              animate={{ 
                x: [0, -2, 2, -2, 2, 0],
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                repeatDelay: 2.5 
              }}
              className="shrink-0 bg-amber-500/10 p-2 rounded-lg"
            >
              <WifiOff className="w-5 h-5 text-[#F59E0B]" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-snug">
                You're offline — Health records and symptom history are available.
              </p>
              <p className="text-white/40 text-[11px] mt-0.5 uppercase tracking-wider font-bold">
                Reconnect for full features
              </p>
            </div>

            <div className="shrink-0 text-[#F59E0B]">
               <Info size={16} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
