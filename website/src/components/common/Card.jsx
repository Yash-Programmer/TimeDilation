import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = "", hover = true, onClick }) => {
  return (
    <motion.div
      whileHover={hover && onClick ? { y: -5, boxShadow: "0 20px 40px rgba(0, 51, 160, 0.1)" } : {}}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      className={`
        glass-card p-6 relative overflow-hidden
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
