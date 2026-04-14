"use client";

import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    { title: "Register ABHA", desc: "Create your unique health ID safely." },
    { title: "Book Visit", desc: "Pick a slot or walk-in to a partner clinic." },
    { title: "Consultation", desc: "Digital prescriptions synced instantly." },
    { title: "Follow-up", desc: "Automated reminders for meds and tests." },
  ];

  return (
    <section className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl font-extrabold mb-4">How it works</h2>
          <p className="text-body max-w-2xl mx-auto">
            A seamless digital journey designed for accessibility and speed.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Dashed) */}
          <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 hidden lg:block">
            <svg width="100%" height="4" className="w-full">
              <line
                x1="10%"
                y1="2"
                x2="90%"
                y2="2"
                stroke="#0891B2"
                strokeWidth="2"
                strokeDasharray="8 12"
              />
              {/* Traveling Dot */}
              <motion.circle
                cx="10%"
                cy="2"
                r="4"
                fill="#0891B2"
                animate={{ cx: ["10%", "90%"] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-primary text-white text-2xl font-bold rounded-full flex items-center justify-center mb-8 border-[6px] border-accent relative">
                   {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-body text-sm leading-relaxed px-4">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
