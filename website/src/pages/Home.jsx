import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ArrowRight, Play, Pause, Settings,
    BarChart3, Sliders, Maximize2, MoreHorizontal,
    Cpu, ShieldCheck, Zap, Globe, Database, Scale,
    Microscope, Timer, Box, FileText, HelpCircle,
    Atom, ChevronDown, Laptop, Layers, Share2, Download,
    Target, Sparkles, Plus, Minus, Activity, Code, Terminal,
    GitBranch, Server, BookOpen, FlaskConical, MousePointer2,
    CheckCircle2, Lock, Clock, GraduationCap, X, Linkedin, Github, Twitter
} from 'lucide-react';
import { gsap, ScrollTrigger } from '../hooks/useGSAP';
import TextMarquee from '../components/common/TextMarquee';
import MagneticButton from '../components/common/MagneticButton';
import HorizontalScroll, { HorizontalScrollItem } from '../components/common/HorizontalScroll';
import Footer from '../components/common/Footer';

// Assets
import featureBeam from '../assets/feature_beam.png';
import featureDetector from '../assets/feature_detector.png';
import featureAnalysis from '../assets/feature_analysis.png';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// ============================================
// GLOBAL NOISE OVERLAY
// ============================================
const NoiseOverlay = () => (
    <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.035] mix-blend-overlay"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
    />
);

// ============================================
// ZOOM HERO - MONOCHROME
// ============================================
const ZoomHero = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const titleRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);

    useIsomorphicLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.2 });

            // Entrances
            const chars1 = line1Ref.current?.querySelectorAll('.char');
            const chars2 = line2Ref.current?.querySelectorAll('.char');

            if (chars1) {
                tl.fromTo(chars1,
                    { opacity: 0, y: 150, rotateX: -90, scale: 0.5 },
                    { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1.2, stagger: 0.04, ease: 'power4.out' },
                    '-=0.4'
                );
            }
            if (chars2) {
                tl.fromTo(chars2,
                    { opacity: 0, y: 150, rotateX: -90, scale: 0.5 },
                    { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1.2, stagger: 0.04, ease: 'power4.out' },
                    '-=1.0'
                );
            }

            tl.fromTo('.hero-fade', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2 }, '-=0.5');

            // ZOOM SCROLL EFFECT
            gsap.to(contentRef.current, {
                scale: 0.85,
                opacity: 0,
                y: -100,
                filter: 'blur(10px)',
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom center',
                    scrub: true
                }
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const splitChars = (text, className = '') => text.split('').map((char, i) => (
        <span key={i} className={`char inline-block ${className}`} style={{ transformOrigin: 'center bottom' }}>{char === ' ' ? '\u00A0' : char}</span>
    ));

    return (
        <section ref={sectionRef} className="relative h-screen sticky top-0 flex flex-col items-center justify-center px-6 bg-[#f5f5f7] overflow-hidden perspective-1000 z-0 border-b border-gray-200">
            {/* Monochrome Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[80%] bg-gray-200/40 rounded-full blur-[150px] mix-blend-multiply opacity-50" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[80%] bg-gray-300/40 rounded-full blur-[150px] mix-blend-multiply opacity-50" />
            </div>

            <div ref={contentRef} className="relative z-10 max-w-[100rem] mx-auto w-full origin-center">
                {/* Stats Bar */}
                <div className="hero-fade flex flex-wrap justify-center gap-4 md:gap-12 mb-16 text-xs md:text-sm font-mono text-[#86868b] uppercase tracking-wider">
                    <div className="flex items-center gap-2 border border-gray-200 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                        v2.4 Kernel Live
                    </div>
                    <div className="flex items-center gap-2 border border-gray-200 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm">
                        <Activity size={14} />
                        100k+ Events/sec
                    </div>
                    <div className="flex items-center gap-2 border border-gray-200 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm">
                        <Zap size={14} />
                        WASM Accelerated
                    </div>
                </div>

                {/* Main Heading */}
                <div ref={titleRef} className="text-center mb-16 perspective-1200">
                    <h1 ref={line1Ref} className="font-display text-[6rem] md:text-[10rem] lg:text-[14rem] leading-[0.85] font-medium tracking-tighter text-[#1d1d1f] mb-2 filter contrast-125">
                        {splitChars('Particle')}
                    </h1>
                    <h1 ref={line2Ref} className="font-display text-[6rem] md:text-[10rem] lg:text-[14rem] leading-[0.85] font-medium tracking-tighter text-[#86868b]">
                        {splitChars('Simulations')}
                    </h1>
                </div>

                <p className="hero-fade text-center text-xl md:text-3xl text-[#424245] max-w-3xl mx-auto leading-relaxed font-regular mb-16">
                    A professional-grade Monte Carlo engine for relativistic kinematics, beam transport, and detector response.
                </p>

                {/* CTA */}
                <div className="hero-fade flex flex-col sm:flex-row justify-center gap-6 mb-24">
                    <MagneticButton as={Link} to="/simulator" strength={0.3} radius={120} className="group relative px-12 py-6 bg-[#1d1d1f] text-white text-xl font-medium rounded-full overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                        <span className="relative z-10 flex items-center gap-3">
                            <Play size={24} className="fill-white" />
                            Launch Simulator
                        </span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
};

// ============================================
// PINNED PIPELINE - TECH SPECS
// ============================================
const PinnedPipeline = () => {
    const sectionRef = useRef(null);
    const stepsRef = useRef([]);

    useIsomorphicLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=250%',
                    pin: true,
                    scrub: 1
                }
            });

            // Draw line
            tl.fromTo('.pipeline-draw-path',
                { strokeDasharray: 2000, strokeDashoffset: 2000 },
                { strokeDashoffset: 0, ease: 'none', duration: 1 }
            );

            // Activate Steps
            stepsRef.current.forEach((step, i) => {
                const progressPoint = (i + 1) * 0.22;
                tl.to(step.querySelector('.step-active'), { opacity: 1, scale: 1, borderColor: '#1d1d1f', duration: 0.1 }, progressPoint);
                tl.to(step.querySelector('.step-icon'), { color: '#1d1d1f', scale: 1.2, duration: 0.1 }, progressPoint);
                tl.to(step.querySelector('.step-num'), { backgroundColor: '#1d1d1f', color: '#ffffff', duration: 0.1 }, progressPoint);
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const steps = [
        { icon: Zap, title: "Beam Gen", desc: "Pion/Kaon Injection", specs: ["100 GeV/c Beam", "Gaussian Spread", "Collimator A"] },
        { icon: Activity, title: "Decay Tunnel", desc: "Lorentz Transforms", specs: ["Relativistic Dilation", "2-Body Decay", "Schwartz-Child"] },
        { icon: Target, title: "Detection", desc: "Calorimeter Response", specs: ["Liquid Argon", "Scintillator Array", "Si-PMT Readout"] },
        { icon: BarChart3, title: "Analysis", desc: "ROOT Histogramming", specs: ["Minuit Fitting", "Chi-Square Test", "Systematic Error"] },
    ];

    return (
        <section ref={sectionRef} className="h-screen bg-white relative overflow-hidden z-20 flex flex-col justify-center border-b border-gray-200">
            <div className="max-w-7xl mx-auto w-full px-6">
                <div className="text-center mb-24">
                    <span className="text-black font-bold text-xs uppercase tracking-widest mb-4 block border border-black/10 inline-block px-3 py-1 rounded-full">Workflow</span>
                    <h2 className="text-5xl md:text-7xl font-semibold text-[#1d1d1f] tracking-tight">The Simulation Pipeline</h2>
                </div>

                <div className="relative">
                    {/* Base Line */}
                    <svg className="absolute top-16 left-0 w-full h-32 hidden md:block overflow-visible z-0 pointer-events-none" preserveAspectRatio="none">
                        <path d="M 50 50 L 1150 50" stroke="#f0f0f0" strokeWidth="4" fill="none" />
                        <path className="pipeline-draw-path" d="M 50 50 L 1150 50" stroke="#000000" strokeWidth="4" fill="none" />
                    </svg>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {steps.map((step, i) => (
                            <div key={i} ref={el => stepsRef.current[i] = el} className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-32 h-32 bg-white border border-gray-100 rounded-full flex items-center justify-center mb-8 shadow-lg relative group-hover:shadow-2xl transition-all duration-500">
                                    <step.icon size={40} className="step-icon text-gray-300 transition-all duration-300" />
                                    <div className="step-active absolute inset-0 rounded-full border-2 border-black opacity-0 scale-90 transition-all duration-300" />
                                </div>
                                <div className="step-num bg-[#f5f5f7] px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#86868b] mb-4 transition-colors duration-300">STEP 0{i + 1}</div>
                                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-2">{step.title}</h3>
                                <p className="text-sm text-[#424245] font-medium mb-3">{step.desc}</p>

                                {/* Tech Specs */}
                                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-mono space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {step.specs.map((s, j) => <div key={j} className="border-t border-gray-100 pt-1 w-full">{s}</div>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ============================================
// HORIZONTAL BLUEPRINTS - MONOCHROME
// ============================================
const HorizontalBlueprints = () => {
    return (
        <div className="bg-black text-white overflow-hidden z-30 relative border-b border-white/10">
            <HorizontalScroll className="h-screen" speed={1} showProgress={true}>
                {/* INTRO PANEL */}
                <HorizontalScrollItem className="w-screen h-screen flex items-center justify-center p-20 border-r border-white/10">
                    <div className="max-w-4xl text-center">
                        <span className="text-white/50 font-mono text-xs mb-6 block border border-white/20 inline-block px-2 py-1 rounded">SYSTEM_DEPTH: MAX</span>
                        <h2 className="text-[8rem] font-semibold tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600">Deep<br />Dive.</h2>
                        <p className="text-2xl text-gray-500 max-w-xl mx-auto">
                            Scroll right to inspect the core architecture modules.
                        </p>
                        <ArrowRight className="mx-auto mt-12 animate-bounce text-white" size={40} />
                    </div>
                </HorizontalScrollItem>

                {/* PHYSICS BLUEPRINT */}
                <HorizontalScrollItem className="w-screen h-screen p-20 flex items-center border-r border-white/10 bg-black">
                    <div className="grid grid-cols-2 gap-24 w-full max-w-7xl mx-auto items-center">
                        <div className="space-y-12">
                            <div className="w-20 h-20 border border-white/30 rounded-2xl flex items-center justify-center bg-white/5">
                                <Atom size={40} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-6xl font-medium mb-6 text-white">Physics Core</h3>
                                <p className="text-xl text-gray-400 leading-relaxed font-light">
                                    A deterministic high-precision engine grounded in PDG 2024 particle data.
                                    Simulating relativistic mass dilation and randomized decay channels.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 font-mono text-sm text-gray-400">
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">4-Vector Kinematics</div>
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">Rejection Sampling</div>
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">Mean Lifetimes</div>
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">Branching Ratios</div>
                            </div>
                        </div>
                        <div className="h-full min-h-[500px] bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                            {/* Mock Blueprint */}
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.1 }} />
                            <div className="text-center">
                                <div className="text-[120px] font-bold text-white/5">E=mc²</div>
                                <div className="font-mono text-white/30 mt-4">RELATIVISTIC_CORE_V2</div>
                            </div>
                        </div>
                    </div>
                </HorizontalScrollItem>

                {/* VIZ BLUEPRINT */}
                <HorizontalScrollItem className="w-screen h-screen p-20 flex items-center border-r border-white/10 bg-black">
                    <div className="grid grid-cols-2 gap-24 w-full max-w-7xl mx-auto items-center">
                        <div className="h-full min-h-[500px] bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.1 }} />
                            <div className="grid grid-cols-3 gap-4 rotate-12 scale-110 opacity-30">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="w-24 h-24 border border-white/40 rounded-lg animate-pulse bg-white/5" style={{ animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-12">
                            <div className="w-20 h-20 border border-white/30 rounded-2xl flex items-center justify-center bg-white/5">
                                <Layers size={40} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-6xl font-medium mb-6 text-white">WebGL Engine</h3>
                                <p className="text-xl text-gray-400 leading-relaxed font-light">
                                    Hardware-accelerated rendering capable of tracking 100k+ events at 60fps.
                                    Instanced mesh rendering for maximum performance.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 font-mono text-sm text-gray-400">
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">Three.js / React-Fiber</div>
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">Bloom Post-Process</div>
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">Instanced Mesh</div>
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">Orbit Controls</div>
                            </div>
                        </div>
                    </div>
                </HorizontalScrollItem>

                {/* DATA BLUEPRINT */}
                <HorizontalScrollItem className="w-screen h-screen p-20 flex items-center bg-black">
                    <div className="grid grid-cols-2 gap-24 w-full max-w-7xl mx-auto items-center">
                        <div className="space-y-12">
                            <div className="w-20 h-20 border border-white/30 rounded-2xl flex items-center justify-center bg-white/5">
                                <Database size={40} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-6xl font-medium mb-6 text-white">Data Analysis</h3>
                                <p className="text-xl text-gray-400 leading-relaxed font-light">
                                    Research-grade export capabilities. Generate native ROOT files or CSV datasets
                                    for processing in Excel, Python, or C++.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 font-mono text-sm text-gray-400">
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">ROOT Format</div>
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">CSV Export</div>
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">Histogramming</div>
                                <div className="border hover:bg-white/10 border-white/20 p-4 rounded-lg transition-colors">Error Props</div>
                            </div>
                        </div>
                        <div className="h-full min-h-[500px] bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                            <div className="font-mono text-xs text-gray-500 p-8">
                                {Array(15).fill("EventID, Px, Py, Pz, E, Mass, Pid").map((l, i) => (
                                    <div key={i} className="mb-2 opacity-50 hover:opacity-100 transition-opacity text-white">{l} : {Math.random().toFixed(4)}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </HorizontalScrollItem>
            </HorizontalScroll>
        </div>
    );
};

// ============================================
// HOLOGRAPHIC PRO LAB - MONOCHROME
// ============================================
const HolographicLab = () => {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const [momentum, setMomentum] = useState(7.0);
    const [particle, setParticle] = useState('Pion+');

    const mass = particle === 'Pion+' ? 0.139 : 0.493;
    const gamma = Math.sqrt(Math.pow(momentum, 2) + Math.pow(mass, 2)) / mass;
    const beta = Math.sqrt(1 - 1 / (gamma * gamma));

    const handleMouseMove = (e) => {
        if (!containerRef.current || !cardRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        gsap.to(cardRef.current, {
            rotateY: (x - 0.5) * 10,
            rotateX: (y - 0.5) * -10,
            duration: 0.5
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.5 });
    };

    return (
        <section className="py-40 px-6 bg-[#f5f5f7] perspective-1000 overflow-hidden border-b border-gray-200" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div ref={containerRef} className="max-w-7xl mx-auto relative z-10 w-full">
                <div className="text-center mb-24">
                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4 block border border-gray-200 inline-block px-3 py-1 rounded-full bg-white">Interactive Demo</span>
                    <h2 className="text-5xl font-semibold text-[#1d1d1f]">Pro Control Panel</h2>
                </div>

                {/* 3D CARD */}
                <div ref={cardRef} className="bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl shadow-black/10 border border-gray-200" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16" style={{ transform: 'translateZ(20px)' }}>
                        <div className="lg:col-span-1 space-y-10">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block">Beam Configuration</label>
                                <div className="flex bg-[#f5f5f7] p-1.5 rounded-xl">
                                    {['Pion+', 'Kaon+'].map(p => (
                                        <button
                                            key={p} onClick={() => setParticle(p)}
                                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${particle === p ? 'bg-black shadow-md text-white' : 'text-gray-400 hover:text-black'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block">Momentum (p)</label>
                                <div className="bg-[#f5f5f7] p-8 rounded-3xl">
                                    <div className="flex justify-between mb-6">
                                        <span className="text-3xl font-bold">{momentum.toFixed(1)}</span>
                                        <span className="text-gray-400 font-medium">GeV/c</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="10" step="0.1"
                                        value={momentum} onChange={(e) => setMomentum(parseFloat(e.target.value))}
                                        className="w-full h-3 bg-gray-300 rounded-full appearance-none cursor-pointer accent-black"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#1d1d1f] text-white p-10 rounded-3xl flex flex-col justify-between shadow-lg transform transition-transform hover:scale-105">
                                <div className="flex items-center gap-3 text-white/50 mb-4">
                                    <Activity size={20} />
                                    <span className="text-xs font-mono uppercase tracking-widest">Lorentz Factor</span>
                                </div>
                                <div className="text-7xl font-mono font-medium tracking-tighter">{gamma.toFixed(3)}</div>
                            </div>

                            <div className="bg-white border-2 border-[#f5f5f7] p-10 rounded-3xl flex flex-col justify-between transform transition-transform hover:scale-105">
                                <div className="flex items-center gap-3 text-gray-400 mb-4">
                                    <Zap size={20} />
                                    <span className="text-xs font-mono uppercase tracking-widest">Velocity (β)</span>
                                </div>
                                <div className="text-7xl font-mono font-medium text-[#1d1d1f] tracking-tighter">{beta.toFixed(4)}</div>
                            </div>

                            <div className="md:col-span-2 bg-black rounded-2xl p-6 font-mono text-xs text-gray-300 shadow-inner overflow-hidden relative min-h-[120px]">
                                <div className="opacity-70 space-y-2">
                                    <div className="text-gray-500">// LIVE KERNEL LOG</div>
                                    <div>{`> UPDATE: Particle=${particle} P=${momentum}GeV`}</div>
                                    <div>{`> GAMMA_CALC: ${gamma.toFixed(5)}`}</div>
                                    <div className="text-white/80 animate-pulse">{`> SYSTEM READY`}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ============================================
// RICH CURRICULUM MODULES
// ============================================
const RichCurriculum = () => {
    return (
        <section className="py-40 bg-white px-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-24 text-center">
                    <span className="text-black font-bold text-xs uppercase tracking-widest mb-4 block border border-black/10 inline-block px-3 py-1 rounded-full">Syllabus</span>
                    <h2 className="text-5xl font-semibold text-[#1d1d1f]">Physics Curriculum</h2>
                </div>

                <div className="space-y-6">
                    {[
                        { title: "Special Relativity", desc: "Lorentz Transformations, Time Dilation", tags: ["Physics", "Math"], duration: "2h 30m" },
                        { title: "Particle Physics", desc: "Standard Model, Leptons & Hadrons", tags: ["Theory", "Standard Model"], duration: "3h 00m" },
                        { title: "Detector Technology", desc: "Scintillators, Cherenkov, Calorimetry", tags: ["Hardware", "Engineering"], duration: "1h 45m" },
                        { title: "Statistical Analysis", desc: "Poisson Distribution, Error Propagation", tags: ["Data", "Analysis"], duration: "4h 00m" },
                        { title: "Computational Physics", desc: "Monte Carlo Rejection Sampling", tags: ["Code", "Simulation"], duration: "2h 15m" }
                    ].map((mod, i) => (
                        <div key={i} className="sticky top-20 bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-center group gap-6">
                            <div className="flex items-center gap-6 w-full">
                                <div className="w-16 h-16 bg-[#f5f5f7] rounded-xl flex items-center justify-center text-gray-500 font-bold text-lg group-hover:bg-black group-hover:text-white transition-colors flex-shrink-0">
                                    0{i + 1}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h3 className="text-2xl font-bold text-[#1d1d1f]">{mod.title}</h3>
                                        {mod.tags.map(tag => (
                                            <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-500">{mod.desc}</p>

                                    {/* Progress Bar Mockup */}
                                    <div className="w-full h-1 bg-gray-100 mt-4 rounded-full overflow-hidden">
                                        <div className="h-full bg-black w-0 group-hover:w-[30%] transition-all duration-1000" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 flex-shrink-0 w-full md:w-auto justify-between md:justify-end">
                                <div className="flex flex-col items-end text-xs text-gray-400 font-mono">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {mod.duration}</span>
                                    <span className="flex items-center gap-1"><GraduationCap size={12} /> Beginner</span>
                                </div>
                                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-colors">
                                    <ArrowRight className="text-gray-300 group-hover:text-white scale-75" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================
// MEGA FOOTER
// ============================================
const MegaFooter = () => (
    <footer className="bg-[#111111] text-white py-24 border-t border-[#333]">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                {/* Brand Column */}
                <div className="col-span-1 md:col-span-1 space-y-8">
                    <h5 className="font-bold text-2xl tracking-tighter">TimeDilation.org</h5>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        A CERN Beamline for Schools project dedicated to visualizing relativistic particle physics through high-fidelity Monte Carlo simulations.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono text-green-400 border border-green-900/30 bg-green-900/10 px-3 py-1.5 rounded-full w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        ALL SYSTEMS OPERATIONAL
                    </div>
                </div>

                {/* Platform Column */}
                <div>
                    <h6 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-6">Platform</h6>
                    <ul className="space-y-4 text-sm text-gray-300">
                        <li><Link to="/simulator" className="hover:text-white transition-colors">Launch Simulator</Link></li>
                        <li><Link to="/learn" className="hover:text-white transition-colors">Documentation</Link></li>
                        <li><a href="#" className="hover:text-white transition-colors">Physics Engine Specs</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Source Code</a></li>
                        <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Changelog <span className="text-[10px] bg-[#333] px-1.5 py-0.5 rounded text-white">v2.4</span></a></li>
                    </ul>
                </div>

                {/* Resources Column */}
                <div>
                    <h6 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-6">Resources</h6>
                    <ul className="space-y-4 text-sm text-gray-300">
                        <li><a href="#" className="hover:text-white transition-colors">CERN Data Exports</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">PDG Particle Data</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Educational Guides</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Research Papers</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">FAQ & Support</a></li>
                    </ul>
                </div>

                {/* Connect Column */}
                <div>
                    <h6 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-6">Stay Updated</h6>
                    <div className="flex gap-2 mb-6">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-[#222] border border-[#333] rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-white transition-colors"
                        />
                        <button className="bg-white text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                            <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>

            <div className="border-t border-[#333] pt-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                <p>&copy; 2024 Time Dilation Project. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Cookies</a>
                </div>
            </div>
        </div>
    </footer>
);

// ============================================
// MAIN HOME
// ============================================
const Home = () => {
    return (
        <div className="bg-[#f5f5f7] min-h-screen font-sans selection:bg-black selection:text-white overflow-x-hidden">
            <NoiseOverlay />
            <ZoomHero />
            <PinnedPipeline />
            <HorizontalBlueprints />
            <HolographicLab />
            <RichCurriculum />
            <MegaFooter />
        </div>
    );
};

export default Home;
