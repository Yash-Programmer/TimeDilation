import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Box, FileText, Database, Globe, Download, X, ZoomIn } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { geant4Data } from '../data/geant4Data';

// Placeholder CAD Viewer Component
const CADViewerPlaceholder = ({ title }) => (
   <div className="w-full h-[300px] bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 relative group overflow-hidden">
       <Box size={48} className="text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
       <p className="text-gray-500 font-medium">{title}</p>
       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="primary" size="sm">Launch 3D Viewer</Button>
       </div>
   </div>
);

const Supplementary = () => {
  const [activeTab, setActiveTab] = useState('figures');
  const [selectedImage, setSelectedImage] = useState(null);

  const tabs = [
     { id: 'figures', label: 'Figures', icon: Image },
     { id: 'cad', label: 'CAD Models', icon: Box },
     { id: 'schematics', label: 'Schematics', icon: FileText },
     { id: 'geant4', label: 'GEANT4 Data', icon: Database },
     { id: 'cern', label: 'CERN Data', icon: Globe },
  ];

  // Mock list of images from public/images
  const figures = [
     { id: 1, src: '/images/01_particle_trajectories.png', title: 'Particle Trajectories' },
     { id: 2, src: '/images/02_momentum_distributions.png', title: 'Momentum Distributions' },
     { id: 3, src: '/images/03_beta_distributions.png', title: 'Beta Distributions' },
     { id: 4, src: '/images/04_eop_distributions.png', title: 'E/p Distributions' },
     { id: 5, src: '/images/05_decay_distributions.png', title: 'Decay Distributions' },
     { id: 6, src: '/images/06_cherenkov_npe.png', title: 'Cherenkov NPE' },
     { id: 7, src: '/images/vis04_full_beamline.png', title: 'Full Beamline Vis' },
  ];

  const cadModels = [
     { id: 1, title: 'Beam Injector Assembly', format: 'STEP', size: '2.3 MB' },
     { id: 2, title: 'TOF Detector Module', format: 'STEP', size: '1.1 MB' },
     { id: 3, title: 'Scintillator Array Frame', format: 'STL', size: '4.5 MB' },
     { id: 4, title: 'Cherenkov Detector Housing', format: 'STEP', size: '3.2 MB' },
     { id: 5, title: 'Electronics Box', format: 'IGES', size: '0.8 MB' },
     { id: 6, title: 'Mounting Brackets', format: 'STL', size: '0.5 MB' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
       {/* Tab Navigation */}
       <div className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
          <div className="container flex overflow-x-auto no-scrollbar">
             {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`
                        flex-1 min-w-[120px] py-4 flex flex-col items-center justify-center gap-2 border-b-4 transition-colors
                        ${activeTab === tab.id ? 'border-[#0033A0] bg-blue-50/50 text-[#0033A0]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                     `}
                   >
                      <Icon size={20} />
                      <span className="font-medium text-sm">{tab.label}</span>
                   </button>
                );
             })}
          </div>
       </div>

       {/* Content Area */}
       <div className="container py-8">

          {/* TAB 1: FIGURES */}
          {activeTab === 'figures' && (
             <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {figures.map(fig => (
                   <div key={fig.id} className="break-inside-avoid">
                      <div
                         className="group relative rounded-xl overflow-hidden shadow-md cursor-pointer bg-white"
                         onClick={() => setSelectedImage(fig)}
                      >
                         <img src={fig.src} alt={fig.title} className="w-full h-auto object-cover" loading="lazy" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                            <h4 className="text-white font-bold">{fig.title}</h4>
                            <div className="flex items-center gap-2 text-white/80 text-xs mt-1">
                               <ZoomIn size={14} /> Click to enlarge
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {/* TAB 2: CAD MODELS */}
          {activeTab === 'cad' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cadModels.map(model => (
                   <Card key={model.id} hover={true}>
                      <CADViewerPlaceholder title={model.title} />
                      <div className="mt-4">
                         <h3 className="text-lg font-bold text-[#1A1A2E]">{model.title}</h3>
                         <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                            <span>{model.format} • {model.size}</span>
                            <div className="flex gap-2">
                               <Button variant="outline" size="sm" icon={Download}>STEP</Button>
                               <Button variant="outline" size="sm" icon={Download}>STL</Button>
                            </div>
                         </div>
                      </div>
                   </Card>
                ))}
             </div>
          )}

          {/* TAB 3: GEANT4 DATA */}
          {activeTab === 'geant4' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Header Card */}
                <div className="lg:col-span-3 bg-[#0033A0] rounded-xl p-8 text-white relative overflow-hidden">
                   <div className="relative z-10">
                      <h2 className="text-3xl font-bold mb-2">Monte Carlo Simulation Results</h2>
                      <p className="text-blue-100 max-w-2xl">
                         Full simulation data generated using GEANT4 Version 11.1 with QGSP_BERT physics list.
                         Contains 60,000 events comparing Pion, Kaon, and Muon decay characteristics at 8 GeV/c.
                      </p>
                   </div>
                   <Database className="absolute right-[-20px] bottom-[-20px] text-white opacity-10" size={200} />
                </div>

                {/* Data Stats */}
                <Card className="lg:col-span-1">
                   <h3 className="font-bold text-gray-700 mb-4">Simulation Parameters</h3>
                   <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                         <span className="text-gray-500">Events</span>
                         <span className="font-mono font-bold">60,000</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                         <span className="text-gray-500">Momentum</span>
                         <span className="font-mono font-bold">8.0 GeV/c</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                         <span className="text-gray-500">Beam Length</span>
                         <span className="font-mono font-bold">15.0 m</span>
                      </div>
                   </div>
                   <Button className="w-full mt-6" variant="outline" size="sm">View Config JSON</Button>
                </Card>

                {/* Download Area */}
                <Card className="lg:col-span-2">
                   <h3 className="font-bold text-gray-700 mb-4">Download Datasets</h3>
                   <div className="space-y-4">
                      {[
                         { name: 'Raw ROOT File', size: '120 MB', type: 'ROOT' },
                         { name: 'Processed CSV Data', size: '15 MB', type: 'CSV' },
                         { name: 'Analysis Scripts (Python)', size: '45 KB', type: 'PY' },
                         { name: 'Run Logs', size: '12 KB', type: 'TXT' },
                      ].map((file, i) => (
                         <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-[#0033A0] font-bold text-xs">
                                  {file.type}
                               </div>
                               <div>
                                  <div className="font-medium text-gray-900">{file.name}</div>
                                  <div className="text-xs text-gray-500">{file.size}</div>
                               </div>
                            </div>
                            <Button variant="ghost" size="sm" icon={Download} />
                         </div>
                      ))}
                   </div>
                </Card>
             </div>
          )}

          {/* Placeholders for other tabs */}
          {activeTab === 'schematics' && (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <FileText size={48} className="mb-4 opacity-50" />
                <h3 className="text-lg font-medium">Schematics Gallery</h3>
                <p>Electrical and Data Flow diagrams would appear here.</p>
             </div>
          )}

          {activeTab === 'cern' && (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Globe size={48} className="mb-4 opacity-50" />
                <h3 className="text-lg font-medium">CERN Beam Data</h3>
                <p>T9 beamline specifications and detector inventory would appear here.</p>
             </div>
          )}

       </div>

       {/* Lightbox Modal for Images */}
       <AnimatePresence>
          {selectedImage && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative max-w-5xl max-h-[90vh]">
                   <img src={selectedImage.src} alt={selectedImage.title} className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" />
                   <button className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80" onClick={() => setSelectedImage(null)}>
                      <X size={24} />
                   </button>
                   <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white rounded-b-lg">
                      <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>

    </div>
  );
};

export default Supplementary;
