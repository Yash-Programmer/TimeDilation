import React, { useState } from 'react';
import {
  Play, Download, Share2, Settings, RefreshCw, BarChart2, Atom,
  ChevronDown, ChevronRight, HelpCircle, Zap, Target, Database, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { useSimulation } from '../../hooks/useSimulation';
import { PARTICLES } from '../../context/SimulationContext';

// ============================================
// TOOLTIP
// ============================================
const Tooltip = ({ children, content }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className="cursor-help">
        {children}
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-xl"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// COMPACT PARTICLE SELECTOR
// ============================================
const ParticleChip = ({ particle, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`
      flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium
      ${isSelected
        ? 'border-[#0033A0] bg-blue-50 text-[#0033A0] shadow-sm'
        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
      }
    `}
  >
    <span
      className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
      style={{ backgroundColor: particle.color }}
    >
      {particle.symbol}
    </span>
    <span>{particle.name}</span>
  </button>
);

// ============================================
// SLIDER
// ============================================
const Slider = ({ label, value, min, max, step, unit, onChange, tooltip }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {tooltip && (
          <Tooltip content={tooltip}>
            <HelpCircle size={12} className="text-slate-400" />
          </Tooltip>
        )}
      </div>
      <span className="font-mono text-sm font-bold text-[#0033A0]">
        {typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0033A0]"
    />
  </div>
);

// ============================================
// SECTION
// ============================================
const Section = ({ title, icon: Icon, children, defaultOpen = false, badge }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-[#0033A0]" />}
          <span className="font-semibold text-sm text-slate-800">{title}</span>
          {badge && (
            <span className="text-[10px] bg-[#0033A0] text-white px-1.5 py-0.5 rounded font-medium">
              {badge}
            </span>
          )}
        </div>
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
          <ChevronRight size={14} className="text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// QUICK STATS BAR
// ============================================
const QuickStats = ({ derived, particle }) => (
  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
    <div className="text-center">
      <div className="text-[10px] text-slate-500 uppercase">β</div>
      <div className="text-sm font-mono font-bold text-emerald-600">{derived.beta.toFixed(4)}</div>
    </div>
    <div className="text-center border-x border-slate-200">
      <div className="text-[10px] text-slate-500 uppercase">γ</div>
      <div className="text-sm font-mono font-bold text-amber-600">{derived.gamma.toFixed(1)}</div>
    </div>
    <div className="text-center">
      <div className="text-[10px] text-slate-500 uppercase">P(surv)</div>
      <div className={`text-sm font-mono font-bold ${derived.expectedSurvival > 0.5 ? 'text-emerald-600' : 'text-red-500'}`}>
        {(derived.expectedSurvival * 100).toFixed(0)}%
      </div>
    </div>
  </div>
);

// ============================================
// MAIN CONTROL PANEL
// ============================================
const ControlPanel = ({ onShowResults, onOpenControlRoom }) => {
  const { state, actions, runSimulation, downloadResults, isRunning, progress, results } = useSimulation();

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-lg overflow-hidden">

      {/* Header */}
      <div className="p-4 bg-[#f5f5f7] border-b border-gray-200 text-[#1d1d1f]">
        <div className="flex items-center gap-3 mb-3">
          <Atom size={24} className="text-[#0071e3]" />
          <div>
            <h2 className="text-lg font-bold">Experiment Setup</h2>
            <p className="text-xs text-gray-500">Configure your simulation</p>
          </div>
        </div>

        {/* Control Center Button */}
        {onOpenControlRoom && (
          <button
            onClick={onOpenControlRoom}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 transition-all shadow-sm"
          >
            <Database size={16} />
            Open Full Control Center
          </button>
        )}
      </div>

      {/* Active Configuration */}
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: state.particle.color }}
          >
            {state.particle.symbol}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-800">{state.particle.name}</div>
            <div className="text-xs text-slate-500">
              {state.beam.momentum} GeV/c • {state.beamline.length}m beamline
            </div>
          </div>
        </div>
        <QuickStats derived={state.derived} particle={state.particle} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">

        {/* Particle Selection */}
        <Section title="Particle" icon={Atom} defaultOpen={true} badge={state.particle.symbol}>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(PARTICLES).map(([type, particle]) => (
              <ParticleChip
                key={type}
                particle={particle}
                isSelected={state.particle.type === type}
                onSelect={() => actions.setParticle(type)}
              />
            ))}
          </div>
        </Section>

        {/* Beam Parameters */}
        <Section title="Beam Parameters" icon={Zap} defaultOpen={true}>
          <Slider
            label="Momentum"
            value={state.beam.momentum}
            min={0.5}
            max={15}
            step={0.1}
            unit="GeV/c"
            onChange={actions.setMomentum}
            tooltip="Higher momentum = higher γ = more time dilation"
          />
          <Slider
            label="Intensity"
            value={state.beam.intensity}
            min={100}
            max={50000}
            step={100}
            unit="particles"
            onChange={actions.setBeamIntensity}
            tooltip="Number of particles per simulation"
          />
        </Section>

        {/* Beamline */}
        <Section title="Beamline" icon={Target} defaultOpen={true}>
          <Slider
            label="Length"
            value={state.beamline.length}
            min={5}
            max={100}
            step={1}
            unit="m"
            onChange={actions.setBeamlineLength}
            tooltip="Longer beamline = more decay observable"
          />

          {/* Detector toggles */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500 uppercase">Detectors</span>
            {[
              { id: 'tof1', label: 'TOF Start', disabled: true },
              { id: 'scintillator', label: 'Scintillator' },
              { id: 'cherenkov', label: 'Cherenkov' },
              { id: 'tof2', label: 'TOF End' }
            ].map(d => (
              <label
                key={d.id}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${state.detectors[d.id] ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'
                  } ${d.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-200'}`}
              >
                <input
                  type="checkbox"
                  checked={state.detectors[d.id]}
                  disabled={d.disabled}
                  onChange={() => actions.toggleDetector(d.id)}
                  className="w-4 h-4 rounded text-[#0033A0] focus:ring-[#0033A0]"
                />
                <span className="text-sm text-slate-700">{d.label}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* Physics */}
        <Section title="Physics" icon={Settings} defaultOpen={true}>
          <label className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-white">
            <span className="text-sm text-slate-700">Enable Decay</span>
            <button
              onClick={() => actions.setDecayEnabled(!state.physics.decayEnabled)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${state.physics.decayEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full shadow"
                animate={{ x: state.physics.decayEnabled ? 20 : 0 }}
              />
            </button>
          </label>

          {/* RNG Seed */}
          <Slider
            label="RNG Seed"
            value={state.rngSeed}
            min={1}
            max={999999}
            step={1}
            unit=""
            onChange={actions.setRngSeed}
            tooltip="Random seed for reproducible simulations. Same seed = identical results every time"
          />
        </Section>

        {/* Detector Response - Toy Model */}
        <Section
          title="Detector Response"
          icon={Sliders}
          defaultOpen={false}
          badge={state.detectorResponse.enabled ? "⚠ TOY" : null}
        >
          {/* Educational Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Educational toy detector model.</strong> Simplified physics for demonstration purposes only.
              Not a replacement for GEANT4 or real detector simulation.
            </p>
          </div>

          {/* Enable Toggle */}
          <label className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-white">
            <span className="text-sm text-slate-700">Enable Detector Response</span>
            <button
              onClick={() => actions.setDetectorResponse({
                ...state.detectorResponse,
                enabled: !state.detectorResponse.enabled
              })}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${state.detectorResponse.enabled ? 'bg-amber-500' : 'bg-slate-300'
                }`}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full shadow"
                animate={{ x: state.detectorResponse.enabled ? 20 : 0 }}
              />
            </button>
          </label>

          {/* Controls (shown when enabled) */}
          <AnimatePresence>
            {state.detectorResponse.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <Slider
                  label="Detection Efficiency"
                  value={state.detectorResponse.efficiency * 100}
                  min={50}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={(val) => actions.setDetectorResponse({
                    ...state.detectorResponse,
                    efficiency: val / 100
                  })}
                  tooltip="Probability a particle is detected (geometric acceptance + efficiency)"
                />

                <Slider
                  label="Timing Resolution"
                  value={state.detectorResponse.timingResolution * 1e12}
                  min={10}
                  max={500}
                  step={10}
                  unit="ps"
                  onChange={(val) => actions.setDetectorResponse({
                    ...state.detectorResponse,
                    timingResolution: val * 1e-12
                  })}
                  tooltip="Gaussian smearing of arrival time measurement (σ_t)"
                />

                <label className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-white">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-slate-700">Energy Loss (dE/dx)</span>
                    <Tooltip content="Simplified Bethe-Bloch formula (no range straggling or secondaries)">
                      <HelpCircle size={12} className="text-slate-400" />
                    </Tooltip>
                  </div>
                  <button
                    onClick={() => actions.setDetectorResponse({
                      ...state.detectorResponse,
                      energyLoss: !state.detectorResponse.energyLoss
                    })}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${state.detectorResponse.energyLoss ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full shadow"
                      animate={{ x: state.detectorResponse.energyLoss ? 20 : 0 }}
                    />
                  </button>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>
      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-2">
        {/* Progress */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              <div className="flex justify-between text-xs font-medium text-[#0033A0]">
                <span>Simulating {state.beam.intensity.toLocaleString()} {state.particle.symbol}...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#0033A0] to-[#3498DB]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Button */}
        <AnimatePresence>
          {results && !isRunning && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Button
                variant="outline"
                className="w-full !border-emerald-500 !text-emerald-600 hover:!bg-emerald-50"
                icon={BarChart2}
                onClick={onShowResults}
              >
                View Results ({(results.stats.survivalRate * 100).toFixed(1)}% survived)
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Run Button */}
        <Button
          variant="primary"
          className="w-full py-3 text-base shadow-md"
          icon={isRunning ? RefreshCw : Play}
          disabled={isRunning}
          onClick={runSimulation}
        >
          {isRunning ? 'Running...' : 'Run Simulation'}
        </Button>

        {/* Export */}
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="flex-1" icon={Download} disabled={!results} onClick={() => downloadResults('csv')}>
            CSV
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" icon={Download} disabled={!results} onClick={() => downloadResults('json')}>
            JSON
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" icon={Share2}>
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
