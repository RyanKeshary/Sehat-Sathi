"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function CounterItem({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-black text-primary mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-body font-bold lowercase tracking-wide">{label}</div>
    </div>
  );
}

export function TrustAndStats() {
  const stats = [
    { label: "Consultations", value: 28450, suffix: "+" },
    { label: "Doctors", value: 847 },
    { label: "Languages", value: 12 },
    { label: "Adherence", value: 94, suffix: "%" },
  ];

  const badges = [
    "ABDM Gold Partner",
    "DPDPA Compliant",
    "Bhashini Powered",
    "ISO 27001 Ready",
  ];

  return (
    <div className="flex flex-col gap-32 py-32 px-6">
      {/* Badges Section */}
      <section className="bg-white/50 border-y border-accent py-12">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 lg:justify-between items-center px-4">
          {badges.map((badge, i) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 text-body/40 font-black italic text-xl select-none"
            >
              {badge}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Counters Section */}
      <section className="max-w-7xl mx-auto w-full grid grid-cols-2 lg:grid-cols-4 gap-16">
        {stats.map((stat) => (
          <CounterItem key={stat.label} {...stat} />
        ))}
      </section>
    </div>
  );
}
