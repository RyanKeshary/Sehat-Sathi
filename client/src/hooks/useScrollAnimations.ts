"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Splits text into individual character spans for GSAP letter animation.
 * Returns the created span elements.
 */
export function splitTextToChars(element: HTMLElement): HTMLSpanElement[] {
  const text = element.textContent || "";
  element.textContent = "";
  const chars: HTMLSpanElement[] = [];

  for (const char of text) {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    if (char === " ") span.style.width = "0.25em";
    element.appendChild(span);
    chars.push(span);
  }

  return chars;
}

/**
 * Creates a GSAP counter animation that formats numbers
 * with Indian locale separators.
 */
export function createCounterAnimation(
  element: HTMLElement,
  endValue: number,
  duration = 2,
  suffix = ""
) {
  const counterObj = { value: 0 };
  return gsap.to(counterObj, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent =
        Math.round(counterObj.value).toLocaleString("en-IN") + suffix;
    },
  });
}

/**
 * Master hook for all landing page GSAP ScrollTrigger animations.
 * 
 * Mobile optimizations (viewport < 768px):
 * - Parallax effects are disabled (they cause jank on mobile)
 * - scrub values reduced from 1.5 to 0 (immediate snap)
 * - stagger delays reduced from 100ms to 50ms
 * - SVG path drawing uses IntersectionObserver instead of ScrollTrigger
 */
export function useScrollAnimations() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const isMobile = window.innerWidth < 768;

    // Allow DOM to settle before creating ScrollTriggers
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
      // ─── 1. HERO FADE OUT ON SCROLL ─────────────────────
      const heroSection = document.querySelector("#hero-section");
      const heroContent = document.querySelector("#hero-content");
      const heroParticles = document.querySelector("#hero-particles");

      if (heroSection && heroContent) {
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: isMobile ? 0 : 1.5, // Immediate snap on mobile
          },
        });

        heroTl.to(
          heroContent,
          { opacity: 0, y: isMobile ? -40 : -80, ease: "none" },
          0
        );

        // Disable parallax on mobile (causes jank)
        if (heroParticles && !isMobile) {
          heroTl.to(
            heroParticles,
            { opacity: 0, y: 40, scale: 0.95, ease: "none" },
            0
          );
        }
      }

      // ─── 2. PROBLEM SECTION REVEAL ──────────────────────
      const problemSection = document.querySelector("#problem-section");
      if (problemSection) {
        const problemCards = problemSection.querySelectorAll(".problem-card");
        const problemHeading = problemSection.querySelector(".problem-heading");

        if (problemHeading) {
          gsap.from(problemHeading, {
            y: isMobile ? 30 : 60,
            opacity: 0,
            duration: isMobile ? 0.6 : 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: problemHeading,
              start: "top 80%",
            },
          });
        }

        problemCards.forEach((card, i) => {
          gsap.from(card, {
            y: isMobile ? 40 : 80,
            opacity: 0,
            scale: 0.95,
            duration: isMobile ? 0.5 : 0.8,
            ease: "power3.out",
            delay: i * (isMobile ? 0.05 : 0.15), // Faster stagger on mobile
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          });
        });
      }

      // ─── 3. STATS COUNTER ANIMATIONS ────────────────────
      const statElements = document.querySelectorAll("[data-counter]");
      statElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const end = parseFloat(htmlEl.dataset.counter || "0");
        const suffix = htmlEl.dataset.counterSuffix || "";

        ScrollTrigger.create({
          trigger: htmlEl,
          start: "top 75%",
          once: true,
          onEnter: () => {
            createCounterAnimation(htmlEl, end, isMobile ? 1.5 : 2, suffix);
          },
        });
      });

      // ─── 4. HOW-IT-WORKS PATH DRAW ─────────────────────
      // On mobile, the SVG path draw uses IntersectionObserver (set up in the component itself)
      // On desktop, use GSAP ScrollTrigger
      if (!isMobile) {
        const hiwPath = document.querySelector("#hiw-draw-path") as SVGPathElement | null;
        const hiwSteps = document.querySelectorAll(".hiw-step");

        if (hiwPath) {
          const totalLength = hiwPath.getTotalLength();
          gsap.set(hiwPath, {
            strokeDasharray: totalLength,
            strokeDashoffset: totalLength,
          });

          gsap.to(hiwPath, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "#how-it-works",
              start: "top 60%",
              end: "bottom 60%",
              scrub: true,
            },
          });

          // Stagger step reveals tied to path progress
          hiwSteps.forEach((step, i) => {
            gsap.from(step, {
              y: 40,
              opacity: 0,
              scale: 0.9,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#how-it-works",
                start: () => `top+=${i * 25}% 60%`,
              },
            });
          });
        }
      }

      // ─── 5. TESTIMONIALS PARALLAX ──────────────────────
      // Disabled on mobile (causes jank)
      if (!isMobile) {
        const testimContainer = document.querySelector("#testimonials-container");
        if (testimContainer) {
          ScrollTrigger.create({
            trigger: "#testimonials-section",
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
              gsap.set(testimContainer, {
                y: self.progress * -50,
              });
            },
          });
        }
      }

      // ─── 6. CTA DRAMATIC REVEAL ────────────────────────
      const ctaCard = document.querySelector("#cta-card") as HTMLElement | null;
      const ctaHeadline = document.querySelector("#cta-headline") as HTMLElement | null;

      if (ctaCard) {
        gsap.from(ctaCard, {
          clipPath: "inset(0 100% 0 0)",
          duration: isMobile ? 0.8 : 1.2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: ctaCard,
            start: "top 75%",
          },
        });
        gsap.set(ctaCard, { clipPath: "inset(0 0% 0 0)" });
      }

      if (ctaHeadline) {
        if (isMobile) {
          // Simpler fade-in on mobile (no char splitting — saves CPU)
          gsap.from(ctaHeadline, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaHeadline,
              start: "top 70%",
            },
          });
        } else {
          const chars = splitTextToChars(ctaHeadline);
          gsap.from(chars, {
            opacity: 0,
            y: 60,
            stagger: 0.03,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaHeadline,
              start: "top 70%",
            },
          });
        }
      }

      // ─── 7. GENERIC SCROLL REVEALS ─────────────────────
      const reveals = document.querySelectorAll("[data-scroll-reveal]");
      reveals.forEach((el) => {
        gsap.from(el, {
          y: isMobile ? 20 : 30,
          opacity: 0,
          duration: isMobile ? 0.5 : 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });
      });
      return () => ctx.revert();
    }, 300);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
}
