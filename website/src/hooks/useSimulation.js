import { useCallback } from 'react';
import { useSimulationContext, calculateKinematics, calculateDecayLength } from '../context/SimulationContext';
import { PhysicsEngine } from '../utils/physicsEngine';

const C = 299792458; // Speed of light in m/s

/**
 * Custom hook for running simulations with the context
 */
export const useSimulation = () => {
  const { state, actions } = useSimulationContext();

  const runSimulation = useCallback(async () => {
    if (state.simulation.running) return;

    actions.startSimulation();

    // Prepare simulation parameters
    const params = {
      particleType: state.particle.type,
      momentum: state.beam.momentum,
      beamLength: state.beamline.length,
      beamIntensity: state.beam.intensity,
      decayEnabled: state.physics.decayEnabled,
      magneticField: state.physics.magneticField,
      seed: state.rngSeed,
      detectorResponse: state.detectorResponse,
    };

    // Run simulation in chunks to keep UI responsive
    const engine = new PhysicsEngine(params);

    // Simulate progress (the actual calculation is fast)
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      if (progress <= 90) {
        actions.updateProgress(progress);
      }
    }, 50);

    // Run after a small delay to let UI update
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const rawResults = engine.run();

      // Generate decay curve data
      const { beta, gamma } = calculateKinematics(state.beam.momentum, state.particle.mass);
      const decayLength = calculateDecayLength(beta, gamma, state.particle.lifetime);
      const curveData = generateDecayCurve(state.particle, state.beamline.length, beta, gamma, decayLength);

      // Enhance results with configuration and curve data
      const results = {
        ...rawResults,
        curveData,
        config: {
          particle: state.particle,
          momentum: state.beam.momentum,
          beamLength: state.beamline.length,
          magneticField: state.physics.magneticField,
          decayEnabled: state.physics.decayEnabled,
          seed: state.rngSeed,
          detectorResponse: state.detectorResponse,
        },
        timestamp: new Date().toISOString(),
      };

      clearInterval(progressInterval);
      actions.updateProgress(100);

      // Small delay before completing for visual feedback
      await new Promise(resolve => setTimeout(resolve, 200));
      actions.completeSimulation(results);

    } catch (error) {
      clearInterval(progressInterval);
      actions.simulationError(error.message);
    }
  }, [state, actions]);

  const exportResults = useCallback((format = 'csv') => {
    const results = state.simulation.results;
    if (!results) return null;

    if (format === 'csv') {
      let csv = 'Event ID,Momentum (GeV/c),Beta,Gamma,TOF (ns),Survived,Detected,Decay Position (m),Seed\\n';
      csv += `# RNG Seed: ${results.seed}\\n`;
      csv += `# Detector Response: ${results.detectorResponseEnabled ? 'Enabled' : 'Disabled'}\\n`;
      results.events.forEach(e => {
        csv += `${e.id},${e.momentum.toFixed(4)},${e.beta.toFixed(6)},${e.gamma.toFixed(2)},${e.tof.toFixed(3)},${e.survived},${e.detected || e.survived},${e.decayPos?.toFixed(2) || 'N/A'},${results.seed}\\n`;
      });
      return csv;
    } else if (format === 'json') {
      return JSON.stringify(results, null, 2);
    }
    return null;
  }, [state.simulation.results]);


  const downloadResults = useCallback((format = 'csv') => {
    const data = exportResults(format);
    if (!data) return;

    const blob = new Blob([data], {
      type: format === 'csv' ? 'text/csv' : 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulation_results_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportResults]);

  return {
    state,
    actions,
    runSimulation,
    exportResults,
    downloadResults,
    isRunning: state.simulation.running,
    progress: state.simulation.progress,
    results: state.simulation.results,
  };
};

/**
 * Generate theoretical decay curve points
 */
function generateDecayCurve(particle, beamLength, beta, gamma, decayLength) {
  const points = [];

  for (let x = 0; x <= beamLength; x += beamLength / 20) {
    const survival = particle.lifetime === Infinity
      ? 1
      : Math.exp(-x / decayLength);
    points.push({
      distance: parseFloat(x.toFixed(2)),
      survival: parseFloat(survival.toFixed(4)),
      survivalPercent: parseFloat((survival * 100).toFixed(2)),
    });
  }

  return points;
}

export default useSimulation;
