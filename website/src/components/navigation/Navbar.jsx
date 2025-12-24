import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, HelpCircle } from 'lucide-react';
import Button from '../common/Button';
import Tooltip from '../common/Tooltip';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Build Simulator', path: '/simulator' },
    { name: 'Learn', path: '/learn' },
    { name: 'Supplementary', path: '/supplementary' },
    { name: 'Team', path: '/team' },
  ];

  // Helper to check if link is active
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
               <motion.div
                 className="absolute inset-0 border-2 border-[#0033A0] rounded-full opacity-30"
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               />
               <motion.div
                 className="absolute inset-1 border-2 border-[#E74C3C] rounded-full opacity-30"
                 animate={{ rotate: -360 }}
                 transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
               />
               <div className="w-2 h-2 bg-[#0033A0] rounded-full" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${isScrolled ? 'text-[#0033A0]' : 'text-gray-900'}`}>
              Time Dilation Explorer
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  relative font-medium text-sm tracking-wide transition-colors hover:text-[#0033A0]
                  ${isActive ? 'text-[#0033A0]' : 'text-gray-600'}
                `}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-6 left-0 right-0 h-0.5 bg-[#0033A0]"
                  />
                )}
              </NavLink>
            ))}
          </div>

          {/* Utilities */}
          <div className="hidden md:flex items-center gap-4">
             <Tooltip content="Change Language">
                <button className="p-2 text-gray-500 hover:text-[#0033A0] hover:bg-gray-100 rounded-full transition-colors">
                  <Globe size={20} />
                </button>
             </Tooltip>
             <Tooltip content="Help & Resources">
                <button className="p-2 text-gray-500 hover:text-[#0033A0] hover:bg-gray-100 rounded-full transition-colors">
                  <HelpCircle size={20} />
                </button>
             </Tooltip>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    text-2xl font-semibold ${isActive ? 'text-[#0033A0]' : 'text-gray-800'}
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
