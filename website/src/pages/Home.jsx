import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ChevronRight, ArrowRight, Play, Pause, Settings,
    BarChart3, Sliders, Maximize2, MoreHorizontal,
    Cpu, ShieldCheck, Zap, Globe, Database, Scale,
    Microscope, Timer, Box, FileText, HelpCircle,
    Atom, ChevronDown, Laptop, Layers, Share2, Download
} from 'lucide-react';

// Assets
import featureBeam from '../assets/feature_beam.png';
import featureDetector from '../assets/feature_detector.png';
import featureAnalysis from '../assets/feature_analysis.png';

// --- ANIMATION VARIANTS ---
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

// --- COMPONENTS ---

// 1. HERO with Parallax
const Hero = () => {
    const { scrollY } = useScroll();
    // Subtle parallax - gentle movement
    const yText = useTransform(scrollY, [0, 800], [0, 60]);
    const yBg = useTransform(scrollY, [0, 800], [0, 30]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

    return (
        <section className="pt-48 pb-20 px-6 flex flex-col items-center text-center relative overflow-hidden min-h-[90vh]">
            {/* Parallax Background Blur */}
            <motion.div
                style={{ y: yBg }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10"
            />

            <motion.div
                style={{ y: yText, opacity }}
                className="max-w-5xl relative z-10"
            >
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">v2.1 Kernel Live</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 shadow-sm">
                        <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 uppercase tracking-wide">The Relativists</span>
                    </div>
                </div>

                <h1 className="font-display text-7xl md:text-9xl font-semibold tracking-tighter text-[#1d1d1f] mb-8 leading-[0.9]">
                    Physics.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Reimagined.</span>
                </h1>

                <p className="text-2xl md:text-3xl text-[#86868b] max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                    The world's first professional-grade particle physics playground on the web.
                    Built for the CERN BL4S competition.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/simulator" className="btn-primary rounded-full px-10 py-5 text-xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow">
                        Launch Simulator
                    </Link>
                    <Link to="/learn" className="flex items-center justify-center gap-2 text-[#1d1d1f] font-semibold bg-gray-100 hover:bg-gray-200 rounded-full px-10 py-5 text-xl transition-colors">
                        View Documentation
                    </Link>
                </div>
            </motion.div>
        </section>
    );
};

// 2. MVP SHOWCASE with Scroll Reveal
const MvpShowcase = () => {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Subtle reveal - gentle scale and minimal tilt
    const scale = useTransform(scrollYProgress, [0, 0.4], [0.96, 1]);
    const rotateX = useTransform(scrollYProgress, [0, 0.4], [3, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.25], [0.5, 1]);

    return (
        <section ref={ref} className="relative z-10 pb-32 px-6 perspective-1000 bg-white overflow-hidden">
            <div className="container-pro">
                <motion.div
                    style={{ scale, rotateX, opacity }}
                    className="relative rounded-[40px] overflow-hidden shadow-2xl bg-[#000000] border-4 border-[#1d1d1f] transform-gpu"
                >
                    {/* ... (Content Remains Same) ... */}
                    {/* Fake Browser Toolbar */}
                    <div className="h-14 bg-[#111111] border-b border-white/5 flex items-center px-6 gap-4">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="h-8 max-w-[400px] flex-1 bg-[#1d1d1f] rounded-lg mx-auto flex items-center justify-center text-xs text-neutral-500 font-mono">
                            timedilation.org/simulator
                        </div>
                    </div>

                    {/* The Interface Representation */}
                    <div className="aspect-[16/9] relative bg-neutral-900 overflow-hidden">
                        {/* 3D Viewport Placeholder (Abstract) */}
                        <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 to-neutral-900">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[1px] bg-blue-500 blur-[1px]" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
                        </div>

                        {/* Floating Panels */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 20, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="absolute top-8 left-0 w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm font-bold text-neutral-400">BEAM SETTINGS</div>
                                <Sliders size={14} className="text-neutral-500" />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-neutral-500 mb-1">Momentum</div>
                                    <div className="h-1.5 w-full bg-neutral-700 rounded-full overflow-hidden">
                                        <div className="h-full w-[70%] bg-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-neutral-500 mb-1">Spread</div>
                                    <div className="h-1.5 w-full bg-neutral-700 rounded-full overflow-hidden">
                                        <div className="h-full w-[30%] bg-purple-500" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: -20, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute bottom-8 right-0 w-80 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm font-bold text-neutral-400">REAL-TIME DATA</div>
                                <BarChart3 size={14} className="text-neutral-500" />
                            </div>
                            <div className="flex gap-4 items-end h-24">
                                <div className="w-1/4 h-[40%] bg-neutral-800 rounded-t" />
                                <div className="w-1/4 h-[70%] bg-neutral-800 rounded-t" />
                                <div className="w-1/4 h-[100%] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                                <div className="w-1/4 h-[60%] bg-neutral-800 rounded-t" />
                            </div>
                        </motion.div>

                        {/* Center CTA within the MPV */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full flex items-center gap-3 pointer-events-auto cursor-pointer hover:bg-white/20 transition-colors"
                            >
                                <Play size={24} className="text-white fill-white" />
                                <span className="text-white font-semibold tracking-wide">RUN SIMULATION</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                <div className="text-center mt-12">
                    <p className="text-lg text-neutral-400 font-medium">Running CERN Geant4-validated simulation kernel v2.1</p>
                </div>
            </div>
        </section>
    );
};

// Helper Component for Internal Parallax
const ParallaxImage = ({ src, alt, className }) => {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <div ref={ref} className="w-full h-full overflow-hidden">
            <motion.img
                style={{ y, scale: 1.1 }} // Scale up slightly to prevent edges showing during movement
                src={src}
                alt={alt}
                className={className}
            />
        </div>
    );
};

// 3. BENTO GRID FEATURES - Strict Layering
const BentoMethodology = () => {
    return (
        <section className="relative z-20 py-32 bg-[#f5f5f7] overflow-hidden">
            <div className="container-pro px-6">
                <div className="mb-20 max-w-3xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-display text-5xl md:text-6xl font-semibold mb-6 text-[#1d1d1f]"
                    >
                        Power, packed.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-neutral-500 leading-relaxed"
                    >
                        We didn't just build a toy. We built a research-grade environment that runs directly in your browser. No downloads, no installation, just physics.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Physics Engine (Large) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-2 h-[400px] bg-white rounded-[40px] p-10 flex flex-col justify-between overflow-hidden relative group shadow-sm hover:shadow-xl transition-shadow duration-500"
                    >
                        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[80px]" />
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-6">
                                <Atom size={28} />
                            </div>
                            <h3 className="text-3xl font-semibold mb-2">Real-Time Engine</h3>
                            <p className="text-neutral-500 max-w-sm">Simulate relativistic kinematics and particle decays (π+, K+) at 100,000+ events per second.</p>
                        </div>
                        <div className="mt-8 bg-[#f5f5f7] rounded-3xl h-full w-full border border-gray-100 flex items-center justify-center overflow-hidden">
                            <ParallaxImage src={featureBeam} alt="Beam" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </motion.div>

                    {/* Card 2: 3D Visualization */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="h-[400px] bg-black text-white rounded-[40px] p-10 flex flex-col justify-between relative overflow-hidden group shadow-lg"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-neutral-800 text-white flex items-center justify-center mb-6 border border-white/20">
                                <Box size={24} />
                            </div>
                            <h3 className="text-3xl font-semibold mb-2">WebGL 3D</h3>
                            <p className="text-neutral-400">Immersive, hardware-accelerated visualization.</p>
                        </div>
                        <div className="relative z-10 mt-4 flex justify-end">
                            <div className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-xs font-mono border border-white/10">60 FPS</div>
                        </div>
                    </motion.div>

                    {/* Card 3: Data Export */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-[400px] bg-white rounded-[40px] p-10 flex flex-col relative overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-500"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[#ff9500] text-white flex items-center justify-center mb-6">
                            <Database size={24} />
                        </div>
                        <h3 className="text-3xl font-semibold mb-2">Research Data</h3>
                        <p className="text-neutral-500 mb-8">Export generic CSV or ROOT-compatible formats.</p>
                        <div className="mt-auto flex gap-3">
                            <div className="px-4 py-3 bg-[#f5f5f7] rounded-xl text-sm font-semibold text-neutral-600 flex items-center gap-2">
                                <Download size={14} /> Export
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 4: Hardware (Large) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="md:col-span-2 h-[400px] bg-[#1d1d1f] text-white rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative shadow-lg"
                    >
                        <div className="flex-1 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center mb-6">
                                <Cpu size={28} />
                            </div>
                            <h3 className="text-3xl font-semibold mb-4">WebAssembly Core</h3>
                            <p className="text-neutral-300 text-lg leading-relaxed">
                                We ported the core physics logic to WASM, enabling near-native performance.
                            </p>
                        </div>
                        <div className="flex-1 w-full h-full bg-neutral-800 rounded-3xl border border-white/10 p-6 font-mono text-xs text-green-400 overflow-hidden">
                            <div className="opacity-70">
                                {`> Initializing Kernel... OK`} <br />
                                {`> Event 001: π+ -> μ+ + νμ`} <br />
                                <span className="animate-pulse">_</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};


// 5. INTERACTIVE LAB SECTION (Strict Layering)
const InteractiveLab = () => {
    const [momentum, setMomentum] = useState(7.0);
    const gamma = (Math.sqrt(Math.pow(momentum, 2) + Math.pow(0.139, 2)) / 0.139);

    return (
        <section id="lab" className="relative z-30 section-padding bg-black text-white overflow-hidden">
            <div className="container-pro">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="md:w-2/3 mx-auto text-center mb-16"
                >
                    <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-white">Interactive Physics.</h2>
                    <p className="text-xl text-neutral-400">Experience relativistic effects first-hand.</p>
                </motion.div>

                <div className="bg-neutral-900 rounded-3xl p-8 md:p-12 border border-white/10">
                    {/* Content Preserved */}
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 block">Beam Momentum (GeV/c)</label>
                            <div className="flex items-center gap-4 mb-2">
                                <span className="font-mono text-sm text-gray-500">1</span>
                                <input
                                    type="range"
                                    min="1" max="10" step="0.1"
                                    value={momentum}
                                    onChange={(e) => setMomentum(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
                                />
                                <span className="font-mono text-sm text-gray-500">10</span>
                            </div>
                            <div className="text-5xl font-display font-bold mt-4">{momentum.toFixed(1)} <span className="text-lg text-gray-500">GeV/c</span></div>
                        </div>
                        <div className="flex-1 border-l border-white/10 pl-0 md:pl-12">
                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Lorentz Factor (γ)</div>
                                    <div className="text-3xl font-mono text-[#0071e3]">{gamma.toFixed(2)}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Time Dilation</div>
                                    <div className="text-3xl font-mono text-purple-400">{(gamma * 26).toFixed(1)} <span className="text-sm text-gray-500">ns</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// 7. FAQ (Strict Layering)
const FAQ = () => (
    <section className="relative z-40 py-24 border-t border-gray-100 bg-white">
        <div className="container-pro">
            <h2 className="font-display text-4xl font-semibold mb-16">Common Questions</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                {[
                    { q: "Is this tool free?", a: "Yes. TimeDilation.org is completely open-source and free for students, educators, and researchers." },
                    { q: "Do I need to install software?", a: "No. The entire simulation runs in your browser using standard web technologies (WebAssembly & WebGL)." },
                    { q: "Can I use this for my own proposal?", a: "Absolutely. The data generated is scientifically valid for preliminary BL4S proposals." },
                    { q: "How accurate is the physics?", a: "We strictly adhere to Particle Data Group (PDG) values for masses and lifetimes." }
                ].map((item, i) => (
                    <div key={i}>
                        <h4 className="font-semibold text-xl mb-3 text-[#1d1d1f]">{item.q}</h4>
                        <p className="text-gray-500 leading-relaxed text-lg">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// 8. FOOTER
const Footer = () => (
    <footer className="relative z-50 bg-[#f5f5f7] py-20 text-xs text-gray-500">
        <div className="container-pro">
            {/* Content Preserved */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                <div>
                    <h5 className="font-semibold text-gray-900 mb-6 text-sm">Simulator</h5>
                    <ul className="space-y-3">
                        <li><Link to="/simulator" className="hover:text-black transition-colors">Launch App</Link></li>
                        <li><a href="#" className="hover:text-black transition-colors">Release Notes</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">Validation Data</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-900 mb-6 text-sm">Resources</h5>
                    <ul className="space-y-3">
                        <li><Link to="/learn" className="hover:text-black transition-colors">Documentation</Link></li>
                        <li><Link to="/learn/tutorial" className="hover:text-black transition-colors">Step-by-Step Guide</Link></li>
                        <li><Link to="/proposal" className="hover:text-black transition-colors">Reference Proposal</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-900 mb-6 text-sm">Project</h5>
                    <ul className="space-y-3">
                        <li><Link to="/team" className="hover:text-black transition-colors">About Us</Link></li>
                        <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">Press Kit</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-gray-900 mb-6 text-sm">Legal</h5>
                    <ul className="space-y-3">
                        <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">Terms of Use</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">Open Source License</a></li>
                    </ul>
                </div>
            </div>
            <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>Copyright © 2024 TimeDilation.org. All rights reserved.</p>
                <p>Designed with <span className="text-red-500">♥</span> for CERN BL4S.</p>
            </div>
        </div>
    </footer>
);

// MAIN COMPONENT
const Home = () => {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-noise fixed inset-0 pointer-events-none z-0" />
            <div className="relative">
                <Hero />
                <MvpShowcase />
                <BentoMethodology />
                <InteractiveLab />
                <FAQ />
                <Footer />
            </div>
        </div>
    );
};

export default Home;
