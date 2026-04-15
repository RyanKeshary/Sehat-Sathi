"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { get, set as idbSet } from "idb-keyval";
import { motion, AnimatePresence } from "framer-motion";

export type LanguageCode = "en" | "hi" | "mr" | "te" | "bn";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simplified translation map for demo
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    hero_title: "Healthcare Reaches Every Corner",
    hero_subtitle: "Connect with certified doctors, check symptoms, and access records — even offline.",
    get_started: "Get Started",
    back_to_top: "Back to top",
  },
  hi: {
    hero_title: "स्वास्थ्य देखभाल हर कोने तक पहुँचती है",
    hero_subtitle: "प्रमाणित डॉक्टरों से जुड़ें, लक्षणों की जाँच करें, और रिकॉर्ड तक पहुँचें — ऑफ़लाइन भी।",
    get_started: "शुरू करें",
    back_to_top: "ऊपर जाएं",
  },
  // Add more as needed
  mr: {}, te: {}, bn: {}
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    // Priority: IndexedDB > Browser > Fallback
    const initLang = async () => {
      const stored = await get<LanguageCode>("user-language");
      if (stored) {
        setLanguageState(stored);
      } else {
        const browserLang = navigator.language.split("-")[0] as LanguageCode;
        if (translations[browserLang]) {
          setLanguageState(browserLang);
        }
      }
    };
    initLang();
  }, []);

  const setLanguage = async (lang: LanguageCode) => {
    setLanguageState(lang);
    await idbSet("user-language", lang);
    localStorage.setItem("user-language", lang);
  };

  const t = (key: string) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={language}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="contents"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
