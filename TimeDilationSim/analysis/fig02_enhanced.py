#!/usr/bin/env python3
"""
Enhanced Figure 02: Momentum distributions - publication quality
"""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import norm
import os

plt.rcParams['font.size'] = 11
plt.rcParams['axes.linewidth'] = 1.5

OUTPUT = '../geant4-result/figures/python-analysis'

def load_data():
    return pd.concat([pd.read_csv(f'../output/TimeDilation_Run{i}.csv') for i in range(4)])

def main():
    print("[2/13] Enhanced momentum distributions...")
    df = load_data()
    
    fig, axes = plt.subplots(1, 2, figsize=(14, 5), facecolor='white')
    fig.suptitle('Beam Momentum Distribution at 8 GeV/c', fontsize=15, fontweight='bold', y=1.02)
    
    for ax, (pdg, name, color) in zip(axes, [(211, 'Pions', '#E74C3C'), (321, 'Kaons', '#3498DB')]):
        data = df[df['PrimaryPDG'] == pdg]['PrimaryMom']
        
        # Histogram with gradient fill
        n, bins, patches = ax.hist(data, bins=60, density=True, alpha=0.7, color=color, edgecolor='white', linewidth=0.5)
        
        # Fit Gaussian
        mu, std = norm.fit(data)
        x = np.linspace(data.min(), data.max(), 200)
        ax.plot(x, norm.pdf(x, mu, std), 'k-', linewidth=2.5, label=f'Gaussian fit')
        ax.plot(x, norm.pdf(x, mu, std), color=color, linewidth=1.5, linestyle='--')
        
        # Vertical lines
        ax.axvline(8.0, color='black', linestyle='-', linewidth=2, alpha=0.8, label='Nominal (8.0 GeV/c)')
        ax.axvline(mu, color=color, linestyle=':', linewidth=2, label=f'Mean: {mu:.3f} GeV/c')
        
        # Stats box
        textstr = f'N = {len(data):,}\n$\\mu$ = {mu:.4f} GeV/c\n$\\sigma$ = {std:.4f} GeV/c\n$\\sigma/\\mu$ = {std/mu*100:.2f}%'
        props = dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.9, edgecolor='gray')
        ax.text(0.97, 0.97, textstr, transform=ax.transAxes, fontsize=10, verticalalignment='top', 
               horizontalalignment='right', bbox=props)
        
        ax.set_xlabel('Momentum (GeV/c)', fontsize=12)
        ax.set_ylabel('Probability Density', fontsize=12)
        ax.set_title(f'{name}', fontsize=13, fontweight='bold')
        ax.legend(loc='upper left', fontsize=9, framealpha=0.9)
        ax.set_xlim([7.6, 8.4])
        ax.grid(True, alpha=0.3, linestyle='--')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT}/02_momentum_distributions.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print("✓ Saved: 02_momentum_distributions.png")

if __name__ == '__main__':
    os.makedirs(OUTPUT, exist_ok=True)
    main()
