import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: "bg-[#0033A0] text-white hover:bg-[#002280] hover:scale-105 shadow-md",
  secondary: "bg-white text-[#0033A0] border-2 border-[#0033A0] hover:bg-blue-50",
  outline: "bg-transparent text-[#0033A0] border border-[#0033A0] hover:bg-blue-50",
  ghost: "bg-transparent text-[#555577] hover:text-[#0033A0] hover:bg-gray-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`
        rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizeClasses[size]}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </motion.button>
  );
};

export default Button;
