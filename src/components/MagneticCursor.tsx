"use client";

import { useEffect, useRef } from "react";

interface ClickEffect {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  startTime: number;
}

/**
 * Ambient background cursor effect.
 * Renders a soft radial glow computing behind the cursor, and click ripple effects.
 * Leaves the default system cursor visible and interactive.
 */
export function MagneticCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const clicksRef = useRef<ClickEffect[]>([]);
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

    const handleMouseDown = (e: MouseEvent) => {
      clicksRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 60,
        alpha: 0.8,
        startTime: performance.now()
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw soft background glow around the cursor
      const { x, y } = mouseRef.current;
      if (x !== -100 && y !== -100) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 400);
        gradient.addColorStop(0, "rgba(8, 145, 178, 0.08)");
        gradient.addColorStop(0.5, "rgba(8, 145, 178, 0.03)");
        gradient.addColorStop(1, "rgba(8, 145, 178, 0)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw click ripple effects
      for (let i = clicksRef.current.length - 1; i >= 0; i--) {
        const click = clicksRef.current[i];
        const elapsed = time - click.startTime;
        const duration = 600; // ms
        
        if (elapsed > duration) {
          clicksRef.current.splice(i, 1);
          continue;
        }

        const progress = elapsed / duration;
        // Ease out quad
        const easeOut = 1 - (1 - progress) * (1 - progress);
        
        click.radius = click.maxRadius * easeOut;
        click.alpha = 0.6 * (1 - progress);

        ctx.beginPath();
        ctx.arc(click.x, click.y, click.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(8, 145, 178, ${click.alpha})`;
        ctx.lineWidth = 1.5 + (1 - progress) * 2;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
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
