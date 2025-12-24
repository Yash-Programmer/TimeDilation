#!/usr/bin/env python3
"""
plot_3d_events.py
Create 3D visualizations of selected particle decay events
"""

import ROOT
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import argparse

def draw_detector_box(ax, center, size, color, alpha=0.2, label=None):
    """Draw a translucent box representing detector volume"""
    x, y, z = center
    dx, dy, dz = size
    
    # Define 8 corners of box
    corners = np.array([
        [x-dx/2, y-dy/2, z-dz/2],
        [x+dx/2, y-dy/2, z-dz/2],
        [x+dx/2, y+dy/2, z-dz/2],
        [x-dx/2, y+dy/2, z-dz/2],
        [x-dx/2, y-dy/2, z+dz/2],
        [x+dx/2, y-dy/2, z+dz/2],
        [x+dx/2, y+dy/2, z+dz/2],
        [x-dx/2, y+dy/2, z+dz/2]
    ])
    
    # Define 6 faces
    faces = [[corners[j] for j in [0, 1, 2, 3]],  # bottom
             [corners[j] for j in [4, 5, 6, 7]],  # top
             [corners[j] for j in [0, 1, 5, 4]],  # front
             [corners[j] for j in [2, 3, 7, 6]],  # back
             [corners[j] for j in [1, 2, 6, 5]],  # right
             [corners[j] for j in [4, 7, 3, 0]]]  # left
    
    collection = Poly3DCollection(faces, alpha=alpha, facecolor=color, edgecolor='black', linewidth=0.5)
    ax.add_collection3d(collection)
    
    if label:
        ax.text(x, y, z, label, fontsize=8)

def visualize_event(event_data, event_id):
    """Create 3D visualization of single event"""
    
    fig = plt.figure(figsize=(14, 10))
    ax = fig.add_subplot(111, projection='3d')
    
    # Draw detector geometry
    # Station 1 components (z = 0)
    draw_detector_box(ax, (0, 0, 0), (10, 10, 1), 'green', alpha=0.3, label='SC1')
    draw_detector_box(ax, (0, 0, 50), (30, 30, 90), 'cyan', alpha=0.15, label='RICH1')
    draw_detector_box(ax, (0, 0, 120), (30, 30, 20), 'yellow', alpha=0.2, label='DWC1')
    
    # Station 2 components (z = 15 m = 1500 cm)
    station2_z = event_data.get('station2_pos', 1500)
    draw_detector_box(ax, (0, 0, station2_z), (10, 10, 1), 'green', alpha=0.3, label='SC2')
    draw_detector_box(ax, (0, 0, station2_z+50), (30, 30, 90), 'cyan', alpha=0.15, label='RICH2')
    draw_detector_box(ax, (0, 0, station2_z+120), (30, 30, 20), 'yellow', alpha=0.2, label='DWC2')
    draw_detector_box(ax, (0, 0, station2_z+200), (30, 30, 14), 'orange', alpha=0.2, label='Calo')
    
    # Draw beam pipe
    theta = np.linspace(0, 2*np.pi, 50)
    z_pipe = np.linspace(-50, station2_z+250, 100)
    r = 5  # 5 cm radius
    
    for z in [z_pipe[0], z_pipe[-1]]:
        x_circle = r * np.cos(theta)
        y_circle = r * np.sin(theta)
        z_circle = np.full_like(theta, z)
        ax.plot(x_circle, y_circle, z_circle, 'gray', alpha=0.3, linewidth=0.5)
    
    # Draw particle track
    pdg = event_data['pdg']
    color_map = {211: 'red', 321: 'blue', -13: 'green'}
    particle_name = {211: 'π+', 321: 'K+', -13: 'μ+'}
    color = color_map.get(pdg, 'black')
    name = particle_name.get(pdg, 'unknown')
    
    # Primary track from z = -50 cm to decay or station2
    z_start = event_data['primary_pos'][2]
    
    if event_data['decayed']:
        # Track to decay point
        z_decay = event_data['decay_pos'][2]
        ax.plot([event_data['primary_pos'][0], event_data['decay_pos'][0]],
                [event_data['primary_pos'][1], event_data['decay_pos'][1]],
                [z_start, z_decay],
                color=color, linewidth=3, label=f'{name} track')
        
        # Mark decay vertex
        ax.scatter(*event_data['decay_pos'], s=200, c='red', marker='*', 
                  edgecolors='black', linewidth=1.5, label='Decay vertex', zorder=5)
        
        # Secondary track (if muon produced)
        if event_data.get('decay_product_pdg') == -13:
            ax.plot([event_data['decay_pos'][0], event_data['decay_pos'][0]],
                    [event_data['decay_pos'][1], event_data['decay_pos'][1]],
                    [z_decay, station2_z],
                    color='green', linewidth=2, linestyle='--', label='μ+ (secondary)')
    else:
        # Straight track (stable particle)
        ax.plot([event_data['primary_pos'][0], 0],
                [event_data['primary_pos'][1], 0],
                [z_start, station2_z],
                color=color, linewidth=3, label=f'{name} track (stable)')
    
    # Formatting
    ax.set_xlabel('X (cm)', fontsize=12, fontweight='bold')
    ax.set_ylabel('Y (cm)', fontsize=12, fontweight='bold')
    ax.set_zlabel('Z (cm)', fontsize=12, fontweight='bold')
    ax.set_xlim(-40, 40)
    ax.set_ylim(-40, 40)
    ax.set_zlim(-100, station2_z+300)
    ax.view_init(elev=20, azim=45)
    ax.legend(loc='upper left', fontsize=10)
    
    title = f"Event {event_id}: {name}"
    if event_data['decayed']:
        title += f" → decay @ z={event_data['decay_pos'][2]:.1f} cm"
    ax.set_title(title, fontsize=14, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(f'event_3d_{event_id}.png', dpi=200, bbox_inches='tight')
    print(f"Saved: event_3d_{event_id}.png")
    plt.show()

def load_event_from_root(filename, event_id):
    """Extract event data from ROOT file"""
    rootfile = ROOT.TFile.Open(filename)
    tree = rootfile.Get("TimeDilation")
    
    tree.GetEntry(event_id)
    
    event_data = {
        'pdg': tree.PrimaryPDG,
        'primary_pos': (tree.PrimaryPosX, tree.PrimaryPosY, tree.PrimaryPosZ),
        'decayed': bool(tree.Decayed),
        'decay_pos': (tree.DecayPosX, tree.DecayPosY, tree.DecayPosZ) if tree.Decayed else None,
        'decay_product_pdg': tree.DecayProductPDG if tree.Decayed else None,
        'station2_pos': 1500  # Default 15 m, adjust per run
    }
    
    return event_data

def main():
    parser = argparse.ArgumentParser(description="Visualize 3D particle events")
    parser.add_argument('--event-id', nargs='+', type=int, default=[0, 1, 2],
                        help='Event IDs to visualize')
    parser.add_argument('--input', default='../output/TimeDilation_Run3.root',
                        help='ROOT file to read')
    args = parser.parse_args()
    
    for evt_id in args.event_id:
        print(f"\nVisualizing event {evt_id}...")
        event_data = load_event_from_root(args.input, evt_id)
        visualize_event(event_data, evt_id)

if __name__ == '__main__':
    main()
