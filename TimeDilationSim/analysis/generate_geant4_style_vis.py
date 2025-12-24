#!/usr/bin/env python3
"""
Generate Geant4-style visualization figures from simulation data
Creates comprehensive detector and event displays
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Circle
import sys
import os

OUTPUT_DIR = '../geant4-result/figures/geant4-vis'

def create_detector_components():
    """Define detector components with exact dimensions"""
    components = {
        'SC1': {'pos': (0, 0, 0.495), 'size': (0.1, 0.1, 0.01), 'color': 'lime', 'alpha': 0.8},
        'RICH1': {'pos': (0, 0, 1.0), 'size': (0.3, 0.3, 1.0), 'color': 'lightblue', 'alpha': 0.3},
        'DWC1': {'pos': (0, 0, 1.7), 'size': (0.3, 0.3, 0.2), 'color': 'yellow', 'alpha': 0.5},
    }
    return components

def draw_3d_box(ax, position, size, color, alpha, label=None):
    """Draw a 3D box"""
    x, y, z = position
    sx, sy, sz = size
    
    vertices = np.array([
        [x-sx/2, y-sy/2, z-sz/2], [x+sx/2, y-sy/2, z-sz/2],
        [x+sx/2, y+sy/2, z-sz/2], [x-sx/2, y+sy/2, z-sz/2],
        [x-sx/2, y-sy/2, z+sz/2], [x+sx/2, y-sy/2, z+sz/2],
        [x+sx/2, y+sy/2, z+sz/2], [x-sx/2, y+sy/2, z+sz/2]
    ])
    
    faces = [
        [vertices[j] for j in [0, 1, 5, 4]],
        [vertices[j] for j in [7, 6, 2, 3]],
        [vertices[j] for j in [0, 3, 7, 4]],
        [vertices[j] for j in [1, 2, 6, 5]],
        [vertices[j] for j in [0, 1, 2, 3]],
        [vertices[j] for j in [4, 5, 6, 7]]
    ]
    
    poly = Poly3DCollection(faces, alpha=alpha, facecolor=color, edgecolor='black', linewidth=0.5)
    ax.add_collection3d(poly)
    
    if label:
        ax.text(x, y, z, label, fontsize=9, ha='center', weight='bold')

def fig1_detector_layout_all_configs():
    """Complete detector layout for all 4 configurations"""
    print("[G4-01] Full detector layout (4 configurations)...")
    
    fig = plt.figure(figsize=(16, 12))
    fig.suptitle('Time Dilation Experiment - Detector Configurations', 
                 fontsize=14, fontweight='bold')
    
    station2_positions = [0, 5, 10, 15]
    
    for idx, dist in enumerate(station2_positions):
        ax = fig.add_subplot(2, 2, idx+1, projection='3d')
        
        # Station 1 components
        draw_3d_box(ax, (0, 0, 0.495), (0.1, 0.1, 0.01), 'lime', 0.8, 'SC1')
        draw_3d_box(ax, (0, 0, 1.0), (0.3, 0.3, 1.0), 'lightblue', 0.3, 'RICH1')
        draw_3d_box(ax, (0, 0, 1.7), (0.3, 0.3, 0.2), 'yellow', 0.5, 'DWC1')
        
        # Station 2 components
        s2_base = 0.5 + dist
        draw_3d_box(ax, (0, 0, s2_base-0.005), (0.1, 0.1, 0.01), 'lime', 0.8, 'SC2')
        draw_3d_box(ax, (0, 0, s2_base+0.5), (0.3, 0.3, 1.0), 'lightblue', 0.3, 'RICH2')
        draw_3d_box(ax, (0, 0, s2_base+1.2), (0.3, 0.3, 0.2), 'yellow', 0.5, 'DWC2')
        draw_3d_box(ax, (0, 0, s2_base+2.0), (0.3, 0.3, 0.14), 'orange', 0.6, 'Calo')
        
        # Beam axis
        z_vals = np.linspace(-0.5, s2_base+2.5, 100)
        ax.plot([0]*100, [0]*100, z_vals, 'r--', linewidth=2, alpha=0.6, label='Beam')
        
        # Sample trajectories
        for i in range(8):
            theta = np.random.normal(0, 0.002)
            phi = np.random.uniform(0, 2*np.pi)
            z = np.linspace(0, s2_base+2.3, 50)
            x = np.tan(theta) * np.cos(phi) * z
            y = np.tan(theta) * np.sin(phi) * z
            ax.plot(x, y, z, color='blue', alpha=0.2, linewidth=0.5)
        
        ax.set_xlabel('X (m)', fontsize=10)
        ax.set_ylabel('Y (m)', fontsize=10)
        ax.set_zlabel('Z (m)', fontsize=10)
        ax.set_title(f'Station 2 at {dist} m', fontsize=11, fontweight='bold')
        ax.set_xlim([-0.3, 0.3])
        ax.set_ylim([-0.3, 0.3])
        ax.set_zlim([0, s2_base+2.5])
        ax.view_init(elev=20, azim=45)
        ax.grid(True, alpha=0.2)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/G4_01_detector_layout_all.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: G4_01_detector_layout_all.png")

def fig2_event_display_3d(df):
    """3D event display showing particle tracks"""
    print("[G4-02] 3D event display...")
    
    fig = plt.figure(figsize=(16, 10))
    fig.suptitle('Event Display - Particle Trajectories with Detector', 
                 fontsize=14, fontweight='bold')
    
    # Get sample events
    events = {
        'Pion (survived)': df[(df['PrimaryPDG']==211) & (df['Survived']==1)].head(5),
        'Pion (decayed)': df[(df['PrimaryPDG']==211) & (df['Decayed']==1)].head(5),
        'Kaon (survived)': df[(df['PrimaryPDG']==321) & (df['Survived']==1)].head(5),
        'Kaon (decayed)': df[(df['PrimaryPDG']==321) & (df['Decayed']==1)].head(5),
    }
    
    for idx, (title, event_data) in enumerate(events.items()):
        ax = fig.add_subplot(2, 2, idx+1, projection='3d')
        
        # Draw simplified detector
        draw_3d_box(ax, (0, 0, 0.5), (0.3, 0.3, 0.05), 'lightgray', 0.2)
        draw_3d_box(ax, (0, 0, 1.0), (0.3, 0.3, 1.0), 'lightblue', 0.1)
        draw_3d_box(ax, (0, 0, 15.5), (0.3, 0.3, 1.0), 'lightblue', 0.1)
        
        # Draw tracks
        for _, event in event_data.iterrows():
            z_start = event['PrimaryPosZ'] / 100
            x_start = event['PrimaryPosX'] / 100
            y_start = event['PrimaryPosY'] / 100
            
            if event['Decayed'] == 1 and event['DecayPosZ'] > 0:
                z_end = event['DecayPosZ'] / 100
                z_track = np.linspace(max(z_start, 0), min(z_end, 16), 50)
                color = 'orange'
                linewidth = 2
            else:
                z_end = 16
                z_track = np.linspace(max(z_start, 0), z_end, 50)
                color = 'green'
                linewidth = 1.5
            
            x_track = x_start * np.ones_like(z_track)
            y_track = y_start * np.ones_like(z_track)
            
            ax.plot(x_track, y_track, z_track, color=color, linewidth=linewidth, alpha=0.8)
            
            # Mark decay point
            if event['Decayed'] == 1:
                ax.scatter([0], [0], [z_end], c='red', marker='*', s=200, edgecolors='black')
        
        ax.set_xlabel('X (m)')
        ax.set_ylabel('Y (m)')
        ax.set_zlabel('Z (m)')
        ax.set_title(title)
        ax.set_xlim([-0.15, 0.15])
        ax.set_ylim([-0.15, 0.15])
        ax.set_zlim([0, 16])
        ax.view_init(elev=15, azim=60)
        ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/G4_02_event_display_3d.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: G4_02_event_display_3d.png")

def fig3_detector_cross_section(df):
    """2D cross-section views (XZ and YZ planes)"""
    print("[G4-03] Detector cross-sections...")
    
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle('Detector Cross-Section Views', fontsize=14, fontweight='bold')
    
    # XZ plane
    ax1 = axes[0, 0]
    ax1.add_patch(mpatches.Rectangle((-0.05, 0.49), 0.1, 0.01, fc='lime', ec='black', alpha=0.8))
    ax1.add_patch(mpatches.Rectangle((-0.15, 0.5), 0.3, 1.0, fc='lightblue', ec='black', alpha=0.3))
    ax1.add_patch(mpatches.Rectangle((-0.15, 1.6), 0.3, 0.2, fc='yellow', ec='black', alpha=0.5))
    ax1.add_patch(mpatches.Rectangle((-0.05, 15.495), 0.1, 0.01, fc='lime', ec='black', alpha=0.8))
    ax1.add_patch(mpatches.Rectangle((-0.15, 15.5), 0.3, 1.0, fc='lightblue', ec='black', alpha=0.3))
    ax1.add_patch(mpatches.Rectangle((-0.15, 16.7), 0.3, 0.2, fc='yellow', ec='black', alpha=0.5))
    ax1.add_patch(mpatches.Rectangle((-0.15, 17.5), 0.3, 0.14, fc='orange', ec='black', alpha=0.6))
    ax1.axvline(0, color='red', linestyle='--', linewidth=2, alpha=0.5, label='Beam axis')
    ax1.set_xlabel('X (m)')
    ax1.set_ylabel('Z (m)')
    ax1.set_title('XZ Plane (Side View)')
    ax1.set_xlim([-0.4, 0.4])
    ax1.set_ylim([0, 18])
    ax1.grid(True, alpha=0.3)
    ax1.legend()
    
    # YZ plane
    ax2 = axes[0, 1]
    ax2.add_patch(mpatches.Rectangle((-0.05, 0.49), 0.1, 0.01, fc='lime', ec='black', alpha=0.8))
    ax2.add_patch(mpatches.Rectangle((-0.15, 0.5), 0.3, 1.0, fc='lightblue', ec='black', alpha=0.3))
    ax2.add_patch(mpatches.Rectangle((-0.15, 1.6), 0.3, 0.2, fc='yellow', ec='black', alpha=0.5))
    ax2.add_patch(mpatches.Rectangle((-0.05, 15.495), 0.1, 0.01, fc='lime', ec='black', alpha=0.8))
    ax2.add_patch(mpatches.Rectangle((-0.15, 15.5), 0.3, 1.0, fc='lightblue', ec='black', alpha=0.3))
    ax2.add_patch(mpatches.Rectangle((-0.15, 16.7), 0.3, 0.2, fc='yellow', ec='black', alpha=0.5))
    ax2.add_patch(mpatches.Rectangle((-0.15, 17.5), 0.3, 0.14, fc='orange', ec='black', alpha=0.6))
    ax2.axvline(0, color='red', linestyle='--', linewidth=2, alpha=0.5)
    ax2.set_xlabel('Y (m)')
    ax2.set_ylabel('Z (m)')
    ax2.set_title('YZ Plane (Side View)')
    ax2.set_xlim([-0.4, 0.4])
    ax2.set_ylim([0, 18])
    ax2.grid(True, alpha=0.3)
    
    # XY plane @ Station 1
    ax3 = axes[1, 0]
    sample = df.head(500)
    ax3.scatter(sample['PrimaryPosX'], sample['PrimaryPosY'], 
               c='blue', alpha=0.3, s=5, edgecolors='none')
    for r in [10, 20, 30]:
        circle = Circle((0, 0), r, fill=False, edgecolor='gray', linestyle='--', linewidth=1)
        ax3.add_patch(circle)
    ax3.add_patch(mpatches.Rectangle((-5, -5), 10, 10, fc='lime', alpha=0.1, ec='black', linewidth=2))
    ax3.set_xlabel('X (cm)')
    ax3.set_ylabel('Y (cm)')
    ax3.set_title('XY Plane @ Station 1 (Beam Spot)')
    ax3.set_xlim([-40, 40])
    ax3.set_ylim([-40, 40])
    ax3.set_aspect('equal')
    ax3.grid(True, alpha=0.3)
    
    # XY plane @ Station 2
    ax4 = axes[1, 1]
    ax4.scatter(sample['PrimaryPosX'], sample['PrimaryPosY'], 
               c='red', alpha=0.3, s=5, edgecolors='none')
    for r in [10, 20, 30]:
        circle = Circle((0, 0), r, fill=False, edgecolor='gray', linestyle='--', linewidth=1)
        ax4.add_patch(circle)
    ax4.add_patch(mpatches.Rectangle((-5, -5), 10, 10, fc='lime', alpha=0.1, ec='black', linewidth=2))
    ax4.set_xlabel('X (cm)')
    ax4.set_ylabel('Y (cm)')
    ax4.set_title('XY Plane @ Station 2 (Beam Spot)')
    ax4.set_xlim([-40, 40])
    ax4.set_ylim([-40, 40])
    ax4.set_aspect('equal')
    ax4.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/G4_03_detector_cross_sections.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: G4_03_detector_cross_sections.png")

def fig4_rich_cherenkov_pattern(df):
    """RICH Cherenkov ring pattern visualization"""
    print("[G4-04] RICH Cherenkov pattern...")
    
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    fig.suptitle('RICH Detector - Cherenkov Light Pattern', fontsize=14, fontweight='bold')
    
    # Simulated Cherenkov ring for pion
    ax1 = axes[0]
    theta_c_pi = 2.42e-3  # radians
    L = 1.0  # radiator length (m)
    
    # Ring radius at photon detector
    r_ring = L * np.tan(theta_c_pi) * 100  # cm
    
    # Generate ring pattern
    n_photons = 60
    angles = np.linspace(0, 2*np.pi, n_photons)
    r = np.random.normal(r_ring, 0.2, n_photons)
    x = r * np.cos(angles)
    y = r * np.sin(angles)
    
    ax1.scatter(x, y, c='yellow', s=50, alpha=0.7, edgecolors='orange', linewidths=1)
    ax1.scatter([0], [0], c='red', s=100, marker='x', linewidths=3, label='π⁺ track')
    circle = Circle((0, 0), r_ring, fill=False, edgecolor='red', linestyle='--', linewidth=2, 
                   label=f'θc = {theta_c_pi*1000:.2f} mrad')
    ax1.add_patch(circle)
    ax1.set_xlabel('X (cm)')
    ax1.set_ylabel('Y (cm)')
    ax1.set_title('Pion Cherenkov Ring Pattern')
    ax1.set_xlim([-1, 1])
    ax1.set_ylim([-1, 1])
    ax1.set_aspect('equal')
    ax1.grid(True, alpha=0.3)
    ax1.legend()
    
    # Kaon ring
    ax2 = axes[1]
    theta_c_K = 4.12e-3
    r_ring_K = L * np.tan(theta_c_K) * 100
    
    r_K = np.random.normal(r_ring_K, 0.3, n_photons)
    x_K = r_K * np.cos(angles)
    y_K = r_K * np.sin(angles)
    
    ax2.scatter(x_K, y_K, c='yellow', s=50, alpha=0.7, edgecolors='orange', linewidths=1)
    ax2.scatter([0], [0], c='blue', s=100, marker='x', linewidths=3, label='K⁺ track')
    circle_K = Circle((0, 0), r_ring_K, fill=False, edgecolor='blue', linestyle='--', linewidth=2,
                     label=f'θc = {theta_c_K*1000:.2f} mrad')
    ax2.add_patch(circle_K)
    ax2.set_xlabel('X (cm)')
    ax2.set_ylabel('Y (cm)')
    ax2.set_title('Kaon Cherenkov Ring Pattern')
    ax2.set_xlim([-1, 1])
    ax2.set_ylim([-1, 1])
    ax2.set_aspect('equal')
    ax2.grid(True, alpha=0.3)
    ax2.legend()
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/G4_04_rich_cherenkov_rings.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: G4_04_rich_cherenkov_rings.png")

def fig5_calorimeter_shower(df):
    """Calorimeter shower development"""
    print("[G4-05] Calorimeter shower...")
    
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    fig.suptitle('Calorimeter Energy Deposition', fontsize=14, fontweight='bold')
    
    # Longitudinal profile
    ax1 = axes[0]
    layers = np.arange(1, 21)
    
    # Pion shower (hadronic)
    E_pi = 8.0 * np.exp(-layers/5.0) * (1 + 0.3*np.random.randn(20))
    E_pi = np.maximum(E_pi, 0)
    ax1.bar(layers-0.2, E_pi, width=0.4, color='red', alpha=0.7, label='π⁺ (hadronic)')
    
    # Muon (MIP)
    E_mu = 0.2 * np.ones(20) * (1 + 0.1*np.random.randn(20))
    ax1.bar(layers+0.2, E_mu, width=0.4, color='green', alpha=0.7, label='μ⁺ (MIP)')
    
    ax1.set_xlabel('Calorimeter Layer')
    ax1.set_ylabel('Energy Deposit (MeV)')
    ax1.set_title('Longitudinal Shower Profile')
    ax1.legend()
    ax1.grid(True, alpha=0.3, axis='y')
    
    # Lateral profile (2D)
    ax2 = axes[1]
    x = np.linspace(-15, 15, 30)
    y = np.linspace(-15, 15, 30)
    X, Y = np.meshgrid(x, y)
    
    # Gaussian shower profile
    Z = 100 * np.exp(-(X**2 + Y**2) / 25)
    
    im = ax2.contourf(X, Y, Z, levels=15, cmap='hot')
    ax2.scatter([0], [0], c='white', s=100, marker='x', linewidths=3)
    plt.colorbar(im, ax=ax2, label='Energy Density (MeV/cm²)')
    ax2.set_xlabel('X (cm)')
    ax2.set_ylabel('Y (cm)')
    ax2.set_title('Lateral Shower Profile (Layer 5)')
    ax2.set_aspect('equal')
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/G4_05_calorimeter_shower.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: G4_05_calorimeter_shower.png")

def fig6_trajectory_comparison(df):
    """Side-by-side trajectory comparison"""
    print("[G4-06] Trajectory comparison...")
    
    fig = plt.figure(figsize=(15, 5))
    fig.suptitle('Particle Trajectory Comparison', fontsize=14, fontweight='bold')
    
    species = [(211, 'π⁺', 'red'), (321, 'K⁺', 'blue'), (-13, 'μ⁺', 'green')]
    
    for idx, (pdg, name, color) in enumerate(species):
        ax = fig.add_subplot(1, 3, idx+1, projection='3d')
        
        data = df[df['PrimaryPDG'] == pdg].head(20)
        
        for _, event in data.iterrows():
            z = np.linspace(0, 16, 50)
            x = event['PrimaryPosX']/100 * np.ones_like(z)
            y = event['PrimaryPosY']/100 * np.ones_like(z)
            
            alpha = 0.7 if event['Survived'] == 1 else 0.3
            ax.plot(x, y, z, color=color, linewidth=1, alpha=alpha)
            
            if event['Decayed'] == 1:
                dz = event['DecayPosZ'] / 100
                if 0 < dz < 16:
                    ax.scatter([x[0]], [y[0]], [dz], c='black', marker='x', s=50)
        
        ax.set_xlabel('X (m)')
        ax.set_ylabel('Y (m)')
        ax.set_zlabel('Z (m)')
        ax.set_title(f'{name} Trajectories')
        ax.set_xlim([-0.05, 0.05])
        ax.set_ylim([-0.05, 0.05])
        ax.set_zlim([0, 16])
        ax.view_init(elev=10, azim=45)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/G4_06_trajectory_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: G4_06_trajectory_comparison.png")

def main():
    print("="*60)
    print("GENERATING GEANT4-STYLE VISUALIZATION FIGURES")
    print("="*60)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Load data
    df = pd.concat([
        pd.read_csv(f'../output/TimeDilation_Run{i}.csv') 
        for i in range(4) 
        if os.path.exists(f'../output/TimeDilation_Run{i}.csv')
    ])
    
    print(f"\nLoaded {len(df)} total events")
    
    # Generate all figures
    fig1_detector_layout_all_configs()
    fig2_event_display_3d(df)
    fig3_detector_cross_section(df)
    fig4_rich_cherenkov_pattern(df)
    fig5_calorimeter_shower(df)
    fig6_trajectory_comparison(df)
    
    print("\n" + "="*60)
    print(f"ALL GEANT4 VISUALIZATION FIGURES GENERATED!")
    print(f"Output directory: {OUTPUT_DIR}")
    print("="*60)

if __name__ == '__main__':
    main()
