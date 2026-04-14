"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Hook that adds IntersectionObserver-based scroll reveal animations.
 * Elements slide up 20px and fade in when entering viewport.
 */
export function useScrollReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    // Observe all children with stagger-reveal class
    const targets = el.querySelectorAll(".stagger-reveal");
    targets.forEach((target) => observer.observe(target));

    // Also observe the element itself
    if (el.classList.contains("stagger-reveal")) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [ref]);
}
