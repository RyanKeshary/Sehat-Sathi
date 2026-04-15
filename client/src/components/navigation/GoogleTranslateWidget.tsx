"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const GoogleTranslateWidget: React.FC = () => {
  useEffect(() => {
    // Inject script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Initializer
    window.googleTranslateElementInit = () => {
      if (window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "hi,mr,gu,ta",
            layout: window.google.translate.TranslateElement?.FloatingPosition?.BOTTOM_RIGHT || 0,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    return () => {
      // Cleanup if needed, though usually globally persistent
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />
      <style jsx global>{`
        #google_translate_element {
          display: none !important;
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-gadget {
          display: none !important;
        }
        .goog-te-menu-value {
          display: none !important;
        }
        .goog-te-menu-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: none !important;
        }
        #goog-gt-tt {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </>
  );
};

export default GoogleTranslateWidget;
