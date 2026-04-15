import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-md hover:shadow-lg",
    secondary: "bg-primary-light text-primary hover:bg-blue-100 focus:ring-primary-light",
    ghost: "bg-transparent text-[#4A5A72] hover:bg-[#EDF2F7] focus:ring-[#D1D5DB] shadow-none",
    danger: "bg-danger text-white hover:bg-red-700 focus:ring-danger shadow-md",
    emergency: "bg-danger text-white animate-pulse hover:scale-105 focus:ring-danger rounded-full shadow-xl",
    white: "bg-white text-primary hover:bg-white/90 focus:ring-white shadow-md hover:shadow-lg",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "p-2",
  };

  return (
    <button
      disabled={isDisabled || isLoading}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
      ) : leftIcon ? (
        <span className="mr-2 transform group-hover:scale-110 transition-transform">{leftIcon}</span>
      ) : null}
      
      <span>{children}</span>
      
      {!isLoading && rightIcon && (
        <span className="ml-2 transform group-hover:translate-x-1 transition-transform">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
