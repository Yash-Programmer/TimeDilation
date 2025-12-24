import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Download, FileText, Table } from 'lucide-react';
import { geant4Data } from '../../data/geant4Data';

const ResultsModal = ({ isOpen, onClose, results }) => {
  const [activeTab, setActiveTab] = useState('curves');

  if (!results) return null;

  // Calculate graph points based on results
  const survivalRate = results.stats.survived / results.stats.total;
  const theoreticalSurvival = results.stats.expectedSurvival;

  // Generate curve for plotting
  const graphData = [];
  const beamLength = results.config.beamLength;
  for (let i = 0; i <= 10; i++) {
      const x = (beamLength / 10) * i;
      // N(t) = N0 * exp(-t / (gamma * tau))
      // t = x / (beta * c)
      // Therefore: N(x) = N0 * exp( -x / (beta * c * gamma * tau) )
      // decayLength = beta * c * gamma * tau
      // S(x) = exp(-x / decayLength)

      const decayLength = results.stats.meanBeta * 299792458 * results.stats.meanGamma * (
          results.config.particleType === 'pion' ? 2.6033e-8 :
          results.config.particleType === 'kaon' ? 1.2380e-8 :
          results.config.particleType === 'muon' ? 2.1969e-6 : Infinity
      );

      graphData.push({
          dist: x.toFixed(1),
          survival: Math.exp(-x / decayLength).toFixed(4),
          ideal: 1.0 // Comparison baseline
      });
  }

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
                 <YAxis label={{ value: 'Survival Fraction', angle: -90, position: 'insideLeft' }} domain={[0, 1]} />
                 <RechartsTooltip />
                 <Legend />
                 <Line type="monotone" dataKey="survival" stroke="#0033A0" strokeWidth={3} name="Survival Rate" dot={{r: 4}} />
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                 <div className="p-2 bg-blue-100 rounded-full text-blue-600">i</div>
                 <div>
                    <h4 className="font-bold text-blue-800">Simulation Complete</h4>
                    <p className="text-sm text-blue-700">
                        Simulated {results.stats.total} particles with mean momentum {results.config.momentum} GeV/c.
                    </p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Survival Rate</div>
                      <div className="text-2xl font-bold font-mono">{(survivalRate * 100).toFixed(2)}%</div>
                      <div className="text-xs text-gray-400">Target: {(theoreticalSurvival * 100).toFixed(2)}%</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Mean Gamma</div>
                      <div className="text-2xl font-bold font-mono">{results.stats.meanGamma.toFixed(2)}</div>
                  </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                 <h4 className="font-bold text-gray-700 mb-2">Beam Statistics</h4>
                 <div className="font-mono text-sm space-y-1">
                    <div>Total Events: {results.stats.total}</div>
                    <div>Survived: <span className="text-green-600">{results.stats.survived}</span></div>
                    <div>Decayed: <span className="text-red-500">{results.stats.decayed}</span></div>
                    <div>Beta (v/c): {results.stats.meanBeta.toFixed(5)}</div>
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
                           <tr key={row.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 font-mono">{row.id}</td>
                              <td className="px-4 py-2">{results.config.particleType}</td>
                              <td className="px-4 py-2">{row.momentum.toFixed(2)}</td>
                              <td className="px-4 py-2">{row.tof.toFixed(2)}</td>
                              <td className="px-4 py-2">
                                 {!row.survived ?
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
