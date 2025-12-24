import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = "", hover = true, onClick }) => {
  return (
    <motion.div
      whileHover={hover && onClick ? { y: -8, boxShadow: "0 8px 24px rgba(0, 51, 160, 0.15)" } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        bg-white rounded-2xl p-6
        shadow-[0_4px_16px_rgba(0,51,160,0.08)]
        border border-gray-100
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;
