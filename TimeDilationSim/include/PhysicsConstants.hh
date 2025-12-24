//
// PhysicsConstants.hh
// Physics constants from Time Dilation Universality Experiment proposal
// All values correspond to 8 GeV/c beam momentum
//

#ifndef PhysicsConstants_h
#define PhysicsConstants_h 1

#include "G4SystemOfUnits.hh"
#include "G4PhysicalConstants.hh"
#include <cmath>

namespace ExpConstants {

  //============================================================================
  // BEAM PARAMETERS (Section 2.1)
  //============================================================================
  constexpr G4double BEAM_MOMENTUM      = 8.0 * GeV;     // Central momentum
  constexpr G4double MOMENTUM_SPREAD    = 0.1 * GeV;     // σ_p = 0.1 GeV (1.25%)
  constexpr G4double BEAM_SPOT_SIGMA    = 1.0 * cm;      // Transverse σ
  constexpr G4double ANGULAR_DIVERGENCE = 2.0 * mrad;    // σ_θ

  //============================================================================
  // PARTICLE MASSES (PDG 2024 values)
  //============================================================================
  constexpr G4double PION_MASS_MEV      = 139.57039;     // MeV/c²
  constexpr G4double KAON_MASS_MEV      = 493.677;       // MeV/c²
  constexpr G4double MUON_MASS_MEV      = 105.6583755;   // MeV/c²

  //============================================================================
  // REST-FRAME LIFETIMES (PDG 2024)
  //============================================================================
  constexpr G4double PION_LIFETIME      = 26.033 * ns;   // τ₀(π+)
  constexpr G4double KAON_LIFETIME      = 12.380 * ns;   // τ₀(K+)
  constexpr G4double MUON_LIFETIME      = 2196.98 * ns;  // τ₀(μ+)

  //============================================================================
  // LORENTZ FACTORS γ AT 8 GeV/c (γ = E/m = √(p² + m²)/m)
  //============================================================================
  // γ = p / (m * √(1 - (m/E)²)) ≈ √(1 + (p/m)²) for relativistic particles
  constexpr G4double PION_GAMMA         = 57.33;         // γ(π+) at 8 GeV/c
  constexpr G4double KAON_GAMMA         = 16.24;         // γ(K+) at 8 GeV/c
  constexpr G4double MUON_GAMMA         = 75.72;         // γ(μ+) at 8 GeV/c

  //============================================================================
  // VELOCITIES β AT 8 GeV/c (β = p/E = p/√(p² + m²))
  //============================================================================
  constexpr G4double PION_BETA          = 0.99985;       // β(π+)
  constexpr G4double KAON_BETA          = 0.99810;       // β(K+)
  constexpr G4double MUON_BETA          = 0.99991;       // β(μ+)

  //============================================================================
  // LAB-FRAME DECAY LENGTHS λ = γ·β·c·τ₀ (meters)
  //============================================================================
  constexpr G4double PION_DECAY_LENGTH  = 447.0 * m;     // λ(π+)
  constexpr G4double KAON_DECAY_LENGTH  = 60.0  * m;     // λ(K+)
  constexpr G4double MUON_DECAY_LENGTH  = 49900.0 * m;   // λ(μ+)

  //============================================================================
  // EXPECTED SURVIVAL FRACTIONS N(L)/N₀ = exp(-L/λ)
  //============================================================================
  // At L = 15 m flight distance (maximum Station 2 position)
  constexpr G4double PION_SURVIVAL_15M  = 0.967;         // 96.7% survive
  constexpr G4double KAON_SURVIVAL_15M  = 0.779;         // 77.9% survive
  constexpr G4double MUON_SURVIVAL_15M  = 0.9997;        // 99.97% survive

  constexpr G4double PION_DECAY_15M     = 0.033;         // 3.3% decay
  constexpr G4double KAON_DECAY_15M     = 0.221;         // 22.1% decay
  constexpr G4double MUON_DECAY_15M     = 0.0003;        // 0.03% decay

  //============================================================================
  // RICH DETECTOR PARAMETERS (Section 2.1)
  //============================================================================
  constexpr G4double C4F10_REFRACTIVE_INDEX = 1.0014;    // n for C4F10
  constexpr G4double CHERENKOV_THRESHOLD_BETA = 0.99860; // β_th = 1/n
  
  // Cherenkov angle θ_c = arccos(1/(nβ))
  // At n = 1.0014:
  //   π+ (β = 0.99985): θ_c ≈ 32.4 mrad
  //   K+ (β = 0.99810): θ_c ≈ 24.7 mrad
  //   μ+ (β = 0.99991): θ_c ≈ 32.6 mrad
  constexpr G4double PION_CHERENKOV_ANGLE   = 32.4 * mrad;
  constexpr G4double KAON_CHERENKOV_ANGLE   = 24.7 * mrad;
  constexpr G4double MUON_CHERENKOV_ANGLE   = 32.6 * mrad;

  // RICH resolution (proposal target)
  constexpr G4double RICH_BETA_RESOLUTION   = 1.0e-3;    // Δβ/β ~ 10⁻³

  //============================================================================
  // CALORIMETER PARAMETERS
  //============================================================================
  constexpr G4double CALO_PB_THICKNESS      = 2.0 * mm;  // Per layer
  constexpr G4double CALO_SCINT_THICKNESS   = 5.0 * mm;  // Per layer
  constexpr G4int    CALO_NUM_LAYERS        = 20;        // Total layers
  // Total depth: 20 × (2mm + 5mm) = 14 cm ≈ 20 X₀

  // E/p discrimination thresholds (proposal Section 2.1)
  constexpr G4double EOP_HADRONIC_MIN       = 0.5;       // π+ shower
  constexpr G4double EOP_HADRONIC_MAX       = 0.8;       // π+ shower
  constexpr G4double EOP_MIP_MAX            = 0.3;       // μ+ MIP
  constexpr G4double SHOWER_WIDTH_HADRONIC  = 3.0 * cm;  // π+ wide shower

  //============================================================================
  // SYSTEMATIC UNCERTAINTIES (Section 3.2.1)
  //============================================================================
  constexpr G4double SYST_MOMENTUM_SCALE    = 0.002;     // δp/p ≤ 0.2%
  constexpr G4double SYST_RICH_REFINDEX     = 2.0e-5;    // δn/n ≤ 2×10⁻⁵
  constexpr G4double SYST_DISTANCE          = 1.0 * mm;  // δL ≤ 1 mm
  constexpr G4double SYST_TIMING            = 10.0 * ps; // δt ≤ 10 ps

  //============================================================================
  // SENSITIVITY TARGET (Section 4)
  //============================================================================
  constexpr G4double TARGET_SENSITIVITY     = 1.0e-3;    // ε_target ≤ 10⁻³

  //============================================================================
  // PDG CODES
  //============================================================================
  constexpr G4int PDG_PION_PLUS   = 211;
  constexpr G4int PDG_KAON_PLUS   = 321;
  constexpr G4int PDG_MUON_PLUS   = -13;  // Note: μ+ has negative PDG code
  constexpr G4int PDG_MUON_MINUS  = 13;
  constexpr G4int PDG_ELECTRON    = 11;
  constexpr G4int PDG_POSITRON    = -11;
  constexpr G4int PDG_NUMU        = 14;
  constexpr G4int PDG_ANTI_NUMU   = -14;

  //============================================================================
  // HELPER FUNCTIONS
  //============================================================================
  
  // Calculate Lorentz factor γ from momentum and mass
  inline G4double CalculateGamma(G4double p, G4double m) {
    G4double E = std::sqrt(p*p + m*m);
    return E / m;
  }

  // Calculate β from momentum and mass
  inline G4double CalculateBeta(G4double p, G4double m) {
    G4double E = std::sqrt(p*p + m*m);
    return p / E;
  }

  // Calculate decay length λ = γβcτ₀
  inline G4double CalculateDecayLength(G4double gamma, G4double beta, G4double tau0) {
    return gamma * beta * c_light * tau0;
  }

  // Calculate survival probability at distance L
  inline G4double SurvivalProbability(G4double L, G4double lambda) {
    return std::exp(-L / lambda);
  }

  // Calculate Cherenkov angle from β and n
  inline G4double CherenkovAngle(G4double beta, G4double n) {
    G4double cosTheta = 1.0 / (n * beta);
    if (cosTheta > 1.0) return 0.0;  // Below threshold
    return std::acos(cosTheta);
  }

  // Calculate β from Cherenkov angle and n
  inline G4double BetaFromCherenkov(G4double theta, G4double n) {
    return 1.0 / (n * std::cos(theta));
  }

}  // namespace ExpConstants

#endif
