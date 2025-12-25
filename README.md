<h1 align="center">⏱️ Time Dilation Experiment</h1>

<p align="center">
  <strong>Testing the Universality of Time Dilation: A Pion-Kaon Comparative Study</strong><br/>
  <em>CERN Beamline for Schools 2025 Proposal</em>
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#the-team">The Team</a> •
  <a href="#repository-structure">Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#features">Features</a> •
  <a href="#license">License</a>
</p>

---

## Overview

This repository contains the complete proposal, simulation, and interactive web application for our BL4S 2025 experiment: **Testing whether time dilation is truly universal across different particle species**.

We measure and compare the dilated lifetimes of π+ (pions) and K+ (kaons) at fixed momentum (8 GeV/c), testing Einstein's prediction that the Lorentz factor γ—and thus time dilation—depends only on velocity, not on the particle's mass or internal structure.

### Key Components

| Component | Description |
|-----------|-------------|
| **LaTeX Proposal** | Full scientific proposal with equations, figures, and methodology |
| **GEANT4 Simulation** | High-fidelity C++ particle physics simulation with complete detector geometry |
| **React Web App** | Interactive simulator, learning modules, and team showcase |
| **Analysis Scripts** | Python tools for survival curves, particle ID, and 3D visualization |
| **Publication Figures** | 17 research-quality plots and visualizations |

---

## The Team

We are **The Relativists**, a global team of 8 passionate students from India, Canada, and Kazakhstan, united by our love for particle physics and our drive to test fundamental physics at CERN.

| Name | Role | Location |
|------|------|----------|
| **Yash Varshney** 👑 | Project Lead & Simulation Developer | India 🇮🇳 |
| Toshani Sharma | Theory & Simulation | Canada 🇨🇦 |
| Prithvi Sinha | Detector Hardware & Electronics | India 🇮🇳 |
| Lakshya Mina | Data Analysis & Statistics | India 🇮🇳 |
| Aisun Slambekova | International Collaboration | Kazakhstan 🇰🇿 |
| Yenlik Slambekova | Documentation & Leadership | Kazakhstan 🇰🇿 |
| Tranav Tyagi | GEANT4 Validation | India 🇮🇳 |
| Aayushi Maurya | Visual Design & Communication | India 🇮🇳 |

---

## Repository Structure

```
TimeDilation/
├── LICENSE                          # Apache 2.0
├── README.md                        # ← You are here
├── latex.tex / latex.pdf            # Full LaTeX proposal
├── proposal.md                      # Human-readable proposal
├── SIMULATION_VALIDATION.md         # Physics validation notes
│
├── TimeDilationSim/                 # 🔬 GEANT4 Simulation
│   ├── CMakeLists.txt               # Build configuration
│   ├── TimeDilationSim.cc           # Main entry point
│   ├── include/                     # C++ headers (9 files)
│   │   ├── DetectorConstruction.hh  # Full beamline geometry
│   │   ├── PhysicsList.hh           # Decay, EM, optical physics
│   │   ├── EventAction.hh           # Event-level data recording
│   │   └── PhysicsConstants.hh      # PDG values, beam parameters
│   ├── src/                         # C++ sources (8 files)
│   │   ├── DetectorConstruction.cc  # 15m beamline, RICH, calorimeter
│   │   ├── PrimaryGeneratorAction.cc# 8 GeV/c π+/K+ beam
│   │   └── SteppingAction.cc        # Decay vertex tracking
│   ├── analysis/                    # Python analysis (31 scripts)
│   │   ├── analyze_decay.py         # Survival probability extraction
│   │   ├── plot_survival_curves.py  # S_π(x) vs S_K(x) comparison
│   │   ├── plot_particle_id.py      # β-based PID performance
│   │   ├── generate_all_figures.py  # Publication figure generation
│   │   └── validate_physics.py      # τ_π, τ_K lifetime validation
│   ├── run_x{0,5,10,15}.mac         # Batch run macros
│   └── output/                      # ROOT/CSV output files
│
├── website/                         # 🌐 React Web Application
│   ├── package.json                 # Dependencies (React, Framer Motion, etc.)
│   ├── vite.config.js               # Vite bundler config
│   ├── tailwind.config.cjs          # Tailwind CSS configuration
│   ├── src/
│   │   ├── pages/                   # 7 main pages
│   │   │   ├── Home.jsx             # Landing with parallax effects
│   │   │   ├── Simulator.jsx        # Interactive physics simulator
│   │   │   ├── Learn.jsx            # 30+ educational modules
│   │   │   ├── Team.jsx             # Team showcase with animations
│   │   │   ├── Proposal.jsx         # Embedded LaTeX proposal
│   │   │   ├── Help.jsx             # Comprehensive documentation
│   │   │   └── Supplementary.jsx    # GEANT4 figures, CAD, data
│   │   ├── components/              # 22+ React components
│   │   │   ├── simulation/          # 3D viewport, control panel
│   │   │   ├── navigation/          # Navbar, Layout, Footer
│   │   │   ├── learn/               # Flashcards, infographics
│   │   │   └── common/              # Shared UI components
│   │   ├── data/                    # Content & configuration
│   │   │   ├── modules.json         # 103KB of learning content
│   │   │   ├── presets.json         # Simulation presets
│   │   │   ├── documentationData.js # Help documentation
│   │   │   └── teamMembers.json     # Team bios & socials
│   │   └── context/                 # React context (SimulationContext)
│   └── public/images/               # Static assets & GEANT4 renders
│
└── figures/                         # 📊 Publication Figures (17 files)
    ├── 01_particle_trajectories.png # 3D particle paths
    ├── 08_pid_performance.png       # Particle ID efficiency
    ├── 11_time_dilation_proof.png   # Core result visualization
    └── vis01-04_*.png               # GEANT4 detector visualizations
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥18 and **npm** (for web app)
- **GEANT4** 11.x with Qt and ROOT support (for simulation)
- **CMake** ≥3.16 and C++17 compiler
- **Python** 3.8+ with numpy, matplotlib, scipy (for analysis)

### Run the Web Application

```bash
git clone https://github.com/Yash-Programmer/TimeDilation.git
cd TimeDilation/website
npm install
npm run dev
# Opens at http://localhost:5173
```

### Build & Run the GEANT4 Simulation

```bash
cd TimeDilationSim
mkdir build && cd build
cmake ..
cmake --build . --config Release

# Interactive mode (opens 3D visualization)
./TimeDilationSim

# Batch mode (production data)
./TimeDilationSim ../run_x15.mac
```

### Run Analysis Scripts

```bash
cd TimeDilationSim/analysis
python analyze_decay.py --position 0 5 10 15
python plot_survival_curves.py
python generate_all_figures.py
```

---

## Features

### 🔬 GEANT4 Simulation
- **Full beamline geometry**: 15m flight path with configurable detector stations
- **Complete detector suite**: RICH (C₄F₁₀ radiator), EM calorimeter (Pb-scintillator), DWCs
- **Realistic physics**: Decay-in-flight, Cherenkov radiation, hadronic interactions
- **31-column ROOT ntuple**: Complete event data with PID, decay vertices, timing

### 🌐 Web Application
- **Interactive Simulator**: Real-time momentum adjustment with γ calculation
- **30+ Learning Modules**: Beginner to advanced particle physics
- **Premium UI**: Framer Motion parallax, glassmorphism, scroll-triggered animations
- **Proposal Viewer**: Embedded LaTeX with equation rendering
- **GEANT4 Gallery**: 12 high-resolution detector visualizations

### 📊 Analysis Pipeline
- **Survival curve extraction**: S_π(x) and S_K(x) vs flight distance
- **Particle ID**: β measurement from Cherenkov angle, E/p from calorimetry
- **Lifetime validation**: τ_π = 26.03 ns, τ_K = 12.38 ns (PDG comparison)
- **3D event visualization**: Matplotlib-based decay topology display

---

## Physics Summary

**Hypothesis**: Time dilation is universal—the dilated lifetime τ' = γτ₀ depends only on velocity (via γ), not on particle mass or composition.

**Method**:
1. Generate π+ and K+ at fixed momentum (8 GeV/c)
2. Measure survival fractions S(x) at multiple flight distances
3. Extract dilated lifetimes τ'_π and τ'_K
4. Verify γ_π τ₀_π ≈ γ_K τ₀_K (within experimental uncertainty)

**Expected Results at 15m**:
| Particle | γ | τ₀ (ns) | τ' (ns) | Survival |
|----------|---|---------|---------|----------|
| π+ | 57.3 | 26.03 | 1491 | 96.7% |
| K+ | 16.2 | 12.38 | 201 | 77.9% |

---

## License

This project is licensed under the **Apache License 2.0**.

```
Copyright 2025 Yash Varshney and The Relativists

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

See the [LICENSE](LICENSE) file for details.

---

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-addition`)
3. Make your changes and test locally
4. Submit a Pull Request with a clear description

For major changes, please open an issue first to discuss your proposal.

---

## Acknowledgements

- **CERN Beamline for Schools** for the competition framework and inspiration
- **GEANT4 Collaboration** for the simulation toolkit
- **React, Framer Motion, Vite** communities for web development tools
- **Our mentors and teachers** for guidance and support

---

<p align="center">
  <strong>Made with ❤️ by The Relativists</strong><br/>
  <em>Testing Einstein's predictions, one particle at a time.</em>
</p>

<p align="center">
  <a href="https://github.com/Yash-Programmer">@Yash-Programmer</a>
</p>
