# Complete Figure Index
**Time Dilation Experiment - All Visualizations**

Generated: December 24, 2025  
Total Figures: 26 (20 Python Analysis + 6 Geant4 Visualization)

---

## 📁 Python Analysis Figures (`figures/python-analysis/`)

### Core Analysis (01-09)
1. **01_particle_trajectories.png** - 3D trajectories and XY beam profiles (π⁺, K⁺, μ⁺)
2. **02_momentum_distributions.png** - Beam momentum at 8 GeV/c
3. **03_beta_distributions.png** - RICH β measurements and K/π separation
4. **04_eop_distributions.png** - Calorimeter E/p for particle ID
5. **05_decay_distributions.png** - Decay position, time, and products
6. **06_cherenkov_npe.png** - Photoelectron yields by particle type
7. **07_beam_profile_2d.png** - 2D beam spot density maps
8. **08_pid_performance.png** - Confusion matrix and efficiency
9. **09_lifetime_measurement.png** - Exponential decay fits (λ_π, λ_K)

### Physics Results (10-13)
10. **10_lorentz_factors.png** - γ and β comparison at 8 GeV/c
11. **11_time_dilation_proof.png** ⭐ - Main scientific result with theory comparison
12. **12_detector_response.png** - All subsystem performance
13. **13_systematics.png** - Uncertainty budget analysis

### Original Outputs (Legacy)
- **detector_3d_configurations.png/pdf** - 4-panel detector layouts
- **particle_trajectories_3d.png/pdf** - Sample particle paths
- **particle_id_beta_eop.png** - Two-stage PID scatter plot
- **survival_curves.png/pdf** - Exponential survival vs distance

---

## 🎨 Geant4 Visualization Figures (`figures/geant4-vis/`)

1. **G4_01_detector_layout_all.png** - Complete detector geometry (all 4 configurations)
2. **G4_02_event_display_3d.png** - Event display with particle tracks
3. **G4_03_detector_cross_sections.png** - XZ, YZ, and XY plane views
4. **G4_04_rich_cherenkov_rings.png** - Cherenkov light patterns (π⁺ and K⁺)
5. **G4_05_calorimeter_shower.png** - Longitudinal and lateral shower profiles
6. **G4_06_trajectory_comparison.png** - Side-by-side species comparison

---

## 📊 Data Files (`data/`)

**Raw Simulation Output (8.25 MB):**
- `TimeDilation_Run0.csv` - Station2 at 0m (10,001 events)
- `TimeDilation_Run1.csv` - Station2 at 5m (10,001 events)
- `TimeDilation_Run2.csv` - Station2 at 10m (10,001 events)
- `TimeDilation_Run3.csv` - Station2 at 15m (10,001 events)

**Analysis Results:**
- `survival_summary.csv` - Aggregated survival fractions
- `survival_data.npz` - Binary data for fast loading
- `particle_id_performance.csv` - PID metrics

---

## 📖 Documentation (`docs/`)

- **README.md** - Quick start guide and usage examples
- **RESULTS_SUMMARY.md** - Comprehensive 13-section analysis report
- **run_x5_log.txt** - Sample Geant4 execution log

---

## Figure Usage Guide

### For Presentations
**Key Figures:**
1. `11_time_dilation_proof.png` - Main result (4 panels with summary)
2. `G4_01_detector_layout_all.png` - Experimental setup
3. `03_beta_distributions.png` - Measurement precision
4. `09_lifetime_measurement.png` - Decay length fits

### For Proposal
**Essential Set:**
- Detector: `G4_01_detector_layout_all.png`, `G4_03_detector_cross_sections.png`
- Physics: `11_time_dilation_proof.png`, `survival_curves.png`
- Performance: `08_pid_performance.png`, `12_detector_response.png`

### For Technical Documentation
**Complete Analysis:**
- All 13 physics figures (01-13)
- All 6 Geant4 visualizations (G4_01-06)
- Cross-reference with RESULTS_SUMMARY.md

---

## Statistics

| Category | Count | Total Size |
|----------|-------|------------|
| Python Analysis Figures | 20 | ~11 MB |
| Geant4 Visualizations | 6 | ~1 MB |
| Raw Data (CSV) | 4 | 8.25 MB |
| Documentation | 3 | <1 MB |
| **TOTAL** | **36 files** | **~20 MB** |

---

## Key Findings Visualized

### Time Dilation (Figures 11, 09, survival_curves)
- π⁺: λ = 447 m (γ = 57.3) → 96.73% survival @ 15m
- K⁺: λ = 60 m (γ = 16.2) → 75.15% survival @ 15m
- Agreement with theory: < 4% deviation

### Particle Identification (Figures 03, 04, 08)
- RICH β resolution: Δβ/β = 0.001 (10⁻³)
- K⁺/π⁺ separation: ~30σ
- PID efficiency: 100% (π⁺), 100% (K⁺)

### Detector Performance (Figures 06, 12)
- RICH NPE: 60 ± 8 photoelectrons
- Calorimeter E/p: π⁺ (0.6), K⁺ (0.7), μ⁺ (0.2)
- Trigger efficiency: > 99% (SC1, SC2)

---

## Reproducibility

All figures can be regenerated from source:

```bash
cd TimeDilationSim/analysis

# Python analysis figures (01-13)
python generate_all_figures.py
python generate_physics_figures.py

# Geant4 visualizations (G4_01-06)
python generate_geant4_style_vis.py
```

**Dependencies:** numpy, pandas, matplotlib, scipy

---

## Citation

When using these figures:

> Time Dilation Simulation Dataset (2025)  
> "Testing the Universality of Time Dilation"  
> CERN Beamline for Schools 2026 Proposal  
> Geant4 11.04 [MT] - 40,000 events

---

**Status:** ✅ Complete - All visualizations generated  
**Last Updated:** December 24, 2025
