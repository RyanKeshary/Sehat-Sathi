"use client";

import React, { useState, useEffect, useRef } from "react";
import { Globe, Search, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
];

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentLang, setCurrentLang] = useState("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sehat-sathi-language");
    if (saved) setCurrentLang(saved);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    setCurrentLang(langCode);
    localStorage.setItem("sehat-sathi-language", langCode);
    document.documentElement.setAttribute("data-lang", langCode);
    
    if (langCode === "en") {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    }
    
    setIsOpen(false);
    window.location.reload();
  };

  const filteredLanguages = LANGUAGES.filter(
    (l) => 
      l.name.toLowerCase().includes(search.toLowerCase()) || 
      l.native.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full glass hover:bg-white/10 transition-all border border-white/10"
      >
        <Globe className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-white/90">{selectedLangObj.native}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden z-[50] border border-gray-100"
          >
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search languages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none text-gray-800"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-height-[320px] overflow-y-auto py-1 scrollbar-hide">
              {filteredLanguages.length > 0 ? (
                <div className="grid grid-cols-1">
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left border-l-4 ${
                        currentLang === lang.code 
                          ? "border-accent bg-emerald-50/50" 
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{lang.flag}</span>
                        <div>
                          <div className={`text-[15px] font-semibold ${currentLang === lang.code ? "text-accent" : "text-gray-900"}`}>
                            {lang.native}
                          </div>
                          <div className="text-[11px] text-gray-500 uppercase tracking-tight font-medium">
                            {lang.name}
                          </div>
                        </div>
                      </div>
                      {currentLang === lang.code && (
                        <Check className="w-4 h-4 text-accent" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 px-4 text-center text-gray-400 text-sm italic">
                  No languages found for "{search}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
