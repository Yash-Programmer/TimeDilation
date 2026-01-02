import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap, ScrollTrigger } from '../hooks/useGSAP';
import Footer from '../components/common/Footer';
import { ArrowRight, Github, Linkedin, Mail, Twitter, ChevronRight, Globe, MapPin, Database, Award, GitCommit } from 'lucide-react';
import teamData from '../data/teamMembers.json';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// ============================================
// MANIFESTO HERO
// ============================================
const TeamHero = () => {
   const containerRef = useRef(null);
   const line1Ref = useRef(null);
   const line2Ref = useRef(null);

   useIsomorphicLayoutEffect(() => {
      const ctx = gsap.context(() => {
         const tl = gsap.timeline({ delay: 0.2 });

         // Split text reveal
         const chars1 = line1Ref.current?.querySelectorAll('.char');
         const chars2 = line2Ref.current?.querySelectorAll('.char');

         if (chars1) tl.fromTo(chars1, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: 'power3.out' });
         if (chars2) tl.fromTo(chars2, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: 'power3.out' }, "-=0.8");

      }, containerRef);
      return () => ctx.revert();
   }, []);

   const split = (text) => text.split('').map((c, i) => <span key={i} className="char inline-block">{c === ' ' ? '\u00A0' : c}</span>);

   return (
      <section ref={containerRef} className="min-h-[80vh] flex flex-col justify-center px-6 bg-[#f5f5f7] border-b border-gray-200">
         <div className="max-w-[90rem] mx-auto w-full">
            <div className="mb-12">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 text-xs font-mono uppercase tracking-widest text-[#86868b]">
                  <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                  Global Collective
               </div>
            </div>

            <h1 ref={line1Ref} className="text-[12vw] leading-[0.8] font-bold tracking-tighter text-[#1d1d1f] overflow-hidden">
               {split("SCIENTIFIC")}
            </h1>
            <h1 ref={line2Ref} className="text-[12vw] leading-[0.8] font-bold tracking-tighter text-[#86868b] overflow-hidden">
               {split("PERSONNEL")}
            </h1>
         </div>
      </section>
   );
};

// ============================================
// INTERACTIVE DIRECTORY (ROSTER)
// ============================================
const Roster = () => {
   const [activeId, setActiveId] = useState(null);
   const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
   const listRef = useRef(null);

   // Mock "Scientific Data" augmentation
   const members = (teamData.team || []).map((m, i) => ({
      ...m,
      id: `OP-${100 + i}`,
      role: m.role || "Research Fellow",
      commits: Math.floor(Math.random() * 500) + 50,
      papers: Math.floor(Math.random() * 10),
      focus: ["Neutrinos", "Dark Matter", "Grid Computing"][i % 3]
   }));

   const handleMouseMove = (e) => {
      // Update cursor tracker for minimal effect if needed
   };

   return (
      <section className="bg-white min-h-screen py-32 px-6" onMouseMove={handleMouseMove}>
         <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* LEFT: LIST */}
            <div className="lg:col-span-7 space-y-0" ref={listRef} onMouseLeave={() => setActiveId(null)}>
               <div className="flex border-b border-black text-xs font-mono uppercase tracking-widest text-gray-400 pb-4 mb-4">
                  <span className="w-24">ID_REF</span>
                  <span className="flex-1">Researchers</span>
                  <span className="w-32 text-right hidden md:block">Location</span>
               </div>

               {members.map((member) => (
                  <div
                     key={member.id}
                     className={`group relative flex items-center py-8 border-b border-gray-100 cursor-pointer transition-all duration-300 ${activeId === member.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                     onMouseEnter={() => setActiveId(member.id)}
                  >
                     <span className="w-24 font-mono text-xs text-gray-400 group-hover:text-black transition-colors">
                        {member.id}
                     </span>
                     <div className="flex-1">
                        <h3 className="text-4xl md:text-5xl font-medium tracking-tight text-[#1d1d1f] mb-1">
                           {member.name}
                        </h3>
                        <p className="text-sm text-gray-400 font-mono group-hover:text-gray-600 transition-colors">
                           {member.role} • {member.focus}
                        </p>
                     </div>
                     <div className="w-32 text-right hidden md:block">
                        <span className="text-xs font-bold uppercase border border-gray-200 px-2 py-1 rounded">
                           {member.country || "Global"}
                        </span>
                     </div>

                     {/* Chevron reveal */}
                     <ChevronRight className={`absolute right-0 text-black opacity-0 -translate-x-4 transition-all duration-300 ${activeId === member.id ? 'opacity-100 translate-x-0' : ''}`} />
                  </div>
               ))}
            </div>

            {/* RIGHT: PREVIEW PANEL (STICKY) */}
            <div className="hidden lg:block lg:col-span-5 relative">
               <div className="sticky top-32 w-full aspect-[3/4] bg-[#f5f5f7] rounded-lg overflow-hidden border border-gray-200">
                  <AnimatePresence mode="wait">
                     {activeId ? (
                        (() => {
                           const activeMember = members.find(m => m.id === activeId);
                           return (
                              <motion.div
                                 key={activeId}
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 exit={{ opacity: 0 }}
                                 transition={{ duration: 0.3 }}
                                 className="absolute inset-0 p-8 flex flex-col justify-end"
                              >
                                 {/* Grayscale Portrait Mockup */}
                                 <div className="absolute inset-0 bg-gray-200">
                                    <div className="w-full h-full flex items-center justify-center text-9xl font-bold text-gray-300 select-none grayscale opacity-30">
                                       {activeMember.name.charAt(0)}
                                    </div>
                                    {/* Noise overlay */}
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,...")' }} />
                                 </div>

                                 {/* Data Card */}
                                 <div className="relative z-10 bg-white/90 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                       <div>
                                          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Commits</div>
                                          <div className="text-2xl font-mono">{activeMember.commits}</div>
                                       </div>
                                       <div>
                                          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Papers</div>
                                          <div className="text-2xl font-mono">{activeMember.papers}</div>
                                       </div>
                                    </div>

                                    <div className="space-y-3 border-t border-gray-200 pt-4">
                                       {activeMember.social?.linkedin && (
                                          <a href={`https://linkedin.com/in/${activeMember.social.linkedin}`} className="flex items-center gap-3 text-sm hover:underline">
                                             <Linkedin size={16} /> linkedin.com/{activeMember.social.linkedin}
                                          </a>
                                       )}
                                       {activeMember.social?.email && (
                                          <a href={`mailto:${activeMember.social.email}`} className="flex items-center gap-3 text-sm hover:underline">
                                             <Mail size={16} /> {activeMember.social.email}
                                          </a>
                                       )}
                                    </div>
                                 </div>
                              </motion.div>
                           );
                        })()
                     ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-center p-12">
                           <div>
                              <Database size={48} className="mx-auto mb-4 text-gray-300" />
                              <p className="text-gray-400 font-mono text-sm">Select a researcher to view dossier.</p>
                           </div>
                        </div>
                     )}
                  </AnimatePresence>
               </div>
            </div>

         </div>
      </section>
   );
};

// ============================================
// MAIN PAGE
// ============================================
const Team = () => {
   return (
      <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white overflow-x-hidden">
         <TeamHero />
         <Roster />
         <Footer />
      </div>
   );
};

export default Team;
