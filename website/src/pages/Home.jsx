import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Scene3D from '../components/simulation/Scene3D';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden">

        {/* Left Side: Content */}
        <div className="w-full lg:w-[40%] bg-white flex flex-col justify-center px-8 lg:px-16 z-10 shadow-xl">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
           >
             <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-4">
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0033A0] to-[#3498DB]">
                 Testing Einstein's
               </span><br />
               Universal Time Dilation
             </h1>

             <motion.h2
               className="text-2xl text-[#555577] font-normal mb-8"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3, duration: 0.8 }}
             >
               A Pion-Kaon Comparative Study
             </motion.h2>

             <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
               The first systematic experiment comparing time dilation across particle species at CERN.
               Watch particles race through space at 99.99% light speed.
             </p>

             <div className="flex flex-wrap gap-4 mb-12">
               <Link to="/simulator">
                  <Button size="lg" icon={Box}>Explore 3D Model</Button>
               </Link>
               <Link to="/learn">
                  <Button variant="secondary" size="lg" icon={ArrowRight}>Start Learning</Button>
               </Link>
             </div>

             {/* Metrics Bar */}
             <div className="flex gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-100">
                  <div className="w-2 h-2 rounded-full bg-[#E74C3C]" />
                  <span className="font-bold text-[#E74C3C]">57.3× Slower</span>
                  <span className="text-xs text-red-400 uppercase tracking-wider">Pion</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                  <div className="w-2 h-2 rounded-full bg-[#3498DB]" />
                  <span className="font-bold text-[#3498DB]">16.2× Slower</span>
                  <span className="text-xs text-blue-400 uppercase tracking-wider">Kaon</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                  <div className="w-2 h-2 rounded-full bg-[#2ECC71]" />
                  <span className="font-bold text-[#2ECC71]">8 GeV/c</span>
                  <span className="text-xs text-green-400 uppercase tracking-wider">Energy</span>
               </div>
             </div>
           </motion.div>
        </div>

        {/* Right Side: 3D Visualization */}
        <div className="w-full lg:w-[60%] h-[50vh] lg:h-full relative bg-[#FAFBFC]">
           <div className="absolute inset-0 pointer-events-none lg:pointer-events-auto">
              <Scene3D interactive={false} />
           </div>

           {/* Overlay Gradient for smooth blend */}
           <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none hidden lg:block" />
           <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none lg:hidden" />
        </div>

      </section>
    </div>
  );
};

export default Home;
