import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const SOSButton = ({ className, onClick }) => {
  const { t } = useTranslation();
  const [isActivating, setIsActivating] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleClick = () => {
    if (isActivating) {
      setIsActivating(false);
      setCountdown(3);
      return;
    }

    setIsActivating(true);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        triggerSOS();
      }
    }, 1000);
  };

  const triggerSOS = () => {
    // Shared emergency logic
    if (onClick) onClick();
    alert("Emergency SOS Activated! Fetching location...");
    setIsActivating(false);
    setCountdown(3);
  };

  return (
    <div className={twMerge("fixed bottom-24 md:bottom-6 right-6 z-[9999]", className)}>
      <button
        onClick={handleClick}
        className={clsx(
          "w-16 h-16 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all duration-300 active:scale-95 border-4 border-white",
          isActivating ? "bg-[#C0392B] scale-110" : "bg-[#C0392B] animate-pulse"
        )}
        aria-label={t('sos_action', 'Emergency SOS')}
      >
        {isActivating ? (
          <span className="text-xl font-bold">{countdown}</span>
        ) : (
          <AlertCircle size={32} />
        )}
      </button>
      
      {isActivating && (
        <p className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-full text-xs font-bold text-[#C0392B] shadow-md border border-[#C0392B]">
          {t('tapping_to_cancel', 'Tap to cancel')}
        </p>
      )}
    </div>
  );
};

export default SOSButton;
