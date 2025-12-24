import React, { useState } from 'react';
import { Play, Download, Share2, Settings, RefreshCw, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import presetsData from '../../data/presets.json';

const AccordionItem = ({ title, isOpen, onClick, children }) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        <span className="font-semibold text-[#0033A0]">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-400"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#F7F9FB]"
          >
            <div className="p-4 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ControlPanel = ({ simulation, onShowResults }) => {
  const { params, updateRootParam, updateParam, runSimulation, isRunning, progress, results } = simulation;
  const [openSection, setOpenSection] = useState('beam'); // 'beam', 'detectors', 'physics', 'analysis'

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handlePresetChange = (e) => {
    // In a real app, this would load the preset params
    console.log("Loading preset:", e.target.value);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-lg z-20 overflow-hidden">

      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white z-10">
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Simulation Parameters</h2>

        {/* Preset Selector */}
        <div className="relative">
          <select
            className="w-full p-3 pl-10 bg-white border-2 border-[#0033A0] rounded-lg appearance-none font-medium text-[#0033A0] focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer hover:shadow-md transition-shadow"
            onChange={handlePresetChange}
          >
            {presetsData.presets.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <Settings className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0033A0]" size={18} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">

        {/* Group 1: Beam Parameters */}
        <AccordionItem title="Beam Parameters" isOpen={openSection === 'beam'} onClick={() => toggleSection('beam')}>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Particle Type</label>
             <div className="grid grid-cols-2 gap-2">
               {['pion', 'kaon', 'muon', 'proton'].map(type => (
                 <button
                   key={type}
                   onClick={() => updateRootParam('particleType', type)}
                   className={`
                     p-2 rounded-md text-sm border capitalize transition-all
                     ${params.particleType === type
                       ? 'bg-blue-100 border-[#0033A0] text-[#0033A0] font-bold'
                       : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                   `}
                 >
                   {type}
                 </button>
               ))}
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Momentum (GeV/c)</label>
             <div className="flex items-center gap-4">
               <input
                 type="range" min="1" max="15" step="0.1"
                 value={params.momentum}
                 onChange={(e) => updateRootParam('momentum', parseFloat(e.target.value))}
                 className="flex-1 h-2 bg-gradient-to-r from-yellow-300 to-red-500 rounded-lg appearance-none cursor-pointer"
               />
               <span className="font-mono text-lg font-bold w-16 text-right">{params.momentum}</span>
             </div>
             <p className="text-xs text-gray-500 mt-1 font-mono">
               β = {(params.momentum / Math.sqrt(params.momentum**2 + 0.14**2)).toFixed(5)} (Pion)
             </p>
           </div>
        </AccordionItem>

        {/* Group 2: Detectors */}
        <AccordionItem title="Detector Configuration" isOpen={openSection === 'detectors'} onClick={() => toggleSection('detectors')}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beamline Length (m)</label>
              <input
                 type="range" min="5" max="50" step="1"
                 value={params.beamLength}
                 onChange={(e) => updateRootParam('beamLength', parseInt(e.target.value))}
                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
               />
               <div className="flex justify-between text-xs text-gray-500 mt-1">
                 <span>5m</span>
                 <span className="font-bold text-[#0033A0]">{params.beamLength}m</span>
                 <span>50m</span>
               </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Active Detectors</label>
              {[
                { id: 'tof1', label: 'TOF Start (Fixed)' },
                { id: 'scint', label: 'Scintillator Array' },
                { id: 'cherenkov', label: 'Cherenkov Counter' },
                { id: 'tof2', label: 'TOF End' }
              ].map(d => (
                <label key={d.id} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.detectors[d.id] ?? true} // Default true if undefined in initial state
                    disabled={d.id === 'tof1'}
                    className="w-4 h-4 text-[#0033A0] rounded focus:ring-[#0033A0]"
                  />
                  <span className="text-sm text-gray-700">{d.label}</span>
                </label>
              ))}
            </div>
        </AccordionItem>

        {/* Group 3: Physics */}
        <AccordionItem title="Physics Settings" isOpen={openSection === 'physics'} onClick={() => toggleSection('physics')}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Enable Decay</span>
              <button
                onClick={() => updateParam('physics', 'decay', !params.physics.decay)}
                className={`
                  w-12 h-6 rounded-full p-1 transition-colors
                  ${params.physics.decay ? 'bg-[#2ECC71]' : 'bg-gray-300'}
                `}
              >
                <div className={`
                  w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform
                  ${params.physics.decay ? 'translate-x-6' : 'translate-x-0'}
                `} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Magnetic Field (Tesla)</label>
              <input
                 type="range" min="0" max="2" step="0.1"
                 value={params.physics.magneticField}
                 onChange={(e) => updateParam('physics', 'magneticField', parseFloat(e.target.value))}
                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
               />
               <div className="text-right text-xs font-mono">{params.physics.magneticField} T</div>
            </div>
        </AccordionItem>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-200 bg-white z-10 space-y-4">
        {/* Progress Bar (if running) */}
        {isRunning && (
          <div className="space-y-1">
             <div className="flex justify-between text-xs font-medium text-[#0033A0]">
               <span>Simulating...</span>
               <span>{progress}%</span>
             </div>
             <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
               <motion.div
                 className="h-full bg-[#0033A0]"
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
               />
             </div>
          </div>
        )}

        {/* Results Button (if finished) */}
        {results && !isRunning && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <Button
                 variant="outline"
                 className="w-full mb-2 !border-green-500 !text-green-600 hover:!bg-green-50"
                 icon={BarChart2}
                 onClick={onShowResults}
               >
                 View Results
               </Button>
            </motion.div>
        )}

        <Button
          variant="primary"
          className="w-full py-4 text-lg shadow-lg shadow-blue-900/20"
          icon={isRunning ? RefreshCw : Play}
          disabled={isRunning}
          onClick={runSimulation}
        >
          {isRunning ? 'Running Simulation...' : 'Run Simulation'}
        </Button>

        <div className="flex gap-4">
          <Button variant="secondary" size="sm" className="flex-1" icon={Download}>Export</Button>
          <Button variant="secondary" size="sm" className="flex-1" icon={Share2}>Share</Button>
        </div>
      </div>

    </div>
  );
};

export default ControlPanel;
