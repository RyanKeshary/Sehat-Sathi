"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LanguageOption {
  text: string;
  language: string;
}

interface LanguageMorphTextProps {
  options: LanguageOption[];
  interval?: number;
  className?: string;
}

export default function LanguageMorphText({ options, interval = 2000, className }: LanguageMorphTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % options.length);
    }, interval);
    return () => clearInterval(timer);
  }, [options.length, interval]);

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(4px)", y: -5 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="inline-block"
        >
          {options[index].text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
