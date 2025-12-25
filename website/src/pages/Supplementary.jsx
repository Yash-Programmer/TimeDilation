import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Box, FileText, Database, Globe, Download, X, ZoomIn, Table, BarChart3 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Real GEANT4 Data from simulation
const survivalData = [
   { position: 0, pionS: 0.999, pionErr: 0.010, kaonS: 0.990, kaonErr: 0.044 },
   { position: 5, pionS: 0.985, pionErr: 0.010, kaonS: 0.926, kaonErr: 0.041 },
   { position: 10, pionS: 0.975, pionErr: 0.010, kaonS: 0.848, kaonErr: 0.041 },
   { position: 15, pionS: 0.967, pionErr: 0.010, kaonS: 0.752, kaonErr: 0.039 },
];

const pidPerformance = {
   pionEfficiency: 80.26,
   kaonEfficiency: 82.70,
   pionContamination: 0.92,
   kaonContamination: 3.73,
};

// CAD Viewer Placeholder
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

   // All 17 unique figures from the figures folder
   const figures = [
      { id: 1, src: '/images/01_particle_trajectories.png', title: 'Particle Trajectories', category: 'Analysis' },
      { id: 2, src: '/images/02_momentum_distributions.png', title: 'Momentum Distributions', category: 'Analysis' },
      { id: 3, src: '/images/03_beta_distributions.png', title: 'Beta Distributions', category: 'Analysis' },
      { id: 4, src: '/images/04_eop_distributions.png', title: 'E/p Distributions', category: 'Analysis' },
      { id: 5, src: '/images/05_decay_distributions.png', title: 'Decay Distributions', category: 'Analysis' },
      { id: 6, src: '/images/06_cherenkov_npe.png', title: 'Cherenkov NPE', category: 'Detector' },
      { id: 7, src: '/images/07_beam_profile_2d.png', title: 'Beam Profile 2D', category: 'Beam' },
      { id: 8, src: '/images/08_pid_performance.png', title: 'PID Performance', category: 'Analysis' },
      { id: 9, src: '/images/09_lifetime_measurement.png', title: 'Lifetime Measurement', category: 'Results' },
      { id: 10, src: '/images/10_lorentz_factors.png', title: 'Lorentz Factors', category: 'Results' },
      { id: 11, src: '/images/11_time_dilation_proof.png', title: 'Time Dilation Proof', category: 'Results' },
      { id: 12, src: '/images/12_detector_response.png', title: 'Detector Response', category: 'Detector' },
      { id: 13, src: '/images/13_systematics.png', title: 'Systematic Uncertainties', category: 'Analysis' },
      { id: 14, src: '/images/vis01_detector_configs.png', title: 'Detector Configurations', category: 'Visualization' },
      { id: 15, src: '/images/vis02_particle_trajectories.png', title: 'Particle Trajectories (3D)', category: 'Visualization' },
      { id: 16, src: '/images/vis03_decay_events.png', title: 'Decay Events', category: 'Visualization' },
      { id: 17, src: '/images/vis04_full_beamline.png', title: 'Full Beamline', category: 'Visualization' },
   ];

   const cadModels = [
      { id: 1, title: 'Beam Injector Assembly', format: 'STEP', size: '2.3 MB' },
      { id: 2, title: 'TOF Detector Module', format: 'STEP', size: '1.1 MB' },
      { id: 3, title: 'Scintillator Array Frame', format: 'STL', size: '4.5 MB' },
      { id: 4, title: 'Cherenkov Detector Housing', format: 'STEP', size: '3.2 MB' },
      { id: 5, title: 'Electronics Box', format: 'IGES', size: '0.8 MB' },
      { id: 6, title: 'Mounting Brackets', format: 'STL', size: '0.5 MB' },
   ];

   // Schematics from the detector and beamline visualizations
   const schematics = [
      { id: 1, src: '/images/vis01_detector_configs.png', title: 'Detector Configuration Schematic', description: 'Overview of the detector layout including TOF, calorimeter, and Cherenkov positions.' },
      { id: 2, src: '/images/vis04_full_beamline.png', title: 'T9 Beamline Layout', description: 'Complete beamline schematic from target to final detector station.' },
      { id: 3, src: '/images/12_detector_response.png', title: 'Detector Response Diagram', description: 'Signal flow and response characteristics of the detector chain.' },
      { id: 4, src: '/images/08_pid_performance.png', title: 'PID System Schematic', description: 'Particle identification system architecture and performance metrics.' },
   ];

   return (
      <div className="min-h-screen bg-[#FAFBFC]">
         {/* Tab Navigation */}
         <div className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
            <div className="container mx-auto flex justify-center overflow-x-auto no-scrollbar">
               {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                        flex-1 min-w-[120px] max-w-[180px] py-4 flex flex-col items-center justify-center gap-2 border-b-4 transition-colors
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
         <div className="container mx-auto py-8 px-4">

            {/* TAB 1: FIGURES - All 17 images */}
            {activeTab === 'figures' && (
               <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-8">
                     <h2 className="text-3xl font-bold text-gray-900 mb-2">Simulation Figures</h2>
                     <p className="text-gray-600">All figures generated from GEANT4 simulation and analysis</p>
                  </div>
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                     {figures.map(fig => (
                        <div key={fig.id} className="break-inside-avoid">
                           <div
                              className="group relative rounded-xl overflow-hidden shadow-md cursor-pointer bg-white"
                              onClick={() => setSelectedImage(fig)}
                           >
                              <img src={fig.src} alt={fig.title} className="w-full h-auto object-cover" loading="lazy" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                 <span className="text-xs text-blue-300 font-medium mb-1">{fig.category}</span>
                                 <h4 className="text-white font-bold">{fig.title}</h4>
                                 <div className="flex items-center gap-2 text-white/80 text-xs mt-1">
                                    <ZoomIn size={14} /> Click to enlarge
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* TAB 2: CAD MODELS */}
            {activeTab === 'cad' && (
               <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-8">
                     <h2 className="text-3xl font-bold text-gray-900 mb-2">CAD Models</h2>
                     <p className="text-gray-600">3D models for detector components and beamline elements</p>
                  </div>
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
               </div>
            )}

            {/* TAB 3: SCHEMATICS */}
            {activeTab === 'schematics' && (
               <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-8">
                     <h2 className="text-3xl font-bold text-gray-900 mb-2">Technical Schematics</h2>
                     <p className="text-gray-600">Detector layouts, beamline diagrams, and system architecture</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {schematics.map(schema => (
                        <Card key={schema.id} hover={true} className="overflow-hidden">
                           <div
                              className="relative cursor-pointer group"
                              onClick={() => setSelectedImage(schema)}
                           >
                              <img src={schema.src} alt={schema.title} className="w-full h-auto rounded-lg" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                 <Button variant="primary" size="sm" icon={ZoomIn}>View Full Size</Button>
                              </div>
                           </div>
                           <div className="mt-4">
                              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">{schema.title}</h3>
                              <p className="text-gray-600 text-sm">{schema.description}</p>
                           </div>
                        </Card>
                     ))}
                  </div>
               </div>
            )}

            {/* TAB 4: GEANT4 DATA - Real Data */}
            {activeTab === 'geant4' && (
               <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     {/* Header Card */}
                     <div className="lg:col-span-3 bg-[#0033A0] rounded-xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                           <h2 className="text-3xl font-bold mb-2">Monte Carlo Simulation Results</h2>
                           <p className="text-blue-100 max-w-2xl">
                              Real simulation data generated using GEANT4 Version 11.1 with QGSP_BERT physics list.
                              Contains 60,000 events comparing Pion, Kaon, and Muon decay characteristics at 8 GeV/c.
                           </p>
                        </div>
                        <Database className="absolute right-[-20px] bottom-[-20px] text-white opacity-10" size={200} />
                     </div>

                     {/* Survival Probability Table */}
                     <Card className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                           <Table size={20} className="text-[#0033A0]" />
                           <h3 className="font-bold text-gray-700">Survival Probability vs Distance</h3>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-sm">
                              <thead>
                                 <tr className="bg-gray-50 text-left">
                                    <th className="p-3 font-semibold text-gray-600">Position (m)</th>
                                    <th className="p-3 font-semibold text-gray-600">Pion S ± err</th>
                                    <th className="p-3 font-semibold text-gray-600">Kaon S ± err</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {survivalData.map((row, i) => (
                                    <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/50">
                                       <td className="p-3 font-mono font-bold text-[#0033A0]">{row.position}</td>
                                       <td className="p-3 font-mono">{row.pionS.toFixed(3)} ± {row.pionErr.toFixed(3)}</td>
                                       <td className="p-3 font-mono">{row.kaonS.toFixed(3)} ± {row.kaonErr.toFixed(3)}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                           Data from: <code className="bg-gray-100 px-1 rounded">survival_summary.csv</code>
                        </p>
                     </Card>

                     {/* PID Performance */}
                     <Card className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                           <BarChart3 size={20} className="text-[#0033A0]" />
                           <h3 className="font-bold text-gray-700">PID Performance</h3>
                        </div>
                        <div className="space-y-4">
                           <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                              <div className="text-xs text-green-600 font-medium mb-1">Pion Efficiency</div>
                              <div className="text-2xl font-bold text-green-700">{pidPerformance.pionEfficiency.toFixed(1)}%</div>
                           </div>
                           <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="text-xs text-blue-600 font-medium mb-1">Kaon Efficiency</div>
                              <div className="text-2xl font-bold text-blue-700">{pidPerformance.kaonEfficiency.toFixed(1)}%</div>
                           </div>
                           <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                              <div className="text-xs text-amber-600 font-medium mb-1">Pion Contamination</div>
                              <div className="text-2xl font-bold text-amber-700">{pidPerformance.pionContamination.toFixed(2)}%</div>
                           </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                           Data from: <code className="bg-gray-100 px-1 rounded">particle_id_performance.csv</code>
                        </p>
                     </Card>

                     {/* Download Area */}
                     <Card className="lg:col-span-3">
                        <h3 className="font-bold text-gray-700 mb-4">Download Raw Datasets</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                           {[
                              { name: 'TimeDilation_Run0.csv', size: '2.1 MB', type: 'CSV' },
                              { name: 'TimeDilation_Run1.csv', size: '2.1 MB', type: 'CSV' },
                              { name: 'TimeDilation_Run2.csv', size: '2.1 MB', type: 'CSV' },
                              { name: 'TimeDilation_Run3.csv', size: '2.1 MB', type: 'CSV' },
                           ].map((file, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-[#0033A0] font-bold text-xs">
                                       {file.type}
                                    </div>
                                    <div>
                                       <div className="font-medium text-gray-900 text-sm">{file.name}</div>
                                       <div className="text-xs text-gray-500">{file.size}</div>
                                    </div>
                                 </div>
                                 <Button variant="ghost" size="sm" icon={Download} />
                              </div>
                           ))}
                        </div>
                     </Card>
                  </div>
               </div>
            )}

            {/* TAB 5: CERN DATA */}
            {activeTab === 'cern' && (
               <div className="max-w-4xl mx-auto text-center py-12">
                  <Globe size={64} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">CERN T9 Beamline Data</h3>
                  <p className="text-gray-500 max-w-xl mx-auto mb-8">
                     Real beam specifications and detector inventory from the CERN T9 beamline will be added once the experiment is approved.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                     {[
                        { label: 'Beam Energy', value: '1-10 GeV' },
                        { label: 'Particle Types', value: 'π, K, p, μ' },
                        { label: 'Beamline Length', value: '15 m' },
                        { label: 'Status', value: 'Pending' },
                     ].map((item, i) => (
                        <div key={i} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                           <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                           <div className="font-bold text-[#0033A0]">{item.value}</div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

         </div>

         {/* Lightbox Modal */}
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
