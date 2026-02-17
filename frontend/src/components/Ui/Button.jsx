import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 bg-transparent",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={twMerge(baseStyles, variants[variant], sizes[props.size || 'md'], className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </motion.button>
  );
};