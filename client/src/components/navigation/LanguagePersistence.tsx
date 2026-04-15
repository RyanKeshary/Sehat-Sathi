"use client";

import { useEffect } from "react";

/**
 * LanguagePersistence — Saves and restores the user's preferred language
 * using localStorage. Works with the app's built-in LanguageProvider.
 */
const LanguagePersistence: React.FC = () => {
  useEffect(() => {
    // The app uses its own LanguageProvider for i18n, no external scripts needed
    const savedLanguage = localStorage.getItem("sehat-sathi-language");
    if (savedLanguage) {
      // Language will be picked up by LanguageProvider context
      document.documentElement.setAttribute("data-lang", savedLanguage);
    }
  }, []);

  return null;
};

export default LanguagePersistence;
