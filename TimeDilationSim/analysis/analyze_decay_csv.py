#!/usr/bin/env python3
"""
analyze_decay_csv.py
Extract survival curves from CSV simulation output
"""

import pandas as pd
import numpy as np
from pathlib import Path

# PDG codes
PDG_PION = 211
PDG_KAON = 321

# Physical constants (match proposal)
C_LIGHT = 299792458  # m/s
PION_MASS = 0.13957  # GeV
KAON_MASS = 0.49368  # GeV
PION_LIFETIME = 26.03e-9  # s
KAON_LIFETIME = 12.38e-9  # s

def calculate_decay_length(momentum, mass, lifetime):
    """Calculate expected decay length λ = βcγτ₀"""
    energy = np.sqrt(momentum**2 + mass**2)
    gamma = energy / mass
    beta = momentum / energy
    return beta * C_LIGHT * gamma * lifetime

def load_csv_data(filename):
    """Load CSV file"""
    print(f"Loading {filename}...")
    return pd.read_csv(filename)

def extract_survival(df, pdg_code):
    """Extract survived particle counts for given species"""
    total = (df['PrimaryPDG'] == pdg_code).sum()
    survived = ((df['PrimaryPDG'] == pdg_code) & (df['Survived'] == 1)).sum()
    
    if total == 0:
        return 0, 0, 0, 0
    
    survival_fraction = survived / total
    error = np.sqrt(survived) / total if survived > 0 else 0
    
    return total, survived, survival_fraction, error

def main():
    positions = np.array([0, 5, 10, 15], dtype=float)  # meters
    input_dir = Path('../output')
    
    # Storage for results
    results = {
        'positions': positions,
        'pion': {'N_total': [], 'N_survived': [], 'S': [], 'S_err': []},
        'kaon': {'N_total': [], 'N_survived': [], 'S': [], 'S_err': []}
    }
    
    # Process each position
    for i, pos in enumerate(positions):
        filename = input_dir / f"TimeDilation_Run{i}.csv"
        df = load_csv_data(str(filename))
        
        # Pions
        ntot, nsurv, S, err = extract_survival(df, PDG_PION)
        results['pion']['N_total'].append(ntot)
        results['pion']['N_survived'].append(nsurv)
        results['pion']['S'].append(S)
        results['pion']['S_err'].append(err)
        
        # Kaons
        ntot, nsurv, S, err = extract_survival(df, PDG_KAON)
        results['kaon']['N_total'].append(ntot)
        results['kaon']['N_survived'].append(nsurv)
        results['kaon']['S'].append(S)
        results['kaon']['S_err'].append(err)
    
    # Print results
    print("\n" + "="*70)
    print("SURVIVAL FRACTIONS N(x)/N(0)")
    print("="*70)
    
    # Reference: N(0)
    N0_pion = results['pion']['N_total'][0]
    N0_kaon = results['kaon']['N_total'][0]
    
    print(f"\nReference counts @ x=0:")
    print(f"  Pions: {N0_pion:6d}")
    print(f"  Kaons: {N0_kaon:6d}")
    
    print("\nPosition | Pion S(x)    | Kaon S(x)")
    print("-"*70)
    for i, pos in enumerate(positions):
        S_pi = results['pion']['S'][i]
        S_K = results['kaon']['S'][i]
        err_pi = results['pion']['S_err'][i]
        err_K = results['kaon']['S_err'][i]
        
        print(f"{pos:4.0f} m   | {S_pi:.4f}±{err_pi:.4f} | {S_K:.4f}±{err_K:.4f}")
    
    # Calculate expected decay lengths
    p_beam = 8.0  # GeV/c
    lambda_pi = calculate_decay_length(p_beam, PION_MASS, PION_LIFETIME)
    lambda_K = calculate_decay_length(p_beam, KAON_MASS, KAON_LIFETIME)
    
    print(f"\nTheoretical decay lengths @ 8 GeV/c:")
    print(f"  Pions: λ_π = {lambda_pi:.1f} m")
    print(f"  Kaons: λ_K = {lambda_K:.1f} m")
    
    # Expected values at 15 m
    S_pi_15_theory = np.exp(-15.0 / lambda_pi)
    S_K_15_theory = np.exp(-15.0 / lambda_K)
    
    print(f"\nExpected @ 15 m:")
    print(f"  S_π(15m) = {S_pi_15_theory:.4f}  (measured: {results['pion']['S'][-1]:.4f}±{results['pion']['S_err'][-1]:.4f})")
    print(f"  S_K(15m) = {S_K_15_theory:.4f}  (measured: {results['kaon']['S'][-1]:.4f}±{results['kaon']['S_err'][-1]:.4f})")
    
    # Save to file for plotting
    np.savez('survival_data.npz', **results)
    print("\nData saved to survival_data.npz")
    
    # Also save as CSV
    summary_df = pd.DataFrame({
        'Position_m': positions,
        'Pion_S': results['pion']['S'],
        'Pion_S_err': results['pion']['S_err'],
        'Kaon_S': results['kaon']['S'],
        'Kaon_S_err': results['kaon']['S_err']
    })
    summary_df.to_csv('survival_summary.csv', index=False)
    print("Summary saved to survival_summary.csv")

if __name__ == '__main__':
    main()
