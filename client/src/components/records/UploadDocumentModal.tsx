"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CloudUpload, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

export default function UploadDocumentModal({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [saved, setSaved] = useState(false);

  // Mock form
  const [docType, setDocType] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [docName, setDocName] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsScanning(true);
      
      // Simulate AI OCR Scan
      setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
        // Auto fill form
        setDocType("LAB_REPORT");
        setDateStr("12/10/2024");
        setDocName("City Labs - Dr. V. Kumar");
      }, 3000);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setFile(null);
      setScanComplete(false);
      onSave();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-[#0A2540]/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
          >
             <div className="flex items-center justify-between p-6 border-b border-slate-100">
               <h2 className="text-xl font-display font-bold text-slate-800">Upload Medical Document</h2>
               <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>

             <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
               
               {!file ? (
                 <label className="border-2 border-dashed border-[#00C896] bg-[#00C896]/5 hover:bg-[#00C896]/10 transition-colors rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer group">
                   <CloudUpload className="w-16 h-16 text-[#00C896] mb-4 group-hover:scale-110 transition-transform" />
                   <p className="font-bold text-slate-700 mb-1">Drag your medical documents here</p>
                   <p className="text-sm text-slate-500 font-medium">or tap to browse files</p>
                   <p className="text-xs text-slate-400 mt-4">Supports PDF, JPG, PNG (Max 5MB)</p>
                   <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileSelect} />
                 </label>
               ) : (
                 <div className="space-y-6">
                    {/* Document Preview & OCR */}
                    <div className="relative w-full aspect-video bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400">
                       <FileText className="w-16 h-16 opacity-50" />
                       <span className="ml-2 font-medium">{file.name}</span>

                       {/* Scanning Animation */}
                       {isScanning && (
                         <div className="absolute inset-0 bg-[#0A2540]/80 backdrop-blur-sm flex flex-col items-center justify-center text-[#00C896]">
                           <div className="relative w-full h-full">
                              <motion.div 
                                className="absolute top-0 left-0 w-full h-1 bg-[#00C896] shadow-[0_0_20px_#00C896]"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                              />
                           </div>
                           <div className="absolute font-mono font-bold text-sm tracking-widest bg-black/50 px-3 py-1 rounded">AI Extracting Info...</div>
                         </div>
                       )}
                    </div>

                    {scanComplete && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                         <div className="bg-emerald-50 text-emerald-700 text-sm font-medium p-3 rounded-lg flex items-center gap-2 border border-emerald-200">
                           <CheckCircle2 className="w-4 h-4" /> AI OCR successfully extracted document details.
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Document Type</label>
                             <select 
                               className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none font-medium text-slate-700 focus:border-[#00C896] transition-colors"
                               value={docType}
                               onChange={e => setDocType(e.target.value)}
                             >
                               <option value="PRESCRIPTION">Prescription</option>
                               <option value="LAB_REPORT">Lab Report</option>
                               <option value="VITALS">Vitals Log</option>
                             </select>
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Date</label>
                             <input 
                               type="text" 
                               value={dateStr}
                               onChange={e => setDateStr(e.target.value)}
                               className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none font-medium text-slate-700 focus:border-[#00C896] transition-colors" 
                             />
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Doctor / Clinic Name</label>
                           <input 
                             type="text" 
                             value={docName}
                             onChange={e => setDocName(e.target.value)}
                             className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none font-medium text-slate-700 focus:border-[#00C896] transition-colors" 
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Private Notes</label>
                           <textarea 
                             placeholder="Add any internal notes here..."
                             className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none font-medium text-slate-700 resize-none h-20 focus:border-[#00C896] transition-colors custom-scrollbar" 
                           />
                         </div>
                      </motion.div>
                    )}
                 </div>
               )}

             </div>

             {file && scanComplete && (
               <div className="p-6 border-t border-slate-100 shrink-0">
                 <button 
                   onClick={handleSave}
                   disabled={saved}
                   className={cn(
                     "w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                     saved 
                       ? "bg-[#00C896] text-white shadow-lg pointer-events-none"
                       : "bg-[#0A2540] text-white hover:bg-[#0A2540]/90 shadow-md"
                   )}
                 >
                   {saved ? <><CheckCircle2 className="w-5 h-5" /> Saved Offline & Queued for Sync ✓</> : "Save Document"}
                 </button>
               </div>
             )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
