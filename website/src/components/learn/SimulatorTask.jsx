import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import Button from '../common/Button';

const SimulatorTask = ({ taskDescription, targetPreset }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-8 my-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-[#0033A0] text-white text-xs font-bold uppercase tracking-wider rounded-full">Simulator Task</span>
        </div>
        <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Put it into Practice</h3>
        <p className="text-gray-700 leading-relaxed">{taskDescription}</p>
      </div>

      <Link to="/simulator">
        <Button size="lg" icon={PlayCircle} className="shadow-lg whitespace-nowrap">
            Launch Simulator
        </Button>
      </Link>
    </div>
  );
};

export default SimulatorTask;
