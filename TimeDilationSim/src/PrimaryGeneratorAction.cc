//
// PrimaryGeneratorAction.cc
// Generates primary π+ and K+ with realistic beam profile
//

#include "PrimaryGeneratorAction.hh"

#include "G4ParticleGun.hh"
#include "G4ParticleTable.hh"
#include "G4ParticleDefinition.hh"
#include "G4SystemOfUnits.hh"
#include "Randomize.hh"
#include "G4Event.hh"

PrimaryGeneratorAction::PrimaryGeneratorAction()
: G4VUserPrimaryGeneratorAction(),
  fParticleGun(nullptr),
  fBeamMomentum(8.0*GeV),
  fMomentumSpread(0.1*GeV),  // 1.25% momentum bite
  fBeamSpotSize(1.0*cm),     // σ = 1 cm
  fAngularDivergence(2.0*mrad),  // σ_θ = 2 mrad
  fPionFraction(0.9480),     // 94.80% π+ (adjusted to include muons)
  fKaonFraction(0.0500),     // 5.00% K+
  fMuonFraction(0.0020)      // ~0.20% μ+ from beamline π→μν decay (~200/spill)
{
  G4int nParticles = 1;
  fParticleGun = new G4ParticleGun(nParticles);

  // Default particle (will be randomized in GeneratePrimaries)
  G4ParticleTable* particleTable = G4ParticleTable::GetParticleTable();
  G4ParticleDefinition* pionPlus = particleTable->FindParticle("pi+");
  fParticleGun->SetParticleDefinition(pionPlus);
  
  // Default position (upstream of Station 1)
  fParticleGun->SetParticlePosition(G4ThreeVector(0, 0, -0.5*m));
  
  // Default direction (along +z)
  fParticleGun->SetParticleMomentumDirection(G4ThreeVector(0, 0, 1));
}

PrimaryGeneratorAction::~PrimaryGeneratorAction()
{
  delete fParticleGun;
}

void PrimaryGeneratorAction::GeneratePrimaries(G4Event* event)
{
  // 1. Select particle type (94.8% π+, 5% K+, 0.2% μ+ from beamline decay)
  // Per proposal: "~200 μ+/spill from π→μν decay in beamline—used to calibrate"
  G4ParticleTable* particleTable = G4ParticleTable::GetParticleTable();
  G4ParticleDefinition* particle;
  
  G4double rand = G4UniformRand();
  if (rand < fPionFraction) {
    particle = particleTable->FindParticle("pi+");
  } else if (rand < fPionFraction + fKaonFraction) {
    particle = particleTable->FindParticle("kaon+");
  } else {
    particle = particleTable->FindParticle("mu+");  // μ+ for calibration
  }
  fParticleGun->SetParticleDefinition(particle);

  // 2. Sample momentum from Gaussian distribution
  G4double momentum = G4RandGauss::shoot(fBeamMomentum, fMomentumSpread);
  
  // Convert to energy (E = sqrt(p² + m²))
  G4double mass = particle->GetPDGMass();
  G4double energy = std::sqrt(momentum*momentum + mass*mass);
  fParticleGun->SetParticleEnergy(energy - mass);  // Kinetic energy
  
  // 3. Sample beam spot position (Gaussian, σ = 1 cm)
  G4double x = G4RandGauss::shoot(0.0, fBeamSpotSize);
  G4double y = G4RandGauss::shoot(0.0, fBeamSpotSize);
  G4double z = -0.5*m;  // 50 cm upstream of Station 1
  fParticleGun->SetParticlePosition(G4ThreeVector(x, y, z));

  // 4. Sample beam direction (Gaussian angular divergence)
  G4double theta_x = G4RandGauss::shoot(0.0, fAngularDivergence);
  G4double theta_y = G4RandGauss::shoot(0.0, fAngularDivergence);
  
  // Direction vector (small-angle approximation)
  G4double px = std::sin(theta_x);
  G4double py = std::sin(theta_y);
  G4double pz = std::sqrt(1.0 - px*px - py*py);  // Normalize
  
  fParticleGun->SetParticleMomentumDirection(G4ThreeVector(px, py, pz));

  // Generate primary vertex
  fParticleGun->GeneratePrimaryVertex(event);
}
