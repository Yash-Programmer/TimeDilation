#!/usr/bin/env python3
"""
validate_physics.py
Validates Time Dilation simulation output against proposal predictions

Physics Parameters from Proposal (Table 1):
  Species | Mass (MeV) |   γ   |  λ (m)  | Survival@15m | Decay@15m
  --------|------------|-------|---------|--------------|----------
  π+      |  139.57    | 57.33 |  447    |    96.7%     |   3.3%
  K+      |  493.68    | 16.24 |   60    |    77.9%     |  22.1%
  μ+      |  105.66    | 75.72 | 49900   |    99.97%    |   0.03%

Usage:
  python validate_physics.py output/run_x15.csv
"""

import numpy as np
import pandas as pd
import sys
import os

# ============================================================================
# EXPECTED VALUES FROM PROPOSAL
# ============================================================================
EXPECTED = {
    'pion': {
        'pdg': 211,
        'mass_mev': 139.57,
        'gamma': 57.33,
        'beta': 0.99985,
        'decay_length_m': 447.0,
        'survival_5m': np.exp(-5/447),
        'survival_10m': np.exp(-10/447),
        'survival_15m': np.exp(-15/447),  # 0.967
    },
    'kaon': {
        'pdg': 321,
        'mass_mev': 493.68,
        'gamma': 16.24,
        'beta': 0.99810,
        'decay_length_m': 60.0,
        'survival_5m': np.exp(-5/60),
        'survival_10m': np.exp(-10/60),
        'survival_15m': np.exp(-15/60),  # 0.779
    },
    'muon': {
        'pdg': -13,
        'mass_mev': 105.66,
        'gamma': 75.72,
        'beta': 0.99991,
        'decay_length_m': 49900.0,
        'survival_5m': np.exp(-5/49900),
        'survival_10m': np.exp(-10/49900),
        'survival_15m': np.exp(-15/49900),  # 0.9997
    }
}

# Tolerance for physics validation (allow 5% relative error for statistics)
TOLERANCE = 0.05

def load_data(filepath):
    """Load simulation output CSV file"""
    if not os.path.exists(filepath):
        print(f"ERROR: File not found: {filepath}")
        sys.exit(1)
    
    return pd.read_csv(filepath)

def validate_decay_fractions(df, flight_distance_m):
    """
    Compare simulated decay fractions with proposal predictions
    """
    print(f"\n{'='*70}")
    print(f"DECAY FRACTION VALIDATION (Flight distance: {flight_distance_m} m)")
    print(f"{'='*70}")
    
    results = {}
    
    for name, params in EXPECTED.items():
        pdg = params['pdg']
        
        # Filter events for this particle type
        particle_df = df[df['PrimaryPDG'] == pdg]
        n_total = len(particle_df)
        
        if n_total == 0:
            print(f"\n{name.upper()} (PDG {pdg}): No events found")
            continue
        
        # Count survivors (reached SC2) and decays
        n_survived = particle_df['Survived'].sum()
        n_decayed = particle_df['Decayed'].sum()
        
        # Calculate fractions
        sim_survival = n_survived / n_total
        sim_decay = n_decayed / n_total
        
        # Get expected values
        if flight_distance_m == 5:
            exp_survival = params['survival_5m']
        elif flight_distance_m == 10:
            exp_survival = params['survival_10m']
        elif flight_distance_m == 15:
            exp_survival = params['survival_15m']
        else:
            exp_survival = np.exp(-flight_distance_m / params['decay_length_m'])
        
        exp_decay = 1.0 - exp_survival
        
        # Calculate statistical uncertainty (binomial)
        stat_error = np.sqrt(sim_survival * (1 - sim_survival) / n_total)
        
        # Check if within tolerance
        rel_error = abs(sim_survival - exp_survival) / exp_survival if exp_survival > 0 else 0
        passed = rel_error < TOLERANCE or abs(sim_survival - exp_survival) < 3 * stat_error
        
        status = "✓ PASS" if passed else "✗ FAIL"
        
        print(f"\n{name.upper()} (PDG {pdg}):")
        print(f"  Events: {n_total}")
        print(f"  Survival fraction:")
        print(f"    Simulated: {sim_survival:.4f} ± {stat_error:.4f}")
        print(f"    Expected:  {exp_survival:.4f} (from λ = {params['decay_length_m']} m)")
        print(f"    Rel Error: {rel_error*100:.2f}%")
        print(f"    Status:    {status}")
        print(f"  Decay fraction:")
        print(f"    Simulated: {sim_decay:.4f}")
        print(f"    Expected:  {exp_decay:.4f}")
        
        results[name] = {
            'n_total': n_total,
            'sim_survival': sim_survival,
            'exp_survival': exp_survival,
            'passed': passed
        }
    
    return results

def validate_beta_measurements(df):
    """
    Validate RICH β measurements against expected values
    """
    print(f"\n{'='*70}")
    print(f"RICH β MEASUREMENT VALIDATION")
    print(f"{'='*70}")
    
    for name, params in EXPECTED.items():
        pdg = params['pdg']
        exp_beta = params['beta']
        
        # Filter events with RICH measurements
        particle_df = df[(df['PrimaryPDG'] == pdg) & (df['RICH1_NPE'] > 0)]
        n_with_rich = len(particle_df)
        
        if n_with_rich == 0:
            print(f"\n{name.upper()} (PDG {pdg}): No RICH measurements")
            continue
        
        # Get measured β values
        beta_values = particle_df['RICH1_Beta'].values
        beta_mean = np.mean(beta_values)
        beta_std = np.std(beta_values)
        
        # Expected resolution from proposal: Δβ/β ~ 10^-3
        exp_resolution = 0.001
        
        rel_error = abs(beta_mean - exp_beta) / exp_beta
        resolution = beta_std / beta_mean
        
        print(f"\n{name.upper()} (PDG {pdg}):")
        print(f"  Events with RICH: {n_with_rich}")
        print(f"  β measurement:")
        print(f"    Mean:     {beta_mean:.6f}")
        print(f"    Expected: {exp_beta:.6f}")
        print(f"    Rel Err:  {rel_error*100:.3f}%")
        print(f"  Resolution (Δβ/β):")
        print(f"    Achieved: {resolution:.4f}")
        print(f"    Target:   {exp_resolution:.4f}")

def validate_pid_performance(df):
    """
    Validate particle identification performance
    """
    print(f"\n{'='*70}")
    print(f"PARTICLE ID PERFORMANCE")
    print(f"{'='*70}")
    
    # Create confusion matrix
    true_pdgs = df['PrimaryPDG'].unique()
    reco_pdgs = df['ReconstructedPID'].unique()
    
    print("\nConfusion Matrix:")
    header = "True \\ Reco"
    print(f"{header:>12}", end='')
    for reco in [211, 321, -13, 0]:
        print(f"{reco:>8}", end='')
    print()
    
    for true_pdg in [211, 321, -13]:
        true_name = {211: 'π+', 321: 'K+', -13: 'μ+'}[true_pdg]
        print(f"{true_name:>12}", end='')
        
        true_df = df[df['PrimaryPDG'] == true_pdg]
        n_true = len(true_df)
        
        for reco_pdg in [211, 321, -13, 0]:
            n_reco = len(true_df[true_df['ReconstructedPID'] == reco_pdg])
            frac = n_reco / n_true * 100 if n_true > 0 else 0
            print(f"{frac:>7.1f}%", end='')
        print()
    
    # Calculate per-species efficiency and purity
    print("\nPer-Species Metrics:")
    for true_pdg in [211, 321, -13]:
        true_name = {211: 'π+', 321: 'K+', -13: 'μ+'}[true_pdg]
        
        true_df = df[df['PrimaryPDG'] == true_pdg]
        reco_df = df[df['ReconstructedPID'] == true_pdg]
        
        n_true = len(true_df)
        n_reco = len(reco_df)
        n_correct = len(true_df[true_df['ReconstructedPID'] == true_pdg])
        
        efficiency = n_correct / n_true * 100 if n_true > 0 else 0
        purity = n_correct / n_reco * 100 if n_reco > 0 else 0
        
        print(f"  {true_name}: Efficiency = {efficiency:.1f}%, Purity = {purity:.1f}%")

def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_physics.py <output_file.csv> [flight_distance_m]")
        print("\nExample: python validate_physics.py output/run_x15.csv 15")
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    # Try to extract flight distance from filename
    if len(sys.argv) >= 3:
        flight_distance = float(sys.argv[2])
    else:
        # Try to parse from filename like "run_x15.csv"
        import re
        match = re.search(r'x(\d+)', filepath)
        if match:
            flight_distance = float(match.group(1))
        else:
            flight_distance = 10.0  # Default
    
    print(f"Loading data from: {filepath}")
    df = load_data(filepath)
    
    print(f"\nDataset summary:")
    print(f"  Total events: {len(df)}")
    print(f"  Columns: {list(df.columns)}")
    
    # Validate physics
    validate_decay_fractions(df, flight_distance)
    validate_beta_measurements(df)
    validate_pid_performance(df)
    
    print(f"\n{'='*70}")
    print("VALIDATION COMPLETE")
    print(f"{'='*70}")

if __name__ == '__main__':
    main()
