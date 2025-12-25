import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, CheckCircle, ArrowLeft, ArrowRight, BookOpen, Clock, Activity, FileText, Brain, Play, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import SimulatorTask from '../components/learn/SimulatorTask';
import Flashcard from '../components/learn/Flashcard';
import { AtomStructure, QuarkTable, StandardModelDiagram, ForceCarriers } from '../components/learn/infographics/ParticleInfographics';
import modulesData from '../data/modules.json';
import { showToast } from '../components/common/Toast';
import { useLocalStorage } from '../hooks/useLocalStorage';
import confetti from 'canvas-confetti';

// Infographic component mapping
const INFOGRAPHICS = {
   'AtomStructure': AtomStructure,
   'QuarkTable': QuarkTable,
   'StandardModelDiagram': StandardModelDiagram,
   'ForceCarriers': ForceCarriers,
};

const SimpleQuiz = ({ questionData }) => {
   const [selected, setSelected] = useState(null);
   const [isCorrect, setIsCorrect] = useState(null);

   const handleSelect = (idx) => {
      if (isCorrect === true) return;
      setSelected(idx);
      const correct = idx === questionData.correct;
      setIsCorrect(correct);
      if (correct) {
         confetti({ particleCount: 50, spread: 40, origin: { y: 0.8 }, startVelocity: 20 });
      }
   };

   return (
      <div className="bg-white border rounded-xl p-6 shadow-sm my-6">
         <div className="flex items-center gap-2 mb-4">
            <Brain size={18} className="text-purple-600" />
            <h3 className="font-bold text-slate-800">Quick Check</h3>
         </div>
         <p className="text-lg font-medium text-slate-800 mb-4">{questionData.q}</p>
         <div className="space-y-2">
            {questionData.a.map((option, idx) => (
               <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center
                            ${selected === idx
                        ? (isCorrect ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800')
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}
                        `}
               >
                  <span>{option}</span>
                  {selected === idx && (
                     <span>{isCorrect ? <CheckCircle size={18} /> : '❌'}</span>
                  )}
               </button>
            ))}
         </div>
         {isCorrect && <p className="mt-3 text-sm text-green-600 font-semibold">Correct! Well done.</p>}
      </div>
   );
};

const Learn = () => {
   const [activeLevel, setActiveLevel] = useState('beginner');
   const [selectedModuleId, setSelectedModuleId] = useState('1.1.1'); // Default to first subtopic of first module? No, select Module ID.
   // Actually the module IDs in JSON are "1.1.1". Wait.
   // In script: beginner_chapters has subtopics with IDs "1.1.1". The chapter itself doesn't have an ID in the script, I need to check the JSON output. 
   // The script didn't assign IDs to the Chapter objects! It assigned "1.1.X" to subtopics.
   // Let me assign a temporary ID based on index if missing, or I should have fixed the script.
   // I will check the JSON structure first to be sure. I'll assume they don't have IDs and generate them or just index.

   // Correction: The script loop for `beginner_chapters` just defined dicts. It didn't add "id".
   // I will map over them and add IDs dynamically.

   const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

   const levels = { beginner: 0, intermediate: 1, advanced: 2 };
   const currentLevelItems = modulesData.modules.find(l => l.level === activeLevel)?.items || [];

   // Flattening or just selecting
   const currentModule = currentLevelItems[currentModuleIndex] || currentLevelItems[0];

   // Handlers
   const handleLevelChange = (level) => {
      setActiveLevel(level);
      setCurrentModuleIndex(0);
   };

   return (
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-[#FAFAFA]">

         {/* Sidebar Navigation */}
         <div className="w-full lg:w-[320px] bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-64px)] sticky top-16 z-30">

            {/* Level Tabs */}
            <div className="flex p-2 gap-1 bg-slate-50 border-b border-slate-200">
               {['beginner', 'intermediate', 'advanced'].map(level => (
                  <button
                     key={level}
                     onClick={() => handleLevelChange(level)}
                     className={`
                    flex-1 py-2 text-xs font-bold rounded-md capitalize transition-colors tracking-wide
                    ${activeLevel === level
                           ? level === 'beginner' ? 'bg-emerald-100 text-emerald-800' : level === 'intermediate' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                           : 'text-slate-500 hover:bg-slate-100'}
                  `}
                  >
                     {level}
                  </button>
               ))}
            </div>

            {/* Module List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
               <div className="px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Chapters
               </div>
               {currentLevelItems.map((module, idx) => (
                  <button
                     key={idx}
                     onClick={() => setCurrentModuleIndex(idx)}
                     className={`
                    w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors group
                    ${currentModuleIndex === idx ? 'bg-[#0033A0]/5 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'}
                  `}
                  >
                     <div className={`
                      flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors
                      ${currentModuleIndex === idx ? 'bg-[#0033A0] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}
                   `}>
                        <span className="text-xs font-bold">{idx + 1}</span>
                     </div>
                     <div>
                        <h4 className={`text-sm font-semibold leading-tight ${currentModuleIndex === idx ? 'text-[#0033A0]' : 'text-slate-700'}`}>
                           {module.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{module.description}</p>
                     </div>
                  </button>
               ))}
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 bg-[#FAFAFA] overflow-y-auto">
            {currentModule ? (
               <div className="max-w-4xl mx-auto px-6 py-12">

                  {/* Header */}
                  <div className="mb-10">
                     <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#0033A0]"></span>
                        {activeLevel} Level
                        <ChevronRight size={12} />
                        Chapter {currentModuleIndex + 1}
                     </div>
                     <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{currentModule.title}</h1>
                     <p className="text-xl text-slate-600 leading-relaxed font-light">{currentModule.description}</p>
                  </div>

                  <div className="space-y-12">
                     {currentModule.subtopics && currentModule.subtopics.map((topic, index) => (
                        <div key={index} className="scroll-mt-24" id={`topic-${index}`}>

                           {/* Topic Title */}
                           <div className="flex items-center gap-3 mb-6">
                              <span className="text-lg font-bold text-slate-300">{(currentModuleIndex + 1)}.{index + 1}</span>
                              <h2 className="text-2xl font-bold text-slate-800">{topic.title}</h2>
                           </div>

                           {/* Content based on Type */}
                           <div className="">
                              {topic.type === 'text' && (
                                 <div className="prose prose-lg prose-slate max-w-none bg-white p-8 rounded-2xl border border-slate-100 shadow-sm prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-slate-700 prose-table:text-sm prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3 prose-td:border-slate-200">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{topic.content}</ReactMarkdown>
                                    {/* Render infographic if specified */}
                                    {topic.infographic && INFOGRAPHICS[topic.infographic] && (
                                       React.createElement(INFOGRAPHICS[topic.infographic])
                                    )}
                                 </div>
                              )}

                              {topic.type === 'case_study' && (
                                 <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                       <BookOpen size={120} className="text-amber-900" />
                                    </div>
                                    <span className="relative z-10 px-3 py-1 bg-amber-200 text-amber-900 text-xs font-bold uppercase rounded-full mb-4 inline-block">Case Study</span>
                                    <div className="relative z-10 prose prose-lg prose-amber max-w-none">
                                       <ReactMarkdown>{topic.content}</ReactMarkdown>
                                    </div>
                                 </div>
                              )}

                              {topic.type === 'task' && (
                                 <SimulatorTask
                                    taskDescription={topic.content}
                                    targetPreset={null}
                                 />
                              )}

                              {topic.type === 'quiz' && topic.quiz && (
                                 <SimpleQuiz questionData={topic.quiz} />
                              )}

                              {topic.type === 'flashcard' && topic.flashcard && (
                                 <Flashcard front={topic.flashcard.front} back={topic.flashcard.back} />
                              )}
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Navigation Footer */}
                  <div className="flex items-center justify-between border-t border-slate-200 pt-10 mt-20">
                     <Button
                        variant="ghost"
                        icon={ArrowLeft}
                        onClick={() => setCurrentModuleIndex(Math.max(0, currentModuleIndex - 1))}
                        disabled={currentModuleIndex === 0}
                     >
                        Previous Chapter
                     </Button>
                     <Button
                        variant="primary"
                        icon={ArrowRight}
                        onClick={() => setCurrentModuleIndex(Math.min(currentLevelItems.length - 1, currentModuleIndex + 1))}
                        disabled={currentModuleIndex === currentLevelItems.length - 1}
                     >
                        Next Chapter
                     </Button>
                  </div>

               </div>
            ) : (
               <div className="flex items-center justify-center h-full text-slate-400">
                  Loading curriculum...
               </div>
            )}
         </div>

      </div>
   );
};

export default Learn;
