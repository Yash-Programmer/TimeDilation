import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Lock, Info, FlaskConical, Atom, Zap, Target,
    BarChart3, Clock, ArrowRight, Download, ExternalLink,
    Gauge, Layers, Activity
} from 'lucide-react';
import { SimulationProvider } from '../context/SimulationContext';
import Scene3D from '../components/simulation/Scene3D';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../hooks/useGSAP';

// Use layout effect with SSR safety
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
// Pre-computed results for the BL4S experiment
const proposalResults = {
    pion: {
        name: 'Pion (π⁺)',
        mass: 139.6,
        momentum: 8.0,
        beta: 0.9985,
        gamma: 57.3,
        labLifetime: 1489, // ns
        decayLength: 446, // m
        survivalProb: 0.967,
    },
    kaon: {
        name: 'Kaon (K⁺)',
        mass: 493.7,
        momentum: 8.0,
        beta: 0.9981,
        gamma: 16.2,
        labLifetime: 201, // ns
        decayLength: 60, // m
        survivalProb: 0.752,
    }
};

const ProposalContent = () => {
    const [activeParticle, setActiveParticle] = useState('pion');
    const data = proposalResults[activeParticle];

    // GSAP refs
    const headerRef = useRef(null);
    const sidebarRef = useRef(null);
    const gammaRef = useRef(null);

    // Animate header on mount
    useIsomorphicLayoutEffect(() => {
        if (!headerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(headerRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power4.out' }
            );
        }, headerRef);

        return () => ctx.revert();
    }, []);

    // Animate sidebar panels
    useIsomorphicLayoutEffect(() => {
        if (!sidebarRef.current) return;

        const ctx = gsap.context(() => {
            const panels = sidebarRef.current.querySelectorAll('.proposal-panel');
            gsap.fromTo(panels,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 0.7, stagger: 0.12, ease: 'power4.out' }
            );
        }, sidebarRef);

        return () => ctx.revert();
    }, []);

    // Animate gamma value change
    useEffect(() => {
        if (gammaRef.current) {
            gsap.fromTo(gammaRef.current,
                { scale: 1.2, opacity: 0.5 },
                { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
            );
        }
    }, [activeParticle]);

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-slate-50">

            {/* Header Banner - Compact */}
            <div ref={headerRef} className="bg-[#f5f5f7] border-b border-gray-200 text-[#1d1d1f] shrink-0">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                                <FlaskConical size={28} className="text-[#0071e3]" />
                                Our BL4S Experiment Proposal
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 rounded text-xs font-normal ml-2 text-gray-600">
                                    <Lock size={10} />
                                    Locked
                                </span>
                            </h1>
                            <p className="text-gray-500 text-sm mt-1 max-w-xl">
                                Testing time dilation universality with pion/kaon decays at CERN T9.
                            </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                                <Download size={14} />
                                PDF
                            </button>
                            <Link
                                to="/simulator"
                                className="flex items-center gap-2 px-3 py-2 bg-white text-[#0033A0] rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
                            >
                                Build Your Own
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

                {/* Left: 3D Visualization */}
                <div className="lg:flex-1 h-[400px] lg:h-full bg-slate-900 relative">
                    <Scene3D />

                    {/* Locked Indicator Overlay */}
                    <div className="absolute top-4 left-4 z-10">
                        <div className="bg-black/70 backdrop-blur-md text-white p-3 rounded-lg text-xs font-mono border border-white/10">
                            <div className="flex items-center gap-2 text-yellow-400 mb-2">
                                <Lock size={12} />
                                <span className="uppercase tracking-wider text-[10px]">Read-Only Mode</span>
                            </div>
                            <div className="text-slate-400">Particle</div>
                            <div className="text-lg font-bold" style={{ color: activeParticle === 'pion' ? '#E74C3C' : '#3498DB' }}>
                                {data.name}
                            </div>
                        </div>
                    </div>

                    {/* Fixed Parameters Display */}
                    <div className="absolute bottom-4 left-4 z-10">
                        <div className="bg-black/80 backdrop-blur-md text-white p-4 rounded-xl text-xs font-mono border border-white/20 shadow-2xl min-w-[280px]">
                            <div className="text-[10px] uppercase tracking-wider text-yellow-400 mb-3 flex items-center gap-2">
                                <Lock size={10} />
                                Locked Experiment Parameters
                            </div>

                            <div className="space-y-2 mb-3 pb-3 border-b border-white/10">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Momentum (p)</span>
                                    <span className="text-cyan-400 font-bold">8.0 GeV/c</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Beamline</span>
                                    <span className="text-indigo-400">15 m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Facility</span>
                                    <span className="text-white">CERN T9</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">β (v/c)</span>
                                    <span className="text-green-400 font-bold">{data.beta.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">γ (Lorentz)</span>
                                    <span className="text-yellow-400 font-bold">{data.gamma.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">τ_lab</span>
                                    <span className="text-orange-400">{data.labLifetime} ns</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">P(survive)</span>
                                    <span className={data.survivalProb > 0.8 ? 'text-emerald-400' : 'text-amber-400'}>
                                        {(data.survivalProb * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Proposal Details */}
                <div ref={sidebarRef} className="lg:w-[450px] bg-white border-l border-slate-200 overflow-y-auto lg:h-full">
                    <div className="p-6 space-y-6">

                        {/* Particle Selector (Visual Only) */}
                        <div className="proposal-panel">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Atom size={14} />
                                Particle Comparison
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['pion', 'kaon'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setActiveParticle(p)}
                                        className={`p-4 rounded-xl border-2 transition-all ${activeParticle === p
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className={`text-lg font-bold ${p === 'pion' ? 'text-pink-600' : 'text-blue-600'}`}>
                                            {p === 'pion' ? 'π⁺' : 'K⁺'}
                                        </div>
                                        <div className="text-xs text-slate-500 capitalize">{p}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Experiment Configuration */}
                        <div className="proposal-panel bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Target size={14} />
                                Experiment Configuration
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Beam Momentum', value: '8.0 GeV/c', icon: Zap },
                                    { label: 'Beamline Length', value: '15 meters', icon: Layers },
                                    { label: 'Events per Run', value: '20,000', icon: Activity },
                                    { label: 'Estimated Duration', value: '2 weeks', icon: Clock },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <item.icon size={14} />
                                            {item.label}
                                        </div>
                                        <div className="font-mono font-bold text-slate-800">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detectors */}
                        <div className="proposal-panel">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Gauge size={14} />
                                Detector Configuration
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { name: 'TOF Start', position: '0 m', status: 'active', color: 'green' },
                                    { name: 'Scintillator', position: '5 m', status: 'active', color: 'blue' },
                                    { name: 'Cherenkov', position: '10 m', status: 'active', color: 'purple' },
                                    { name: 'TOF End', position: '15 m', status: 'active', color: 'orange' },
                                    { name: 'Calorimeter', position: '15 m', status: 'active', color: 'red' },
                                ].map((det, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full bg-${det.color}-500`} />
                                            <span className="font-medium text-slate-700">{det.name}</span>
                                        </div>
                                        <span className="text-xs font-mono text-slate-500">{det.position}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Expected Results */}
                        <div className="proposal-panel bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                            <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <BarChart3 size={14} />
                                Expected Results
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs text-blue-600 mb-1">Time Dilation Factor (γ)</div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl font-bold text-blue-900">{data.gamma.toFixed(1)}×</span>
                                        <span className="text-sm text-blue-600 mb-1">slower for {activeParticle}</span>
                                    </div>
                                </div>
                                <div className="text-sm text-blue-700">
                                    Lab-frame lifetime: <strong>{data.labLifetime} ns</strong> (vs {activeParticle === 'pion' ? '26' : '12.4'} ns proper time)
                                </div>
                                <div className="text-sm text-blue-700">
                                    Survival probability at 15m: <strong>{(data.survivalProb * 100).toFixed(1)}%</strong>
                                </div>
                            </div>
                        </div>

                        {/* Scientific Goal */}
                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                                Scientific Objective
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Our experiment aims to verify that time dilation is <strong>universal</strong>—applying
                                identically to different particle species. By measuring the survival probability of
                                pions and kaons at the same momentum, we can extract their lab-frame lifetimes and
                                compare them to theoretical predictions based on special relativity.
                            </p>
                        </div>

                        {/* Links */}
                        <div className="flex gap-3">
                            <Link
                                to="/learn"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                            >
                                Learn More
                                <ExternalLink size={14} />
                            </Link>
                            <Link
                                to="/supplementary"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0033A0] text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                            >
                                View Data
                                <BarChart3 size={14} />
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Proposal component with simulation context
const Proposal = () => {
    return (
        <SimulationProvider initialState={{
            particle: { name: 'Pion', symbol: 'π⁺', mass: 0.1396, massUnit: '139.6 MeV/c²', color: '#E74C3C', lifetime: 2.6e-8 },
            beam: { momentum: 8.0, intensity: 20000 },
            beamline: { length: 15 },
            detectors: {
                tofStart: { enabled: true, position: 0 },
                scintillator: { enabled: true, position: 5 },
                cherenkov: { enabled: true, position: 10 },
                tofEnd: { enabled: true, position: 15 },
                calorimeter: { enabled: true, position: 15 },
            },
            physics: { magneticField: 0 },
        }}>
            <ProposalContent />
        </SimulationProvider>
    );
};

export default Proposal;
