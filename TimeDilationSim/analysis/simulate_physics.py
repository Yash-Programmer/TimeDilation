#!/usr/bin/env python3
"""
simulate_physics.py
Python-based Monte Carlo simulation mimicking GEANT4 physics
Generates realistic decay data for immediate analysis
"""

import numpy as np
import pandas as pd
from pathlib import Path

# Physical constants
C_LIGHT = 299792458  # m/s
PION_MASS = 0.13957  # GeV
KAON_MASS = 0.49368  # GeV
MUON_MASS = 0.10566  # GeV
PION_LIFETIME = 26.03e-9  # s
KAON_LIFETIME = 12.38e-9  # s

def lorentz_gamma(momentum, mass):
    """Calculate Lorentz γ factor"""
    energy = np.sqrt(momentum**2 + mass**2)
    return energy / mass

def beta_from_momentum(momentum, mass):
    """Calculate velocity β = v/c"""
    energy = np.sqrt(momentum**2 + mass**2)
    return momentum / energy

def decay_length(momentum, mass, lifetime):
    """Calculate characteristic decay length λ = βcγτ₀"""
    gamma = lorentz_gamma(momentum, mass)
    beta = beta_from_momentum(momentum, mass)
    return beta * C_LIGHT * gamma * lifetime

def simulate_beam(n_events, pion_fraction=0.95):
    """Generate beam particles with realistic distribution"""
    # Particle type (95% pions, 5% kaons)
    particle_pdg = np.where(
        np.random.random(n_events) < pion_fraction,
        211,  # pion
        321   # kaon
    )
    
    # Momentum (Gaussian, mean=8 GeV/c, sigma=0.1 GeV/c)
    momentum = np.random.normal(8.0, 0.1, n_events)
    
    # Initial position (beam spot, sigma=1 cm)
    pos_x = np.random.normal(0, 1.0, n_events)  # cm
    pos_y = np.random.normal(0, 1.0, n_events)
    pos_z = np.full(n_events, -50.0)  # -50 cm upstream
    
    return pd.DataFrame({
        'EventID': np.arange(n_events),
        'PrimaryPDG': particle_pdg,
        'PrimaryMom': momentum,
        'PrimaryPosX': pos_x,
        'PrimaryPosY': pos_y,
        'PrimaryPosZ': pos_z
    })

def simulate_decay(df, station2_position=1500):
    """Simulate decay-in-flight to station2_position (cm)"""
    results = []
    
    for _, row in df.iterrows():
        pdg = row['PrimaryPDG']
        momentum = row['PrimaryMom']
        
        # Get particle parameters
        if pdg == 211:
            mass = PION_MASS
            lifetime = PION_LIFETIME
        else:  # 321 (kaon)
            mass = KAON_MASS
            lifetime = KAON_LIFETIME
        
        # Calculate decay length
        lambda_decay = decay_length(momentum, mass, lifetime)
        
        # Sample decay position (exponential distribution)
        decay_distance = np.random.exponential(lambda_decay * 100)  # convert m to cm
        
        # Check if particle reaches station 2
        flight_distance = station2_position - row['PrimaryPosZ']
        
        if decay_distance < flight_distance:
            # Particle decayed before station 2
            decayed = True
            survived = False
            decay_z = row['PrimaryPosZ'] + decay_distance
            decay_product_pdg = -13  # muon (μ+)
        else:
            # Particle survived to station 2
            decayed = False
            survived = True
            decay_z = 0
            decay_product_pdg = 0
        
        # RICH detector (measure β)
        beta_true = beta_from_momentum(momentum, mass)
        # Add measurement uncertainty (Δβ/β ~ 10^-3)
        beta_measured = beta_true + np.random.normal(0, beta_true * 0.001)
        
        # Calorimeter energy (for stable particles, minimal deposition)
        if survived:
            calo_energy = 0.1 + np.random.normal(0, 0.05)  # MIP energy
        else:
            calo_energy = 0.0
        
        eop = calo_energy / momentum if survived else 0
        
        # Scintillator hits
        sc1_hit = True  # All particles hit SC1
        sc2_hit = survived
        
        # DWC hits
        dwc1_nhits = 10 + np.random.poisson(2)
        dwc2_nhits = (10 + np.random.poisson(2)) if survived else 0
        
        results.append({
            **row.to_dict(),
            'RICH1_Beta': beta_measured,
            'RICH1_NPE': int(50 + np.random.poisson(10)),
            'RICH2_Beta': beta_measured if survived else 0,
            'RICH2_NPE': int(50 + np.random.poisson(10)) if survived else 0,
            'Calo_TotalE': calo_energy,
            'Calo_EoP': eop,
            'DWC1_NHits': dwc1_nhits,
            'DWC1_TrackAngle': 0.0,
            'DWC2_NHits': dwc2_nhits,
            'DWC2_TrackAngle': 0.0,
            'DecayKinkDetected': int(decayed),
            'SC1_Hit': int(sc1_hit),
            'SC2_Hit': int(sc2_hit),
            'TOF': 50.0 if survived else 0.0,
            'Decayed': int(decayed),
            'DecayPosX': 0.0,
            'DecayPosY': 0.0,
            'DecayPosZ': decay_z,
            'DecayTime': decay_distance / (beta_true * C_LIGHT * 100) if decayed else 0,
            'DecayProductPDG': decay_product_pdg,
            'ReconstructedPID': pdg,
            'Survived': int(survived)
        })
    
    return pd.DataFrame(results)

def run_simulation(n_events, station_positions=[0, 500, 1000, 1500]):
    """Run full simulation for all station positions"""
    print(f"Generating {n_events} events per position...")
    
    output_dir = Path('../output')
    output_dir.mkdir(exist_ok=True)
    
    for run_id, position in enumerate(station_positions):
        print(f"\nRun {run_id}: Station2 @ {position/100:.1f} m")
        
        # Generate beam
        beam = simulate_beam(n_events)
        
        # Simulate physics
        data = simulate_decay(beam, station2_position=position)
        
        # Add run number
        data['RunNumber'] = run_id
        
        # Save to CSV
        csv_file = output_dir / f'TimeDilation_Run{run_id}.csv'
        data.to_csv(csv_file, index=False)
        print(f"  Saved: {csv_file}")
        
        # Print statistics
        n_pions = (data['PrimaryPDG'] == 211).sum()
        n_kaons = (data['PrimaryPDG'] == 321).sum()
        pion_survival = data[(data['PrimaryPDG'] == 211) & (data['Survived'] == 1)].shape[0] / n_pions
        kaon_survival = data[(data['PrimaryPDG'] == 321) & (data['Survived'] == 1)].shape[0] / n_kaons
        
        print(f"  Pions: {n_pions} total, {pion_survival:.4f} survived")
        print(f"  Kaons: {n_kaons} total, {kaon_survival:.4f} survived")

if __name__ == '__main__':
    # Run with 10,000 events per position (fast, good statistics)
    run_simulation(10000, station_positions=[0, 500, 1000, 1500])
    print("\n✓ Simulation complete! CSV files saved in output/")
    print("Run analysis scripts to generate figures.")
