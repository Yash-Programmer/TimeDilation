import React, { useState } from 'react';
import { GripVertical, Info, Maximize2, Minimize2 } from 'lucide-react';
import { SimulationProvider } from '../context/SimulationContext';
import Scene3D from '../components/simulation/Scene3D';
import ControlPanel from '../components/simulation/ControlPanel';
import ResultsModal from '../components/simulation/ResultsModal';
import ControlRoomModal from '../components/simulation/ControlRoomModal';
import { useSimulation } from '../hooks/useSimulation';

// Inner component that uses the context
const SimulatorContent = () => {
   const { state, isRunning, results } = useSimulation();
   const [isResultsOpen, setIsResultsOpen] = useState(false);
   const [is3DExpanded, setIs3DExpanded] = useState(false);
   const [isControlRoomOpen, setIsControlRoomOpen] = useState(false);

   return (
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">

         {/* Left Panel: 3D Scene */}
         <div className={`relative bg-slate-900 transition-all duration-500 ${is3DExpanded ? 'flex-1' : 'flex-grow'}`}>
            {/* Info Overlay - Top Left */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
               <div className="bg-black/70 backdrop-blur-md text-white p-3 rounded-lg text-xs font-mono border border-white/10 space-y-1">
                  <div className="text-slate-400">Active Particle</div>
                  <div className="text-lg font-bold" style={{ color: state.particle.color }}>
                     {state.particle.name}
                  </div>
                  <div className="border-t border-white/10 pt-1 mt-1">
                     <span className="text-slate-400">Status: </span>
                     <span className={isRunning ? 'text-green-400' : 'text-yellow-400'}>
                        {isRunning ? 'SIMULATING' : 'READY'}
                     </span>
                  </div>
               </div>
            </div>

            {/* Expand/Collapse Button */}
            <button
               onClick={() => setIs3DExpanded(!is3DExpanded)}
               className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
            >
               {is3DExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            {/* The 3D Scene */}
            <Scene3D />

            {/* Live Data Overlays */}
            {isRunning && (
               <div className="absolute bottom-4 left-4 z-10">
                  <div className="bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-lg border-l-4 border-[#0033A0] w-64">
                     <h4 className="text-[#0033A0] font-bold text-xs uppercase mb-2">Real-time Detector Readout</h4>
                     <div className="space-y-2 font-mono text-xs">
                        <div className="flex justify-between">
                           <span className="text-slate-600">TOF Start:</span>
                           <span className="text-green-600 font-bold">━━━━━━</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-slate-600">Scintillator:</span>
                           <span className="text-green-500 font-bold">━━━━━</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-slate-600">Cherenkov:</span>
                           <span className="text-blue-500 font-bold">━━━━</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-slate-600">TOF End:</span>
                           <span className="text-orange-500 font-bold">━━━</span>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Parameter Meters - Bottom Left (Always visible) */}
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
               <div className="bg-black/80 backdrop-blur-md text-white p-4 rounded-xl text-xs font-mono border border-white/20 shadow-2xl min-w-[280px]">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                     Live Parameters
                  </div>

                  {/* Particle Info */}
                  <div className="mb-3 pb-3 border-b border-white/10">
                     <div className="flex justify-between items-center">
                        <span className="text-slate-400">Particle</span>
                        <span className="font-bold" style={{ color: state.particle.color }}>
                           {state.particle.symbol || state.particle.name}
                        </span>
                     </div>
                     <div className="flex justify-between mt-1">
                        <span className="text-slate-500 text-[10px]">Mass</span>
                        <span className="text-slate-300">{state.particle.massUnit}</span>
                     </div>
                  </div>

                  {/* Beam Parameters */}
                  <div className="space-y-2 mb-3 pb-3 border-b border-white/10">
                     <div className="flex justify-between">
                        <span className="text-slate-400">Momentum (p)</span>
                        <span className="text-cyan-400 font-bold">{state.beam.momentum.toFixed(1)} GeV/c</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-400">Intensity</span>
                        <span className="text-white">{state.beam.intensity.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-400">Beamline</span>
                        <span className="text-indigo-400">{state.beamline.length} m</span>
                     </div>
                  </div>

                  {/* Derived Physics */}
                  <div className="space-y-2">
                     <div className="flex justify-between">
                        <span className="text-slate-400">β (v/c)</span>
                        <span className="text-green-400 font-bold">{state.derived.beta.toFixed(5)}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-400">γ (Lorentz)</span>
                        <span className="text-yellow-400 font-bold">{state.derived.gamma.toFixed(1)}</span>
                     </div>
                     {state.particle.lifetime !== Infinity && (
                        <>
                           <div className="flex justify-between">
                              <span className="text-slate-400">τ_lab</span>
                              <span className="text-orange-400">{(state.derived.labLifetime * 1e9).toFixed(1)} ns</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-slate-400">λ (decay)</span>
                              <span className="text-pink-400">{state.derived.decayLength.toFixed(0)} m</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-slate-400">P(survive)</span>
                              <span className={state.derived.expectedSurvival > 0.5 ? 'text-emerald-400' : 'text-red-400'}>
                                 {(state.derived.expectedSurvival * 100).toFixed(1)}%
                              </span>
                           </div>
                        </>
                     )}
                     {state.physics.magneticField > 0 && (
                        <div className="flex justify-between">
                           <span className="text-slate-400">B-field</span>
                           <span className="text-purple-400">{state.physics.magneticField.toFixed(1)} T</span>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Status Indicator - Bottom Right */}
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
               <div className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs font-mono border border-white/10">
                  <span className="text-slate-400">Status: </span>
                  <span className={isRunning ? 'text-green-400' : results ? 'text-blue-400' : 'text-yellow-400'}>
                     {isRunning ? 'SIMULATING' : results ? 'COMPLETE' : 'READY'}
                  </span>
               </div>
            </div>
         </div>

         {/* Draggable Divider */}
         <div className="w-1 bg-slate-200 hover:bg-[#0033A0] cursor-col-resize flex items-center justify-center transition-colors z-30 group">
            <GripVertical size={12} className="text-slate-400 group-hover:text-white" />
         </div>

         {/* Right Panel: Controls */}
         <div className={`h-full z-20 transition-all duration-500 ${is3DExpanded ? 'w-0 opacity-0' : 'w-[420px] min-w-[360px] max-w-[500px]'} hidden md:block`}>
            <ControlPanel
               onShowResults={() => setIsResultsOpen(true)}
               onOpenControlRoom={() => setIsControlRoomOpen(true)}
            />
         </div>

         {/* Results Modal */}
         <ResultsModal
            isOpen={isResultsOpen}
            onClose={() => setIsResultsOpen(false)}
         />

         {/* Control Room Modal */}
         <ControlRoomModal
            isOpen={isControlRoomOpen}
            onClose={() => setIsControlRoomOpen(false)}
         />
      </div>
   );
};

// Main Simulator component wraps with Provider
const Simulator = () => {
   return (
      <SimulationProvider>
         <SimulatorContent />
      </SimulationProvider>
   );
};

export default Simulator;
