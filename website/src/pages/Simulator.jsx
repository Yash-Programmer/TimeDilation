import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';
import Scene3D from '../components/simulation/Scene3D';
import ControlPanel from '../components/simulation/ControlPanel';
import ResultsModal from '../components/simulation/ResultsModal';
import { useSimulation } from '../hooks/useSimulation';

const Simulator = () => {
  const simulation = useSimulation();
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  // In a real implementation, we'd use a draggable splitter library
  // For now, we'll use a fixed ratio that collapses on mobile

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      {/* Left Panel: 3D Scene */}
      <div className="flex-grow relative bg-black">
         {/* Overlays */}
         <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-md text-white p-2 rounded-lg text-xs font-mono border border-white/10">
               <div>FPS: 60</div>
               <div>Particles: {simulation.isRunning ? "ACTIVE" : "IDLE"}</div>
            </div>
         </div>

         {/* The Scene */}
         <Scene3D interactive={true} simulationState={{ running: simulation.isRunning }} />

         {/* Live Data Overlays (Fake) */}
         {simulation.isRunning && (
            <div className="absolute bottom-4 left-4 z-10">
               <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border-l-4 border-[#0033A0] w-64">
                  <h4 className="text-[#0033A0] font-bold text-xs uppercase mb-2">Real-time Detector Readout</h4>
                  <div className="space-y-1 font-mono text-xs">
                     <div className="flex justify-between">
                        <span>TOF Start:</span>
                        <span className="text-green-600">{(Math.random()*100).toFixed(0)} Hz</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Scintillator:</span>
                        <span className="text-green-600">{(Math.random()*90).toFixed(0)} Hz</span>
                     </div>
                     <div className="flex justify-between">
                        <span>TOF End:</span>
                        <span className="text-red-500">{(Math.random()*80).toFixed(0)} Hz</span>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>

      {/* Draggable Divider (Visual Only) */}
      <div className="w-1 bg-gray-200 hover:bg-[#0033A0] cursor-col-resize flex items-center justify-center transition-colors z-30">
         <GripVertical size={12} className="text-gray-400" />
      </div>

      {/* Right Panel: Controls */}
      <div className="w-[400px] min-w-[320px] max-w-[500px] h-full z-20 hidden md:block">
         <ControlPanel
            simulation={simulation}
            onShowResults={() => setIsResultsOpen(true)}
         />
      </div>

      {/* Results Modal */}
      <ResultsModal
         isOpen={isResultsOpen}
         onClose={() => setIsResultsOpen(false)}
         results={simulation.results}
      />

    </div>
  );
};

export default Simulator;
