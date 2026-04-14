"use client";

import { motion } from "framer-motion";
import { User, Stethoscope, Building2, ArrowRight } from "lucide-react";

export function RoleCards() {
  const roles = [
    {
      title: "For Patients",
      desc: "Manage your health records, schedule appointments, and get AI-assisted symptom checks even without internet.",
      icon: User,
      href: "#",
    },
    {
      title: "For Doctors",
      desc: "Streamline your practice with AI-powered intake, patient history timelines, and secure e-prescriptions.",
      icon: Stethoscope,
      href: "#",
    },
    {
      title: "For Clinic Ops",
      desc: "Optimize queue management, billing, and ABDM compliance dashboard with real-time analytics.",
      icon: Building2,
      href: "#",
    },
  ];

  return (
    <section className="py-24 px-6 bg-accent/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-xl border border-accent shadow-premium border-t-4 border-t-primary transition-all hover:shadow-hover group"
            >
              <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <role.icon className="text-primary w-8 h-8 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{role.title}</h3>
              <p className="text-body mb-8 leading-relaxed">
                {role.desc}
              </p>
              <a
                href={role.href}
                className="inline-flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all"
              >
                Enter Dashboard <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
