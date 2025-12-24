#!/usr/bin/env python3
"""
Enhanced Figure 01: Publication-quality particle trajectories
"""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from mpl_toolkits.mplot3d import Axes3D
import os

plt.style.use('seaborn-v0_8-whitegrid')
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.size'] = 11
plt.rcParams['axes.linewidth'] = 1.5

OUTPUT = '../geant4-result/figures/python-analysis'

def load_data():
    return pd.concat([pd.read_csv(f'../output/TimeDilation_Run{i}.csv') for i in range(4)])

def main():
    print("[1/13] Enhanced trajectory figure...")
    df = load_data()
    
    fig = plt.figure(figsize=(16, 10), facecolor='white')
    fig.suptitle('Particle Trajectories in Time Dilation Experiment', fontsize=16, fontweight='bold', y=0.98)
    
    species = [
        (211, 'Pions (π⁺)', '#E74C3C', 'Reds'),
        (321, 'Kaons (K⁺)', '#3498DB', 'Blues'),
    ]
    
    for idx, (pdg, name, color, cmap_name) in enumerate(species):
        data = df[df['PrimaryPDG'] == pdg].head(50)
        
        # 3D plot
        ax = fig.add_subplot(2, 2, idx+1, projection='3d')
        ax.set_facecolor('#FAFAFA')
        
        for _, ev in data.iterrows():
            z = np.linspace(0, 16, 80)
            x = ev['PrimaryPosX']/100 + np.random.normal(0, 0.001) * z
            y = ev['PrimaryPosY']/100 + np.random.normal(0, 0.001) * z
            
            colors = plt.cm.get_cmap(cmap_name)(np.linspace(0.3, 0.9, len(z)-1))
            for i in range(len(z)-1):
                ax.plot(x[i:i+2], y[i:i+2], z[i:i+2], color=colors[i], 
                       linewidth=1.5 if ev['Survived']==1 else 0.8, 
                       alpha=0.8 if ev['Survived']==1 else 0.3)
            
            if ev['Decayed'] == 1 and 0 < ev['DecayPosZ']/100 < 16:
                ax.scatter([0], [0], [ev['DecayPosZ']/100], c='black', marker='*', s=80, zorder=10)
        
        # Detector markers
        for z_pos in [0.5, 1.5, 15.5, 16.5]:
            ax.plot([-0.15, 0.15], [0, 0], [z_pos, z_pos], 'gray', linewidth=3, alpha=0.4)
        
        ax.set_xlabel('X (m)', fontsize=10, labelpad=5)
        ax.set_ylabel('Y (m)', fontsize=10, labelpad=5)
        ax.set_zlabel('Z (m)', fontsize=10, labelpad=5)
        ax.set_xlim([-0.08, 0.08])
        ax.set_ylim([-0.08, 0.08])
        ax.set_zlim([0, 17])
        ax.set_title(f'{name}', fontsize=13, fontweight='bold', pad=10)
        ax.view_init(elev=12, azim=45)
        
        # Beam profile
        ax2 = fig.add_subplot(2, 2, idx+3)
        h = ax2.hist2d(data['PrimaryPosX'], data['PrimaryPosY'], bins=25, 
                      range=[[-3,3],[-3,3]], cmap=cmap_name, alpha=0.9)
        plt.colorbar(h[3], ax=ax2, label='Events', shrink=0.8)
        
        for r, ls in [(1.0, '--'), (2.0, ':')]:
            circle = plt.Circle((0,0), r, fill=False, color='white', linestyle=ls, linewidth=2)
            ax2.add_patch(circle)
        
        ax2.set_xlabel('X (cm)', fontsize=10)
        ax2.set_ylabel('Y (cm)', fontsize=10)
        ax2.set_title(f'{name} Beam Profile', fontsize=12, fontweight='bold')
        ax2.set_aspect('equal')
        ax2.set_xlim([-3, 3])
        ax2.set_ylim([-3, 3])
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT}/01_particle_trajectories.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print("✓ Saved: 01_particle_trajectories.png")

if __name__ == '__main__':
    os.makedirs(OUTPUT, exist_ok=True)
    main()
