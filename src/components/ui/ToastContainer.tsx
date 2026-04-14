"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore, Toast } from "@/store/useToastStore";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";

const TOAST_ICONS = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const TOAST_BORDERS = {
  success: "border-l-emerald-500",
  error: "border-l-rose-500",
  warning: "border-l-amber-500",
  info: "border-l-blue-500",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className={cn(
              "pointer-events-auto bg-[#0A2540]/90 backdrop-blur-xl border-l-4 rounded-xl p-4 shadow-2xl flex items-start gap-3 relative overflow-hidden",
              TOAST_BORDERS[toast.type]
            )}
          >
            <div className="shrink-0 mt-0.5">{TOAST_ICONS[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 hover:bg-white/10 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4 text-white/40 hover:text-white" />
            </button>

            {/* Progress Bar Animation */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: "linear" }}
              className={cn(
                "absolute bottom-0 left-0 right-0 h-1 bg-white/10 origin-left",
                toast.type === "success" && "bg-emerald-500/30",
                toast.type === "error" && "bg-rose-500/30",
                toast.type === "warning" && "bg-amber-500/30",
                toast.type === "info" && "bg-blue-500/30"
              )}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
