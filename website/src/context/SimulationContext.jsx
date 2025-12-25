import React, { createContext, useContext, useReducer, useMemo } from 'react';

// ============================================
// PARTICLE DATABASE (Enhanced with physics info)
// ============================================
export const PARTICLES = {
    pion: {
        type: 'pion',
        name: 'Pion (π⁺)',
        symbol: 'π⁺',
        mass: 0.13957,
        massUnit: '139.57 MeV/c²',
        lifetime: 2.6033e-8,
        lifetimeUnit: '26.0 ns',
        charge: 1,
        color: '#E74C3C',
        decayMode: 'μ⁺ + νμ (99.99%)',
        composition: 'u + d̄ (up + anti-down)',
        description: 'Lightest meson. Ideal for time dilation due to short lifetime.',
        funFact: 'Discovered in 1947 by Cecil Powell using cosmic rays.'
    },
    kaon: {
        type: 'kaon',
        name: 'Kaon (K⁺)',
        symbol: 'K⁺',
        mass: 0.49367,
        massUnit: '493.68 MeV/c²',
        lifetime: 1.2380e-8,
        lifetimeUnit: '12.4 ns',
        charge: 1,
        color: '#3498DB',
        decayMode: 'μ⁺νμ (63%), π⁺π⁰ (21%)',
        composition: 'u + s̄ (up + anti-strange)',
        description: 'Contains strange quark. Key for testing universality.',
        funFact: 'K⁰ mixing led to the discovery of CP violation (Nobel 1980).'
    },
    muon: {
        type: 'muon',
        name: 'Muon (μ⁺)',
        symbol: 'μ⁺',
        mass: 0.10566,
        massUnit: '105.66 MeV/c²',
        lifetime: 2.1969e-6,
        lifetimeUnit: '2.20 μs',
        charge: 1,
        color: '#2ECC71',
        decayMode: 'e⁺ + νₑ + ν̄μ (100%)',
        composition: 'Fundamental lepton (no quarks)',
        description: 'Heavy electron. Used in Rossi-Hall experiment (1941).',
        funFact: 'Muon g-2 anomaly hints at new physics beyond Standard Model!'
    },
    proton: {
        type: 'proton',
        name: 'Proton (p⁺)',
        symbol: 'p⁺',
        mass: 0.93827,
        massUnit: '938.27 MeV/c²',
        lifetime: Infinity,
        lifetimeUnit: 'Stable (>10³⁴ years)',
        charge: 1,
        color: '#9B59B6',
        decayMode: 'None (stable)',
        composition: 'uud (2 up + 1 down)',
        description: 'Stable baryon. No decay, useful for calibration.',
        funFact: 'Proton stability is protected by baryon number conservation.'
    },
    electron: {
        type: 'electron',
        name: 'Electron (e⁻)',
        symbol: 'e⁻',
        mass: 0.000511,
        massUnit: '0.511 MeV/c²',
        lifetime: Infinity,
        lifetimeUnit: 'Stable',
        charge: -1,
        color: '#00BCD4',
        decayMode: 'None (stable)',
        composition: 'Fundamental lepton',
        description: 'Lightest charged lepton. Used at DESY for detector calibration.',
        funFact: 'First subatomic particle discovered (J.J. Thomson, 1897).'
    },
    positron: {
        type: 'positron',
        name: 'Positron (e⁺)',
        symbol: 'e⁺',
        mass: 0.000511,
        massUnit: '0.511 MeV/c²',
        lifetime: Infinity,
        lifetimeUnit: 'Stable (until annihilation)',
        charge: 1,
        color: '#FF9800',
        decayMode: 'e⁺e⁻ → 2γ (annihilation)',
        composition: 'Antiparticle of electron',
        description: 'Antimatter electron. Annihilates with electrons into photons.',
        funFact: 'First antiparticle discovered (Carl Anderson, 1932).'
    },
    photon: {
        type: 'photon',
        name: 'Photon (γ)',
        symbol: 'γ',
        mass: 0,
        massUnit: '0 (massless)',
        lifetime: Infinity,
        lifetimeUnit: 'Stable',
        charge: 0,
        color: '#FFEB3B',
        decayMode: 'None (stable)',
        composition: 'Gauge boson (force carrier)',
        description: 'Massless. Travels at exactly c. Used in photoproduction at ELSA.',
        funFact: 'Wave-particle duality first demonstrated with photon (Einstein, 1905).'
    }
};

const C = 299792458; // Speed of light in m/s

// ============================================
// PHYSICS CALCULATIONS (Pure Functions)
// ============================================
export const calculateKinematics = (momentum, mass) => {
    // E² = p² + m²
    const energy = Math.sqrt(momentum * momentum + mass * mass);
    // β = v/c = p/E
    const beta = momentum / energy;
    // γ = E/m = 1/√(1-β²)
    const gamma = energy / mass;
    return { energy, beta, gamma };
};

export const calculateDecayLength = (beta, gamma, lifetime) => {
    // λ = βcγτ₀
    return beta * C * gamma * lifetime;
};

export const calculateLabLifetime = (gamma, properLifetime) => {
    // τ_lab = γ × τ₀
    return gamma * properLifetime;
};

// ============================================
// INITIAL STATE
// ============================================
const createInitialState = () => {
    const particle = PARTICLES.pion;
    const momentum = 8; // GeV/c
    const { energy, beta, gamma } = calculateKinematics(momentum, particle.mass);
    const decayLength = calculateDecayLength(beta, gamma, particle.lifetime);
    const labLifetime = calculateLabLifetime(gamma, particle.lifetime);

    return {
        // Particle selection
        particle,

        // Beam parameters
        beam: {
            momentum,
            intensity: 10000,
        },

        // Beamline geometry
        beamline: {
            length: 15, // meters
        },

        // Active detectors
        detectors: {
            tof1: true,
            scintillator: true,
            cherenkov: true,
            tof2: true,
        },

        // Physics settings
        physics: {
            decayEnabled: true,
            magneticField: 0, // Tesla
            showSecondaries: false,
        },

        // Analysis settings
        analysis: {
            mode: 'single', // 'single', 'continuous', 'event-by-event'
            targetEvents: 10000,
            showErrorBars: true,
            fitCurve: true,
            normalize: true,
        },

        // RNG seed for reproducibility
        rngSeed: Math.floor(Date.now() / 1000),

        // Detector response (toy model)
        detectorResponse: {
            enabled: false,
            efficiency: 0.95,
            timingResolution: 50e-12, // 50 ps
            energyLoss: false,
        },

        // Derived physics values (auto-calculated)
        derived: {
            energy,
            beta,
            gamma,
            decayLength,
            labLifetime,
            expectedSurvival: Math.exp(-15 / decayLength), // For default 15m beamline
        },

        // Simulation state
        simulation: {
            running: false,
            progress: 0,
            results: null,
            error: null,
        },

        // Active preset (for UI highlighting)
        activePreset: 'time-dilation',
    };
};

// ============================================
// ACTION TYPES
// ============================================
const ActionTypes = {
    SET_PARTICLE: 'SET_PARTICLE',
    SET_MOMENTUM: 'SET_MOMENTUM',
    SET_BEAM_INTENSITY: 'SET_BEAM_INTENSITY',
    SET_BEAMLINE_LENGTH: 'SET_BEAMLINE_LENGTH',
    TOGGLE_DETECTOR: 'TOGGLE_DETECTOR',
    SET_PHYSICS_DECAY: 'SET_PHYSICS_DECAY',
    SET_MAGNETIC_FIELD: 'SET_MAGNETIC_FIELD',
    SET_ANALYSIS_MODE: 'SET_ANALYSIS_MODE',
    SET_TARGET_EVENTS: 'SET_TARGET_EVENTS',
    TOGGLE_ANALYSIS_OPTION: 'TOGGLE_ANALYSIS_OPTION',
    SET_RNG_SEED: 'SET_RNG_SEED',
    SET_DETECTOR_RESPONSE: 'SET_DETECTOR_RESPONSE',
    LOAD_PRESET: 'LOAD_PRESET',
    START_SIMULATION: 'START_SIMULATION',
    UPDATE_PROGRESS: 'UPDATE_PROGRESS',
    COMPLETE_SIMULATION: 'COMPLETE_SIMULATION',
    SIMULATION_ERROR: 'SIMULATION_ERROR',
    RESET_SIMULATION: 'RESET_SIMULATION',
};

// ============================================
// REDUCER
// ============================================
const recalculateDerived = (state) => {
    const { beta, gamma, energy } = calculateKinematics(
        state.beam.momentum,
        state.particle.mass
    );
    const decayLength = calculateDecayLength(beta, gamma, state.particle.lifetime);
    const labLifetime = calculateLabLifetime(gamma, state.particle.lifetime);
    const expectedSurvival = state.particle.lifetime === Infinity
        ? 1
        : Math.exp(-state.beamline.length / decayLength);

    return {
        ...state,
        derived: {
            energy,
            beta,
            gamma,
            decayLength,
            labLifetime,
            expectedSurvival,
        }
    };
};

const simulationReducer = (state, action) => {
    let newState;

    switch (action.type) {
        case ActionTypes.SET_PARTICLE:
            newState = {
                ...state,
                particle: PARTICLES[action.payload],
                activePreset: null, // Clear preset when manually changing
            };
            return recalculateDerived(newState);

        case ActionTypes.SET_MOMENTUM:
            newState = {
                ...state,
                beam: { ...state.beam, momentum: action.payload },
                activePreset: null,
            };
            return recalculateDerived(newState);

        case ActionTypes.SET_BEAM_INTENSITY:
            return {
                ...state,
                beam: { ...state.beam, intensity: action.payload },
            };

        case ActionTypes.SET_BEAMLINE_LENGTH:
            newState = {
                ...state,
                beamline: { ...state.beamline, length: action.payload },
                activePreset: null,
            };
            return recalculateDerived(newState);

        case ActionTypes.TOGGLE_DETECTOR:
            return {
                ...state,
                detectors: {
                    ...state.detectors,
                    [action.payload]: !state.detectors[action.payload],
                },
                activePreset: null,
            };

        case ActionTypes.SET_PHYSICS_DECAY:
            return {
                ...state,
                physics: { ...state.physics, decayEnabled: action.payload },
            };

        case ActionTypes.SET_MAGNETIC_FIELD:
            return {
                ...state,
                physics: { ...state.physics, magneticField: action.payload },
                activePreset: null,
            };

        case ActionTypes.SET_ANALYSIS_MODE:
            return {
                ...state,
                analysis: { ...state.analysis, mode: action.payload },
            };

        case ActionTypes.SET_TARGET_EVENTS:
            return {
                ...state,
                analysis: { ...state.analysis, targetEvents: action.payload },
            };

        case ActionTypes.TOGGLE_ANALYSIS_OPTION:
            return {
                ...state,
                analysis: {
                    ...state.analysis,
                    [action.payload]: !state.analysis[action.payload],
                },
            };

        case ActionTypes.SET_RNG_SEED:
            return {
                ...state,
                rngSeed: action.payload,
            };

        case ActionTypes.SET_DETECTOR_RESPONSE:
            return {
                ...state,
                detectorResponse: action.payload,
            };

        case ActionTypes.LOAD_PRESET:
            const preset = action.payload;
            newState = {
                ...state,
                particle: PARTICLES[preset.particle],
                beam: {
                    momentum: preset.momentum,
                    intensity: preset.beamIntensity,
                },
                beamline: {
                    length: preset.beamlineLength,
                },
                detectors: { ...preset.detectors },
                physics: {
                    decayEnabled: preset.physics.decayEnabled,
                    magneticField: state.physics.magneticField,
                    showSecondaries: false,
                },
                activePreset: preset.id,
            };
            return recalculateDerived(newState);

        case ActionTypes.START_SIMULATION:
            return {
                ...state,
                simulation: {
                    running: true,
                    progress: 0,
                    results: null,
                    error: null,
                },
            };

        case ActionTypes.UPDATE_PROGRESS:
            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    progress: action.payload,
                },
            };

        case ActionTypes.COMPLETE_SIMULATION:
            return {
                ...state,
                simulation: {
                    running: false,
                    progress: 100,
                    results: action.payload,
                    error: null,
                },
            };

        case ActionTypes.SIMULATION_ERROR:
            return {
                ...state,
                simulation: {
                    running: false,
                    progress: 0,
                    results: null,
                    error: action.payload,
                },
            };

        case ActionTypes.RESET_SIMULATION:
            return {
                ...state,
                simulation: {
                    running: false,
                    progress: 0,
                    results: null,
                    error: null,
                },
            };

        default:
            return state;
    }
};

// ============================================
// CONTEXT
// ============================================
const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(simulationReducer, null, createInitialState);

    // Memoized action creators
    const actions = useMemo(() => ({
        setParticle: (type) => dispatch({ type: ActionTypes.SET_PARTICLE, payload: type }),
        setMomentum: (p) => dispatch({ type: ActionTypes.SET_MOMENTUM, payload: p }),
        setBeamIntensity: (n) => dispatch({ type: ActionTypes.SET_BEAM_INTENSITY, payload: n }),
        setBeamlineLength: (l) => dispatch({ type: ActionTypes.SET_BEAMLINE_LENGTH, payload: l }),
        toggleDetector: (name) => dispatch({ type: ActionTypes.TOGGLE_DETECTOR, payload: name }),
        setDecayEnabled: (enabled) => dispatch({ type: ActionTypes.SET_PHYSICS_DECAY, payload: enabled }),
        setMagneticField: (B) => dispatch({ type: ActionTypes.SET_MAGNETIC_FIELD, payload: B }),
        setAnalysisMode: (mode) => dispatch({ type: ActionTypes.SET_ANALYSIS_MODE, payload: mode }),
        setTargetEvents: (n) => dispatch({ type: ActionTypes.SET_TARGET_EVENTS, payload: n }),
        toggleAnalysisOption: (opt) => dispatch({ type: ActionTypes.TOGGLE_ANALYSIS_OPTION, payload: opt }),
        setRngSeed: (seed) => dispatch({ type: ActionTypes.SET_RNG_SEED, payload: seed }),
        setDetectorResponse: (config) => dispatch({ type: ActionTypes.SET_DETECTOR_RESPONSE, payload: config }),
        loadPreset: (preset) => dispatch({ type: ActionTypes.LOAD_PRESET, payload: preset }),
        startSimulation: () => dispatch({ type: ActionTypes.START_SIMULATION }),
        updateProgress: (p) => dispatch({ type: ActionTypes.UPDATE_PROGRESS, payload: p }),
        completeSimulation: (results) => dispatch({ type: ActionTypes.COMPLETE_SIMULATION, payload: results }),
        simulationError: (err) => dispatch({ type: ActionTypes.SIMULATION_ERROR, payload: err }),
        resetSimulation: () => dispatch({ type: ActionTypes.RESET_SIMULATION }),
    }), []);

    const value = useMemo(() => ({ state, actions, dispatch }), [state, actions]);

    return (
        <SimulationContext.Provider value={value}>
            {children}
        </SimulationContext.Provider>
    );
};

// ============================================
// HOOK
// ============================================
export const useSimulationContext = () => {
    const context = useContext(SimulationContext);
    if (!context) {
        throw new Error('useSimulationContext must be used within a SimulationProvider');
    }
    return context;
};

export default SimulationContext;
