"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { Globe } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "For Doctors", href: "#for-doctors" },
  { name: "Impact", href: "#impact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav
      suppressHydrationWarning
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300",
        isLanding 
          ? (isScrolled ? "top-5 mx-auto w-[min(90%,1280px)]" : "top-0 w-full px-4 sm:px-6 py-4 bg-transparent")
          : "top-0 w-full bg-[#0A2540]/80 backdrop-blur-xl border-b border-white/5 py-3"
      )}
    >
      <motion.div 
        suppressHydrationWarning
        animate={{
          backgroundColor: isLanding && !isScrolled ? "rgba(10, 37, 64, 0)" : "rgba(10, 37, 64, 0.4)",
          backdropFilter: isLanding && !isScrolled ? "blur(0px)" : "blur(16px)",
          borderRadius: isLanding && isScrolled ? "9999px" : "0px",
          padding: isLanding && isScrolled ? "0.75rem 1.75rem" : "0.5rem 1.5rem",
        }}
        className={cn(
          "relative flex items-center justify-between shadow-2xl transition-all duration-500",
          isLanding && isScrolled && "border border-white/10"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            animate={{ 
              filter: isLanding && !isScrolled ? "brightness(0) invert(1)" : "none",
              scale: isLanding && !isScrolled ? 1.1 : 1
            }}
            className="relative w-8 h-8"
          >
            <Image
              src="/assets/images/sehat sathi logo .png"
              alt="Sehat Sathi Logo"
              fill
              sizes="32px"
              suppressHydrationWarning
              className="object-contain"
            />
          </motion.div>
          <span className={cn(
            "font-display font-bold text-xl tracking-tight transition-colors",
            isLanding && !isScrolled ? "text-white" : "text-white"
          )}>
            Sehat Sathi
          </span>
        </Link>

        {/* Desktop Links (Visible only on Landing) */}
        {isLanding && (
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-medium text-[15px] text-white/70 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

        {/* Right Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <LanguageSwitcher />

          <Link
            href="/get-started"
            className="bg-accent text-dark-bg px-6 py-2.5 rounded-full font-bold text-sm glow-green hover:scale-105 transition-transform active:scale-95"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Button — animated 3-line to X */}
        <button
          className={cn(
            "md:hidden flex flex-col items-center justify-center gap-[5px] w-11 h-11 rounded-full hover:bg-white/10 transition-colors",
            isMobileMenuOpen && "hamburger-open"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </motion.div>

      {/* ─── Mobile Full-Screen Overlay Menu ─────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 bg-[#060F1E] z-[9998] md:hidden flex flex-col overflow-y-auto"
            style={{ height: "100dvh" }}
          >
            {/* Close button */}
            <div className="flex justify-end p-6">
              <button
                onClick={closeMobileMenu}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white text-2xl font-light"
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            {/* Nav Links — large tap targets */}
            <div className="flex flex-col gap-5 px-8 pt-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.3, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    className="block text-[24px] font-bold text-white/80 hover:text-white py-2 transition-colors active:text-accent"
                    onClick={closeMobileMenu}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <hr className="border-white/10 mx-8 my-8" />
            
            {/* Language + CTAs */}
            <div className="flex flex-col gap-6 px-8 pb-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <LanguageSwitcher />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex flex-col gap-4"
              >
                <Link
                  href="/get-started"
                  onClick={closeMobileMenu}
                  className="bg-accent text-dark-bg block w-full py-4 rounded-2xl font-bold text-center text-lg glow-green active:scale-95 transition-transform"
                >
                  Get Started
                </Link>
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="border border-white/20 text-white block w-full py-4 rounded-2xl font-bold text-center text-lg hover:bg-white/5 active:scale-95 transition-all"
                >
                  Go to Dashboard
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
