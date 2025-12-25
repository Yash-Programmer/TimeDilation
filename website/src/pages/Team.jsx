import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Mail, Linkedin, Globe, Instagram, ArrowUpRight, Sparkles } from 'lucide-react';
import teamData from '../data/teamMembers.json';

// --- ANIMATIONS ---
const containerVar = {
   hidden: { opacity: 0 },
   visible: {
      opacity: 1,
      transition: {
         staggerChildren: 0.1,
         delayChildren: 0.2
      }
   }
};

const cardVar = {
   hidden: { opacity: 0, y: 40, scale: 0.98 },
   visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
   }
};

const MemberCard = ({ member }) => {
   return (
      <motion.div
         variants={cardVar}
         className="group relative h-[480px] bg-white rounded-[40px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/5"
      >
         {/* Hover Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

         {/* Top Content */}
         <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
               {/* Avatar / Initial */}
               <div className="w-20 h-20 rounded-3xl bg-[#f5f5f7] flex items-center justify-center text-3xl font-semibold text-black/80 group-hover:scale-105 transition-transform duration-500">
                  {member.name.charAt(0)}
               </div>

               {/* Location Badge */}
               <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f5f5f7] text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  <MapPin size={10} />
                  {member.country || "Global"}
               </div>
            </div>

            <h3 className="text-4xl md:text-5xl font-semibold tracking-tighter text-[#1d1d1f] mb-4 leading-[0.95] group-hover:translate-x-1 transition-transform duration-500">
               {member.name}
            </h3>

            <div className="flex flex-wrap gap-2 mb-6">
               {member.threeWords?.map((word, i) => (
                  <span key={i} className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                     {word} {i < member.threeWords.length - 1 && "•"}
                  </span>
               ))}
            </div>

            <p className="text-lg text-neutral-500 leading-relaxed max-w-sm">
               {member.description}
            </p>
         </div>

         {/* Bottom / Socials */}
         <div className="relative z-10 pt-8 border-t border-neutral-100 mt-auto flex items-center justify-between">
            <div className="flex gap-1">
               {member.social?.linkedin && (
                  <a href={`https://linkedin.com/in/${member.social.linkedin}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-[#0077b5] hover:text-white flex items-center justify-center text-neutral-500 transition-all duration-300">
                     <Linkedin size={18} />
                  </a>
               )}
               {member.social?.instagram && (
                  <a href={`https://instagram.com/${member.social.instagram}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-[#E1306C] hover:text-white flex items-center justify-center text-neutral-500 transition-all duration-300">
                     <Instagram size={18} />
                  </a>
               )}
               {member.social?.email && (
                  <a href={`mailto:${member.social.email}`} className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-black hover:text-white flex items-center justify-center text-neutral-500 transition-all duration-300">
                     <Mail size={18} />
                  </a>
               )}
            </div>
            <ArrowUpRight size={24} className="text-neutral-300 group-hover:text-black group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500" />
         </div>
      </motion.div>
   );
};

// --- SCROLL ANIMATION WRAPPER FOR GRID ---
const ParallaxTeamGrid = () => {
   const containerRef = useRef(null);
   const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start end", "end start"]
   });

   const leftCol = teamData.team.filter((_, i) => i % 2 === 0);
   const rightCol = teamData.team.filter((_, i) => i % 2 !== 0);

   // Subtle parallax - gentle asymmetric drift
   const yRight = useTransform(scrollYProgress, [0, 1], [0, -60]);

   return (
      <section ref={containerRef} className="container mx-auto px-6 mb-32">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">

            {/* Left Column - Standard Flow, just stagger fade in */}
            <div className="space-y-8">
               {leftCol.map((member, i) => (
                  <MemberCard key={i * 2} member={member} />
               ))}
            </div>

            {/* Right Column - Parallaxed */}
            <motion.div style={{ y: yRight }} className="space-y-8 pt-0 md:pt-12">
               {rightCol.map((member, i) => (
                  <MemberCard key={i * 2 + 1} member={member} />
               ))}
            </motion.div>

         </div>
      </section>
   );
};

const Team = () => {
   return (
      <div className="min-h-screen bg-[#f5f5f7] pt-40 pb-32">

         {/* HERO SECTION - Sticky Effect */}
         <div className="container mx-auto px-6 mb-32 md:mb-48 relative h-[40vh] flex items-center">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="max-w-4xl sticky top-32 z-0"
            >
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">The Relativists</span>
               </div>
               <h1 className="text-7xl md:text-9xl font-semibold tracking-tighter text-[#1d1d1f] mb-8 leading-none">
                  The <span className="text-neutral-400">Minds.</span>
               </h1>
               <p className="text-2xl md:text-3xl text-neutral-500 font-medium max-w-2xl leading-tight">
                  A global collective of physicists, engineers, and visionaries pushing the boundaries of student research.
               </p>
            </motion.div>
         </div>

         {/* TEAM GRID - 2 BLOCKS AT A TIME */}
         <ParallaxTeamGrid />

         {/* FULL WIDTH CTA SECTION */}
         <section className="container mx-auto px-6">
            <div className="bg-black rounded-[40px] p-12 md:p-32 text-center relative overflow-hidden group">
               {/* Abstract Blue Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full group-hover:bg-blue-600/30 transition-colors duration-1000" />

               <div className="relative z-10 max-w-3xl mx-auto">
                  <h2 className="text-5xl md:text-7xl font-semibold text-white tracking-tight mb-8">
                     Join the mission.
                  </h2>
                  <p className="text-xl text-neutral-400 mb-12">
                     We're always looking for brilliant minds to contribute to our open-source tools and research.
                  </p>
                  <motion.a
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     href="mailto:contact@timedilation.org"
                     className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black text-xl font-semibold rounded-full hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all"
                  >
                     Get in Touch <ArrowUpRight size={24} />
                  </motion.a>
               </div>
            </div>
         </section>
      </div>
   );
};

export default Team;
