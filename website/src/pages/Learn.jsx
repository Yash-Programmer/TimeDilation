import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, CheckCircle, ArrowLeft, ArrowRight, BookOpen, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Quiz from '../components/learn/Quiz';
import SimulatorTask from '../components/learn/SimulatorTask';
import { LorentzCalculator, ParticleBuilder } from '../components/learn/Widgets';
import modulesData from '../data/modules.json';
import { showToast } from '../components/common/Toast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import confetti from 'canvas-confetti';

const Learn = () => {
  const [activeLevel, setActiveLevel] = useState('beginner');
  const [selectedModuleId, setSelectedModuleId] = useState('1.1');
  const [searchTerm, setSearchTerm] = useState('');
  const [completedModules, setCompletedModules] = useLocalStorage('completed_modules', []);

  // Find current module data
  const flatModules = modulesData.modules.flatMap(level => level.items.map(m => ({ ...m, level: level.level })));
  const currentModule = flatModules.find(m => m.id === selectedModuleId);

  // Handlers
  const handleModuleComplete = () => {
      if (!completedModules.includes(selectedModuleId)) {
          setCompletedModules([...completedModules, selectedModuleId]);
          confetti({
             particleCount: 150,
             spread: 60,
             origin: { y: 0.7 }
          });
          showToast("Module Completed! Progress saved.", "success");
      } else {
          showToast("Module already completed!", "info");
      }
  };

  const filteredModules = modulesData.modules.find(l => l.level === activeLevel)?.items.filter(m =>
     m.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">

       {/* Sidebar Navigation */}
       <div className="w-full lg:w-[320px] bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] sticky top-16 z-30">

          {/* Search */}
          <div className="p-4 border-b border-gray-100">
             <input
               type="text"
               placeholder="Search modules..."
               className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0033A0]"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>

          {/* Level Tabs */}
          <div className="flex p-2 gap-1 bg-gray-50 border-b border-gray-100">
             {['beginner', 'intermediate', 'advanced'].map(level => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`
                    flex-1 py-2 text-xs font-medium rounded-md capitalize transition-colors
                    ${activeLevel === level
                       ? level === 'beginner' ? 'bg-green-100 text-green-800' : level === 'intermediate' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                       : 'text-gray-500 hover:bg-gray-100'}
                  `}
                >
                  {level}
                </button>
             ))}
          </div>

          {/* Module List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {filteredModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  className={`
                    w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors
                    ${selectedModuleId === module.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50 border border-transparent'}
                  `}
                >
                   <div className={`
                      p-2 rounded-lg shrink-0 relative
                      ${selectedModuleId === module.id ? 'bg-[#0033A0] text-white' : 'bg-gray-100 text-gray-500'}
                   `}>
                      <span className="text-xs font-bold">{module.id}</span>
                      {completedModules.includes(module.id) && (
                          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border border-white">
                              <CheckCircle size={10} className="text-white" />
                          </div>
                      )}
                   </div>
                   <div>
                      <h4 className={`text-sm font-medium ${selectedModuleId === module.id ? 'text-[#0033A0]' : 'text-gray-700'}`}>
                         {module.title}
                      </h4>
                      <span className="text-xs text-gray-400">{module.duration}</span>
                   </div>
                </button>
             ))}
          </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 bg-white overflow-y-auto">
          {currentModule ? (
             <div className="max-w-[820px] mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-8 border-b border-gray-100 pb-8">
                   <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <span className="capitalize">{currentModule.level}</span>
                      <ChevronRight size={14} />
                      <span>Module {currentModule.id}</span>
                   </div>
                   <h1 className="text-4xl font-bold text-[#0033A0] mb-4">{currentModule.title}</h1>

                   <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                         <Clock size={16} className="text-[#0033A0]" />
                         <span>{currentModule.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <BookOpen size={16} className="text-[#0033A0]" />
                         <span>Reading</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Activity size={16} className="text-[#0033A0]" />
                         <span>Interactive</span>
                      </div>
                   </div>
                </div>

                {/* Markdown Content */}
                <div className="prose prose-lg text-gray-700 mb-12">
                   <ReactMarkdown>{currentModule.content || "Content coming soon..."}</ReactMarkdown>
                </div>

                {/* Interactive Widgets */}
                {currentModule.interactive?.type === 'lorentz-calculator' && <LorentzCalculator />}
                {currentModule.interactive?.type === 'particle-builder' && <ParticleBuilder />}

                {/* Simulator Task */}
                {currentModule.task && (
                    <SimulatorTask
                        taskDescription={currentModule.task.description}
                        targetPreset={currentModule.task.preset}
                    />
                )}

                {/* Quiz Section */}
                {currentModule.quiz && (
                   <div className="my-12">
                      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">Test Your Knowledge</h2>
                      <Quiz questions={currentModule.quiz} onComplete={handleModuleComplete} />
                   </div>
                )}

                {/* Navigation Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-12">
                   <Button variant="ghost" icon={ArrowLeft}>Previous</Button>

                   <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">Done reading?</p>
                      <Button variant="outline" size="sm" onClick={handleModuleComplete} icon={CheckCircle}>
                         Mark Complete
                      </Button>
                   </div>

                   <Button variant="primary" icon={ArrowRight}>Next Module</Button>
                </div>

             </div>
          ) : (
             <div className="flex items-center justify-center h-full text-gray-400">
                Select a module to begin learning
             </div>
          )}
       </div>

    </div>
  );
};

export default Learn;
