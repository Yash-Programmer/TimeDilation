#!/usr/bin/env python3
"""
Enhanced Figure 08: PID Performance - publication quality
"""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os

OUTPUT = '../geant4-result/figures/python-analysis'

def main():
    print('[8/13] Enhanced PID performance...')
    df = pd.concat([pd.read_csv(f'../output/TimeDilation_Run{i}.csv') for i in range(4)])
    
    fig = plt.figure(figsize=(16, 12), facecolor='white')
    fig.suptitle('Particle Identification Performance', fontsize=16, fontweight='bold', y=0.98)
    
    # Panel 1: Beta vs E/p scatter
    ax1 = fig.add_subplot(221)
    for pdg, name, color in [(211, 'Pions', '#E74C3C'), (321, 'Kaons', '#3498DB')]:
        data = df[df['PrimaryPDG'] == pdg].sample(min(3000, len(df[df['PrimaryPDG']==pdg])))
        beta = data['RICH1_Beta']
        eop = data['Calo_EoP']
        valid = (beta > 0.995) & (beta < 1.005) & (eop < 1.5)
        ax1.scatter(beta[valid], eop[valid], c=color, alpha=0.4, s=15, label=name)
    
    ax1.axhline(0.3, color='gray', linestyle='--', alpha=0.7, label='MIP threshold')
    ax1.axhline(0.8, color='gray', linestyle=':', alpha=0.7)
    ax1.axvline(0.999, color='purple', linestyle='--', alpha=0.7, label='K/pi threshold')
    
    ax1.set_xlabel('Beta (RICH)', fontsize=12)
    ax1.set_ylabel('E/p (Calorimeter)', fontsize=12)
    ax1.set_title('Two-Stage PID Phase Space', fontsize=12, fontweight='bold')
    ax1.legend(fontsize=9)
    ax1.grid(True, alpha=0.3)
    ax1.set_xlim([0.995, 1.002])
    ax1.set_ylim([0, 1.2])
    
    # Panel 2: Confusion matrix
    ax2 = fig.add_subplot(222)
    true_map = {211: 0, 321: 1}
    reco_map = {211.0: 0, 321.0: 1, 0.0: 2}
    
    matrix = np.zeros((2, 3))
    for i, true_pdg in enumerate([211, 321]):
        for j, reco_pdg in enumerate([211.0, 321.0, 0.0]):
            count = len(df[(df['PrimaryPDG']==true_pdg) & (df['ReconstructedPID']==reco_pdg)])
            matrix[i, j] = count
    
    # Normalize rows
    row_sums = matrix.sum(axis=1, keepdims=True)
    matrix_pct = matrix / row_sums * 100
    
    im = ax2.imshow(matrix_pct, cmap='Blues', aspect='auto', vmin=0, vmax=100)
    ax2.set_xticks([0, 1, 2])
    ax2.set_xticklabels(['Pion', 'Kaon', 'Unknown'])
    ax2.set_yticks([0, 1])
    ax2.set_yticklabels(['Pion', 'Kaon'])
    ax2.set_xlabel('Reconstructed', fontsize=12)
    ax2.set_ylabel('True', fontsize=12)
    ax2.set_title('PID Confusion Matrix (%)', fontsize=12, fontweight='bold')
    
    for i in range(2):
        for j in range(3):
            text = f'{matrix_pct[i,j]:.1f}%'
            color = 'white' if matrix_pct[i,j] > 50 else 'black'
            ax2.text(j, i, text, ha='center', va='center', fontsize=14, fontweight='bold', color=color)
    
    plt.colorbar(im, ax=ax2, label='Percentage', shrink=0.8)
    
    # Panel 3: Efficiency vs distance
    ax3 = fig.add_subplot(223)
    dists = [0, 5, 10, 15]
    for pdg, name, color, marker in [(211, 'Pions', '#E74C3C', 'o'), (321, 'Kaons', '#3498DB', 's')]:
        effs = []
        for i in range(4):
            run = df[(df['RunNumber']==i) & (df['PrimaryPDG']==pdg)]
            if len(run) > 0:
                correct = (run['ReconstructedPID'] == pdg).sum()
                effs.append(correct / len(run) * 100)
            else:
                effs.append(0)
        ax3.plot(dists, effs, f'{marker}-', color=color, linewidth=2.5, markersize=12, label=name)
    
    ax3.set_xlabel('Flight Distance (m)', fontsize=12)
    ax3.set_ylabel('PID Efficiency (%)', fontsize=12)
    ax3.set_title('PID Efficiency vs Distance', fontsize=12, fontweight='bold')
    ax3.set_ylim([0, 105])
    ax3.legend(fontsize=11)
    ax3.grid(True, alpha=0.3)
    
    # Panel 4: NPE distribution comparison
    ax4 = fig.add_subplot(224)
    pions = df[df['PrimaryPDG'] == 211]
    kaons = df[df['PrimaryPDG'] == 321]
    
    bins = np.linspace(0, 120, 40)
    ax4.hist(pions['RICH1_NPE'], bins=bins, alpha=0.6, color='#E74C3C', density=True, label='Pions')
    ax4.hist(kaons['RICH1_NPE'], bins=bins, alpha=0.6, color='#3498DB', density=True, label='Kaons')
    
    ax4.set_xlabel('Number of Photoelectrons', fontsize=12)
    ax4.set_ylabel('Normalized', fontsize=12)
    ax4.set_title('RICH NPE Distribution', fontsize=12, fontweight='bold')
    ax4.legend()
    ax4.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT}/08_pid_performance.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print('Saved: 08_pid_performance.png')

if __name__ == '__main__':
    os.makedirs(OUTPUT, exist_ok=True)
    main()
