import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Globe, HelpCircle } from 'lucide-react';
import Tooltip from '../common/Tooltip';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Build Simulator', path: '/simulator' },
    { name: 'Learn', path: '/learn' },
    { name: 'Supplementary', path: '/supplementary' },
    { name: 'Team', path: '/team' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled
            ? 'glass border-white/20 h-16'
            : 'bg-transparent border-transparent h-20'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="container h-full flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
               <div className="absolute inset-0 bg-cern-blue/10 rounded-full animate-pulse-slow" />
               <motion.div
                 className="absolute inset-0 border-2 border-cern-blue rounded-full"
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               />
               <motion.div
                 className="absolute inset-1.5 border-2 border-pion-red rounded-full"
                 animate={{ rotate: -360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               />
               <div className="w-2 h-2 bg-cern-blue rounded-full shadow-[0_0_10px_currentColor]" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-slate-900 group-hover:text-cern-blue transition-colors">
              Time Dilation Explorer
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive ? 'text-cern-blue bg-blue-50/50' : 'text-slate-600 hover:text-cern-blue hover:bg-white/50'}
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Utilities */}
          <div className="hidden md:flex items-center gap-3">
             <Tooltip content="Change Language">
                <button className="p-2.5 text-slate-500 hover:text-cern-blue hover:bg-blue-50 rounded-full transition-colors">
                  <Globe size={20} />
                </button>
             </Tooltip>
             <div className="w-px h-6 bg-slate-200" />
             <Tooltip content="Help & Resources">
                <button className="p-2.5 text-slate-500 hover:text-cern-blue hover:bg-blue-50 rounded-full transition-colors">
                  <HelpCircle size={20} />
                </button>
             </Tooltip>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    text-3xl font-display font-bold ${isActive ? 'text-cern-blue' : 'text-slate-400'}
                  `}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
