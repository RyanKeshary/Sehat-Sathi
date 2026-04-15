import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  wrapperClassName,
  isRequired = false,
  readAloudLabel = "Read label aloud",
  ...props
}) => {
  const id = React.useId();

  const handleReadAloud = () => {
    const utterance = new SpeechSynthesisUtterance(`${label}. ${hint || ''}`);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={twMerge("flex flex-col gap-1.5 w-full", wrapperClassName)}>
      <div className="flex justify-between items-center">
        {label && (
          <label 
            htmlFor={id} 
            className="text-sm font-medium text-[#1A2332] flex items-center gap-1"
          >
            {label} {isRequired && <span className="text-[#C0392B]">*</span>}
          </label>
        )}
        <button
          type="button"
          onClick={handleReadAloud}
          title={readAloudLabel}
          className="text-[#1A6FA3] text-xs hover:underline flex items-center gap-1"
        >
          <span className="sr-only">{readAloudLabel}</span>
          🔊 Listen
        </button>
      </div>

      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9BB0]">
            {leftIcon}
          </div>
        )}
        
        <input
          id={id}
          className={twMerge(
            "w-full px-4 py-2.5 bg-white border border-[#D4DCE8] rounded-lg text-[#1A2332] placeholder-[#8A9BB0] transition-all duration-200 outline-none",
            "focus:border-[#1A6FA3] focus:ring-4 focus:ring-[#EBF4FF]",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-[#C0392B] focus:border-[#C0392B] focus:ring-[#FDEDEC]",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9BB0]">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#C0392B] font-medium" role="alert">
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p className="text-xs text-[#8A9BB0]">
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
