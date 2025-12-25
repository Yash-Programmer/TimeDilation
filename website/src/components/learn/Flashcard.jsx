import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const Flashcard = ({ front, back }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="perspective-1000 my-8 w-full max-w-md mx-auto cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className="relative w-full h-64 transition-transform duration-500 transform-style-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* Front */}
                <div className="absolute inset-0 w-full h-full bg-white border-2 border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg backface-hidden">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Flashcard</span>
                    <h3 className="text-2xl font-bold text-slate-800 text-center">{front}</h3>
                    <p className="absolute bottom-4 text-xs text-slate-400 flex items-center gap-1">
                        <RefreshCw size={12} /> Click to flip
                    </p>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0033A0] to-blue-700 text-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl backface-hidden"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-4">Answer</span>
                    <p className="text-xl font-medium text-center leading-relaxed">{back}</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Flashcard;
