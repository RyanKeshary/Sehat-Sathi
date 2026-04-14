"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudOff, RefreshCw, CheckCircle2, History, Database, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { useOnlineStatus, useOfflineSync } from "@/hooks/use-offline";

export default function OfflineSyncIndicator() {
  const isOnline = useOnlineStatus();
  const { isSyncing, syncData } = useOfflineSync();
  const [showPopover, setShowPopover] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  const handleManualSync = async () => {
    if (!isOnline || isSyncing) return;
    await syncData();
    setLastSync(new Date());
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowPopover(!showPopover)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center p-2 rounded-xl hover:bg-white/5 transition-colors relative group"
      >
        <AnimatePresence mode="wait">
          {!isOnline ? (
            <motion.div
              key="offline"
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                opacity: [1, 0.6, 1] 
              }}
              exit={{ scale: 0 }}
              transition={{ 
                opacity: { duration: 3, repeat: Infinity }
              }}
              className="relative"
            >
              <Cloud className="w-6 h-6 text-amber-500" />
              <div className="absolute -top-1 -right-1 bg-[#060F1E] rounded-full p-0.5">
                <CloudOff className="w-3 h-3 text-amber-500" />
              </div>
            </motion.div>
          ) : isSyncing ? (
            <motion.div
              key="syncing"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="synced"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              exit={{ scale: 0 }}
              className="relative"
            >
              <Cloud className="w-6 h-6 text-[#00C896]" />
              <div className="absolute -bottom-0.5 -right-0.5 bg-[#060F1E] rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00C896] fill-[#060F1E]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
           <div className="bg-[#0A2540] border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap text-white text-[10px] font-bold uppercase tracking-wider">
             {isSyncing ? "Syncing data..." : !isOnline ? "Working Offline" : "All data synced"}
           </div>
        </div>
      </motion.button>

      {/* Popover */}
      <AnimatePresence>
        {showPopover && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setShowPopover(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full right-0 mb-3 w-72 bg-[#0A2540] border border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden backdrop-blur-xl"
            >
              <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                   <Database size={16} className="text-[#00C896]" />
                   Sync Status
                </h4>
              </div>

              <div className="p-4 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50 font-medium">Network Status</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                      isOnline ? "bg-[#00C896]/10 text-[#00C896]" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {isOnline ? "Online" : "Offline"}
                    </span>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                       <span className="text-xs text-white/50 font-medium">Pending Uploads</span>
                       <span className="text-sm font-bold text-white">0 records</span>
                    </div>
                    <History size={18} className="text-white/20" />
                 </div>

                 <div className="pt-2">
                    <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-2">Last Sync</div>
                    <div className="text-xs text-white/70">
                       {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Just now
                    </div>
                 </div>

                 <button
                    disabled={!isOnline || isSyncing}
                    onClick={handleManualSync}
                    className={cn(
                      "w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                      isOnline && !isSyncing 
                        ? "bg-[#00C896] text-white hover:bg-[#00b084] shadow-lg shadow-[#00C896]/20" 
                        : "bg-white/5 text-white/20 cursor-not-allowed"
                    )}
                 >
                    {isSyncing ? "Syncing..." : "Sync Now"}
                    <ArrowRight size={14} />
                 </button>
              </div>

              {!isOnline && (
                <div className="bg-amber-500/10 p-3 flex gap-2">
                   <CloudOff size={14} className="text-amber-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-amber-500/80 font-medium leading-relaxed">
                     Changes made now will sync automatically when your internet returns.
                   </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
