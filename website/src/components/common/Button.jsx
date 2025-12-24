import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "border-2 border-cern-blue text-cern-blue hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-all duration-200",
  ghost: "text-slate-600 hover:text-cern-blue hover:bg-blue-50/50 px-4 py-2 rounded-lg font-medium transition-colors",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 px-6 py-2 rounded-lg",
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
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  };

  // If variant class already has padding, don't override unless necessary
  const finalSizeClass = variant === 'primary' || variant === 'secondary' ? '' : sizeClasses[size];

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${finalSizeClass}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={size === 'lg' ? 24 : 18} />}
      {children}
    </motion.button>
  );
};

export default Button;
