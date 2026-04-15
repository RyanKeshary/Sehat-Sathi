"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check } from "lucide-react";
import { cn } from "@/utils/cn";

export type Language = {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  placeholder: string;
};

export const LANGUAGES: Language[] = [
  { id: "en", name: "English", nativeName: "English", flag: "🇬🇧", placeholder: "Describe your symptoms..." },
  { id: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", placeholder: "अपने लक्षण बताएं..." },
  { id: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", placeholder: "तुमची लक्षणे सांगा..." },
  { id: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", placeholder: "તમારા લક્ષણો વર્ણવો..." },
  { id: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", placeholder: "உங்கள் அறிகுறிகளை விவரிக்கவும்..." },
];

export default function LanguageSelector({
  isOpen,
  onClose,
  selectedLang,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedLang: Language;
  onSelect: (lang: Language) => void;
}) {
  const [search, setSearch] = useState("");

  const filteredLangs = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#060F1E]/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-[#0A2540] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-display font-bold text-white">Select Language</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search language..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#060F1E] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div className="overflow-y-auto p-4 pt-0 space-y-2 custom-scrollbar flex-1">
              {filteredLangs.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    onSelect(lang);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl transition-all",
                    selectedLang.id === lang.id
                      ? "bg-accent/20 border border-accent/50"
                      : "hover:bg-white/5 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left">
                      <div className="text-white font-bold">{lang.nativeName}</div>
                      <div className="text-white/50 text-sm">{lang.name}</div>
                    </div>
                  </div>
                  {selectedLang.id === lang.id && <Check className="w-5 h-5 text-accent" />}
                </button>
              ))}
              {filteredLangs.length === 0 && (
                <div className="text-center py-8 text-white/40 font-medium">
                  No languages found.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
