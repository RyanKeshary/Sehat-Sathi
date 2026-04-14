"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { Globe, ChevronDown, Menu, X } from "lucide-react";
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

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300",
        isLanding 
          ? (isScrolled ? "top-5 mx-auto w-[min(90%,1280px)]" : "top-0 w-full px-6 py-4 bg-transparent")
          : "top-0 w-full bg-[#0A2540]/80 backdrop-blur-xl border-b border-white/5 py-3"
      )}
    >
      <motion.div 
        animate={{
          backgroundColor: isLanding && !isScrolled ? "transparent" : "rgba(10, 37, 64, 0.4)",
          backdropFilter: isLanding && !isScrolled ? "blur(0px)" : "blur(16px)",
          borderRadius: isLanding && isScrolled ? "9999px" : "0px",
          padding: isLanding && isScrolled ? "0.75rem 1.75rem" : "0.5rem 1.5rem",
        }}
        className={cn(
          "flex items-center justify-between shadow-2xl transition-all duration-500",
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

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          <LanguageSwitcher />

          <Link
            href="/get-started"
            className="bg-accent text-dark-bg px-6 py-2.5 rounded-full font-bold text-sm glow-green hover:scale-105 transition-transform active:scale-95"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 bg-[#060F1E] z-40 md:hidden flex flex-col p-8 pt-24"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-3xl font-bold text-white/80 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <hr className="border-white/10 my-8" />
            
            <div className="flex flex-col gap-6">
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 text-xl text-white/80"
              >
                <Globe className="w-6 h-6" />
                <span>Change Language</span>
              </motion.button>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-accent text-dark-bg block w-full py-4 rounded-2xl font-bold text-center text-lg glow-green"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
