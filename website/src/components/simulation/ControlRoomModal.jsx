import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Gauge, Atom, Zap, Clock, ChevronDown, Play, Settings,
    Target, Activity, Layers, BarChart2, Database, Radio, MapPin, Info
} from 'lucide-react';
import { useSimulationContext, PARTICLES } from '../../context/SimulationContext';
import presetsData from '../../data/presets.json';

// ============================================
// FACILITIES - Only CERN, DESY, ELSA
// ============================================
const FACILITIES = {
    'cern-t9': presetsData.beamlines['cern-t9'],
    'cern-ps': presetsData.beamlines['cern-ps'],
    'cern-sps': presetsData.beamlines['cern-sps'],
    'desy-ii': presetsData.beamlines['desy-ii'],
    'elsa': presetsData.beamlines['elsa'],
};

// Filter presets to only those with valid beamlines
const VALID_PRESETS = presetsData.presets.filter(p =>
    !p.beamline || p.beamline === 'cern-t9' || p.beamline === 'cern-ps' ||
    p.beamline === 'cern-sps' || p.beamline === 'desy-ii' || p.beamline === 'elsa'
);

// ============================================
// CIRCULAR GAUGE - Clean Light Theme
// ============================================
const CircularGauge = ({ value, max, label, unit, color, size = 90, decimals = 1 }) => {
    const percentage = Math.min(100, (value / max) * 100);
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90" width={size} height={size}>
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth="5"
                        fill="none"
                    />
                    {/* Value arc */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500 ease-out"
                    />
                </svg>

                {/* Center value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base font-bold text-slate-800">
                        {typeof value === 'number' ? value.toFixed(decimals) : value}
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium">{unit}</span>
                </div>
            </div>
            <span className="mt-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{label}</span>
        </div>
    );
};

// ============================================
// DATA TABLE ROW
// ============================================
const DataRow = ({ label, value, unit = '', color = 'text-slate-800' }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
        <span className="text-xs text-slate-500">{label}</span>
        <span className={`text-sm font-mono font-semibold ${color}`}>
            {value}{unit && <span className="text-slate-400 text-xs ml-1">{unit}</span>}
        </span>
    </div>
);

// ============================================
// PARTICLE CHIP
// ============================================
const ParticleChip = ({ particle, isSelected, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
      px-3 py-2 rounded-lg border-2 transition-all font-medium text-sm
      ${disabled
                ? 'opacity-40 cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                : isSelected
                    ? 'border-[#0033A0] bg-blue-50 text-[#0033A0] shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
            }
    `}
    >
        <span style={{ color: disabled ? undefined : particle.color }}>{particle.symbol}</span>
    </button>
);

// ============================================
// BEAMLINE CARD
// ============================================
const BeamlineCard = ({ beamline, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`
      w-full text-left p-3 rounded-lg border-2 transition-all
      ${isSelected
                ? 'border-[#0033A0] bg-blue-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }
    `}
    >
        <div className="flex items-center gap-3">
            <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: beamline.color }}
            />
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-800">{beamline.name}</div>
                <div className="text-xs text-slate-500">{beamline.minMomentum}–{beamline.maxMomentum} GeV/c</div>
            </div>
            {isSelected && (
                <div className="w-5 h-5 bg-[#0033A0] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
    </button>
);

// ============================================
// PRESET CARD
// ============================================
const PresetChip = ({ preset, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`
      px-3 py-2 rounded-lg border transition-all text-xs font-medium
      ${isActive
                ? 'border-[#0033A0] bg-[#0033A0] text-white'
                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
            }
    `}
    >
        {preset.name}
    </button>
);

// ============================================
// MAIN CONTROL ROOM MODAL
// ============================================
const ControlRoomModal = ({ isOpen, onClose }) => {
    const { state, actions } = useSimulationContext();
    const [selectedBeamline, setSelectedBeamline] = useState('cern-t9');
    const [activeTab, setActiveTab] = useState('beamline');

    const currentBeamline = FACILITIES[selectedBeamline];

    // Available particles for current beamline
    const availableParticles = useMemo(() => {
        if (!currentBeamline) return Object.keys(PARTICLES);
        return currentBeamline.particles.filter(p => PARTICLES[p]);
    }, [currentBeamline]);

    // Filter presets by selected beamline
    const filteredPresets = useMemo(() => {
        return VALID_PRESETS.filter(p => p.beamline === selectedBeamline);
    }, [selectedBeamline]);

    // Handle beamline change
    const handleBeamlineChange = (beamlineId) => {
        setSelectedBeamline(beamlineId);
        const beamline = FACILITIES[beamlineId];
        if (beamline) {
            actions.setBeamlineLength(beamline.typicalLength);
            if (!beamline.particles.includes(state.particle.type)) {
                actions.setParticle(beamline.particles[0]);
            }
            if (state.beam.momentum > beamline.maxMomentum) {
                actions.setMomentum(beamline.maxMomentum);
            } else if (state.beam.momentum < beamline.minMomentum) {
                actions.setMomentum(beamline.minMomentum);
            }
        }
    };

    // Handle preset selection
    const handlePresetSelect = (preset) => {
        actions.loadPreset(preset);
        if (preset.beamline && FACILITIES[preset.beamline]) {
            setSelectedBeamline(preset.beamline);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

                {/* Modal */}
                <motion.div
                    className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-200"
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                >
                    {/* Header */}
                    <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-[#0033A0] text-white">
                                    <Database size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        Simulation Control Center
                                    </h2>
                                    <p className="text-sm text-slate-500">Configure beamline, particles, and physics parameters</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                                    <Radio className="w-3 h-3 text-emerald-500" />
                                    <span className="text-xs font-semibold text-emerald-700">SYSTEM READY</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-3 h-[calc(90vh-140px)]">

                        {/* LEFT: Beamline & Presets */}
                        <div className="border-r border-slate-200 overflow-y-auto">
                            {/* Tabs */}
                            <div className="flex border-b border-slate-200">
                                <button
                                    onClick={() => setActiveTab('beamline')}
                                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'beamline' ? 'text-[#0033A0] border-b-2 border-[#0033A0]' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <MapPin size={14} className="inline mr-1" /> Facilities
                                </button>
                                <button
                                    onClick={() => setActiveTab('presets')}
                                    className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'presets' ? 'text-[#0033A0] border-b-2 border-[#0033A0]' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <Layers size={14} className="inline mr-1" /> Presets
                                </button>
                            </div>

                            <div className="p-4 space-y-2">
                                {activeTab === 'beamline' ? (
                                    <>
                                        <p className="text-xs text-slate-500 mb-3">Select a particle physics facility:</p>
                                        {Object.entries(FACILITIES).map(([id, beamline]) => (
                                            <BeamlineCard
                                                key={id}
                                                beamline={beamline}
                                                isSelected={selectedBeamline === id}
                                                onClick={() => handleBeamlineChange(id)}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs text-slate-500 mb-3">Quick experiment configurations for {currentBeamline?.name}:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {filteredPresets.map(preset => (
                                                <PresetChip
                                                    key={preset.id}
                                                    preset={preset}
                                                    isActive={state.activePreset === preset.id}
                                                    onClick={() => handlePresetSelect(preset)}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* CENTER: Parameters */}
                        <div className="overflow-y-auto p-5 bg-slate-50">
                            {/* Current Facility Header */}
                            <div className="mb-5 pb-4 border-b border-slate-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentBeamline?.color }} />
                                    <span className="font-bold text-slate-800">{currentBeamline?.name}</span>
                                </div>
                                <p className="text-xs text-slate-500">{currentBeamline?.description}</p>
                            </div>

                            {/* Particle Selection */}
                            <div className="mb-5">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
                                    Particle Selection
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(PARTICLES).map(([id, particle]) => (
                                        <ParticleChip
                                            key={id}
                                            particle={particle}
                                            isSelected={state.particle.type === id}
                                            disabled={!availableParticles.includes(id)}
                                            onClick={() => actions.setParticle(id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Momentum Slider */}
                            <div className="mb-5 p-4 bg-white rounded-xl border border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-semibold text-slate-700">Beam Momentum</label>
                                    <span className="text-lg font-mono font-bold text-[#0033A0]">
                                        {state.beam.momentum.toFixed(1)} <span className="text-sm text-slate-400">GeV/c</span>
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={currentBeamline?.minMomentum || 0.5}
                                    max={currentBeamline?.maxMomentum || 15}
                                    step={0.1}
                                    value={state.beam.momentum}
                                    onChange={(e) => actions.setMomentum(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0033A0]"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                    <span>{currentBeamline?.minMomentum || 0.5} GeV/c</span>
                                    <span>{currentBeamline?.maxMomentum || 15} GeV/c</span>
                                </div>
                            </div>

                            {/* Intensity */}
                            <div className="mb-5 p-4 bg-white rounded-xl border border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-semibold text-slate-700">Beam Intensity</label>
                                    <span className="text-lg font-mono font-bold text-[#0033A0]">
                                        {state.beam.intensity.toLocaleString()}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={100}
                                    max={100000}
                                    step={100}
                                    value={state.beam.intensity}
                                    onChange={(e) => actions.setBeamIntensity(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0033A0]"
                                />
                            </div>

                            {/* Beamline Length */}
                            <div className="p-4 bg-white rounded-xl border border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-semibold text-slate-700">Beamline Length</label>
                                    <span className="text-lg font-mono font-bold text-[#0033A0]">
                                        {state.beamline.length} <span className="text-sm text-slate-400">m</span>
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={5}
                                    max={currentBeamline?.maxLength || 50}
                                    step={1}
                                    value={state.beamline.length}
                                    onChange={(e) => actions.setBeamlineLength(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#0033A0]"
                                />
                            </div>
                        </div>

                        {/* RIGHT: Live Physics Data */}
                        <div className="overflow-y-auto p-5 bg-slate-50">
                            {/* Gauges */}
                            <div className="mb-5">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4 block">
                                    Real-Time Physics
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    <CircularGauge
                                        value={state.derived.beta}
                                        max={1}
                                        label="Beta (v/c)"
                                        unit=""
                                        color="#10B981"
                                        decimals={4}
                                    />
                                    <CircularGauge
                                        value={state.derived.gamma}
                                        max={Math.max(100, state.derived.gamma * 1.2)}
                                        label="Gamma"
                                        unit=""
                                        color="#F59E0B"
                                        decimals={1}
                                    />
                                    <CircularGauge
                                        value={state.derived.expectedSurvival * 100}
                                        max={100}
                                        label="Survival"
                                        unit="%"
                                        color={state.derived.expectedSurvival > 0.5 ? '#10B981' : '#EF4444'}
                                        decimals={1}
                                    />
                                </div>
                            </div>

                            {/* Particle Data Table */}
                            <div className="mb-5 p-4 bg-white rounded-xl border border-slate-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                        style={{ backgroundColor: state.particle.color }}
                                    >
                                        {state.particle.symbol}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800 text-sm">{state.particle.name}</div>
                                        <div className="text-xs text-slate-500">{state.particle.composition}</div>
                                    </div>
                                </div>
                                <DataRow label="Rest Mass" value={state.particle.massUnit} color="text-slate-800" />
                                <DataRow label="Proper Lifetime τ₀" value={state.particle.lifetimeUnit} color="text-slate-800" />
                                <DataRow label="Charge" value={`${state.particle.charge > 0 ? '+' : ''}${state.particle.charge}e`} color="text-slate-800" />
                            </div>

                            {/* Kinematics Table */}
                            <div className="p-4 bg-white rounded-xl border border-slate-200">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3 block">
                                    Derived Kinematics
                                </label>
                                <DataRow label="Velocity β" value={state.derived.beta.toFixed(6)} unit="c" color="text-emerald-600" />
                                <DataRow label="Lorentz Factor γ" value={state.derived.gamma.toFixed(2)} color="text-amber-600" />
                                <DataRow label="Total Energy E" value={state.derived.energy.toFixed(3)} unit="GeV" color="text-blue-600" />
                                {state.particle.lifetime !== Infinity && (
                                    <>
                                        <DataRow label="Lab Lifetime τ_lab" value={(state.derived.labLifetime * 1e9).toFixed(1)} unit="ns" color="text-orange-600" />
                                        <DataRow label="Decay Length λ" value={state.derived.decayLength.toFixed(1)} unit="m" color="text-pink-600" />
                                        <DataRow label="P(survive)" value={(state.derived.expectedSurvival * 100).toFixed(1)} unit="%" color={state.derived.expectedSurvival > 0.5 ? 'text-emerald-600' : 'text-red-600'} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center">
                        <div className="text-xs text-slate-500">
                            <strong className="text-slate-700">Active:</strong> {currentBeamline?.facility} • {state.particle.name} @ {state.beam.momentum} GeV/c
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 text-sm font-bold text-white bg-[#0033A0] hover:bg-[#002880] rounded-lg transition-colors shadow-md"
                            >
                                Apply Configuration
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ControlRoomModal;
