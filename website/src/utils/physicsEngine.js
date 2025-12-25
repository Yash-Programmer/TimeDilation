// ============================================
// SEEDED RANDOM NUMBER GENERATOR
// ============================================
// Mulberry32 PRNG for reproducible simulations
function mulberry32(seed) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Box-Muller transform for Gaussian random numbers
function gaussianRandom(mean = 0, sigma = 1, rng) {
    const u1 = rng();
    const u2 = rng();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z0 * sigma;
}

// ============================================
// CONSTANTS
// ============================================
const C = 299792458; // m/s
const HBAR = 6.582119569e-25; // GeV s

// Particle Properties (Mass in GeV/c^2, Lifetime in seconds)
export const PARTICLES = {
    pion: { mass: 0.13957, lifetime: 2.6033e-8, name: 'Pion (π+)' },
    kaon: { mass: 0.49367, lifetime: 1.2380e-8, name: 'Kaon (K+)' },
    muon: { mass: 0.10566, lifetime: 2.1969e-6, name: 'Muon (μ+)' },
    proton: { mass: 0.93827, lifetime: Infinity, name: 'Proton (p+)' } // Stable
};

export class PhysicsEngine {
    constructor(params) {
        this.params = params; // { particleType, momentum, beamLength, count, ... }

        // Initialize seeded RNG for reproducibility
        this.seed = params.seed || Date.now();
        this.rng = mulberry32(this.seed);

        // Detector response parameters (optional toy model)
        this.detectorResponse = {
            enabled: params.detectorResponse?.enabled || false,
            efficiency: params.detectorResponse?.efficiency || 0.95,
            timingResolution: params.detectorResponse?.timingResolution || 50e-12, // 50 ps
            energyLoss: params.detectorResponse?.energyLoss || false
        };
    }

    // Relativistic Calculations
    calculateKinematics(momentum, mass) {
        const energy = Math.sqrt(momentum ** 2 + mass ** 2);
        const beta = momentum / energy;
        const gamma = energy / mass;
        return { beta, gamma, energy };
    }

    // Run Monte Carlo Simulation
    run() {
        const { particleType, momentum, beamLength, beamIntensity } = this.params;
        const particle = PARTICLES[particleType];

        // Count represents number of particles to simulate (scaled down for performance if needed)
        // If intensity is 10,000, we simulate 10,000 events
        const N = beamIntensity || 1000;

        const results = {
            events: [],
            stats: {
                total: N,
                survived: 0,
                decayed: 0,
                meanBeta: 0,
                meanGamma: 0
            }
        };

        const kinematics = this.calculateKinematics(momentum, particle.mass);
        results.stats.meanBeta = kinematics.beta;
        results.stats.meanGamma = kinematics.gamma;

        // Proper decay length (lambda = beta * c * gamma * tau)
        const decayLength = kinematics.beta * C * kinematics.gamma * particle.lifetime;

        for (let i = 0; i < N; i++) {
            // 1. Generate Gaussian momentum spread (simulating real beam)
            // Sigma approx 1% of momentum
            const p = momentum * (1 + (this.rng() + this.rng() + this.rng() - 1.5) * 0.02);

            // Re-calculate kinematics for this specific particle
            const k = this.calculateKinematics(p, particle.mass);

            // 2. Determine Decay
            // Probability of surviving distance x: P(x) = exp(-x / lambda)
            // Inverse transform sampling: x_decay = -lambda * ln(U), where U is uniform(0,1)
            // Correct lambda for this specific particle's momentum
            const lambda = k.beta * C * k.gamma * particle.lifetime;

            // Random decay position
            const decayPos = particle.lifetime === Infinity ? Infinity : -lambda * Math.log(this.rng());

            const survived = decayPos > beamLength;

            // Apply detector response if enabled
            let detected = survived; // Start with survival status
            let measuredTOF = beamLength / (k.beta * C) * 1e9; // ns
            let tofUncertainty = 0;

            if (this.detectorResponse.enabled && survived) {
                // 1. Detection efficiency - probabilistic hit
                if (this.rng() > this.detectorResponse.efficiency) {
                    detected = false; // Particle not detected
                }

                // 2. Timing resolution - Gaussian smearing
                if (detected) {
                    const tofNoise = gaussianRandom(0, this.detectorResponse.timingResolution, this.rng);
                    measuredTOF += tofNoise * 1e9; // Add noise in nanoseconds
                    tofUncertainty = this.detectorResponse.timingResolution * 1e9;
                }
            }

            if (survived) results.stats.survived++;
            else results.stats.decayed++;

            // Count detected events separately
            if (detected && this.detectorResponse.enabled) {
                results.stats.detected = (results.stats.detected || 0) + 1;
            }

            // 3. Generate "Hit" Data
            // Store limited events for the table to avoid memory issues
            if (i < 200) {
                results.events.push({
                    id: i,
                    momentum: p,
                    beta: k.beta,
                    gamma: k.gamma,
                    decayPos: survived ? null : decayPos,
                    survived: survived,
                    detected: this.detectorResponse.enabled ? detected : survived,
                    tof: measuredTOF,
                    tofUncertainty: tofUncertainty
                });
            }
        }

        // Calculate expected survival for comparison
        results.stats.expectedSurvival = Math.exp(-beamLength / decayLength);

        // Calculate observed survival rate
        results.stats.survivalRate = results.stats.survived / results.stats.total;

        // Include seed for reproducibility
        results.seed = this.seed;
        results.detectorResponseEnabled = this.detectorResponse.enabled;

        return results;
    }
}
