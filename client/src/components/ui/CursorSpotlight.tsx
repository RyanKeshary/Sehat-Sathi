"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

/**
 * FIX-004: Cursor Spotlight Effect
 * Adds a premium radial gradient spotlight that follows the cursor position.
 * Optimized with Framer Motion springs for buttery smooth transition.
 */
export default function CursorSpotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[1] opacity-40 mix-blend-soft-light transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${smoothX}px ${smoothY}px, rgba(0, 200, 150, 0.15), transparent 80%)`,
      }}
    />
  );
}
