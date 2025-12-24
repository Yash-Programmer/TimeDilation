//
// SteppingAction.cc
// Monitors particle decays and Cherenkov photon emission during tracking
//

#include "SteppingAction.hh"
#include "PhysicsConstants.hh"
#include "G4Step.hh"
#include "G4Track.hh"
#include "G4ParticleDefinition.hh"
#include "G4SystemOfUnits.hh"
#include "G4VProcess.hh"
#include "G4OpticalPhoton.hh"

SteppingAction::SteppingAction(EventAction* eventAction)
: G4UserSteppingAction(),
  fEventAction(eventAction)
{
}

SteppingAction::~SteppingAction()
{
}

void SteppingAction::UserSteppingAction(const G4Step* step)
{
  G4Track* track = step->GetTrack();
  G4ParticleDefinition* particle = track->GetDefinition();
  G4int pdg = particle->GetPDGEncoding();

  // ====================================================================
  // 1. CHERENKOV PHOTON DETECTION FOR β RECONSTRUCTION
  // ====================================================================
  // Track optical photons produced by Cherenkov process in RICH
  if (particle == G4OpticalPhoton::OpticalPhotonDefinition()) {
    // Check if photon was created by Cherenkov process
    const G4VProcess* creatorProcess = track->GetCreatorProcess();
    if (creatorProcess && creatorProcess->GetProcessName() == "Cerenkov") {
      G4String volumeName = track->GetVolume()->GetName();
      
      // Record Cherenkov photon in RICH1 or RICH2
      if (volumeName.contains("RICH1")) {
        // Get parent particle's β from Cherenkov angle
        // cos(θ_c) = 1/(nβ) → β = 1/(n·cos(θ_c))
        G4ThreeVector photonDir = track->GetMomentumDirection();
        G4ThreeVector parentDir = track->GetVertexMomentumDirection();
        
        // Calculate Cherenkov angle
        G4double cosTheta = photonDir.dot(parentDir);
        if (cosTheta > 0 && cosTheta <= 1.0) {
          G4double cherenkovAngle = std::acos(cosTheta);
          G4double beta = ExpConstants::BetaFromCherenkov(cherenkovAngle, 
                                                          ExpConstants::C4F10_REFRACTIVE_INDEX);
          fEventAction->AddRICH1Photon(beta);
        }
        // Kill photon to save CPU (we've recorded the info)
        const_cast<G4Track*>(track)->SetTrackStatus(fStopAndKill);
      }
      else if (volumeName.contains("RICH2")) {
        G4ThreeVector photonDir = track->GetMomentumDirection();
        G4ThreeVector parentDir = track->GetVertexMomentumDirection();
        
        G4double cosTheta = photonDir.dot(parentDir);
        if (cosTheta > 0 && cosTheta <= 1.0) {
          G4double cherenkovAngle = std::acos(cosTheta);
          G4double beta = ExpConstants::BetaFromCherenkov(cherenkovAngle,
                                                          ExpConstants::C4F10_REFRACTIVE_INDEX);
          fEventAction->AddRICH2Photon(beta);
        }
        const_cast<G4Track*>(track)->SetTrackStatus(fStopAndKill);
      }
    }
    return;  // Don't process photons further
  }

  // ====================================================================
  // 2. PARTICLE DECAY MONITORING
  // ====================================================================
  // Check if particle is π+, K+, or μ+ (using PDG codes from constants)
  if (pdg == ExpConstants::PDG_PION_PLUS || 
      pdg == ExpConstants::PDG_KAON_PLUS || 
      pdg == ExpConstants::PDG_MUON_PLUS) {
    
    // Check if track stopped due to decay
    if (track->GetTrackStatus() == fStopAndKill) {
      const G4VProcess* process = step->GetPostStepPoint()->GetProcessDefinedStep();
      if (process && process->GetProcessName() == "Decay") {
        
        // Record decay position and time
        G4ThreeVector pos = step->GetPostStepPoint()->GetPosition();
        G4double time = step->GetPostStepPoint()->GetGlobalTime();
        
        // Get decay product (first secondary)
        const std::vector<const G4Track*>* secondaries = step->GetSecondaryInCurrentStep();
        G4int decayProductPDG = 0;
        if (secondaries && secondaries->size() > 0) {
          decayProductPDG = (*secondaries)[0]->GetDefinition()->GetPDGEncoding();
        }
        
        fEventAction->SetDecayInfo(
          true,
          pos.x() / cm,
          pos.y() / cm,
          pos.z() / cm,
          time / ns,
          decayProductPDG
        );
      }
    }
  }

  // ====================================================================
  // 3. DETECTOR RESPONSE (simplified, via energy deposition)
  // ====================================================================
  G4String volumeName = track->GetVolume()->GetName();
  G4double edep = step->GetTotalEnergyDeposit();
  
  if (edep > 0) {
    if (volumeName.contains("Scint")) {
      fEventAction->AddCaloEnergy(edep / GeV);
    }
    if (volumeName == "SC1") {
      fEventAction->RecordSC1Hit();
    }
    if (volumeName == "SC2") {
      fEventAction->RecordSC2Hit();
    }
    if (volumeName.contains("DWC1")) {
      fEventAction->AddDWC1Hit();
    }
    if (volumeName.contains("DWC2")) {
      fEventAction->AddDWC2Hit();
    }
  }
}
