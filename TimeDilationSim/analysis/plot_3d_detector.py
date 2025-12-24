#!/usr/bin/env python3
"""
plot_3d_detector.py
Creates 3D visualization of detector setup and sample particle trajectories
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import sys
import os

def draw_detector_box(ax, position, size, color, alpha, label):
    """Draw a 3D box representing a detector"""
    x, y, z = position
    sx, sy, sz = size
    
    # Define vertices
    vertices = [
        [x-sx/2, y-sy/2, z-sz/2], [x+sx/2, y-sy/2, z-sz/2],
        [x+sx/2, y+sy/2, z-sz/2], [x-sx/2, y+sy/2, z-sz/2],
        [x-sx/2, y-sy/2, z+sz/2], [x+sx/2, y-sy/2, z+sz/2],
        [x+sx/2, y+sy/2, z+sz/2], [x-sx/2, y+sy/2, z+sz/2]
    ]
    
    # Define faces
    faces = [
        [vertices[0], vertices[1], vertices[5], vertices[4]],
        [vertices[7], vertices[6], vertices[2], vertices[3]],
        [vertices[0], vertices[3], vertices[7], vertices[4]],
        [vertices[1], vertices[2], vertices[6], vertices[5]],
        [vertices[0], vertices[1], vertices[2], vertices[3]],
        [vertices[4], vertices[5], vertices[6], vertices[7]]
    ]
    
    poly = Poly3DCollection(faces, alpha=alpha, facecolor=color, edgecolor='k', linewidth=0.5)
    ax.add_collection3d(poly)
    
    # Add label
    ax.text(x, y, z, label, fontsize=8, ha='center')

def plot_detector_setup():
    """Create 3D visualization of the detector setup"""
    fig = plt.figure(figsize=(16, 10))
    
    # Station 1 at 0m
    ax1 = fig.add_subplot(221, projection='3d')
    ax1.set_title('Station 2 at 0 m (Baseline)', fontsize=12, fontweight='bold')
    plot_setup(ax1, station2_z=0)
    
    # Station 2 at 5m
    ax2 = fig.add_subplot(222, projection='3d')
    ax2.set_title('Station 2 at 5 m', fontsize=12, fontweight='bold')
    plot_setup(ax2, station2_z=5)
    
    # Station 2 at 10m
    ax3 = fig.add_subplot(223, projection='3d')
    ax3.set_title('Station 2 at 10 m', fontsize=12, fontweight='bold')
    plot_setup(ax3, station2_z=10)
    
    # Station 2 at 15m
    ax4 = fig.add_subplot(224, projection='3d')
    ax4.set_title('Station 2 at 15 m (Max)', fontsize=12, fontweight='bold')
    plot_setup(ax4, station2_z=15)
    
    plt.tight_layout()
    plt.savefig('detector_3d_configurations.png', dpi=300, bbox_inches='tight')
    plt.savefig('detector_3d_configurations.pdf', bbox_inches='tight')
    print("✓ Saved: detector_3d_configurations.png, detector_3d_configurations.pdf")
    
    plt.close()

def plot_setup(ax, station2_z=10):
    """Plot a single detector configuration"""
    
    # Station 1 at z=0.5m
    station1_z = 0.5
    
    # Scintillator 1
    draw_detector_box(ax, (0, 0, station1_z-0.005), (0.1, 0.1, 0.01), 
                     'lime', 0.6, 'SC1')
    
    # RICH 1
    draw_detector_box(ax, (0, 0, station1_z+0.5), (0.3, 0.3, 1.0), 
                     'lightblue', 0.3, 'RICH1')
    
    # DWC 1
    draw_detector_box(ax, (0, 0, station1_z+1.2), (0.3, 0.3, 0.2), 
                     'yellow', 0.4, 'DWC1')
    
    # Station 2
    station2_pos = station1_z + station2_z
    
    # Scintillator 2
    draw_detector_box(ax, (0, 0, station2_pos-0.005), (0.1, 0.1, 0.01), 
                     'lime', 0.6, 'SC2')
    
    # RICH 2
    draw_detector_box(ax, (0, 0, station2_pos+0.5), (0.3, 0.3, 1.0), 
                     'lightblue', 0.3, 'RICH2')
    
    # DWC 2
    draw_detector_box(ax, (0, 0, station2_pos+1.2), (0.3, 0.3, 0.2), 
                     'yellow', 0.4, 'DWC2')
    
    # Calorimeter
    draw_detector_box(ax, (0, 0, station2_pos+2.0), (0.3, 0.3, 0.14), 
                     'orange', 0.5, 'Calo')
    
    # Draw beam line
    z_vals = np.linspace(-0.5, station2_pos+2.5, 100)
    ax.plot([0]*100, [0]*100, z_vals, 'r--', linewidth=2, alpha=0.5, label='Beam axis')
    
    # Draw sample trajectories
    np.random.seed(42)
    for i in range(5):
        theta = np.random.normal(0, 0.002)  # 2 mrad divergence
        phi = np.random.uniform(0, 2*np.pi)
        x_end = np.tan(theta) * np.cos(phi) * station2_pos
        y_end = np.tan(theta) * np.sin(phi) * station2_pos
        
        z_traj = np.linspace(-0.5, station2_pos+2.5, 50)
        x_traj = np.linspace(0, x_end, 50)
        y_traj = np.linspace(0, y_end, 50)
        
        ax.plot(x_traj, y_traj, z_traj, 'b-', linewidth=0.5, alpha=0.3)
    
    # Set labels and limits
    ax.set_xlabel('X (m)', fontsize=10)
    ax.set_ylabel('Y (m)', fontsize=10)
    ax.set_zlabel('Z (m)', fontsize=10)
    
    max_range = max(station2_pos+2.5, 0.4)
    ax.set_xlim([-0.3, 0.3])
    ax.set_ylim([-0.3, 0.3])
    ax.set_zlim([-0.5, station2_pos+2.5])
    
    ax.view_init(elev=20, azim=45)
    ax.grid(True, alpha=0.3)

def plot_sample_events(csv_file):
    """Plot sample particle trajectories from simulation data"""
    
    print(f"Loading data from {csv_file}...")
    df = pd.read_csv(csv_file)
    
    fig = plt.figure(figsize=(16, 12))
    
    # Get sample events
    pions = df[df['PrimaryPDG'] == 211].head(20)
    kaons = df[df['PrimaryPDG'] == 321].head(20)
    muons = df[df['PrimaryPDG'] == -13].head(20)
    
    # Plot all three species
    for idx, (species, data, color, name) in enumerate([
        (211, pions, 'red', 'Pions (π+)'),
        (321, kaons, 'blue', 'Kaons (K+)'),
        (-13, muons, 'green', 'Muons (μ+)')
    ]):
        ax = fig.add_subplot(2, 3, idx+1, projection='3d')
        ax.set_title(f'{name} - Sample Trajectories', fontsize=11, fontweight='bold')
        
        for _, event in data.iterrows():
            # Primary particle trajectory
            z_path = np.linspace(event['PrimaryPosZ'], 15, 50)
            x_path = np.linspace(event['PrimaryPosX'], 
                                event['PrimaryPosX'] + 0.01*np.random.randn(), 50)
            y_path = np.linspace(event['PrimaryPosY'], 
                                event['PrimaryPosY'] + 0.01*np.random.randn(), 50)
            
            # Color by survival
            survived = event['Survived'] == 1
            line_color = color if survived else 'gray'
            alpha = 0.7 if survived else 0.3
            
            ax.plot(x_path, y_path, z_path, color=line_color, linewidth=1.5, alpha=alpha)
            
            # Mark decay point if decayed
            if event['Decayed'] == 1:
                ax.scatter(event['DecayPosX'], event['DecayPosY'], event['DecayPosZ'], 
                          c='red', marker='x', s=50, alpha=0.8)
        
        ax.set_xlabel('X (cm)')
        ax.set_ylabel('Y (cm)')
        ax.set_zlabel('Z (m)')
        ax.set_xlim([-5, 5])
        ax.set_ylim([-5, 5])
        ax.set_zlim([0, 16])
        ax.view_init(elev=20, azim=45)
        ax.grid(True, alpha=0.3)
        
        # XY projection
        ax_xy = fig.add_subplot(2, 3, idx+4)
        ax_xy.set_title(f'{name} - Beam Profile (XY)', fontsize=10)
        ax_xy.scatter(data['PrimaryPosX'], data['PrimaryPosY'], 
                     c=color, alpha=0.6, s=30)
        ax_xy.set_xlabel('X (cm)')
        ax_xy.set_ylabel('Y (cm)')
        ax_xy.set_xlim([-5, 5])
        ax_xy.set_ylim([-5, 5])
        ax_xy.grid(True, alpha=0.3)
        ax_xy.set_aspect('equal')
        
        # Draw 1σ and 2σ circles
        circle1 = plt.Circle((0, 0), 1.0, fill=False, color='gray', linestyle='--', 
                            linewidth=1, label='1σ (1 cm)')
        circle2 = plt.Circle((0, 0), 2.0, fill=False, color='gray', linestyle=':', 
                            linewidth=1, label='2σ (2 cm)')
        ax_xy.add_patch(circle1)
        ax_xy.add_patch(circle2)
        if idx == 0:
            ax_xy.legend(fontsize=8, loc='upper right')
    
    plt.tight_layout()
    plt.savefig('particle_trajectories_3d.png', dpi=300, bbox_inches='tight')
    plt.savefig('particle_trajectories_3d.pdf', bbox_inches='tight')
    print("✓ Saved: particle_trajectories_3d.png, particle_trajectories_3d.pdf")
    plt.close()

def main():
    if len(sys.argv) < 2:
        output_dir = '../output'
    else:
        output_dir = sys.argv[1]
    
    print("Generating 3D detector visualizations...")
    
    # Plot detector configurations
    plot_detector_setup()
    
    # Plot sample event trajectories from Run 3 (15m)
    csv_file = os.path.join(output_dir, 'TimeDilation_Run3.csv')
    if os.path.exists(csv_file):
        plot_sample_events(csv_file)
    else:
        print(f"Warning: {csv_file} not found, skipping trajectory plots")
    
    print("\n✓ 3D visualization complete!")

if __name__ == '__main__':
    main()
