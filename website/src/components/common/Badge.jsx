import React from 'react';

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-blue-100 text-[#0033A0]",
    pion: "bg-red-100 text-[#E74C3C]",
    kaon: "bg-blue-100 text-[#3498DB]",
    muon: "bg-green-100 text-[#2ECC71]",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant] || variants.default}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;
