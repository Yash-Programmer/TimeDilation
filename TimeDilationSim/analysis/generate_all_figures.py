#!/usr/bin/env python3
"""
generate_all_figures.py
Generates ALL possible figures from TimeDilation simulation data
Run one at a time to avoid memory issues
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
from scipy.optimize import curve_fit
import sys
import os

# Output directory
OUTPUT_DIR = '../geant4-result/figures/python-analysis'

def load_all_data(output_dir='../output'):
    """Load all CSV files and combine"""
    dfs = []
    for i in range(4):
        csv_path = os.path.join(output_dir, f'TimeDilation_Run{i}.csv')
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            dfs.append(df)
            print(f"Loaded Run{i}: {len(df)} events")
    return pd.concat(dfs, ignore_index=True) if dfs else None

def fig1_trajectory_fixed(df):
    """Fixed particle trajectories - proper axis limits"""
    print("\n[1/9] Generating fixed trajectory plot...")
    
    fig = plt.figure(figsize=(15, 10))
    
    pions = df[df['PrimaryPDG'] == 211].head(30)
    kaons = df[df['PrimaryPDG'] == 321].head(30)
    muons = df[df['PrimaryPDG'] == -13].head(30)
    
    for idx, (data, color, name) in enumerate([
        (pions, 'red', 'Pions (π⁺)'),
        (kaons, 'blue', 'Kaons (K⁺)'),
        (muons, 'green', 'Muons (μ⁺)')
    ]):
        # 3D trajectory
        ax = fig.add_subplot(2, 3, idx+1, projection='3d')
        ax.set_title(f'{name} - Trajectories', fontsize=11, fontweight='bold')
        
        if len(data) == 0:
            ax.text(0, 0, 8, 'No data', ha='center', fontsize=12)
        else:
            for _, event in data.iterrows():
                # Start at z=-50cm (origin), end at z=15m
                z_start = event['PrimaryPosZ'] / 100  # cm to m
                z_end = 15.5
                
                # Trajectory with small spread
                n_pts = 50
                z_path = np.linspace(max(z_start, -0.5), z_end, n_pts)
                
                # XY positions in cm, convert to m for display
                x_start = event['PrimaryPosX'] / 100
                y_start = event['PrimaryPosY'] / 100
                
                # Small angular divergence
                theta = np.random.normal(0, 0.002)
                phi = np.random.uniform(0, 2*np.pi)
                
                x_path = x_start + np.tan(theta) * np.cos(phi) * (z_path - z_start)
                y_path = y_start + np.tan(theta) * np.sin(phi) * (z_path - z_start)
                
                survived = event['Survived'] == 1
                alpha = 0.7 if survived else 0.3
                
                ax.plot(x_path, y_path, z_path, color=color, linewidth=1, alpha=alpha)
                
                # Mark decay point
                if event['Decayed'] == 1 and event['DecayPosZ'] > 0:
                    dz = event['DecayPosZ'] / 100  # cm to m
                    if 0 < dz < 16:
                        ax.scatter([0], [0], [dz], c='black', marker='x', s=30)
        
        ax.set_xlabel('X (m)')
        ax.set_ylabel('Y (m)')
        ax.set_zlabel('Z (m)')
        ax.set_xlim([-0.1, 0.1])
        ax.set_ylim([-0.1, 0.1])
        ax.set_zlim([0, 16])
        ax.view_init(elev=15, azim=45)
        
        # XY beam profile
        ax2 = fig.add_subplot(2, 3, idx+4)
        ax2.set_title(f'{name} - Beam Profile', fontsize=10)
        if len(data) > 0:
            ax2.scatter(data['PrimaryPosX'], data['PrimaryPosY'], 
                       c=color, alpha=0.6, s=30, edgecolors='black', linewidth=0.3)
        circle1 = plt.Circle((0, 0), 1.0, fill=False, color='gray', linestyle='--')
        circle2 = plt.Circle((0, 0), 2.0, fill=False, color='gray', linestyle=':')
        ax2.add_patch(circle1)
        ax2.add_patch(circle2)
        ax2.set_xlabel('X (cm)')
        ax2.set_ylabel('Y (cm)')
        ax2.set_xlim([-4, 4])
        ax2.set_ylim([-4, 4])
        ax2.set_aspect('equal')
        ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/01_particle_trajectories.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: 01_particle_trajectories.png")

def fig2_momentum_distribution(df):
    """Momentum distributions by particle type"""
    print("\n[2/9] Generating momentum distributions...")
    
    fig, axes = plt.subplots(1, 3, figsize=(14, 4))
    
    for ax, (pdg, name, color) in zip(axes, [
        (211, 'π⁺', 'red'), (321, 'K⁺', 'blue'), (-13, 'μ⁺', 'green')
    ]):
        data = df[df['PrimaryPDG'] == pdg]['PrimaryMom']
        if len(data) > 0:
            ax.hist(data, bins=50, color=color, alpha=0.7, edgecolor='black')
            ax.axvline(8.0, color='black', linestyle='--', label='Nominal 8 GeV/c')
            ax.axvline(data.mean(), color='darkred', linestyle='-', 
                      label=f'Mean: {data.mean():.3f} GeV/c')
            ax.set_xlabel('Momentum (GeV/c)')
            ax.set_ylabel('Events')
            ax.set_title(f'{name} Momentum Distribution\n(N={len(data)}, σ={data.std():.3f})')
            ax.legend(fontsize=8)
        else:
            ax.text(0.5, 0.5, 'No data', ha='center', va='center', transform=ax.transAxes)
            ax.set_title(f'{name} - No Events')
        ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/02_momentum_distributions.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: 02_momentum_distributions.png")

def fig3_beta_distribution(df):
    """RICH beta measurements"""
    print("\n[3/9] Generating β distributions...")
    
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    
    # β distribution by species
    ax1 = axes[0, 0]
    for pdg, name, color in [(211, 'π⁺', 'red'), (321, 'K⁺', 'blue'), (-13, 'μ⁺', 'green')]:
        data = df[df['PrimaryPDG'] == pdg]['RICH1_Beta']
        data = data[(data > 0.99) & (data < 1.01)]
        if len(data) > 0:
            ax1.hist(data, bins=50, alpha=0.5, label=f'{name} (N={len(data)})', color=color)
    ax1.axvline(0.999850, color='red', linestyle='--', linewidth=2, label='π⁺ expected')
    ax1.axvline(0.998100, color='blue', linestyle='--', linewidth=2, label='K⁺ expected')
    ax1.set_xlabel('β (v/c)')
    ax1.set_ylabel('Events')
    ax1.set_title('RICH β Distribution by Particle Type')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # β resolution
    ax2 = axes[0, 1]
    pion_beta = df[df['PrimaryPDG'] == 211]['RICH1_Beta']
    pion_beta = pion_beta[(pion_beta > 0.99) & (pion_beta < 1.01)]
    if len(pion_beta) > 0:
        ax2.hist(pion_beta - 0.999850, bins=50, color='red', alpha=0.7)
        ax2.set_xlabel('β - β_expected')
        ax2.set_ylabel('Events')
        resolution = pion_beta.std() / pion_beta.mean()
        ax2.set_title(f'π⁺ β Resolution: Δβ/β = {resolution:.4f}')
    ax2.grid(True, alpha=0.3)
    
    # β vs momentum
    ax3 = axes[1, 0]
    pions = df[df['PrimaryPDG'] == 211]
    kaons = df[df['PrimaryPDG'] == 321]
    ax3.scatter(pions['PrimaryMom'], pions['RICH1_Beta'], c='red', alpha=0.3, s=5, label='π⁺')
    ax3.scatter(kaons['PrimaryMom'], kaons['RICH1_Beta'], c='blue', alpha=0.3, s=5, label='K⁺')
    ax3.set_xlabel('Momentum (GeV/c)')
    ax3.set_ylabel('β')
    ax3.set_title('β vs Momentum')
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # K/π separation
    ax4 = axes[1, 1]
    pi_beta = df[df['PrimaryPDG'] == 211]['RICH1_Beta']
    k_beta = df[df['PrimaryPDG'] == 321]['RICH1_Beta']
    pi_beta = pi_beta[(pi_beta > 0.99) & (pi_beta < 1.01)]
    k_beta = k_beta[(k_beta > 0.99) & (k_beta < 1.01)]
    
    if len(pi_beta) > 0 and len(k_beta) > 0:
        separation = abs(pi_beta.mean() - k_beta.mean()) / np.sqrt(pi_beta.std()**2 + k_beta.std()**2)
        ax4.hist(pi_beta, bins=30, alpha=0.5, color='red', label=f'π⁺: β={pi_beta.mean():.5f}')
        ax4.hist(k_beta, bins=30, alpha=0.5, color='blue', label=f'K⁺: β={k_beta.mean():.5f}')
        ax4.set_title(f'K⁺/π⁺ Separation: {separation:.1f}σ')
        ax4.legend()
    ax4.set_xlabel('β')
    ax4.set_ylabel('Events')
    ax4.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/03_beta_distributions.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: 03_beta_distributions.png")

def fig4_eop_distribution(df):
    """E/p (calorimeter) distributions"""
    print("\n[4/9] Generating E/p distributions...")
    
    fig, axes = plt.subplots(1, 3, figsize=(14, 4))
    
    for ax, (pdg, name, color) in zip(axes, [
        (211, 'π⁺ (hadronic)', 'red'), (321, 'K⁺ (hadronic)', 'blue'), (-13, 'μ⁺ (MIP)', 'green')
    ]):
        data = df[df['PrimaryPDG'] == pdg]['Calo_EoP']
        data = data[data < 2]  # Remove outliers
        if len(data) > 0:
            ax.hist(data, bins=50, color=color, alpha=0.7, edgecolor='black')
            ax.axvline(data.mean(), color='black', linestyle='-', linewidth=2,
                      label=f'Mean: {data.mean():.3f}')
            # PID thresholds
            ax.axvspan(0.5, 0.8, alpha=0.2, color='orange', label='Hadronic region')
            ax.axvspan(0, 0.3, alpha=0.2, color='cyan', label='MIP region')
        ax.set_xlabel('E/p')
        ax.set_ylabel('Events')
        ax.set_title(f'{name}\nN={len(data)}')
        ax.legend(fontsize=8)
        ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/04_eop_distributions.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: 04_eop_distributions.png")

def fig5_decay_distributions(df):
    """Decay position and time distributions"""
    print("\n[5/9] Generating decay distributions...")
    
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    
    # Decay Z position
    ax1 = axes[0, 0]
    for pdg, name, color in [(211, 'π⁺', 'red'), (321, 'K⁺', 'blue')]:
        decayed = df[(df['PrimaryPDG'] == pdg) & (df['Decayed'] == 1)]
        if len(decayed) > 0:
            decay_z = decayed['DecayPosZ'] / 100  # cm to m
            decay_z = decay_z[(decay_z > 0) & (decay_z < 20)]
            ax1.hist(decay_z, bins=40, alpha=0.5, color=color, label=f'{name} (N={len(decay_z)})')
    ax1.set_xlabel('Decay Z Position (m)')
    ax1.set_ylabel('Events')
    ax1.set_title('Decay Position Along Beam Axis')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Decay time
    ax2 = axes[0, 1]
    for pdg, name, color, tau in [(211, 'π⁺', 'red', 26e-9), (321, 'K⁺', 'blue', 12.4e-9)]:
        decayed = df[(df['PrimaryPDG'] == pdg) & (df['Decayed'] == 1)]
        if len(decayed) > 0:
            decay_t = decayed['DecayTime']
            decay_t = decay_t[(decay_t > 0) & (decay_t < 200)]
            ax2.hist(decay_t, bins=40, alpha=0.5, color=color, label=f'{name}')
    ax2.set_xlabel('Decay Time (ns)')
    ax2.set_ylabel('Events')
    ax2.set_title('Decay Time Distribution')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    # Decay product PDG
    ax3 = axes[1, 0]
    decayed = df[df['Decayed'] == 1]
    if len(decayed) > 0:
        products = decayed['DecayProductPDG'].value_counts()
        labels = {-13: 'μ⁺', 13: 'μ⁻', -14: 'νμ', 14: 'ν̄μ', 211: 'π⁺', 111: 'π⁰', -211: 'π⁻'}
        names = [labels.get(int(p), str(int(p))) for p in products.index[:6]]
        ax3.bar(names, products.values[:6], color='purple', alpha=0.7)
        ax3.set_xlabel('Decay Product')
        ax3.set_ylabel('Count')
        ax3.set_title('Decay Products')
    ax3.grid(True, alpha=0.3)
    
    # Decay fraction vs distance
    ax4 = axes[1, 1]
    distances = [0, 5, 10, 15]
    for pdg, name, color in [(211, 'π⁺', 'red'), (321, 'K⁺', 'blue')]:
        decay_fracs = []
        for i, d in enumerate(distances):
            run_data = df[(df['RunNumber'] == i) & (df['PrimaryPDG'] == pdg)]
            if len(run_data) > 0:
                decay_fracs.append(run_data['Decayed'].sum() / len(run_data) * 100)
            else:
                decay_fracs.append(0)
        ax4.plot(distances, decay_fracs, 'o-', color=color, linewidth=2, markersize=8, label=name)
    ax4.set_xlabel('Flight Distance (m)')
    ax4.set_ylabel('Decay Fraction (%)')
    ax4.set_title('Decay Probability vs Distance')
    ax4.legend()
    ax4.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/05_decay_distributions.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: 05_decay_distributions.png")

def fig6_cherenkov_npe(df):
    """Cherenkov photoelectron distributions"""
    print("\n[6/9] Generating Cherenkov NPE distributions...")
    
    fig, axes = plt.subplots(1, 3, figsize=(14, 4))
    
    for ax, (pdg, name, color) in zip(axes, [
        (211, 'π⁺', 'red'), (321, 'K⁺', 'blue'), (-13, 'μ⁺', 'green')
    ]):
        data = df[df['PrimaryPDG'] == pdg]
        npe1 = data['RICH1_NPE']
        npe2 = data['RICH2_NPE']
        
        if len(data) > 0:
            ax.hist(npe1, bins=30, alpha=0.5, color=color, label=f'RICH1: μ={npe1.mean():.1f}')
            ax.hist(npe2, bins=30, alpha=0.5, color='gray', label=f'RICH2: μ={npe2.mean():.1f}')
            ax.set_xlabel('Number of Photoelectrons')
            ax.set_ylabel('Events')
            ax.set_title(f'{name} Cherenkov NPE\n(N={len(data)})')
            ax.legend()
        ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/06_cherenkov_npe.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: 06_cherenkov_npe.png")

def fig7_beam_profile(df):
    """Beam profile 2D histograms"""
    print("\n[7/9] Generating beam profile...")
    
    fig, axes = plt.subplots(1, 3, figsize=(14, 4))
    
    for ax, (pdg, name, cmap) in zip(axes, [
        (211, 'π⁺', 'Reds'), (321, 'K⁺', 'Blues'), (-13, 'μ⁺', 'Greens')
    ]):
        data = df[df['PrimaryPDG'] == pdg]
        if len(data) > 0:
            h = ax.hist2d(data['PrimaryPosX'], data['PrimaryPosY'], 
                         bins=30, cmap=cmap, range=[[-4, 4], [-4, 4]])
            plt.colorbar(h[3], ax=ax, label='Events')
            circle1 = plt.Circle((0, 0), 1.0, fill=False, color='white', linestyle='--', linewidth=2)
            ax.add_patch(circle1)
        ax.set_xlabel('X (cm)')
        ax.set_ylabel('Y (cm)')
        ax.set_title(f'{name} Beam Profile (N={len(data)})')
        ax.set_aspect('equal')
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/07_beam_profile_2d.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: 07_beam_profile_2d.png")

def fig8_pid_performance(df):
    """PID performance matrix"""
    print("\n[8/9] Generating PID performance matrix...")
    
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    
    # β vs E/p scatter
    ax1 = axes[0, 0]
    for pdg, name, color in [(211, 'π⁺', 'red'), (321, 'K⁺', 'blue'), (-13, 'μ⁺', 'green')]:
        data = df[df['PrimaryPDG'] == pdg]
        beta = data['RICH1_Beta']
        eop = data['Calo_EoP']
        valid = (beta > 0.99) & (beta < 1.01) & (eop < 1.5)
        ax1.scatter(beta[valid], eop[valid], c=color, alpha=0.3, s=10, label=name)
    ax1.axhline(0.3, color='gray', linestyle='--', alpha=0.5)
    ax1.axhline(0.8, color='gray', linestyle='--', alpha=0.5)
    ax1.axvline(0.999, color='gray', linestyle='--', alpha=0.5)
    ax1.set_xlabel('β (RICH)')
    ax1.set_ylabel('E/p (Calorimeter)')
    ax1.set_title('Two-Stage PID Space')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Confusion matrix
    ax2 = axes[0, 1]
    true_labels = df['PrimaryPDG'].map({211: 'π⁺', 321: 'K⁺', -13: 'μ⁺'})
    reco_labels = df['ReconstructedPID'].map({211: 'π⁺', 321: 'K⁺', -13: 'μ⁺', 0: 'Unknown'})
    
    species = ['π⁺', 'K⁺', 'μ⁺']
    matrix = np.zeros((3, 4))
    for i, true in enumerate(species):
        for j, reco in enumerate(species + ['Unknown']):
            matrix[i, j] = ((true_labels == true) & (reco_labels == reco)).sum()
    
    # Normalize
    matrix_norm = matrix / matrix.sum(axis=1, keepdims=True) * 100
    
    im = ax2.imshow(matrix_norm, cmap='Blues', aspect='auto')
    ax2.set_xticks(range(4))
    ax2.set_xticklabels(species + ['Unknown'])
    ax2.set_yticks(range(3))
    ax2.set_yticklabels(species)
    ax2.set_xlabel('Reconstructed')
    ax2.set_ylabel('True')
    ax2.set_title('PID Confusion Matrix (%)')
    for i in range(3):
        for j in range(4):
            ax2.text(j, i, f'{matrix_norm[i,j]:.1f}%', ha='center', va='center')
    plt.colorbar(im, ax=ax2)
    
    # Efficiency vs distance
    ax3 = axes[1, 0]
    distances = [0, 5, 10, 15]
    for pdg, name, color in [(211, 'π⁺', 'red'), (321, 'K⁺', 'blue')]:
        effs = []
        for i in range(4):
            run = df[(df['RunNumber'] == i) & (df['PrimaryPDG'] == pdg)]
            if len(run) > 0:
                correct = (run['ReconstructedPID'] == pdg).sum()
                effs.append(correct / len(run) * 100)
            else:
                effs.append(0)
        ax3.plot(distances, effs, 'o-', color=color, linewidth=2, markersize=8, label=name)
    ax3.set_xlabel('Flight Distance (m)')
    ax3.set_ylabel('PID Efficiency (%)')
    ax3.set_ylim([0, 105])
    ax3.set_title('PID Efficiency vs Distance')
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # Survival efficiency
    ax4 = axes[1, 1]
    for pdg, name, color in [(211, 'π⁺', 'red'), (321, 'K⁺', 'blue')]:
        survivals = []
        for i in range(4):
            run = df[(df['RunNumber'] == i) & (df['PrimaryPDG'] == pdg)]
            if len(run) > 0:
                survivals.append(run['Survived'].sum() / len(run) * 100)
            else:
                survivals.append(0)
        ax4.plot(distances, survivals, 'o-', color=color, linewidth=2, markersize=8, label=name)
    ax4.set_xlabel('Flight Distance (m)')
    ax4.set_ylabel('Survival Fraction (%)')
    ax4.set_title('Survival vs Distance (Time Dilation)')
    ax4.legend()
    ax4.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/08_pid_performance.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: 08_pid_performance.png")

def fig9_lifetime_fit(df):
    """Lifetime/decay length measurement"""
    print("\n[9/9] Generating lifetime measurement...")
    
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    
    distances = np.array([0, 5, 10, 15])
    
    def exp_decay(x, S0, lam):
        return S0 * np.exp(-x / lam)
    
    for ax, (pdg, name, color, expected_lambda) in zip(axes, [
        (211, 'π⁺', 'red', 447), (321, 'K⁺', 'blue', 60)
    ]):
        survivals = []
        errors = []
        for i in range(4):
            run = df[(df['RunNumber'] == i) & (df['PrimaryPDG'] == pdg)]
            if len(run) > 0:
                s = run['Survived'].sum() / len(run)
                survivals.append(s)
                errors.append(np.sqrt(s * (1-s) / len(run)))
            else:
                survivals.append(1)
                errors.append(0.1)
        
        survivals = np.array(survivals)
        errors = np.array(errors)
        
        # Fit
        try:
            popt, pcov = curve_fit(exp_decay, distances, survivals, p0=[1.0, expected_lambda], 
                                   sigma=errors, absolute_sigma=True)
            S0_fit, lambda_fit = popt
            lambda_err = np.sqrt(pcov[1, 1])
            
            # Plot data
            ax.errorbar(distances, survivals, yerr=errors, fmt='o', color=color, 
                       markersize=10, capsize=5, label='Data')
            
            # Plot fit
            x_fit = np.linspace(0, 20, 100)
            ax.plot(x_fit, exp_decay(x_fit, *popt), '-', color=color, linewidth=2,
                   label=f'Fit: λ = {lambda_fit:.1f} ± {lambda_err:.1f} m')
            
            # Expected curve
            ax.plot(x_fit, exp_decay(x_fit, 1.0, expected_lambda), '--', color='gray',
                   linewidth=1, label=f'Expected: λ = {expected_lambda} m')
            
            ax.set_title(f'{name} Decay Length Measurement\nλ_meas = {lambda_fit:.1f} m vs λ_exp = {expected_lambda} m')
        except:
            ax.errorbar(distances, survivals, yerr=errors, fmt='o', color=color, markersize=10)
            ax.set_title(f'{name} (fit failed)')
        
        ax.set_xlabel('Flight Distance (m)')
        ax.set_ylabel('Survival Fraction')
        ax.set_xlim([-1, 20])
        ax.set_ylim([0, 1.1])
        ax.legend()
        ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{OUTPUT_DIR}/09_lifetime_measurement.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("✓ Saved: 09_lifetime_measurement.png")

def main():
    print("="*60)
    print("GENERATING ALL SIMULATION FIGURES")
    print("="*60)
    
    # Ensure output dir exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Load data
    df = load_all_data()
    if df is None:
        print("ERROR: No data files found!")
        return
    
    print(f"\nTotal events loaded: {len(df)}")
    print(f"  π⁺: {(df['PrimaryPDG']==211).sum()}")
    print(f"  K⁺: {(df['PrimaryPDG']==321).sum()}")
    print(f"  μ⁺: {(df['PrimaryPDG']==-13).sum()}")
    
    # Generate all figures
    fig1_trajectory_fixed(df)
    fig2_momentum_distribution(df)
    fig3_beta_distribution(df)
    fig4_eop_distribution(df)
    fig5_decay_distributions(df)
    fig6_cherenkov_npe(df)
    fig7_beam_profile(df)
    fig8_pid_performance(df)
    fig9_lifetime_fit(df)
    
    print("\n" + "="*60)
    print("ALL FIGURES GENERATED SUCCESSFULLY!")
    print(f"Output: {OUTPUT_DIR}")
    print("="*60)

if __name__ == '__main__':
    main()
