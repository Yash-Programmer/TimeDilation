//
// PhysicsList.cc
// Registers physics processes (decay, EM, optical, hadronic)
//

#include "PhysicsList.hh"

#include "G4DecayPhysics.hh"
#include "G4EmStandardPhysics.hh"
#include "G4EmExtraPhysics.hh"
#include "G4OpticalPhysics.hh"
#include "G4HadronElasticPhysicsHP.hh"
#include "G4HadronPhysicsQGSP_BERT.hh"
#include "G4StoppingPhysics.hh"
#include "G4IonPhysics.hh"
#include "G4SystemOfUnits.hh"

PhysicsList::PhysicsList()
: G4VModularPhysicsList()
{
  SetVerboseLevel(1);

  // 1. Decay Physics (CRITICAL for pion/kaon decays!)
  RegisterPhysics(new G4DecayPhysics());

  // 2. EM Standard Physics (ionization, bremsstrahlung, multiple scattering)
  RegisterPhysics(new G4EmStandardPhysics());

  // 3. Optical Physics (Cherenkov, scintillation, optical photon processes)
  G4OpticalPhysics* opticalPhysics = new G4OpticalPhysics();
  // Modern GEANT4 handles these via G4OpticalParameters, defaults are fine for now
  // opticalPhysics->SetMaxNumPhotonsPerStep(100);
  // opticalPhysics->SetMaxBetaChangePerStep(10.0);
  // opticalPhysics->SetTrackSecondariesFirst(kCerenkov, true);
  // opticalPhysics->SetTrackSecondariesFirst(kScintillation, true);
  RegisterPhysics(opticalPhysics);

  // 4. Hadronic Physics (for kaon interactions)
  RegisterPhysics(new G4HadronPhysicsQGSP_BERT());
  RegisterPhysics(new G4HadronElasticPhysicsHP());
  RegisterPhysics(new G4StoppingPhysics());
  RegisterPhysics(new G4IonPhysics());

  // 5. Extra EM Physics (gamma-nuclear, mu-nuclear)
  RegisterPhysics(new G4EmExtraPhysics());
}

PhysicsList::~PhysicsList()
{
}

void PhysicsList::SetCuts()
{
  // Default production cuts
  SetCutsWithDefault();

  // Set production cuts for specific regions if needed
  // Lower cuts in sensitive detectors for better precision
  SetCutValue(1.0*mm, "gamma");
  SetCutValue(1.0*mm, "e-");
  SetCutValue(1.0*mm, "e+");
  SetCutValue(0.1*mm, "proton");
}
