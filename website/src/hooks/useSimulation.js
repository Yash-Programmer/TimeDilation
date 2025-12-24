import { useState, useCallback } from 'react';
import { PhysicsEngine } from '../utils/physicsEngine';

export const useSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  // Simulation Parameters
  const [params, setParams] = useState({
    particleType: 'pion',
    momentum: 8,
    beamIntensity: 10000,
    beamLength: 15,
    detectors: {
      tof1: true,
      scint: true,
      cherenkov: true,
      tof2: true
    },
    physics: {
      decay: true,
      magneticField: 0
    }
  });

  const updateParam = (section, key, value) => {
    setParams(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateRootParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const runSimulation = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setProgress(0);
    setResults(null);

    // Run simulation in chunks to allow UI updates
    const engine = new PhysicsEngine(params);

    // Simulate "Running" process
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);

      if (p >= 100) {
        clearInterval(interval);

        // Execute Physics Calculations
        const simResults = engine.run();

        setResults({
          stats: simResults.stats,
          data: simResults.events,
          timestamp: new Date().toISOString(),
          config: params
        });

        setIsRunning(false);
      }
    }, 20);

  }, [isRunning, params]);

  return {
    isRunning,
    progress,
    results,
    params,
    updateParam,
    updateRootParam,
    runSimulation
  };
};
