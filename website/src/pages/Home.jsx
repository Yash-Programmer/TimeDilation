import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Activity, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Scene3D from '../components/simulation/Scene3D';

const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
  <div className="glass p-6 rounded-2xl flex flex-col items-start gap-2 min-w-[160px] border-t border-white/40">
    <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600 mb-1`}>
      <Icon size={20} />
    </div>
    <div className="text-3xl font-bold font-display text-slate-800 tracking-tight">{value}</div>
    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
    <div className={`text-xs text-${color}-600 bg-${color}-50 px-2 py-0.5 rounded-full mt-1`}>
      {subtext}
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Animated Math Symbols */}
         <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-[20%] left-[10%] text-9xl font-serif text-cern-blue/5">γ</motion.div>
         <motion.div animate={{ y: [0, 30, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-[10%] left-[5%] text-8xl font-serif text-pion-red/5">π</motion.div>
         <motion.div animate={{ y: [0, -40, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-[15%] right-[10%] text-9xl font-serif text-kaon-blue/5">c</motion.div>
      </div>

      <section className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center pt-20">

        {/* Left: Text Content */}
        <div className="w-full lg:w-[45%] px-8 lg:pl-24 lg:pr-12 py-12 flex flex-col justify-center">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
           >
             <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-cern-blue text-sm font-bold tracking-wide mb-6 border border-blue-100">
                CERN BEAMLINE FOR SCHOOLS 2026
             </div>

             <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight text-slate-900">
               Testing <span className="text-transparent bg-clip-text bg-gradient-to-r from-cern-blue to-kaon-blue">Einstein's</span> <br/>
               Universal Clock
             </h1>

             <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-light">
               A high-fidelity simulation comparing time dilation across particle species.
               Watch Pions and Kaons race through the T9 beamline at 99.99% light speed.
             </p>

             <div className="flex flex-wrap gap-4 mb-16">
               <Link to="/simulator">
                  <Button size="lg" icon={Box} className="shadow-cern-blue/25 shadow-xl">
                    Launch Simulator
                  </Button>
               </Link>
               <Link to="/learn">
                  <Button variant="secondary" size="lg" icon={ArrowRight}>
                    Start Curriculum
                  </Button>
               </Link>
             </div>

             {/* Metrics */}
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard label="Pion Factor" value="57.3×" subtext="Slower Decay" icon={Clock} color="pion-red" />
                <StatCard label="Kaon Factor" value="16.2×" subtext="Slower Decay" icon={Activity} color="kaon-blue" />
                <StatCard label="Beam Energy" value="8.0" subtext="GeV/c" icon={Zap} color="muon-green" />
             </div>
           </motion.div>
        </div>

        {/* Right: 3D Scene */}
        <div className="w-full lg:w-[55%] h-[60vh] lg:h-screen relative">
           {/* Gradient Overlay for blending */}
           <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-transparent z-20 pointer-events-none lg:w-40" />
           <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-transparent z-20 pointer-events-none lg:hidden h-32" />

           <div className="absolute inset-0 z-10">
              <Scene3D interactive={false} />
           </div>
        </div>

      </section>
    </div>
  );
};

export default Home;
