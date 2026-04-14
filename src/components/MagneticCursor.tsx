"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

/**
 * Magnetic cursor trail effect for the landing page.
 * Renders a 16px teal circle with trailing ghost circles and a larger 48px hollow ring.
 */
export function MagneticCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Point>({ x: -100, y: -100 });
  const dotRef = useRef<Point>({ x: -100, y: -100 });
  const ringRef = useRef<Point>({ x: -100, y: -100 });
  const trailRef = useRef<Point[]>([]);
  const isHoveringRef = useRef(false);
  const hoverTargetRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [role='button'], input, textarea, select")) {
        isHoveringRef.current = true;
        const rect = target.getBoundingClientRect();
        hoverTargetRef.current = rect;
      } else {
        isHoveringRef.current = false;
        hoverTargetRef.current = null;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lerp the dot
      dotRef.current.x = lerp(dotRef.current.x, mouseRef.current.x, 0.12);
      dotRef.current.y = lerp(dotRef.current.y, mouseRef.current.y, 0.12);

      // Lerp the ring
      ringRef.current.x = lerp(ringRef.current.x, mouseRef.current.x, 0.06);
      ringRef.current.y = lerp(ringRef.current.y, mouseRef.current.y, 0.06);

      // Update trail
      trailRef.current.unshift({ x: dotRef.current.x, y: dotRef.current.y });
      if (trailRef.current.length > 6) trailRef.current.pop();

      // Draw trail ghosts
      trailRef.current.forEach((point, i) => {
        const scale = 1 - (i / 6);
        const opacity = 0.4 * (1 - i / 6);
        const size = 16 * scale;

        ctx.beginPath();
        ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(8, 145, 178, ${opacity})`;
        ctx.fill();
      });

      // Draw main dot
      ctx.beginPath();
      ctx.arc(dotRef.current.x, dotRef.current.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(8, 145, 178, 0.8)";
      ctx.fill();

      // Draw ring (snaps to hovered element or follows cursor)
      if (isHoveringRef.current && hoverTargetRef.current) {
        const rect = hoverTargetRef.current;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const targetX = lerp(ringRef.current.x, cx, 0.15);
        const targetY = lerp(ringRef.current.y, cy, 0.15);
        ringRef.current = { x: targetX, y: targetY };

        // Draw rounded rect halo
        const padding = 8;
        const w = rect.width + padding * 2;
        const h = rect.height + padding * 2;
        const rx = Math.min(12, w / 4);

        ctx.beginPath();
        ctx.roundRect(targetX - w / 2, targetY - h / 2, w, h, rx);
        ctx.strokeStyle = "rgba(5, 150, 105, 0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Free ring
        ctx.beginPath();
        ctx.arc(ringRef.current.x, ringRef.current.y, 24, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(8, 145, 178, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
