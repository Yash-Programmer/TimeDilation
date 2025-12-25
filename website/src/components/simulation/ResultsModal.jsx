import React, { useState, useMemo, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Download, FileText, Table, CheckCircle, XCircle, TrendingUp, AlertTriangle, Image } from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';
import { PARTICLES } from '../../context/SimulationContext';

const ResultsModal = ({ isOpen, onClose }) => {
   const { state, results, downloadResults } = useSimulation();
   const [activeTab, setActiveTab] = useState('curves');
   const chartRef = useRef(null);

   // PNG Export function
   const downloadChartAsPNG = useCallback(async () => {
      if (!chartRef.current) return;

      try {
         // Dynamic import to avoid bundle size issues
         const html2canvas = (await import('html2canvas')).default;
         const canvas = await html2canvas(chartRef.current, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher resolution
         });

         const link = document.createElement('a');
         link.download = `decay_curve_${results?.config?.particle?.type || 'simulation'}_${Date.now()}.png`;
         link.href = canvas.toDataURL('image/png');
         link.click();
      } catch (error) {
         console.error('PNG export failed:', error);
         // Fallback: simple canvas method
         const svgElement = chartRef.current.querySelector('svg');
         if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new window.Image();

            img.onload = () => {
               canvas.width = img.width * 2;
               canvas.height = img.height * 2;
               ctx.fillStyle = '#ffffff';
               ctx.fillRect(0, 0, canvas.width, canvas.height);
               ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

               const link = document.createElement('a');
               link.download = `decay_curve_${Date.now()}.png`;
               link.href = canvas.toDataURL('image/png');
               link.click();
            };

            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
         }
      }
   }, [results]);

   // Extract data from results (or use defaults if no results yet)
   const stats = results?.stats;
   const curveData = results?.curveData || [];
   const config = results?.config;
   const events = results?.events || [];

   // Calculate chi-squared test (simplified) - MUST be before any early returns!
   const chiSquaredResult = useMemo(() => {
      if (!stats) return null;
      const observed = stats.survivalRate;
      const expected = stats.theoreticalSurvival;
      const diff = observed - expected;
      const sigma = Math.sqrt(expected * (1 - expected) / stats.total);
      const zScore = sigma > 0 ? diff / sigma : 0;

      return {
         observed,
         expected,
         diff: diff * 100,
         zScore,
         pass: Math.abs(zScore) < 2,
      };
   }, [stats]);

   // Early return AFTER all hooks
   if (!results) return null;

   const tabs = [
      { id: 'curves', label: 'Decay Curves', icon: TrendingUp },
      { id: 'stats', label: 'Statistics', icon: CheckCircle },
      { id: 'data', label: 'Raw Data', icon: Table },
      { id: 'notes', label: 'Analysis Notes', icon: FileText },
   ];

   // Generate analysis notes template based on actual results
   const generateNotesTemplate = () => {
      const particle = config.particle;
      const survivalPercent = (stats.survivalRate * 100).toFixed(1);
      const theoreticalPercent = (stats.theoreticalSurvival * 100).toFixed(1);

      return `## Simulation Analysis: ${particle.name}

### Configuration
- Momentum: ${config.momentum} GeV/c
- Beamline Length: ${config.beamLength}m
- Decay Enabled: ${config.decayEnabled ? 'Yes' : 'No'}
- Magnetic Field: ${config.magneticField} T

### Key Results
- **Survival Rate**: ${survivalPercent}% (observed) vs ${theoreticalPercent}% (theory)
- **Mean γ factor**: ${stats.meanGamma.toFixed(2)}
- **Mean β**: ${stats.meanBeta.toFixed(6)}
- **Total Events**: ${stats.total.toLocaleString()}

### Observations
${chiSquaredResult?.pass
            ? '✅ Results are consistent with special relativity predictions within statistical uncertainty.'
            : '⚠️ Deviation from theory detected - investigate systematic effects.'}

### Notes
(Add your observations here...)
`;
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose} title="Simulation Results" maxWidth="max-w-5xl">
         {/* Tabs */}
         <div className="flex border-b border-slate-200 mb-6">
            {tabs.map(tab => {
               const Icon = tab.icon;
               return (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`
                px-6 py-3 font-medium text-sm transition-colors relative flex items-center gap-2
                ${activeTab === tab.id ? 'text-[#0033A0]' : 'text-slate-500 hover:text-slate-700'}
              `}
                  >
                     <Icon size={16} />
                     {tab.label}
                     {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0033A0]" />
                     )}
                  </button>
               );
            })}
         </div>

         {/* Content */}
         <div className="min-h-[450px]">

            {/* Tab 1: Decay Curves */}
            {activeTab === 'curves' && (
               <div>
                  {/* Legend */}
                  <div className="flex items-center gap-4 mb-4">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.particle.color }} />
                        <span className="text-sm text-slate-600">{config.particle.name} Theoretical</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-400" />
                        <span className="text-sm text-slate-600">Simulated Data</span>
                     </div>
                  </div>

                  <div ref={chartRef} className="h-[350px] w-full bg-white p-2 rounded">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={curveData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                           <defs>
                              <linearGradient id="colorSurvival" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor={config.particle.color} stopOpacity={0.3} />
                                 <stop offset="95%" stopColor={config.particle.color} stopOpacity={0} />
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                           <XAxis
                              dataKey="distance"
                              label={{ value: 'Distance (m)', position: 'bottom', offset: 0 }}
                              tickFormatter={(v) => `${v}m`}
                           />
                           <YAxis
                              label={{ value: 'Survival Fraction', angle: -90, position: 'insideLeft' }}
                              domain={[0, 1]}
                              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                           />
                           <RechartsTooltip
                              formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Survival']}
                              labelFormatter={(label) => `Distance: ${label}m`}
                           />
                           <Area
                              type="monotone"
                              dataKey="survival"
                              stroke={config.particle.color}
                              strokeWidth={3}
                              fillOpacity={1}
                              fill="url(#colorSurvival)"
                              name="Survival Rate"
                           />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                     <div className="text-sm text-slate-500">
                        λ = {stats.theoreticalDecayLength?.toFixed(1) || '∞'} m (decay length)
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" icon={Image} onClick={downloadChartAsPNG}>
                           Save PNG
                        </Button>
                        <Button variant="outline" size="sm" icon={Download} onClick={() => downloadResults('csv')}>
                           CSV Data
                        </Button>
                     </div>
                  </div>
               </div>
            )}

            {/* Tab 2: Statistics */}
            {activeTab === 'stats' && (
               <div className="space-y-6">
                  {/* Summary Box */}
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${chiSquaredResult?.pass ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                     {chiSquaredResult?.pass ? (
                        <CheckCircle className="text-green-600 shrink-0" size={24} />
                     ) : (
                        <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                     )}
                     <div>
                        <h4 className={`font-bold ${chiSquaredResult?.pass ? 'text-green-800' : 'text-amber-800'}`}>
                           {chiSquaredResult?.pass ? 'Results Consistent with Theory' : 'Deviation Detected'}
                        </h4>
                        <p className={`text-sm ${chiSquaredResult?.pass ? 'text-green-700' : 'text-amber-700'}`}>
                           Simulated {stats.total.toLocaleString()} {config.particle.name} particles at {config.momentum} GeV/c.
                           Observed {(stats.survivalRate * 100).toFixed(1)}% survival vs {(stats.theoreticalSurvival * 100).toFixed(1)}% expected.
                        </p>
                     </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Survival Rate</div>
                        <div className="text-2xl font-bold font-mono text-[#0033A0]">{(stats.survivalRate * 100).toFixed(2)}%</div>
                        <div className="text-xs text-slate-400">
                           vs {(stats.theoreticalSurvival * 100).toFixed(2)}% theory
                        </div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Mean Gamma (γ)</div>
                        <div className="text-2xl font-bold font-mono text-yellow-600">{stats.meanGamma.toFixed(2)}</div>
                        <div className="text-xs text-slate-400">time dilation factor</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Mean Beta (β)</div>
                        <div className="text-2xl font-bold font-mono text-green-600">{stats.meanBeta.toFixed(5)}</div>
                        <div className="text-xs text-slate-400">v/c ratio</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Mean TOF</div>
                        <div className="text-2xl font-bold font-mono text-purple-600">{stats.meanTOF.toFixed(2)} ns</div>
                        <div className="text-xs text-slate-400">time of flight</div>
                     </div>
                  </div>

                  {/* Detailed Stats */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                     <h4 className="font-bold text-slate-700 mb-3">Event Statistics</h4>
                     <div className="grid grid-cols-3 gap-4 font-mono text-sm">
                        <div>
                           <span className="text-slate-500">Total Events:</span>
                           <span className="ml-2 font-bold">{stats.total.toLocaleString()}</span>
                        </div>
                        <div>
                           <span className="text-green-600">Survived:</span>
                           <span className="ml-2 font-bold text-green-700">{stats.survived.toLocaleString()}</span>
                        </div>
                        <div>
                           <span className="text-red-600">Decayed:</span>
                           <span className="ml-2 font-bold text-red-700">{stats.decayed.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Tab 3: Raw Data */}
            {activeTab === 'data' && (
               <div>
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-sm text-slate-500">
                        Showing first {events.length} of {stats.total.toLocaleString()} events
                     </span>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" icon={FileText} onClick={() => downloadResults('json')}>
                           JSON
                        </Button>
                        <Button variant="outline" size="sm" icon={Table} onClick={() => downloadResults('csv')}>
                           CSV
                        </Button>
                     </div>
                  </div>

                  <div className="overflow-x-auto border rounded-lg max-h-[350px]">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                           <tr>
                              <th className="px-4 py-3">Event ID</th>
                              <th className="px-4 py-3">Momentum (GeV/c)</th>
                              <th className="px-4 py-3">β</th>
                              <th className="px-4 py-3">γ</th>
                              <th className="px-4 py-3">TOF (ns)</th>
                              <th className="px-4 py-3">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {events.map(event => (
                              <tr key={event.id} className="hover:bg-slate-50">
                                 <td className="px-4 py-2 font-mono text-slate-600">{event.id}</td>
                                 <td className="px-4 py-2 font-mono">{event.momentum.toFixed(4)}</td>
                                 <td className="px-4 py-2 font-mono text-green-600">{event.beta.toFixed(6)}</td>
                                 <td className="px-4 py-2 font-mono text-yellow-600">{event.gamma.toFixed(2)}</td>
                                 <td className="px-4 py-2 font-mono text-purple-600">{event.tof.toFixed(3)}</td>
                                 <td className="px-4 py-2">
                                    {event.survived ? (
                                       <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                                          <CheckCircle size={14} /> Survived
                                       </span>
                                    ) : (
                                       <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                                          <XCircle size={14} /> Decayed @ {event.decayPos?.toFixed(2)}m
                                       </span>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {/* Tab 4: Analysis Notes */}
            {activeTab === 'notes' && (
               <div className="h-full">
                  <textarea
                     className="w-full h-[350px] p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-transparent resize-none font-mono text-sm"
                     placeholder="Record your observations here..."
                     defaultValue={generateNotesTemplate()}
                  />
                  <div className="mt-2 flex justify-between items-center">
                     <span className="text-xs text-slate-400">
                        Context-aware template generated for {config.particle.name}
                     </span>
                     <Button variant="outline" size="sm">
                        Copy to Clipboard
                     </Button>
                  </div>
               </div>
            )}

         </div>
      </Modal>
   );
};

export default ResultsModal;
