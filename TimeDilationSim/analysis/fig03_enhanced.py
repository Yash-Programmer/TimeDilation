#!/usr/bin/env python3
"""
Enhanced Figure 03: RICH Beta distributions - publication quality
"""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import norm
import os

plt.rcParams['font.size'] = 11
OUTPUT = '../geant4-result/figures/python-analysis'

def load_data():
    return pd.concat([pd.read_csv(f'../output/TimeDilation_Run{i}.csv') for i in range(4)])

def main():
    print("[3/13] Enhanced beta distributions...")
    df = load_data()
    
    fig = plt.figure(figsize=(16, 10), facecolor='white')
    fig.suptitle('RICH Detector: Velocity (Beta) Measurement', fontsize=16, fontweight='bold', y=0.98)
    
    # Panel 1: Beta by species
    ax1 = fig.add_subplot(221)
    for pdg, name, color in [(211, 'Pions', '#E74C3C'), (321, 'Kaons', '#3498DB')]:
        data = df[df['PrimaryPDG'] == pdg]['RICH1_Beta']
        data = data[(data > 0.995) & (data < 1.005)]
        ax1.hist(data, bins=50, alpha=0.6, color=color, label=f'{name} (N={len(data):,})', edgecolor='white')
    
    ax1.axvline(0.999850, color='#E74C3C', linestyle='--', linewidth=2, label='Expected pion')
    ax1.axvline(0.998100, color='#3498DB', linestyle='--', linewidth=2, label='Expected kaon')
    ax1.set_xlabel('Beta (v/c)', fontsize=12)
    ax1.set_ylabel('Events', fontsize=12)
    ax1.set_title('Beta Distribution by Particle Type', fontsize=12, fontweight='bold')
    ax1.legend(fontsize=9)
    ax1.grid(True, alpha=0.3)
    
    # Panel 2: K/pi separation
    ax2 = fig.add_subplot(222)
    pi_beta = df[df['PrimaryPDG'] == 211]['RICH1_Beta']
    k_beta = df[df['PrimaryPDG'] == 321]['RICH1_Beta']
    pi_beta = pi_beta[(pi_beta > 0.995) & (pi_beta < 1.005)]
    k_beta = k_beta[(k_beta > 0.995) & (k_beta < 1.005)]
    
    ax2.hist(pi_beta, bins=40, alpha=0.6, color='#E74C3C', density=True, label='Pions')
    ax2.hist(k_beta, bins=40, alpha=0.6, color='#3498DB', density=True, label='Kaons')
    
    sep = abs(pi_beta.mean() - k_beta.mean()) / np.sqrt(pi_beta.std()**2 + k_beta.std()**2)
    ax2.set_title(f'K/Pi Separation: {sep:.1f} sigma', fontsize=12, fontweight='bold')
    ax2.set_xlabel('Beta', fontsize=12)
    ax2.set_ylabel('Normalized', fontsize=12)
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    # Panel 3: Beta resolution
    ax3 = fig.add_subplot(223)
    residual = pi_beta - 0.999850
    ax3.hist(residual, bins=50, color='#9B59B6', alpha=0.7, edgecolor='white')
    res = pi_beta.std() / pi_beta.mean()
    ax3.axvline(0, color='black', linestyle='-', linewidth=2)
    ax3.set_xlabel('Beta - Beta_expected', fontsize=12)
    ax3.set_ylabel('Events', fontsize=12)
    ax3.set_title(f'Pion Beta Resolution: dB/B = {res:.4f}', fontsize=12, fontweight='bold')
    ax3.grid(True, alpha=0.3)
    
    # Panel 4: Beta vs Momentum
    ax4 = fig.add_subplot(224)
    pions = df[df['PrimaryPDG'] == 211].sample(min(2000, len(df[df['PrimaryPDG']==211])))
    kaons = df[df['PrimaryPDG'] == 321]
    
    ax4.scatter(pions['PrimaryMom'], pions['RICH1_Beta'], c='#E74C3C', alpha=0.3, s=8, label='Pions')
    ax4.scatter(kaons['PrimaryMom'], kaons['RICH1_Beta'], c='#3498DB', alpha=0.5, s=15, label='Kaons')
    
    ax4.axhline(0.999850, color='#E74C3C', linestyle='--', alpha=0.7)
    ax4.axhline(0.998100, color='#3498DB', linestyle='--', alpha=0.7)
    
    ax4.set_xlabel('Momentum (GeV/c)', fontsize=12)
    ax4.set_ylabel('Beta', fontsize=12)
    ax4.set_title('Beta vs Momentum', fontsize=12, fontweight='bold')
    ax4.legend()
    ax4.grid(True, alpha=0.3)
    ax4.set_ylim([0.995, 1.002])
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT}/03_beta_distributions.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print("✓ Saved: 03_beta_distributions.png")

if __name__ == '__main__':
    os.makedirs(OUTPUT, exist_ok=True)
    main()
