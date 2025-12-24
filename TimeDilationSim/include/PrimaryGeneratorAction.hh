//
// PrimaryGeneratorAction.hh
// Particle gun configuration (π+, K+, μ+ at 8 GeV/c)
// Per proposal: 94.8% π+, 5% K+, 0.2% μ+ (beamline calibration)
//

#ifndef PrimaryGeneratorAction_h
#define PrimaryGeneratorAction_h 1

#include "G4VUserPrimaryGeneratorAction.hh"
#include "G4ParticleGun.hh"
#include "globals.hh"

class G4ParticleGun;
class G4Event;

class PrimaryGeneratorAction : public G4VUserPrimaryGeneratorAction
{
public:
  PrimaryGeneratorAction();
  ~PrimaryGeneratorAction() override;

  void GeneratePrimaries(G4Event*) override;

  const G4ParticleGun* GetParticleGun() const { return fParticleGun; }

private:
  G4ParticleGun* fParticleGun;
  
  // Beam parameters (per proposal Section 2.1)
  G4double fBeamMomentum;      // Central momentum: 8 GeV/c
  G4double fMomentumSpread;    // Gaussian sigma: 0.1 GeV (1.25% bite)
  G4double fBeamSpotSize;      // Transverse σ: 1 cm
  G4double fAngularDivergence; // Divergence σ: 2 mrad
  
  // Beam composition (per proposal)
  G4double fPionFraction;      // 94.80% π+ (primary)
  G4double fKaonFraction;      // 5.00% K+ (primary)
  G4double fMuonFraction;      // 0.20% μ+ (~200/spill from beamline decay)
};

#endif
