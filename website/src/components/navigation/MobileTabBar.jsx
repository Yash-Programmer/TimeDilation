import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlayCircle, BookOpen, Grid, Users } from 'lucide-react';

const MobileTabBar = () => {
  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Simulate', path: '/simulator', icon: PlayCircle },
    { name: 'Learn', path: '/learn', icon: BookOpen },
    { name: 'More', path: '/supplementary', icon: Grid },
    { name: 'Team', path: '/team', icon: Users },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-50 px-6 pb-safe">
      <div className="flex justify-between items-center h-full">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1 w-full h-full
                ${isActive ? 'text-[#0033A0]' : 'text-gray-400 hover:text-gray-600'}
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? "currentColor" : "none"} className={isActive ? "opacity-20" : ""} />
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="absolute" />
                  <span className="text-[10px] font-medium">{link.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabBar;
