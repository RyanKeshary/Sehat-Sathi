"use client";

import { useEffect } from "react";

/**
 * Sets a CSS custom property `--vh` on the root element to work around
 * the iOS Safari 100vh bug. Updates on resize and orientation change.
 * This provides a JavaScript fallback for browsers without `dvh` support.
 */
export function useViewportHeight() {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();
    window.addEventListener("resize", setVh, { passive: true });
    window.addEventListener("orientationchange", setVh);

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);
}
