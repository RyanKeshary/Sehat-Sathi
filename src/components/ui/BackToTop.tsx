"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/utils/cn";
import { useLanguage } from "@/components/providers/LanguageProvider";

/**
 * FIX-001: BackToTop Button
 * Implements instant teleportation to top (behavior: 'instant')
 * with throttled scroll detection via requestAnimationFrame.
 */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 400) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    // Exact requirement: behavior: 'instant'
    try {
      window.scrollTo({
        top: 0,
        behavior: "instant" as ScrollBehavior,
      });
    } catch (e) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, []);

  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={scrollToTop}
          title={t("back_to_top")}
          className={cn(
            "fixed z-[9999] flex items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-95",
            "bg-[#00C896] hover:bg-[#00B085] hover:-translate-y-1 shadow-[#00C896]/40 hover:shadow-xl",
            // Responsive sizing and position to avoid mobile UI overlap
            "right-8 bottom-24 md:bottom-8 w-10 h-10 md:w-12 md:h-12"
          )}
          aria-label={t("back_to_top")}
          role="button"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
