#!/usr/bin/env python3
"""
Enhanced Figure 01: Beautiful particle trajectories with gradients and effects
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from matplotlib import cm
from matplotlib.colors import LinearSegmentedColormap
import sys
import os

OUTPUT_DIR = '../geant4-result/figures/python-analysis'

def load_data():
    df = pd.concat([
        pd.read_csv(f'../output/TimeDilation_Run{i}.csv') 
        for i in range(4) 
        if os.path.exists(f'../output/TimeDilation_Run{i}.csv')
    ])
    return df

def create_custom_colormap():
    """Create beautiful gradient colormaps"""
    colors_pion = ['#ff0000', '#ff6b6b', '#ffaaaa']
    colors_kaon = ['#0000ff', '#6b6bff', '#aaaaff']
    colors_muon = ['#00ff00', '#6bff6b', '#aaffaa']
    
    cmap_pi = LinearSegmentedColormap.from_list('pion', colors_pion)
    cmap_k = LinearSegmentedColormap.from_list('kaon', colors_kaon)
    cmap_mu = LinearSegmentedColormap.from_list('muon', colors_muon)
    
    return cmap_pi, cmap_k, cmap_mu

def fig1_enhanced(df):
    """Enhanced trajectory visualization with gradients and styling"""
    print("[Enhanced-01] Beautiful particle trajectories...")
    
    fig = plt.figure(figsize=(18, 12), facecolor='#f8f9fa')
    fig.suptitle('Particle Trajectories - Time Dilation Experiment', 
                 fontsize=16, fontweight='bold', y=0.98)
    
    cmaps = create_custom_colormap()
    
    pions = df[df['PrimaryPDG'] == 211].head(40)
    kaons = df[df['PrimaryPDG'] == 321].head(40)
    muons = df[df['PrimaryPDG'] == -13].head(10) if len(df[df['PrimaryPDG'] == -13]) > 0 else pd.DataFrame()
    
    for idx, (data, cmap, name, main_color) in enumerate([
        (pions, cmaps[0], 'Pions (π⁺)', '#e74c3c'),
        (kaons, cmaps[1], 'Kaons (K⁺)', '#3498db'),
        (muons if len(muons) > 0 else pions.head(10), cmaps[2], 'Muons (μ⁺)', '#2ecc71')
    ]):
        # 3D trajectory plot
        ax = fig.add_subplot(2, 3, idx+1, projection='3d', facecolor='#ffffff')
        ax.set_title(f'{name} - 3D Trajectories', fontsize=13, fontweight='bold', pad=15)
        
        if len(data) > 0:
            for i, (_, event) in enumerate(data.iterrows()):
                z_start = max(event['PrimaryPosZ'] / 100, -0.5)
                z_end = 15.5
                
                n_pts = 100
                z_path = np.linspace(z_start, z_end, n_pts)
                
                x_start = event['PrimaryPosX'] / 100
                y_start = event['PrimaryPosY'] / 100
                
                theta = np.random.normal(0, 0.001)
                phi = np.random.uniform(0, 2*np.pi)
                
                x_path = x_start + np.tan(theta) * np.cos(phi) * (z_path - z_start)
                y_path = y_start + np.tan(theta) * np.sin(phi) * (z_path - z_start)
                
                survived = event['Survived'] == 1
                
                # Gradient effect along track
                for j in range(n_pts-1):
                    alpha = 0.7 if survived else 0.3
                    color_val = cmap(j / n_pts)
                    ax.plot(x_path[j:j+2], y_path[j:j+2], z_path[j:j+2], 
                           color=color_val, linewidth=1.5, alpha=alpha)
                
                # Mark decay point with glow effect
                if event['Decayed'] == 1 and event['DecayPosZ'] > 0:
                    dz = event['DecayPosZ'] / 100
                    if 0 < dz < 16:
                        ax.scatter([0], [0], [dz], c='black', marker='X', 
                                 s=100, alpha=0.8, edgecolors='white', linewidths=2)
        
        # Styling
        ax.set_xlabel('X (m)', fontsize=10, labelpad=8)
        ax.set_ylabel('Y (m)', fontsize=10, labelpad=8)
        ax.set_zlabel('Z (m)', fontsize=10, labelpad=8)
        ax.set_xlim([-0.1, 0.1])
        ax.set_ylim([-0.1, 0.1])
        ax.set_zlim([0, 16])
        ax.view_init(elev=15, azim=45)
        ax.grid(True, alpha=0.2, linestyle='--')
        ax.xaxis.pane.fill = False
        ax.yaxis.pane.fill = False
        ax.zaxis.pane.fill = False
        
        # Beam profile with density and contours
        ax2 = fig.add_subplot(2, 3, idx+4)
        ax2.set_title(f'{name} - Beam Profile', fontsize=12, fontweight='bold')
        
        if len(data) > 0:
            # 2D histogram with smooth interpolation
            h, xedges, yedges = np.histogram2d(data['PrimaryPosX'], data['PrimaryPosY'], 
                                              bins=30, range=[[-4, 4], [-4, 4]])
            
            extent = [xedges[0], xedges[-1], yedges[0], yedges[-1]]
            im = ax2.imshow(h.T, extent=extent, origin='lower', 
                           cmap=cmap, alpha=0.8, interpolation='gaussian')
            
            # Add contours
            X, Y = np.meshgrid((xedges[:-1] + xedges[1:]) / 2, 
                             (yedges[:-1] + yedges[1:]) / 2)
            ax2.contour(X, Y, h.T, levels=5, colors='white', alpha=0.3, linewidths=1)
            
            # Overlay scatter points
            ax2.scatter(data['PrimaryPosX'], data['PrimaryPosY'], 
                       c=main_color, alpha=0.4, s=20, edgecolors='white', linewidths=0.5)
            
            plt.colorbar(im, ax=ax2, label='Event Density', fraction=0.046, pad=0.04)
        
        # Reference circles with labels
        for r, label in zip([1.0, 2.0], ['1σ', '2σ']):
            circle = plt.Circle((0, 0), r, fill=False, edgecolor='gray', 
                               linestyle='--', linewidth=2, alpha=0.6)
            ax2.add_patch(circle)
            ax2.text(r/np.sqrt(2), r/np.sqrt(2), label, 
                    fontsize=10, color='gray', weight='bold')
        
        ax2.set_xlabel('X (cm)', fontsize=10)
        ax2.set_ylabel('Y (cm)', fontsize=10)
        ax2.set_xlim([-4, 4])
        ax2.set_ylim([-4, 4])
        ax2.set_aspect('equal')
        ax2.grid(True, alpha=0.2, linestyle='--')
        ax2.set_facecolor('#f8f9fa')
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/01_particle_trajectories.png', dpi=300, bbox_inches='tight', facecolor='#f8f9fa')
    plt.close()
    print("✓ Saved enhanced: 01_particle_trajectories.png")

if __name__ == '__main__':
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    df = load_data()
    fig1_enhanced(df)
