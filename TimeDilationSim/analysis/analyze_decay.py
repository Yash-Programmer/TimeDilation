#!/usr/bin/env python3
"""
analyze_decay.py
Extract survival curves from GEANT4 ROOT output files
"""

import ROOT
import numpy as np
import argparse
from pathlib import Path

# PDG codes
PDG_PION = 211
PDG_KAON = 321
PDG_MUON = -13

# Physical constants (match proposal)
C_LIGHT = 299792458  # m/s
PION_MASS = 0.13957  # GeV
KAON_MASS = 0.49368  # GeV
MUON_MASS = 0.10566  # GeV
PION_LIFETIME = 26.03e-9  # s
KAON_LIFETIME = 12.38e-9  # s

def calculate_decay_length(momentum, mass, lifetime):
    """Calculate expected decay length λ = βcγτ₀"""
    energy = np.sqrt(momentum**2 + mass**2)
    gamma = energy / mass
    beta = momentum / energy
    return beta * C_LIGHT * gamma * lifetime

def load_data(filename):
    """Load ROOT file and return TTree"""
    print(f"Loading {filename}...")
    rootfile = ROOT.TFile.Open(filename)
    if not rootfile or rootfile.IsZombie():
        raise FileNotFoundError(f"Cannot open {filename}")
    
    tree = rootfile.Get("TimeDilation")
    if not tree:
        raise ValueError(f"Tree 'TimeDilation' not found in {filename}")
    
    return tree

def extract_survival(tree, pdg_code, position_name):
    """Extract survived particle counts for given species"""
    # Count particles that:
    # 1. Are identified as this species (PrimaryPDG)
    # 2. Either survived to Station 2 or decayed before it
    
    total = tree.GetEntries(f"PrimaryPDG == {pdg_code}")
    survived = tree.GetEntries(f"PrimaryPDG == {pdg_code} && Survived == 1")
    
    if total == 0:
        return 0, 0, 0
    
    survival_fraction = survived / total
    # Poisson error
    error = np.sqrt(survived) / total if survived > 0 else 0
    
    return total, survived, survival_fraction, error

def main():
    parser = argparse.ArgumentParser(description="Analyze pion/kaon decay data")
    parser.add_argument('--position', nargs='+', type=int, default=[0, 5, 10, 15],
                        help='Station2 positions in meters')
    parser.add_argument('--input-dir', default='../output', help='Directory with ROOT files')
    args = parser.parse_args()
    
    positions = np.array(args.position, dtype=float)
    input_dir = Path(args.input_dir)
    
    # Storage for results
    results = {
        'positions': positions,
        'pion': {'N_total': [], 'N_survived': [], 'S': [], 'S_err': []},
        'kaon': {'N_total': [], 'N_survived': [], 'S': [], 'S_err': []},
        'muon': {'N_total': [], 'N_survived': [], 'S': [], 'S_err': []}
    }
    
    # Process each position
    for i, pos in enumerate(positions):
        filename = input_dir / f"TimeDilation_Run{i}.root"
        tree = load_data(str(filename))
        
        # Pions
        ntot, nsurv, S, err = extract_survival(tree, PDG_PION, f"x={pos}m")
        results['pion']['N_total'].append(ntot)
        results['pion']['N_survived'].append(nsurv)
        results['pion']['S'].append(S)
        results['pion']['S_err'].append(err)
        
        # Kaons
        ntot, nsurv, S, err = extract_survival(tree, PDG_KAON, f"x={pos}m")
        results['kaon']['N_total'].append(ntot)
        results['kaon']['N_survived'].append(nsurv)
        results['kaon']['S'].append(S)
        results['kaon']['S_err'].append(err)
        
        # Muons (calibration check)
        ntot, nsurv, S, err = extract_survival(tree, PDG_MUON, f"x={pos}m")
        results['muon']['N_total'].append(ntot)
        results['muon']['N_survived'].append(nsurv)
        results['muon']['S'].append(S)
        results['muon']['S_err'].append(err)
    
    # Print results
    print("\n" + "="*70)
    print("SURVIVAL FRACTIONS N(x)/N(0)")
    print("="*70)
    
    # Reference: N(0)
    N0_pion = results['pion']['N_total'][0]
    N0_kaon = results['kaon']['N_total'][0]
    N0_muon = results['muon']['N_total'][0]
    
    print(f"\nReference counts @ x=0:")
    print(f"  Pions: {N0_pion:6d}")
    print(f"  Kaons: {N0_kaon:6d}")
    print(f"  Muons: {N0_muon:6d}")
    
    print("\nPosition | Pion S(x)    | Kaon S(x)    | Muon S(x)")
    print("-"*70)
    for i, pos in enumerate(positions):
        S_pi = results['pion']['S'][i]
        S_K = results['kaon']['S'][i]
        S_mu = results['muon']['S'][i]
        err_pi = results['pion']['S_err'][i]
        err_K = results['kaon']['S_err'][i]
        err_mu = results['muon']['S_err'][i]
        
        print(f"{pos:4.0f} m   | {S_pi:.4f}±{err_pi:.4f} | {S_K:.4f}±{err_K:.4f} | {S_mu:.4f}±{err_mu:.4f}")
    
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
    print("Run plot_survival_curves.py to visualize")

if __name__ == '__main__':
    main()
