import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LorentzCalculator = () => {
  const [velocity, setVelocity] = useState(0.8);
  const c = 299792458;

  const gamma = 1 / Math.sqrt(1 - velocity*velocity);

  return (
    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 my-8">
      <h3 className="text-xl font-bold text-[#0033A0] mb-4">Interactive: Lorentz Factor Calculator</h3>

      <div className="flex flex-col md:flex-row gap-8">
         <div className="flex-1 space-y-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Velocity (v/c)</label>
               <input
                 type="range" min="0" max="0.999" step="0.001"
                 value={velocity}
                 onChange={(e) => setVelocity(parseFloat(e.target.value))}
                 className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
               />
               <div className="flex justify-between mt-1 text-sm font-mono text-blue-800">
                  <span>0</span>
                  <span className="font-bold">{velocity.toFixed(3)}c</span>
                  <span>0.999c</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500 uppercase">Gamma (γ)</div>
                  <div className="text-2xl font-bold text-[#0033A0] font-mono">{gamma.toFixed(3)}</div>
               </div>
               <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500 uppercase">Time Dilation</div>
                  <div className="text-2xl font-bold text-[#E74C3C] font-mono">{gamma.toFixed(1)}x</div>
                  <div className="text-xs text-gray-400">slower</div>
               </div>
            </div>
         </div>

         <div className="flex-1 flex items-center justify-center bg-white rounded-lg p-4 relative overflow-hidden">
             {/* Visualization */}
             <div className="relative w-full h-32 flex flex-col justify-center">
                 {/* Stationary Clock */}
                 <div className="flex items-center gap-2 mb-4 opacity-50">
                    <div className="w-8 h-8 border-2 border-gray-400 rounded-full relative">
                        <motion.div
                           className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gray-600 origin-left"
                           animate={{ rotate: 360 }}
                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <span className="text-xs text-gray-500">Earth Clock</span>
                 </div>

                 {/* Moving Clock */}
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 border-2 border-[#E74C3C] rounded-full relative bg-red-50">
                        <motion.div
                           className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-[#E74C3C] origin-left"
                           animate={{ rotate: 360 }}
                           transition={{ duration: 2 * gamma, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-[#E74C3C] font-bold">Moving Clock</span>
                        <span className="text-[10px] text-gray-400">Ticks {gamma.toFixed(1)}x slower</span>
                    </div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export const ParticleBuilder = () => {
   const [quarks, setQuarks] = useState([]);

   const addQuark = (type) => {
       if (quarks.length < 3) setQuarks([...quarks, type]);
   };

   const reset = () => setQuarks([]);

   const getParticleName = () => {
       const sorted = [...quarks].sort().join('');
       if (sorted === 'uud') return { name: 'Proton', charge: '+1' };
       if (sorted === 'udd') return { name: 'Neutron', charge: '0' };
       if (quarks.length === 3) return { name: 'Unknown Baryon', charge: '?' };
       return null;
   };

   const result = getParticleName();

   return (
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 my-8">
         <h3 className="text-xl font-bold text-[#0033A0] mb-4">Interactive: Build a Particle</h3>
         <p className="text-sm text-gray-600 mb-4">Combine 3 quarks to make a Baryon.</p>

         <div className="flex gap-4 mb-6">
            <button onClick={() => addQuark('u')} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-bold border border-red-300">
               Up (u) <span className="text-xs block font-normal">+2/3 charge</span>
            </button>
            <button onClick={() => addQuark('d')} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-bold border border-blue-300">
               Down (d) <span className="text-xs block font-normal">-1/3 charge</span>
            </button>
            <button onClick={reset} className="px-4 py-2 text-gray-500 hover:text-gray-700 ml-auto">Reset</button>
         </div>

         <div className="h-32 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center gap-2">
            <AnimatePresence>
               {quarks.map((q, i) => (
                  <motion.div
                     key={i}
                     initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                     className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg
                        ${q === 'u' ? 'bg-[#E74C3C]' : 'bg-[#3498DB]'}
                     `}
                  >
                     {q}
                  </motion.div>
               ))}
            </AnimatePresence>
            {quarks.length === 0 && <span className="text-gray-400">Drop quarks here</span>}
         </div>

         {result && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
                 <div className="text-2xl font-bold text-gray-800">{result.name}</div>
                 <div className="text-sm text-gray-500">Charge: {result.charge}</div>
             </motion.div>
         )}
      </div>
   );
};
