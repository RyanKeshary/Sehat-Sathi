"use client";

import { useEffect } from "react";

const LanguagePersistence: React.FC = () => {
  useEffect(() => {
    const savedLanguage = localStorage.getItem("sehat-sathi-language");
    if (savedLanguage && savedLanguage !== "en") {
      // Delay to allow Google Translate script to initialize
      const timer = setTimeout(() => {
        const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = savedLanguage;
          selectElement.dispatchEvent(new Event("change"));
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
};

export default LanguagePersistence;
