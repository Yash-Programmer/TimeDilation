import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Linkedin, Instagram } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import teamData from '../data/teamMembers.json';

const MemberCard = ({ member }) => {
  return (
    <Card className="flex flex-col items-center text-center h-full relative overflow-hidden group">
       {/* Photo Section */}
       <div className="relative mb-6 mt-4">
          <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 ring-2 ring-[#0033A0]">
             {/* Placeholder Avatar generator */}
             <div className={`w-full h-full flex items-center justify-center text-4xl font-bold text-white
                 ${member.name.length % 2 === 0 ? 'bg-[#0033A0]' : 'bg-[#E74C3C]'}
             `}>
                 {member.name.charAt(0)}
             </div>
             {/* <img src={member.photo} alt={member.name} className="w-full h-full object-cover" /> */}
          </div>
          {/* Country Flag Badge */}
          <div className="absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-lg border border-gray-100" title={member.location}>
             {member.country === 'CA' ? '🇨🇦' : member.country === 'IN' ? '🇮🇳' : '🇰🇿'}
          </div>
       </div>

       {/* Content */}
       <h3 className="text-2xl font-bold text-[#0033A0] mb-2">{member.name}</h3>

       <div className="flex items-center gap-2 justify-center text-sm text-gray-500 italic mb-1">
          {member.threeWords.join(' • ')}
       </div>

       <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <MapPin size={12} /> {member.location}
       </div>

       <p className="text-gray-700 text-sm leading-relaxed mb-6 px-4 min-h-[48px]">
          "{member.description}"
       </p>

       <div className="w-10/12 h-px bg-gray-100 mb-6" />

       {/* Socials */}
       <div className="flex gap-4 mt-auto">
          {member.social.instagram && (
             <a href={`https://instagram.com/${member.social.instagram}`} target="_blank" rel="noreferrer" className="p-2 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-lg hover:scale-110 transition-transform shadow-sm">
                <Instagram size={18} />
             </a>
          )}
          {member.social.linkedin && (
             <a href={`https://linkedin.com/in/${member.social.linkedin}`} target="_blank" rel="noreferrer" className="p-2 bg-[#0A66C2] text-white rounded-lg hover:scale-110 transition-transform shadow-sm">
                <Linkedin size={18} />
             </a>
          )}
          <a href={`mailto:${member.social.email}`} className="p-2 bg-[#0033A0] text-white rounded-lg hover:scale-110 transition-transform shadow-sm">
             <Mail size={18} />
          </a>
       </div>
    </Card>
  );
};

const Team = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
       {/* Hero */}
       <div className="bg-gradient-to-b from-white to-[#F0F8FF] py-20 px-4 text-center border-b border-gray-100">
          <h1 className="text-5xl font-bold text-[#1A1A2E] mb-4">Meet the Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
             Eight students testing Einstein's universal time dilation. United by curiosity, driven by science.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
             {['8 Team Members', '5 Countries Represented', '100+ Hours of Collaboration', '1 Shared Dream'].map((stat, i) => (
                <div key={i} className="px-6 py-2 bg-blue-50 text-[#0033A0] rounded-full font-medium text-sm border border-blue-100 shadow-sm">
                   {stat}
                </div>
             ))}
          </div>
       </div>

       {/* Team Grid */}
       <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {teamData.team.map((member, idx) => (
                <motion.div
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                >
                   <MemberCard member={member} />
                </motion.div>
             ))}
          </div>
       </div>

       {/* Story Section */}
       <div className="container pb-20">
          <div className="bg-[#F0F8FF] rounded-2xl p-12 max-w-4xl mx-auto text-center border border-blue-100">
             <h2 className="text-3xl font-bold text-[#0033A0] mb-6">Our Journey</h2>
             <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                   Our story began at the Lodha Genius Programme and the Junior Academy, where we first discovered our shared passion for fundamental physics. Despite living across different time zones and countries, we bonded over late-night Zoom calls, debugging GEANT4 simulations, and debating relativity.
                </p>
                <p>
                   What started as a competition entry became a mission: to prove that students can contribute to real scientific research. We've spent months designing detectors, writing code, and learning from mentors. Now, we are ready to bring our experiment to CERN.
                </p>
             </div>
          </div>
       </div>

       {/* CTA */}
       <div className="bg-white py-16 border-t border-gray-200">
          <div className="container text-center">
             <h2 className="text-2xl font-bold mb-2">Interested in collaborating?</h2>
             <p className="text-gray-500 mb-8">Get in touch with us to learn more about our proposal.</p>
             <Button size="lg">Join Our Next Experiment</Button>
          </div>
       </div>
    </div>
  );
};

export default Team;
