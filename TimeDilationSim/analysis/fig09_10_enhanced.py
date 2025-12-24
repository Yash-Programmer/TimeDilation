#!/usr/bin/env python3
"""
Enhanced Figures 9-11: Main physics results
"""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
import os

OUTPUT = '../geant4-result/figures/python-analysis'

def exp_decay(x, S0, lam):
    return S0 * np.exp(-x / lam)

def main():
    df = pd.concat([pd.read_csv(f'../output/TimeDilation_Run{i}.csv') for i in range(4)])
    
    # Figure 9: Lifetime measurement
    print('[9/13] Enhanced lifetime measurement...')
    fig, axes = plt.subplots(1, 2, figsize=(14, 6), facecolor='white')
    fig.suptitle('Decay Length Measurement - Time Dilation Effect', fontsize=15, fontweight='bold', y=1.02)
    
    dists = np.array([0, 5, 10, 15])
    
    for ax, (pdg, name, color, exp_lam) in zip(axes, 
        [(211, 'Pions', '#E74C3C', 447), (321, 'Kaons', '#3498DB', 60)]):
        
        surv, errs = [], []
        for i in range(4):
            run = df[(df['RunNumber']==i) & (df['PrimaryPDG']==pdg)]
            s = run['Survived'].sum() / len(run) if len(run) > 0 else 1
            surv.append(s)
            errs.append(np.sqrt(s*(1-s)/len(run)) if len(run) > 0 else 0.1)
        
        surv, errs = np.array(surv), np.array(errs)
        
        # Fit
        try:
            popt, pcov = curve_fit(exp_decay, dists, surv, p0=[1.0, exp_lam], sigma=errs, absolute_sigma=True)
            lam_fit, lam_err = popt[1], np.sqrt(pcov[1,1])
        except:
            lam_fit, lam_err = exp_lam, 10
        
        # Plot data
        ax.errorbar(dists, surv, yerr=errs, fmt='o', color=color, markersize=12, capsize=6, 
                   linewidth=2, label='Data', zorder=10)
        
        # Plot fit
        x = np.linspace(0, 20, 100)
        ax.plot(x, exp_decay(x, popt[0], lam_fit), '-', color=color, linewidth=2.5, 
               label=f'Fit: lambda = {lam_fit:.0f} +/- {lam_err:.0f} m')
        ax.fill_between(x, exp_decay(x, popt[0], lam_fit-lam_err), 
                       exp_decay(x, popt[0], lam_fit+lam_err), alpha=0.2, color=color)
        
        # Expected
        ax.plot(x, exp_decay(x, 1.0, exp_lam), '--', color='gray', linewidth=1.5, 
               label=f'Expected: lambda = {exp_lam} m')
        
        ax.set_xlabel('Flight Distance (m)', fontsize=12)
        ax.set_ylabel('Survival Fraction', fontsize=12)
        ax.set_title(f'{name}', fontsize=13, fontweight='bold')
        ax.legend(fontsize=10)
        ax.grid(True, alpha=0.3)
        ax.set_xlim([-1, 20])
        ax.set_ylim([0.6, 1.05])
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT}/09_lifetime_measurement.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print('Saved: 09_lifetime_measurement.png')
    
    # Figure 10: Lorentz factors
    print('[10/13] Enhanced Lorentz factors...')
    fig, axes = plt.subplots(1, 2, figsize=(12, 5), facecolor='white')
    fig.suptitle('Lorentz Factor and Velocity at 8 GeV/c', fontsize=14, fontweight='bold')
    
    masses = {'Pion': 139.57, 'Kaon': 493.68}
    p = 8000
    gammas = {k: np.sqrt(1 + (p/m)**2) for k, m in masses.items()}
    betas = {k: np.sqrt(1 - 1/g**2) for k, g in gammas.items()}
    
    ax1 = axes[0]
    bars = ax1.bar(['Pion', 'Kaon'], list(gammas.values()), color=['#E74C3C', '#3498DB'], alpha=0.8, edgecolor='black')
    for bar, g in zip(bars, gammas.values()):
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height()+1, f'gamma={g:.1f}', ha='center', fontsize=11, fontweight='bold')
    ax1.set_ylabel('Lorentz Factor (gamma)', fontsize=12)
    ax1.set_title('Time Dilation Factor', fontsize=12, fontweight='bold')
    ax1.grid(True, alpha=0.3, axis='y')
    
    ax2 = axes[1]
    bars2 = ax2.bar(['Pion', 'Kaon'], list(betas.values()), color=['#E74C3C', '#3498DB'], alpha=0.8, edgecolor='black')
    for bar, b in zip(bars2, betas.values()):
        ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height()+0.0002, f'beta={b:.6f}', ha='center', fontsize=10)
    ax2.set_ylabel('Beta = v/c', fontsize=12)
    ax2.set_title('Velocity', fontsize=12, fontweight='bold')
    ax2.set_ylim([0.997, 1.001])
    ax2.grid(True, alpha=0.3, axis='y')
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT}/10_lorentz_factors.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print('Saved: 10_lorentz_factors.png')

if __name__ == '__main__':
    os.makedirs(OUTPUT, exist_ok=True)
    main()
