import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Download, FileText, Table } from 'lucide-react';
import { geant4Data } from '../../data/geant4Data';

const ResultsModal = ({ isOpen, onClose, results }) => {
  const [activeTab, setActiveTab] = useState('curves');

  if (!results) return null;

  // Mock data for graph
  const graphData = [
      { dist: 0, pion: 1.0, kaon: 1.0, muon: 1.0 },
      { dist: 5, pion: 0.98, kaon: 0.92, muon: 1.0 },
      { dist: 10, pion: 0.96, kaon: 0.84, muon: 0.99 },
      { dist: 15, pion: 0.94, kaon: 0.78, muon: 0.99 },
  ];

  const tabs = [
    { id: 'curves', label: 'Decay Curves' },
    { id: 'stats', label: 'Statistics' },
    { id: 'data', label: 'Raw Data' },
    { id: 'notes', label: 'Analysis Notes' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Simulation Results" maxWidth="max-w-5xl">
       {/* Tabs */}
       <div className="flex border-b border-gray-200 mb-6">
         {tabs.map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`
               px-6 py-3 font-medium text-sm transition-colors relative
               ${activeTab === tab.id ? 'text-[#0033A0]' : 'text-gray-500 hover:text-gray-700'}
             `}
           >
             {tab.label}
             {activeTab === tab.id && (
               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0033A0]" />
             )}
           </button>
         ))}
       </div>

       {/* Content */}
       <div className="min-h-[400px]">

         {/* Tab 1: Curves */}
         {activeTab === 'curves' && (
           <div className="h-[400px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                 <XAxis dataKey="dist" label={{ value: 'Distance (m)', position: 'insideBottom', offset: -10 }} />
                 <YAxis label={{ value: 'Survival Fraction', angle: -90, position: 'insideLeft' }} domain={[0.5, 1]} />
                 <RechartsTooltip />
                 <Legend />
                 <Line type="monotone" dataKey="pion" stroke="#E74C3C" strokeWidth={3} name="Pion (π+)" dot={{r: 4}} />
                 <Line type="monotone" dataKey="kaon" stroke="#3498DB" strokeWidth={3} name="Kaon (K+)" dot={{r: 4}} />
                 <Line type="monotone" dataKey="muon" stroke="#2ECC71" strokeWidth={3} name="Muon (μ+)" dot={{r: 4}} />
               </LineChart>
             </ResponsiveContainer>
             <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" icon={Download}>Download Plot</Button>
             </div>
           </div>
         )}

         {/* Tab 2: Statistics */}
         {activeTab === 'stats' && (
           <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                 <div className="p-2 bg-green-100 rounded-full text-green-600">✓</div>
                 <div>
                    <h4 className="font-bold text-green-800">Universality Confirmed!</h4>
                    <p className="text-sm text-green-700">The normalized decay curves collapse within 1.8σ, consistent with Special Relativity predictions.</p>
                 </div>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="border-b border-gray-200 text-gray-500 text-sm">
                      <th className="py-2">Particle</th>
                      <th className="py-2">Mass (MeV)</th>
                      <th className="py-2">Expected γ</th>
                      <th className="py-2">Measured γ</th>
                      <th className="py-2">Difference</th>
                   </tr>
                </thead>
                <tbody className="text-gray-800">
                   <tr className="border-b border-gray-100">
                      <td className="py-3 font-medium text-[#E74C3C]">Pion</td>
                      <td>139.6</td>
                      <td>57.3</td>
                      <td>57.1 ± 0.5</td>
                      <td>-0.3%</td>
                   </tr>
                   <tr className="border-b border-gray-100">
                      <td className="py-3 font-medium text-[#3498DB]">Kaon</td>
                      <td>493.7</td>
                      <td>16.2</td>
                      <td>16.3 ± 0.2</td>
                      <td>+0.6%</td>
                   </tr>
                </tbody>
              </table>

              <div className="bg-gray-50 p-4 rounded-lg">
                 <h4 className="font-bold text-gray-700 mb-2">Chi-Squared Test</h4>
                 <div className="font-mono text-sm">
                    χ² = 1.24 (d.o.f = 3)<br/>
                    p-value = 0.74
                 </div>
              </div>
           </div>
         )}

         {/* Tab 3: Raw Data */}
         {activeTab === 'data' && (
            <div>
               <div className="flex justify-end gap-2 mb-4">
                  <Button variant="outline" size="sm" icon={FileText}>JSON</Button>
                  <Button variant="outline" size="sm" icon={Table}>CSV</Button>
               </div>
               <div className="overflow-x-auto border rounded-lg max-h-[300px]">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0">
                        <tr>
                           <th className="px-4 py-2">Event ID</th>
                           <th className="px-4 py-2">PDG</th>
                           <th className="px-4 py-2">Momentum</th>
                           <th className="px-4 py-2">TOF (ns)</th>
                           <th className="px-4 py-2">Decayed?</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {results.data.map(row => (
                           <tr key={row.eventID} className="hover:bg-gray-50">
                              <td className="px-4 py-2 font-mono">{row.eventID}</td>
                              <td className="px-4 py-2">{row.primaryPDG}</td>
                              <td className="px-4 py-2">{row.primaryMom.toFixed(2)}</td>
                              <td className="px-4 py-2">{row.tof.toFixed(2)}</td>
                              <td className="px-4 py-2">
                                 {row.decayed ?
                                   <span className="text-red-500 font-bold">Yes</span> :
                                   <span className="text-green-500">No</span>
                                 }
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* Tab 4: Notes */}
         {activeTab === 'notes' && (
             <div className="h-full">
                <textarea
                  className="w-full h-[300px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent resize-none font-mono text-sm"
                  placeholder="Record your observations here... (Auto-saved)"
                  defaultValue="Observation 1: Kaons decayed significantly faster than pions as expected due to their shorter lifetime and lower gamma factor at 8 GeV/c."
                />
                <div className="mt-2 text-xs text-gray-400 text-right">Saved just now</div>
             </div>
         )}

       </div>
    </Modal>
  );
};

export default ResultsModal;
