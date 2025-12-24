#!/usr/bin/env python3
"""
plot_particle_id_csv.py
Analyze and visualize particle identification performance from CSV
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Ellipse

def plot_beta_vs_energy():
    """Create β vs. E/p scatter plot for particle ID"""
    
    # Load data from any run (use Run 0)
    df = pd.read_csv("../output/TimeDilation_Run0.csv")
    
    # Extract data
    beta = df['RICH1_Beta'].values
    eop = df['Calo_EoP'].values
    pdg = df['PrimaryPDG'].values
    
    # Separate by species
    mask_pion = (pdg == 211)
    mask_kaon = (pdg == 321)
    
    # Create plot
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Plot scatter
    ax.scatter(beta[mask_pion], eop[mask_pion], c='red', alpha=0.3, s=20, label='π+')
    ax.scatter(beta[mask_kaon], eop[mask_kaon], c='blue', alpha=0.3, s=20, label='K+')
    
    # Add ID regions (ellipses)
    # Kaon region: β < 0.999, E/p ~ 1
    kaon_ellipse = Ellipse((0.99, 1.0), width=0.008, height=0.3,
                           edgecolor='blue', facecolor='none', linewidth=2,
                           linestyle='--', label='K+ ID region')
    ax.add_patch(kaon_ellipse)
    
    # Pion region: β > 0.9998, E/p < 0.5 (stable)
    pion_ellipse = Ellipse((0.9999, 0.15), width=0.0002, height=0.2,
                          edgecolor='red', facecolor='none', linewidth=2,
                          linestyle='--', label='π+ ID region')
    ax.add_patch(pion_ellipse)
    
    ax.set_xlabel('Measured β (RICH)', fontsize=14, fontweight='bold')
    ax.set_ylabel('E/p (Calorimeter)', fontsize=14, fontweight='bold')
    ax.set_xlim(0.985, 1.001)
    ax.set_ylim(0, 1.5)
    ax.grid(alpha=0.3, linestyle='--')
    ax.legend(loc='upper left', fontsize=12)
    
    ax.text(0.02, 0.98, 'Particle Identification Performance\\nRICH + Calorimeter',
            transform=ax.transAxes, fontsize=11, verticalalignment='top',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
    
    plt.tight_layout()
    plt.savefig('particle_id_beta_eop.png', dpi=300, bbox_inches='tight')
    print("✓ Saved: particle_id_beta_eop.png")
    plt.close()

def calculate_efficiencies():
    """Calculate particle ID efficiencies and cross-contamination"""
    
    df = pd.read_csv("../output/TimeDilation_Run0.csv")
    
    # Apply ID cuts
    correct_pion = 0
    correct_kaon = 0
    total_pion = 0
    total_kaon = 0
    pion_as_kaon = 0
    kaon_as_pion = 0
    
    for _, row in df.iterrows():
        beta = row['RICH1_Beta']
        true_pdg = row['PrimaryPDG']
        
        # ID logic: β < 0.999 → K+, else π+ (simplified)
        reco_pdg = 321 if beta < 0.999 else 211
        
        if true_pdg == 211:
            total_pion += 1
            if reco_pdg == 211:
                correct_pion += 1
            else:
                pion_as_kaon += 1
        elif true_pdg == 321:
            total_kaon += 1
            if reco_pdg == 321:
                correct_kaon += 1
            else:
                kaon_as_pion += 1
    
    eff_pion = correct_pion / total_pion if total_pion > 0 else 0
    eff_kaon = correct_kaon / total_kaon if total_kaon > 0 else 0
    contam_pion = kaon_as_pion / total_pion if total_pion > 0 else 0
    contam_kaon = pion_as_kaon / total_kaon if total_kaon > 0 else 0
    
    print("\n" + "="*50)
    print("PARTICLE ID PERFORMANCE")
    print("="*50)
    print(f"\nPion ID:")
    print(f"  Efficiency: {eff_pion*100:.1f}%")
    print(f"  K+ contamination: {contam_kaon*100:.2f}%")
    print(f"\nKaon ID:")
    print(f"  Efficiency: {eff_kaon*100:.1f}%")
    print(f"  π+ contamination: {contam_pion*100:.2f}%")
    print(f"\nTarget: >90% π+, >95% K+, <2% cross-contamination")
    
    # Save to CSV
    pid_df = pd.DataFrame({
        'Metric': ['Pion_Efficiency_%', 'Kaon_Efficiency_%', 'Pion_Contamination_%', 'Kaon_Contamination_%'],
        'Value': [eff_pion*100, eff_kaon*100, contam_pion*100, contam_kaon*100]
    })
    pid_df.to_csv('particle_id_performance.csv', index=False)
    print("\n✓ Performance saved to particle_id_performance.csv")

if __name__ == '__main__':
    try:
        print("Generating particle ID plots...")
        plot_beta_vs_energy()
        calculate_efficiencies()
        print("\n✓ Particle ID analysis complete!")
    except FileNotFoundError as e:
        print(f"ERROR: {e}")
        print("Run simulate_physics.py first to generate data.")
