import { useCallback } from 'react';
import { useSimulationContext, calculateKinematics, calculateDecayLength } from '../context/SimulationContext';

const C = 299792458; // Speed of light in m/s

/**
 * Enhanced Physics Engine with proper Monte Carlo simulation
 */
class PhysicsEngine {
  constructor(state) {
    this.particle = state.particle;
    this.momentum = state.beam.momentum;
    this.intensity = state.beam.intensity;
    this.beamLength = state.beamline.length;
    this.decayEnabled = state.physics.decayEnabled;
    this.magneticField = state.physics.magneticField;
  }

  /**
   * Relativistic kinematics for any particle
   */
  kinematics(p, mass) {
    const energy = Math.sqrt(p * p + mass * mass);
    const beta = p / energy;
    const gamma = energy / mass;
    return { energy, beta, gamma };
  }

  /**
   * Sample momentum with Gaussian spread (~1% resolution)
   * Using Box-Muller transform for proper Gaussian
   */
  sampleMomentum() {
    const u1 = Math.random();
    const u2 = Math.random();
    const sigma = this.momentum * 0.01; // 1% resolution
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return this.momentum + sigma * z;
  }

  /**
   * Sample decay position using inverse transform sampling
   * Decay probability: P(x) = exp(-x / λ) where λ = βcγτ₀
   */
  sampleDecayPosition(beta, gamma, lifetime) {
    if (lifetime === Infinity) return Infinity; // Stable particle

    const decayLength = beta * C * gamma * lifetime;
    const u = Math.random();
    // Inverse transform: x = -λ * ln(U)
    return -decayLength * Math.log(u);
  }

  /**
   * Calculate Time of Flight in nanoseconds
   */
  calculateTOF(beta, distance) {
    return (distance / (beta * C)) * 1e9; // Convert to nanoseconds
  }

  /**
   * Calculate Larmor radius for magnetic deflection
   * r = p / (qB) in SI units, with p in GeV/c
   */
  calculateLarmorRadius(momentum, B) {
    if (B === 0) return Infinity;
    // Convert momentum from GeV/c to SI: p_SI = p_GeV * 1.6e-10 / c
    // r = p / (qB) = (p_GeV * 1e9 * 1.6e-19) / (1.6e-19 * B * c)
    // Simplifies to: r = p_GeV * 1e9 / (B * c) ≈ p_GeV * 3.336 / B
    return (momentum * 3.33564) / B; // meters
  }

  /**
   * Run Monte Carlo simulation
   */
  run(onProgress) {
    const nEvents = Math.min(this.intensity, 50000); // Cap for performance
    const events = [];
    const stats = {
      total: nEvents,
      survived: 0,
      decayed: 0,
      meanBeta: 0,
      meanGamma: 0,
      meanTOF: 0,
    };

    let sumBeta = 0;
    let sumGamma = 0;
    let sumTOF = 0;

    for (let i = 0; i < nEvents; i++) {
      // Sample momentum
      const p = this.sampleMomentum();

      // Calculate kinematics for this particle
      const { energy, beta, gamma } = this.kinematics(p, this.particle.mass);

      // Sample decay position
      let decayPos = Infinity;
      if (this.decayEnabled && this.particle.lifetime !== Infinity) {
        decayPos = this.sampleDecayPosition(beta, gamma, this.particle.lifetime);
      }

      // Determine if particle survives
      const survived = decayPos > this.beamLength;

      // Calculate TOF (only for surviving particles reaching end)
      const tof = this.calculateTOF(beta, this.beamLength);

      // Larmor radius (for magnetic field visualization)
      const larmorRadius = this.calculateLarmorRadius(p, this.magneticField);

      // Update stats
      if (survived) stats.survived++;
      else stats.decayed++;

      sumBeta += beta;
      sumGamma += gamma;
      sumTOF += tof;

      // Store event (limit to 500 for UI performance)
      if (i < 500) {
        events.push({
          id: i,
          momentum: p,
          energy,
          beta,
          gamma,
          decayPos: survived ? null : decayPos,
          survived,
          tof,
          larmorRadius,
        });
      }

      // Report progress every 1000 events
      if (onProgress && i % 1000 === 0) {
        onProgress(Math.round((i / nEvents) * 100));
      }
    }

    // Calculate averages
    stats.meanBeta = sumBeta / nEvents;
    stats.meanGamma = sumGamma / nEvents;
    stats.meanTOF = sumTOF / nEvents;
    stats.survivalRate = stats.survived / stats.total;

    // Theoretical expectation
    const { beta, gamma } = this.kinematics(this.momentum, this.particle.mass);
    const theoreticalDecayLength = calculateDecayLength(beta, gamma, this.particle.lifetime);
    stats.theoreticalSurvival = this.particle.lifetime === Infinity
      ? 1
      : Math.exp(-this.beamLength / theoreticalDecayLength);
    stats.theoreticalDecayLength = theoreticalDecayLength;

    // Generate decay curve data points
    const curveData = this.generateDecayCurve(beta, gamma);

    return {
      events,
      stats,
      curveData,
      config: {
        particle: this.particle,
        momentum: this.momentum,
        beamLength: this.beamLength,
        magneticField: this.magneticField,
        decayEnabled: this.decayEnabled,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate theoretical decay curve points
   */
  generateDecayCurve(beta, gamma) {
    const points = [];
    const decayLength = calculateDecayLength(beta, gamma, this.particle.lifetime);

    for (let x = 0; x <= this.beamLength; x += this.beamLength / 20) {
      const survival = this.particle.lifetime === Infinity
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
}

/**
 * Custom hook for running simulations with the context
 */
export const useSimulation = () => {
  const { state, actions } = useSimulationContext();

  const runSimulation = useCallback(async () => {
    if (state.simulation.running) return;

    actions.startSimulation();

    // Run simulation in chunks to keep UI responsive
    const engine = new PhysicsEngine(state);

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
      const results = engine.run((p) => {
        actions.updateProgress(p);
      });

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
      let csv = 'Event ID,Momentum (GeV/c),Beta,Gamma,TOF (ns),Survived,Decay Position (m)\n';
      results.events.forEach(e => {
        csv += `${e.id},${e.momentum.toFixed(4)},${e.beta.toFixed(6)},${e.gamma.toFixed(2)},${e.tof.toFixed(3)},${e.survived},${e.decayPos?.toFixed(2) || 'N/A'}\n`;
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

export default useSimulation;
