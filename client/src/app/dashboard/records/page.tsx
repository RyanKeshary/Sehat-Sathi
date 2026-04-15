"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudUpload, Download, Search, Filter, Calendar, HeartPulse,
  WifiOff, Cloud, Smartphone, Pill, FileSymlink, CloudLightning
} from "lucide-react";
import { cn } from "@/utils/cn";
import TimelineNavigation from "@/components/records/TimelineNavigation";
import RecordDetailViewer from "@/components/records/RecordDetailViewer";
import UploadDocumentModal from "@/components/records/UploadDocumentModal";
import LinkABHAModal from "@/components/records/LinkABHAModal";
import { RecordEntry, MOCK_RECORDS } from "@/lib/records-data";

export default function DigitalHealthRecordsPage() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  
  const [records, setRecords] = useState<RecordEntry[]>(MOCK_RECORDS);
  const [activeRecordId, setActiveRecordId] = useState<string>(MOCK_RECORDS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [offlineOnly, setOfflineOnly] = useState(false);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isABHAOpen, setIsABHAOpen] = useState(false);
  
  const [hasABHA, setHasABHA] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(true);

  const activeRecord = records.find(r => r.id === activeRecordId);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowOfflineBanner(true);
      // Simulate sync
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        setSyncComplete(true);
        setTimeout(() => setSyncComplete(false), 3000);
      }, 2000);
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Initial check
    if (!navigator.onLine) handleOffline();

    const bannerTimeout = setTimeout(() => setShowOfflineBanner(false), 5000);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(bannerTimeout);
    };
  }, [isOffline]);

  const filteredRecords = records.filter(r => {
    if (activeFilter !== "All" && r.type !== activeFilter) return false;
    if (offlineOnly && r.syncStatus !== "OFFLINE") return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A2540] flex flex-col font-sans">
      
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                 <h1 className="text-2xl md:text-[28px] font-display font-bold text-[#0A2540]">My Health Records</h1>
                 {hasABHA && (
                   <span className="bg-[#00C896]/10 text-[#00C896] text-xs font-bold px-2 py-1 rounded-full border border-[#00C896]/30 flex items-center gap-1">
                     <FileSymlink className="w-3 h-3" /> ABDM Linked
                   </span>
                 )}
              </div>
              <p className="text-slate-500 font-medium mt-1 text-sm">
                Complete medical history · Offline accessible · ABDM synced
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <button 
                onClick={() => setIsUploadOpen(true)}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#00C896] text-[#00C896] hover:bg-[#00C896]/5 font-bold transition-colors"
              >
                <CloudUpload className="w-4 h-4" /> Upload Document
              </button>
              
              {!hasABHA && (
                <button 
                  onClick={() => setIsABHAOpen(true)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 font-bold transition-colors"
                >
                  <CloudLightning className="w-4 h-4" /> Link ABHA ID
                </button>
              )}
              
              <button className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-colors">
                <Download className="w-4 h-4" /> Export Records
              </button>
            </div>
          </div>

          {/* Sync Status top right */}
          <div className="absolute top-6 right-4 md:right-8 flex items-center gap-2 text-sm font-semibold">
             {isOffline && <span className="text-amber-500 flex items-center gap-1"><WifiOff className="w-4 h-4"/> Offline</span>}
             {isSyncing && <span className="text-blue-500 flex items-center gap-1"><Cloud className="w-4 h-4 animate-pulse"/> Syncing...</span>}
             {syncComplete && <span className="text-[#00C896] flex items-center gap-1">Synced ✓</span>}
          </div>

          {/* Filter Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-64 shrink-0">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search records..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#00C896]/50 transition-shadow"
               />
            </div>
            
            <div className="flex items-center gap-2 w-full overflow-x-auto hide-scrollbar">
              {["All", "PRESCRIPTION", "LAB_REPORT", "VITALS", "VACCINATION"].map((type) => (
                <button 
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={cn(
                    "shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors",
                    activeFilter === type 
                      ? "bg-[#0A2540] text-white" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {type === "All" ? "All" : type.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="shrink-0 flex items-center gap-4 border-l border-slate-200 pl-4 w-full md:w-auto">
               <button className="flex items-center gap-2 text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors">
                 <Calendar className="w-4 h-4" />
                 Date Range
               </button>
               
               <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={cn("w-10 h-6 rounded-full p-1 transition-colors relative", offlineOnly ? "bg-amber-500" : "bg-slate-300")}>
                    <div className={cn("w-4 h-4 rounded-full bg-white transition-transform", offlineOnly ? "translate-x-4" : "")} />
                  </div>
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Offline Only</span>
               </label>
            </div>
          </div>
        </div>
      </header>

      {/* Offline Status Banner */}
      <AnimatePresence>
         {isOffline && showOfflineBanner && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: "auto", opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             className="overflow-hidden bg-[#FFFBEB] border-b border-amber-200 text-amber-900"
           >
              <div className="container mx-auto px-4 py-3 flex justify-between items-center text-sm font-medium">
                <div className="flex items-center gap-2">
                   <Smartphone className="w-4 h-4 text-amber-600" />
                   📡 Offline Mode — Showing 12 locally stored records. 4 records pending sync.
                </div>
                <button 
                  onClick={() => setShowOfflineBanner(false)}
                  className="text-amber-700 hover:text-amber-900 font-bold bg-amber-100 px-2 py-1 rounded"
                >
                  Dismiss
                </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* Main Content Layout */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] overflow-hidden">
        
        {/* Left Panel: Timeline */}
        <div className="w-full md:w-[35%] h-full flex flex-col shrink-0 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
           <div className="p-4 border-b border-slate-100 bg-slate-50/50">
             <h2 className="font-bold text-slate-800">Timeline</h2>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
             <TimelineNavigation 
               records={filteredRecords} 
               activeId={activeRecordId} 
               onSelect={setActiveRecordId} 
             />
           </div>
        </div>

        {/* Right Panel: Detail Viewer */}
        <div className="w-full md:w-[65%] h-full flex flex-col shrink-0 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden relative">
           <AnimatePresence mode="wait">
              {activeRecord ? (
                <RecordDetailViewer key={activeRecord.id} record={activeRecord} />
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-slate-400"
                >
                  <HeartPulse className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-medium">Select a record from the timeline to view</p>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

      </div>

      {/* Modals */}
      <UploadDocumentModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSave={() => {
        setIsUploadOpen(false);
        // In real app, we'd add to `records`
      }} />
      <LinkABHAModal isOpen={isABHAOpen} onClose={() => setIsABHAOpen(false)} onLinkSuccess={() => {
        setIsABHAOpen(false);
        setHasABHA(true);
      }} />

    </div>
  );
}
