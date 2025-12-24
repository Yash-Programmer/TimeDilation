# Time Dilation Universality Experiment - GEANT4 Simulation

## Overview

Complete GEANT4 simulation of the pion-kaon time dilation universality experiment testing whether time dilation is mass-independent by comparing π+ and K+ decay-in-flight at fixed momentum (8 GeV/c).

**Key Features:**
- Full beamline geometry (15 m flight path, configurable Station 2 position)
- RICH detectors (C₄F₁₀ radiator, Cherenkov angle measurement)
- EM calorimeter (20-layer Pb-scintillator sandwich)
- Drift wire chambers (track reconstruction)
- Scintillator trigger system
- Complete physics: decay, EM, optical (Cherenkov), hadronic
- ROOT data acquisition with 31-column ntuple
- Particle ID algorithm (β measurement, topology, energy deposition)

## Building

### Prerequisites
- GEANT4 11.x (with Qt visualization, ROOT support)
- CMake 3.16+
- ROOT 6.x
- C++17 compiler

### Build Instructions

```bash
cd TimeDilationSim
mkdir build
cd build
cmake ..
make -j4
```

## Running

### Interactive Mode (Visualization)
```bash
./TimeDilationSim
# Opens Qt window with 3D geometry view
# Particle tracks colored: π+ (red), K+ (blue), μ+ (green)
```

### Batch Mode (Production Runs)
```bash
# Station 2 at 0 m (reference)
./TimeDilationSim run_x0.mac

# Station 2 at 5 m
./TimeDilationSim run_x5.mac

# Station 2 at 10 m
./TimeDilationSim run_x10.mac

# Station 2 at 15 m
./TimeDilationSim run_x15.mac
```

**Output:** ROOT files `TimeDilation_Run{0,1,2,3}.root` in `output/`

## Analysis

Python scripts in `analysis/`:

```bash
cd ../analysis

# Extract survival curves
python analyze_decay.py --position 0 5 10 15

# Plot S_π(x) and S_K(x)
python plot_survival_curves.py

# Particle ID performance
python plot_particle_id.py

# 3D event visualization
python plot_3d_events.py --event-id 123 456 789
```

## Physics Parameters

**Beam:**
- Momentum: 8.0 ± 0.1 GeV/c (Gaussian)
- Composition: 95% π+, 5% K+
- Spot size: σ = 1 cm
- Angular divergence: σ_θ = 2 mrad

**Decay Lengths (8 GeV/c):**
- π+: λ = 447 m (γ = 57.3)
- K+: λ = 60 m (γ = 16.2)
- μ+: λ = 49,900 m (calibration reference)

**Expected Decay Fractions @ 15 m:**
- Pions: 3.3%
- Kaons: 22.1%
- Muons: 0.03% (negligible)

## ROOT Ntuple Structure

| Column | Type | Description |
|--------|------|-------------|
| EventID | Int | Event number |
| PrimaryPDG | Int | 211 (π+) or 321 (K+) |
| PrimaryMom | Double | Momentum (GeV/c) |
| RICH1_Beta, RICH2_Beta | Double | Measured β |
| Calo_TotalE | Double | Energy (GeV) |
| SC1_Hit, SC2_Hit | Int | Trigger flags |
| Decayed | Int | Decay occurred |
| DecayPosX/Y/Z | Double | Decay vertex (cm) |
| Survived | Int | Reached Station 2 |

Full schema: 31 columns (see RunAction.cc)

## Validation Tests

Run automated checks:
```bash
# Geometry (no overlaps)
./TimeDilationSim vis.mac

# Particle lifetimes
python analysis/check_lifetimes.py

# RICH resolution
python analysis/validate_rich.py

# Survival curves
python analysis/analyze_decay.py --position 15
```

**Expected Results:**
- τ_π = 26.03 ± 0.05 ns
- τ_K = 12.38 ± 0.08 ns
- S_π(15m) = 0.967 ± 0.010
- S_K(15m) = 0.779 ± 0.030
- χ²/dof ≈ 1.0 for universality test

## File Structure

```
TimeDilationSim/
├── CMakeLists.txt
├── README.md
├── TimeDilationSim.cc        # Main program
├── vis.mac, run.mac          # Macros
├── include/                  # Headers
│   ├── DetectorConstruction.hh
│   ├── PhysicsList.hh
│   ├── PrimaryGeneratorAction.hh
│   ├── ActionInitialization.hh
│   ├── RunAction.hh
│   ├── EventAction.hh
│   └── SteppingAction.hh
├── src/                      # Implementation
├── analysis/                 # Python scripts
│   ├── analyze_decay.py
│   ├── plot_survival_curves.py
│   ├── plot_particle_id.py
│   └── plot_3d_events.py
└── output/                   # ROOT files
```

## Citation

Based on: "Testing the Universality of Time Dilation: A Pion-Kaon Comparative Study"  
CERN Beamline for Schools 2026 Proposal

## License

Educational use for physics research.
