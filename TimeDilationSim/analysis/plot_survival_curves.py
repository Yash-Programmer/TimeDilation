#!/usr/bin/env python3
"""
plot_survival_curves.py
Generate publication-quality survival curve plots
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib import rcParams

# Set publication style
rcParams['font.family'] = 'serif'
rcParams['font.size'] = 12
rcParams['figure.figsize'] = (10, 6)

def exp_decay(x, lambda_param):
    """Exponential decay function"""
    return np.exp(-x / lambda_param)

def load_survival_data():
    """Load data from analyze_decay_csv.py output"""
    data = np.load('survival_data.npz', allow_pickle=True)
    return data

def plot_survival_curves():
    """Create survival curve plots matching proposal style"""
    data = load_survival_data()
    
    positions = data['positions']
    
    # Extract pion and kaon data
    S_pi = np.array(data['pion'].item()['S'])
    S_pi_err = np.array(data['pion'].item()['S_err'])
    S_K = np.array(data['kaon'].item()['S'])
    S_K_err = np.array(data['kaon'].item()['S_err'])
    
    # Theoretical predictions (from proposal)
    lambda_pi = 447.0  # m
    lambda_K = 60.0    # m
    
    x_theory = np.linspace(0, 15, 100)
    S_pi_theory = exp_decay(x_theory, lambda_pi)
    S_K_theory = exp_decay(x_theory, lambda_K)
    
    # Create plot
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), height_ratios=[3, 1])
    
    # Main plot
    ax1.errorbar(positions, S_pi, yerr=S_pi_err, fmt='ro', markersize=8, 
                 capsize=5, label='Pions π+ (data)', zorder=3)
    ax1.errorbar(positions, S_K, yerr=S_K_err, fmt='bs', markersize=8,
                 capsize=5, label='Kaons K+ (data)', zorder=3)
    
    # Theory curves
    ax1.plot(x_theory, S_pi_theory, 'r--', linewidth=2, alpha=0.7,
             label=f'Theory: λ_π = {lambda_pi} m')
    ax1.plot(x_theory, S_K_theory, 'b--', linewidth=2, alpha=0.7,
             label=f'Theory: λ_K = {lambda_K} m')
    ax1.axhline(1.0, color='gray', linestyle=':', alpha=0.5)
    
    ax1.set_ylabel('Survival Fraction S(x)', fontsize=14, fontweight='bold')
    ax1.set_xlim(-1, 16)
    ax1.set_ylim(0.7, 1.05)
    ax1.grid(alpha=0.3, linestyle='--')
    ax1.legend(loc='upper right', fontsize=11, framealpha=0.9)
    
    ax1.text(0.02, 0.98, 'Python Monte Carlo Simulation\\nTime Dilation Universality Test',
             transform=ax1.transAxes, fontsize=10, verticalalignment='top',
             bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
    
    # Residual plot
    S_pi_theory_at_data = exp_decay(positions, lambda_pi)
    S_K_theory_at_data = exp_decay(positions, lambda_K)
    
    residual_pi = (S_pi - S_pi_theory_at_data) / S_pi_err
    residual_K = (S_K - S_K_theory_at_data) / S_K_err
    
    ax2.errorbar(positions, residual_pi, yerr=1.0, fmt='ro', capsize=3, label='π+')
    ax2.errorbar(positions, residual_K, yerr=1.0, fmt='bs', capsize=3, label='K+')
    ax2.axhline(0, color='black', linestyle='-', linewidth=1)
    ax2.axhline(2, color='gray', linestyle=':', alpha=0.5)
    ax2.axhline(-2, color='gray', linestyle=':', alpha=0.5)
    
    ax2.set_xlabel('Distance (m)', fontsize=14, fontweight='bold')
    ax2.set_ylabel('(Data - Theory) / σ', fontsize=12)
    ax2.set_xlim(-1, 16)
    ax2.set_ylim(-3, 3)
    ax2.grid(alpha=0.3, linestyle='--')
    ax2.legend(loc='upper right', fontsize=10)
    
    plt.tight_layout()
    plt.savefig('survival_curves.png', dpi=300, bbox_inches='tight')
    plt.savefig('survival_curves.pdf', bbox_inches='tight')
    print("✓ Saved: survival_curves.png, survival_curves.pdf")
    plt.close()

if __name__ == '__main__':
    try:
        plot_survival_curves()
        print("\n✓ Survival curve plots generated successfully!")
    except FileNotFoundError as e:
        print(f"ERROR: {e}")
        print("Run analyze_decay_csv.py first to generate data.")
