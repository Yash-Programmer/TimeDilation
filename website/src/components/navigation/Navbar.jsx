import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const NavItem = ({ to, children, hoveredItem, setHoveredItem, layoutId }) => {
  const isHovered = hoveredItem === layoutId;

  return (
    <div
      className="relative px-5 py-2.5"
      onMouseEnter={() => setHoveredItem(layoutId)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {isHovered && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-black/5 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <NavLink
        to={to}
        className={({ isActive }) =>
          `relative z-10 text-sm font-medium transition-colors ${isActive ? 'text-black font-semibold' : 'text-neutral-600 hover:text-black'}`
        }
      >
        {children}
      </NavLink>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <>
      <motion.nav
        className="fixed z-50 transition-all duration-500
            
            /* Mobile: Full Width Top Bar */
            top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-white/20
            
            /* Desktop: Floating Island (Grid Based for Perfect Center) */
            md:top-6 md:left-0 md:right-0 md:mx-auto md:h-auto 
            md:w-[95vw] md:max-w-5xl md:rounded-full 
            md:border md:border-white/40 md:shadow-2xl md:shadow-black/10 
            md:bg-white/90 md:backdrop-blur-2xl md:saturate-150"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
      >
        <div className="h-full md:py-3 px-6 md:px-8 grid md:grid-cols-[1fr_auto_1fr] grid-cols-[auto_1fr] items-center">

          {/* Logo Section (Left) */}
          <NavLink to="/" className="flex items-center gap-3 group relative z-50 shrink-0 justify-self-start">
            <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-black/5">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse-slow" />
              <div className="w-3 h-3 bg-[#1d1d1f] rounded-full group-hover:scale-125 transition-transform duration-500" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#1d1d1f] hidden lg:block">
              Particle Simulator
            </span>
            <span className="text-lg font-bold tracking-tight text-[#1d1d1f] lg:hidden">
              PS
            </span>
          </NavLink>

          {/* Desktop Nav - Perfectly Centered in Grid (Center) */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-1 bg-neutral-100/50 rounded-full p-1.5 border border-black/5" onMouseLeave={() => setHoveredItem(null)}>
              <NavItem to="/" hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} layoutId="home">Home</NavItem>
              <NavItem to="/simulator" hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} layoutId="simulator">Simulator</NavItem>
              <NavItem to="/learn" hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} layoutId="learn">Learn</NavItem>
              <NavItem to="/team" hoveredItem={hoveredItem} setHoveredItem={setHoveredItem} layoutId="team">Team</NavItem>

              {/* Dropdown */}
              <div
                className="relative group px-1"
                onMouseEnter={() => {
                  setHoveredItem('proposal');
                  setActiveDropdown('proposal');
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setActiveDropdown(null);
                }}
              >
                <div className="relative z-10 py-2.5 px-4 cursor-pointer flex items-center gap-2 rounded-full hover:bg-black/5 transition-colors">
                  <span className={`relative z-10 text-base font-medium transition-colors ${location.pathname.includes('proposal') ? 'text-black' : 'text-neutral-600 group-hover:text-black'}`}>
                    Proposal
                  </span>
                  <ChevronDown size={14} className={`relative z-10 transition-transform duration-300 ${activeDropdown ? 'rotate-180' : ''} text-neutral-400 group-hover:text-black`} />
                </div>

                {/* Morphing Dropdown */}
                <AnimatePresence>
                  {activeDropdown === 'proposal' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, scale: 1, y: 20, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.95, y: 15, filter: 'blur(8px)' }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-white/90 backdrop-blur-3xl rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/20 ring-1 ring-black/5 overflow-hidden p-2"
                    >
                      <NavLink to="/proposal" className="block px-4 py-4 rounded-2xl hover:bg-black/5 transition-all group/item">
                        <div className="text-base font-semibold text-gray-900 group-hover/item:text-black">The Proposal</div>
                        <div className="text-xs text-gray-500 group-hover/item:text-gray-700">Explore our hypothesis</div>
                      </NavLink>
                      <div className="h-px bg-black/5 my-1 mx-2" />
                      <NavLink to="/supplementary" className="block px-4 py-4 rounded-2xl hover:bg-black/5 transition-all group/item">
                        <div className="text-base font-semibold text-gray-900 group-hover/item:text-black">Supplementary Data</div>
                        <div className="text-xs text-gray-500 group-hover/item:text-gray-700">Detailed figures & models</div>
                      </NavLink>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Utilities - Right Side (Right) */}
          <div className="hidden md:flex items-center gap-4 shrink-0 justify-self-end">
            <NavLink
              to="/simulator"
              className="px-8 py-3.5 bg-[#1d1d1f] hover:bg-black text-white text-base font-semibold rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20"
            >
              Launch App
            </NavLink>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-800 z-50 relative justify-self-end"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white/90 backdrop-blur-3xl pt-28 px-8 md:hidden flex flex-col"
          >
            <div className="space-y-6">
              {[
                { to: "/", label: "Home" },
                { to: "/simulator", label: "Simulator" },
                { to: "/learn", label: "Learn" },
                { to: "/team", label: "Team" },
                { to: "/proposal", label: "Proposal" },
              ].map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.5, type: "spring", bounce: 0.3 }}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `block text-4xl font-semibold tracking-tighter transition-colors ${isActive ? 'text-black' : 'text-neutral-400'}`}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-auto mb-12"
            >
              <NavLink
                to="/simulator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full py-5 bg-black text-white text-xl text-center font-bold rounded-3xl"
              >
                Launch App
              </NavLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
