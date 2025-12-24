import { useState, useCallback } from 'react';
import { geant4Data, getStats } from '../data/geant4Data';

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

  const runSimulation = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    setProgress(0);
    setResults(null);

    // Simulate "Running" process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          // Generate fake results based on params
          setResults({
            stats: getStats(),
            data: geant4Data.slice(0, 50), // Sample
            timestamp: new Date().toISOString()
          });
          return 100;
        }
        return prev + 1; // 2 seconds total roughly
      });
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
