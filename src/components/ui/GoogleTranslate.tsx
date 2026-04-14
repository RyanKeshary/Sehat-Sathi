"use client";

import React, { useEffect } from "react";
import { Globe, ArrowRight } from "lucide-react";

/**
 * FIX-007: Google Translate Integration
 * Injects Google Translate widget scripts and provides a premium UI wrapper.
 */
export default function GoogleTranslate() {
  useEffect(() => {
    // Add Google Translate script
    const googleTranslateElementInit = () => {
      // @ts-ignore
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", layout: 0 }, // layout: 0 is standard dropdown
        "google_translate_element"
      );
    };

    // @ts-ignore
    window.googleTranslateElementInit = googleTranslateElementInit;

    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
      <Globe className="w-4 h-4 text-[#00C896]" />
      <div id="google_translate_element" className="google_translate_wrapper"></div>
      
      <style jsx global>{`
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 13px !important;
          color: transparent !important;
        }
        .goog-te-gadget .goog-te-combo {
          background: transparent !important;
          border: none !important;
          color: white !important;
          font-weight: 600 !important;
          outline: none !important;
          margin: 0 !important;
          cursor: pointer;
        }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
        }
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .goog-logo-link {
          display: none !important;
        }
        .goog-te-gadget span {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
