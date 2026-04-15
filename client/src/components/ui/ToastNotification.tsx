'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export function ToastNotification({ message, isVisible, onClose }: { message: string, isVisible: boolean, onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 bg-white shadow-xl rounded-lg border-l-4 border-[#00C896] p-4 flex items-center gap-3 z-50 text-slate-800"
        >
          <div className="bg-[#00C896]/10 p-1.5 rounded-full text-[#00C896]">
            <Check size={16} />
          </div>
          <span className="font-medium text-sm">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
