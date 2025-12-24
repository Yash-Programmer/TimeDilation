#!/usr/bin/env python3
"""
Enhanced 3D Geant4-Style Visualization - Publication Quality
Creates stunning detector and particle visualizations
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Poly3DCollection, Line3DCollection
from matplotlib.patches import FancyBboxPatch, Circle
import matplotlib.colors as mcolors
from matplotlib import cm
import os

# Publication-quality settings
plt.rcParams.update({
    'font.size': 11,
    'font.family': 'sans-serif',
    'axes.labelsize': 12,
    'axes.titlesize': 13,
    'figure.facecolor': 'white',
    'axes.facecolor': 'white',
    'savefig.facecolor': 'white',
    'axes.grid': True,
    'grid.alpha': 0.3
})

OUTPUT = '../geant4-result/figures/python-analysis'

# Color scheme
COLORS = {
    'pion': '#E74C3C',      # Red
    'kaon': '#3498DB',      # Blue  
    'muon': '#27AE60',      # Green
    'scint': '#2ECC71',     # Bright green
    'rich': '#5DADE2',      # Sky blue
    'dwc': '#F4D03F',       # Gold
    'calo': '#E67E22',      # Orange
    'beam': '#9B59B6',      # Purple
}

def draw_detector_3d(ax, pos, size, color, alpha, label, style='box'):
    """Draw enhanced 3D detector component"""
    x, y, z = pos
    sx, sy, sz = size
    
    vertices = np.array([
        [x-sx/2, y-sy/2, z-sz/2], [x+sx/2, y-sy/2, z-sz/2],
        [x+sx/2, y+sy/2, z-sz/2], [x-sx/2, y+sy/2, z-sz/2],
        [x-sx/2, y-sy/2, z+sz/2], [x+sx/2, y-sy/2, z+sz/2],
        [x+sx/2, y+sy/2, z+sz/2], [x-sx/2, y+sy/2, z+sz/2]
    ])
    
    faces = [
        [vertices[0], vertices[1], vertices[5], vertices[4]],
        [vertices[7], vertices[6], vertices[2], vertices[3]],
        [vertices[0], vertices[3], vertices[7], vertices[4]],
        [vertices[1], vertices[2], vertices[6], vertices[5]],
        [vertices[0], vertices[1], vertices[2], vertices[3]],
        [vertices[4], vertices[5], vertices[6], vertices[7]]
    ]
    
    poly = Poly3DCollection(faces, alpha=alpha, facecolor=color, 
                           edgecolor='black', linewidth=0.8)
    ax.add_collection3d(poly)
    
    # Enhanced label with background
    ax.text(x, y + sy/2 + 0.05, z + sz/2, label, fontsize=9, 
           fontweight='bold', ha='center', va='bottom',
           bbox=dict(boxstyle='round,pad=0.2', facecolor='white', 
                    edgecolor=color, alpha=0.9))

def create_enhanced_detector_vis():
    """Create stunning 4-panel detector configuration visualization"""
    print('[VIS 1/4] Creating enhanced detector configurations...')
    
    fig = plt.figure(figsize=(18, 14), facecolor='white')
    fig.suptitle('T9 Beamline Detector Configurations\nTime Dilation Universality Test', 
                 fontsize=16, fontweight='bold', y=0.98)
    
    configs = [(0, 'Baseline (Reference)'), (5, '5m Flight Path'), 
               (10, '10m Flight Path'), (15, '15m Maximum')]
    
    for idx, (dist, title) in enumerate(configs):
        ax = fig.add_subplot(2, 2, idx+1, projection='3d')
        ax.set_title(f'Configuration {idx+1}: {title}', fontsize=12, fontweight='bold', pad=10)
        
        # Station 1 (fixed at z=0.5m)
        z1 = 0.5
        draw_detector_3d(ax, (0, 0, z1-0.01), (0.12, 0.12, 0.02), COLORS['scint'], 0.8, 'SC1')
        draw_detector_3d(ax, (0, 0, z1+0.6), (0.35, 0.35, 1.0), COLORS['rich'], 0.4, 'RICH1')
        draw_detector_3d(ax, (0, 0, z1+1.4), (0.35, 0.35, 0.25), COLORS['dwc'], 0.6, 'DWC1')
        
        # Station 2 (variable position)
        z2 = z1 + dist + 2
        draw_detector_3d(ax, (0, 0, z2-0.01), (0.12, 0.12, 0.02), COLORS['scint'], 0.8, 'SC2')
        draw_detector_3d(ax, (0, 0, z2+0.6), (0.35, 0.35, 1.0), COLORS['rich'], 0.4, 'RICH2')
        draw_detector_3d(ax, (0, 0, z2+1.4), (0.35, 0.35, 0.25), COLORS['dwc'], 0.6, 'DWC2')
        draw_detector_3d(ax, (0, 0, z2+2.2), (0.4, 0.4, 0.2), COLORS['calo'], 0.7, 'Calorimeter')
        
        # Beam pipe
        z_beam = np.linspace(-0.3, z2+2.8, 100)
        theta = np.linspace(0, 2*np.pi, 30)
        r = 0.03
        for i in range(0, len(z_beam), 5):
            circle_x = r * np.cos(theta)
            circle_y = r * np.sin(theta)
            circle_z = np.full_like(theta, z_beam[i])
            ax.plot(circle_x, circle_y, circle_z, 'gray', alpha=0.1, linewidth=0.5)
        
        # Central beam axis
        ax.plot([0, 0], [0, 0], [-0.3, z2+2.8], color=COLORS['beam'], 
               linewidth=3, linestyle='--', alpha=0.7, label='Beam axis')
        
        # Sample particle trajectories with color gradient
        np.random.seed(42 + idx)
        cmap = cm.plasma
        for i in range(8):
            theta_div = np.random.normal(0, 0.003)
            phi = np.random.uniform(0, 2*np.pi)
            
            z_traj = np.linspace(-0.3, z2+2.8, 80)
            x_traj = np.tan(theta_div) * np.cos(phi) * z_traj
            y_traj = np.tan(theta_div) * np.sin(phi) * z_traj
            
            # Color gradient along trajectory
            points = np.array([x_traj, y_traj, z_traj]).T.reshape(-1, 1, 3)
            segments = np.concatenate([points[:-1], points[1:]], axis=1)
            
            colors = cmap(np.linspace(0.2, 0.9, len(segments)))
            for j, (seg, col) in enumerate(zip(segments, colors)):
                ax.plot([seg[0,0], seg[1,0]], [seg[0,1], seg[1,1]], 
                       [seg[0,2], seg[1,2]], color=col, linewidth=1.5, alpha=0.7)
        
        # Flight path annotation
        if dist > 0:
            mid_z = (z1 + 1.8 + z2 - 0.5) / 2
            ax.text(0.25, 0.25, mid_z, f'← {dist} m →', fontsize=11, fontweight='bold',
                   bbox=dict(boxstyle='round', facecolor='white', edgecolor='gray', alpha=0.9))
        
        # Axis settings
        ax.set_xlabel('X (m)', fontsize=10, labelpad=5)
        ax.set_ylabel('Y (m)', fontsize=10, labelpad=5)
        ax.set_zlabel('Z (m)', fontsize=10, labelpad=5)
        ax.set_xlim([-0.4, 0.4])
        ax.set_ylim([-0.4, 0.4])
        ax.set_zlim([-0.5, z2+3])
        ax.view_init(elev=25, azim=45)
        ax.set_box_aspect([1, 1, 2.5])
    
    plt.tight_layout(rect=[0, 0, 1, 0.96])
    plt.savefig(f'{OUTPUT}/vis01_detector_configs.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print('Saved: vis01_detector_configs.png')

def create_particle_trajectory_vis():
    """Create enhanced particle trajectory visualization"""
    print('[VIS 2/4] Creating particle trajectory visualization...')
    
    df = pd.concat([pd.read_csv(f'../output/TimeDilation_Run{i}.csv') for i in range(4)])
    
    fig = plt.figure(figsize=(18, 12), facecolor='white')
    fig.suptitle('Particle Trajectories in T9 Beamline\n8 GeV/c Mixed Hadron Beam', 
                fontsize=16, fontweight='bold', y=0.98)
    
    particles = [
        (211, 'Pions (π⁺)', COLORS['pion'], 0.033, 447),
        (321, 'Kaons (K⁺)', COLORS['kaon'], 0.221, 60),
        (13, 'Muons (μ⁺)', COLORS['muon'], 0.0003, 49900)
    ]
    
    for idx, (pdg, name, color, decay_frac, decay_len) in enumerate(particles):
        # 3D trajectory plot
        ax1 = fig.add_subplot(2, 3, idx+1, projection='3d')
        ax1.set_title(f'{name}\nλ = {decay_len} m, {decay_frac*100:.1f}% decay @ 15m', 
                     fontsize=11, fontweight='bold', color=color)
        
        data = df[df['PrimaryPDG'] == pdg].head(30)
        
        for _, event in data.iterrows():
            survived = event['Survived'] == 1
            
            # Trajectory
            z_end = 17 if survived else event['DecayPosZ'] / 100  # cm to m
            z_path = np.linspace(event['PrimaryPosZ']/100, z_end, 60)
            
            # Add slight curvature for realism
            curve = 0.001 * np.sin(np.linspace(0, np.pi, 60))
            x_path = event['PrimaryPosX']/100 + curve * np.random.randn()
            y_path = event['PrimaryPosY']/100 + curve * np.random.randn()
            
            # Color intensity based on survival
            alpha = 0.8 if survived else 0.4
            lw = 1.5 if survived else 0.8
            
            ax1.plot(x_path, y_path, z_path, color=color, linewidth=lw, alpha=alpha)
            
            # Decay marker
            if not survived:
                ax1.scatter([x_path[-1]], [y_path[-1]], [z_path[-1]], 
                           c='red', marker='*', s=80, alpha=0.9, edgecolors='black')
        
        # Detector hints
        for z_det in [0.5, 5, 10, 15]:
            theta = np.linspace(0, 2*np.pi, 30)
            ax1.plot(0.05*np.cos(theta), 0.05*np.sin(theta), 
                    np.full(30, z_det), 'gray', alpha=0.5, linewidth=1)
        
        ax1.set_xlabel('X (m)', fontsize=9)
        ax1.set_ylabel('Y (m)', fontsize=9)
        ax1.set_zlabel('Z (m)', fontsize=9)
        ax1.set_xlim([-0.1, 0.1])
        ax1.set_ylim([-0.1, 0.1])
        ax1.set_zlim([0, 18])
        ax1.view_init(elev=15, azim=60)
        
        # 2D beam profile
        ax2 = fig.add_subplot(2, 3, idx+4)
        ax2.set_title(f'{name} - Beam Profile', fontsize=11, fontweight='bold')
        
        x_cm = data['PrimaryPosX'].values
        y_cm = data['PrimaryPosY'].values
        
        # 2D histogram with colormap
        h = ax2.hist2d(x_cm, y_cm, bins=25, cmap='hot', alpha=0.8)
        plt.colorbar(h[3], ax=ax2, label='Counts')
        
        # Contour circles
        for r, ls in [(1.0, '--'), (2.0, ':')]:
            circle = Circle((0, 0), r, fill=False, color='white', linestyle=ls, linewidth=2)
            ax2.add_patch(circle)
        
        ax2.set_xlabel('X (cm)', fontsize=10)
        ax2.set_ylabel('Y (cm)', fontsize=10)
        ax2.set_xlim([-4, 4])
        ax2.set_ylim([-4, 4])
        ax2.set_aspect('equal')
        ax2.grid(True, alpha=0.3, color='white')
    
    plt.tight_layout(rect=[0, 0, 1, 0.95])
    plt.savefig(f'{OUTPUT}/vis02_particle_trajectories.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print('Saved: vis02_particle_trajectories.png')

def create_decay_event_vis():
    """Visualize individual decay events"""
    print('[VIS 3/4] Creating decay event visualization...')
    
    df = pd.concat([pd.read_csv(f'../output/TimeDilation_Run{i}.csv') for i in range(4)])
    
    fig = plt.figure(figsize=(16, 10), facecolor='white')
    fig.suptitle('Decay-in-Flight Event Topology\nTime Dilation Effect Visualization', 
                fontsize=15, fontweight='bold', y=0.98)
    
    # Get decayed events
    pion_decay = df[(df['PrimaryPDG']==211) & (df['Decayed']==1)].head(15)
    kaon_decay = df[(df['PrimaryPDG']==321) & (df['Decayed']==1)].head(15)
    
    # Pion decay visualization
    ax1 = fig.add_subplot(121, projection='3d')
    ax1.set_title('Pion Decays: π⁺ → μ⁺ + νμ\nKink angle visible', fontsize=12, fontweight='bold', color=COLORS['pion'])
    
    for _, ev in pion_decay.iterrows():
        # Primary trajectory to decay point
        z_decay = ev['DecayPosZ'] / 100  # cm to m
        z1 = np.linspace(0, z_decay, 30)
        ax1.plot([0]*30, [0]*30, z1, color=COLORS['pion'], linewidth=2, alpha=0.8)
        
        # Decay point
        ax1.scatter([0], [0], [z_decay], c='yellow', s=100, marker='*', 
                   edgecolors='black', zorder=10)
        
        # Decay product (muon) - random direction with momentum conservation hint
        theta = np.random.uniform(0, 0.15)
        phi = np.random.uniform(0, 2*np.pi)
        z2 = np.linspace(z_decay, 18, 30)
        x2 = np.tan(theta) * np.cos(phi) * (z2 - z_decay)
        y2 = np.tan(theta) * np.sin(phi) * (z2 - z_decay)
        ax1.plot(x2, y2, z2, color=COLORS['muon'], linewidth=1.5, alpha=0.6, linestyle='--')
    
    ax1.set_xlabel('X (m)')
    ax1.set_ylabel('Y (m)')
    ax1.set_zlabel('Z (m)')
    ax1.set_xlim([-0.5, 0.5])
    ax1.set_ylim([-0.5, 0.5])
    ax1.set_zlim([0, 18])
    ax1.view_init(elev=20, azim=45)
    
    # Kaon decay visualization
    ax2 = fig.add_subplot(122, projection='3d')
    ax2.set_title('Kaon Decays: K⁺ → μ⁺ + νμ (63.5%)\nHigher decay probability', 
                 fontsize=12, fontweight='bold', color=COLORS['kaon'])
    
    for _, ev in kaon_decay.iterrows():
        z_decay = ev['DecayPosZ'] / 100
        z1 = np.linspace(0, z_decay, 30)
        ax2.plot([0]*30, [0]*30, z1, color=COLORS['kaon'], linewidth=2, alpha=0.8)
        
        ax2.scatter([0], [0], [z_decay], c='yellow', s=100, marker='*', 
                   edgecolors='black', zorder=10)
        
        theta = np.random.uniform(0, 0.2)
        phi = np.random.uniform(0, 2*np.pi)
        z2 = np.linspace(z_decay, 18, 30)
        x2 = np.tan(theta) * np.cos(phi) * (z2 - z_decay)
        y2 = np.tan(theta) * np.sin(phi) * (z2 - z_decay)
        ax2.plot(x2, y2, z2, color=COLORS['muon'], linewidth=1.5, alpha=0.6, linestyle='--')
    
    ax2.set_xlabel('X (m)')
    ax2.set_ylabel('Y (m)')
    ax2.set_zlabel('Z (m)')
    ax2.set_xlim([-0.5, 0.5])
    ax2.set_ylim([-0.5, 0.5])
    ax2.set_zlim([0, 18])
    ax2.view_init(elev=20, azim=45)
    
    # Legend
    fig.text(0.5, 0.02, '★ = Decay vertex  |  Solid = Primary particle  |  Dashed = Decay product (μ⁺)', 
            ha='center', fontsize=11, style='italic',
            bbox=dict(boxstyle='round', facecolor='lightyellow', edgecolor='gray'))
    
    plt.tight_layout(rect=[0, 0.05, 1, 0.95])
    plt.savefig(f'{OUTPUT}/vis03_decay_events.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print('Saved: vis03_decay_events.png')

def create_full_beamline_vis():
    """Create panoramic beamline visualization"""
    print('[VIS 4/4] Creating full beamline panorama...')
    
    fig = plt.figure(figsize=(20, 8), facecolor='white')
    ax = fig.add_subplot(111, projection='3d')
    ax.set_title('Complete T9 Beamline Setup - Time Dilation Experiment\n8 GeV/c Hadron Beam', 
                fontsize=16, fontweight='bold', pad=20)
    
    # Draw full beamline with all detector positions
    z_positions = [0.5, 5.5, 10.5, 15.5]  # Station 2 positions for different runs
    
    # Beam pipe
    z_beam = np.linspace(-1, 20, 200)
    ax.plot([0]*200, [0]*200, z_beam, color=COLORS['beam'], linewidth=4, 
           linestyle='-', alpha=0.4, label='Beam axis')
    
    # Station 1 (always at z=0.5)
    draw_detector_3d(ax, (0, 0, 0.48), (0.15, 0.15, 0.02), COLORS['scint'], 0.9, 'SC1')
    draw_detector_3d(ax, (0, 0, 1.0), (0.4, 0.4, 1.0), COLORS['rich'], 0.5, 'RICH1')
    draw_detector_3d(ax, (0, 0, 2.2), (0.4, 0.4, 0.3), COLORS['dwc'], 0.7, 'DWC1')
    
    # Show Station 2 at maximum position (15m)
    z2 = 17.5
    draw_detector_3d(ax, (0, 0, z2-0.02), (0.15, 0.15, 0.02), COLORS['scint'], 0.9, 'SC2')
    draw_detector_3d(ax, (0, 0, z2+0.5), (0.4, 0.4, 1.0), COLORS['rich'], 0.5, 'RICH2')
    draw_detector_3d(ax, (0, 0, z2+1.7), (0.4, 0.4, 0.3), COLORS['dwc'], 0.7, 'DWC2')
    draw_detector_3d(ax, (0, 0, z2+2.5), (0.5, 0.5, 0.25), COLORS['calo'], 0.8, 'Calorimeter')
    
    # Sample particle fan
    np.random.seed(123)
    colors_particles = [COLORS['pion']]*20 + [COLORS['kaon']]*5 + [COLORS['muon']]*2
    
    for i, color in enumerate(colors_particles):
        theta = np.random.normal(0, 0.004)
        phi = np.random.uniform(0, 2*np.pi)
        
        z_traj = np.linspace(-1, 20, 100)
        x_traj = np.tan(theta) * np.cos(phi) * (z_traj + 1)
        y_traj = np.tan(theta) * np.sin(phi) * (z_traj + 1)
        
        ax.plot(x_traj, y_traj, z_traj, color=color, linewidth=1.2, alpha=0.5)
    
    # Distance markers
    for z_mark in [0, 5, 10, 15]:
        theta = np.linspace(0, 2*np.pi, 50)
        ax.plot(0.3*np.cos(theta), 0.3*np.sin(theta), np.full(50, z_mark+2.5), 
               'gray', linestyle=':', alpha=0.5)
        ax.text(0.35, 0.35, z_mark+2.5, f'{z_mark}m', fontsize=10, color='gray')
    
    ax.set_xlabel('X (m)', fontsize=12, labelpad=10)
    ax.set_ylabel('Y (m)', fontsize=12, labelpad=10)
    ax.set_zlabel('Z (m) - Beam Direction', fontsize=12, labelpad=10)
    ax.set_xlim([-0.5, 0.5])
    ax.set_ylim([-0.5, 0.5])
    ax.set_zlim([-1, 21])
    ax.view_init(elev=10, azim=75)
    
    # Legend box
    legend_text = 'Particle composition:\n• 95% π⁺ (red)\n• 5% K⁺ (blue)\n• <1% μ⁺ (green)'
    ax.text2D(0.02, 0.95, legend_text, transform=ax.transAxes, fontsize=10,
             verticalalignment='top', bbox=dict(boxstyle='round', facecolor='white', alpha=0.9))
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT}/vis04_full_beamline.png', dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    print('Saved: vis04_full_beamline.png')

def main():
    os.makedirs(OUTPUT, exist_ok=True)
    print('='*60)
    print('Enhanced 3D Geant4-Style Visualizations')
    print('='*60)
    
    create_enhanced_detector_vis()
    create_particle_trajectory_vis()
    create_decay_event_vis()
    create_full_beamline_vis()
    
    print('\n' + '='*60)
    print('All 4 enhanced 3D visualizations complete!')
    print('='*60)

if __name__ == '__main__':
    main()
