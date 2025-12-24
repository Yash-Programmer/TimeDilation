import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 px-3 py-2 text-xs text-white bg-[#1A1A2E] rounded-md shadow-lg -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            {content}
            <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-[#1A1A2E]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
