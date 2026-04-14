"use client";

import { useState, useEffect } from "react";

/**
 * Detects mobile viewport based on window.innerWidth < 768px.
 * Runs after mount to avoid SSR hydration mismatch.
 * Updates on window resize with debounce.
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();

    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(check, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}
