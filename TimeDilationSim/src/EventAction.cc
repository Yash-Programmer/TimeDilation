//
// EventAction.cc
// Collects detector hits and implements two-stage PID
// Per proposal: Stage 1 (RICH β), Stage 2 (Calorimeter E/p + topology)
//

#include "EventAction.hh"
#include "PhysicsConstants.hh"
#include "G4Event.hh"
#include "G4RunManager.hh"
#include "G4AnalysisManager.hh"
#include "G4SystemOfUnits.hh"
#include "G4PrimaryVertex.hh"
#include "G4PrimaryParticle.hh"
#include <cmath>

EventAction::EventAction(RunAction* runAction)
: G4UserEventAction(),
  fRunAction(runAction),
  fRICH1_BetaSum(0), fRICH2_BetaSum(0),
  fRICH1_Beta(0), fRICH2_Beta(0),
  fRICH1_NPE(0), fRICH2_NPE(0),
  fCaloEnergy(0),
  fDWC1_NHits(0), fDWC2_NHits(0),
  fSC1_Hit(false), fSC2_Hit(false),
  fDecayed(false),
  fDecayPosX(0), fDecayPosY(0), fDecayPosZ(0),
  fDecayTime(0), fDecayProductPDG(0),
  fPrimaryPDG(0), fPrimaryMom(0),
  fPrimaryPosX(0), fPrimaryPosY(0), fPrimaryPosZ(0)
{
}

EventAction::~EventAction()
{
}

void EventAction::BeginOfEventAction(const G4Event* event)
{
  // Reset all event-level accumulators
  fRICH1_BetaSum = 0; fRICH2_BetaSum = 0;
  fRICH1_Beta = 0; fRICH2_Beta = 0;
  fRICH1_NPE = 0; fRICH2_NPE = 0;
  fCaloEnergy = 0;
  fDWC1_NHits = 0; fDWC2_NHits = 0;
  fSC1_Hit = false; fSC2_Hit = false;
  fDecayed = false;
  fDecayPosX = 0; fDecayPosY = 0; fDecayPosZ = 0;
  fDecayTime = 0; fDecayProductPDG = 0;

  // Capture primary particle info
  G4PrimaryVertex* vertex = event->GetPrimaryVertex();
  if (vertex) {
    G4PrimaryParticle* primary = vertex->GetPrimary();
    if (primary) {
      fPrimaryPDG = primary->GetPDGcode();
      
      G4ThreeVector mom = primary->GetMomentum();
      fPrimaryMom = mom.mag() / GeV;
      
      G4ThreeVector pos = vertex->GetPosition();
      fPrimaryPosX = pos.x() / cm;
      fPrimaryPosY = pos.y() / cm;
      fPrimaryPosZ = pos.z() / cm;
    }
  }
}

void EventAction::EndOfEventAction(const G4Event* event)
{
  G4AnalysisManager* analysisManager = G4AnalysisManager::Instance();
  
  // ================================================================
  // CALCULATE AVERAGE β FROM RICH CHERENKOV PHOTONS
  // Per proposal: β = average of individual photon measurements
  // ================================================================
  if (fRICH1_NPE > 0) {
    fRICH1_Beta = fRICH1_BetaSum / fRICH1_NPE;
  }
  if (fRICH2_NPE > 0) {
    fRICH2_Beta = fRICH2_BetaSum / fRICH2_NPE;
  }
  
  // ================================================================
  // DERIVED QUANTITIES
  // ================================================================
  G4double EoP = (fPrimaryMom > 0) ? fCaloEnergy / fPrimaryMom : 0;
  G4double TOF = 0;  // Would be calculated from scintillator timing if implemented
  G4bool survived = fSC2_Hit;  // Particle reached Station 2
  
  // ================================================================
  // TWO-STAGE PARTICLE ID (Per Proposal Section 2.1)
  // Stage 1: RICH β measurement separates K+ from π+/μ+
  // Stage 2: Calorimeter E/p + topology for π+/μ+ discrimination
  // ================================================================
  G4int reconstructedPID = 0;
  G4double beta = (fRICH2_NPE > 0) ? fRICH2_Beta : fRICH1_Beta;
  
  if (beta > 0) {
    // STAGE 1: RICH β discrimination
    // K+ has β ≈ 0.99810, well below π+/μ+ β ≈ 0.9999
    // Threshold at β = 0.9990 separates K+ with >5σ
    if (beta < 0.9990) {
      reconstructedPID = ExpConstants::PDG_KAON_PLUS;  // K+ (β too low for π+/μ+)
    } 
    else {
      // STAGE 2: π+ vs μ+ discrimination via Calorimeter
      // Per proposal:
      //   π+ → hadronic shower: E/p ~ 0.5-0.8, wide shower (>3 cm)
      //   μ+ → MIP: E/p < 0.3, straight track through calorimeter
      
      if (EoP > ExpConstants::EOP_HADRONIC_MIN && EoP < ExpConstants::EOP_HADRONIC_MAX) {
        // High E/p → hadronic shower → π+
        reconstructedPID = ExpConstants::PDG_PION_PLUS;
      }
      else if (EoP < ExpConstants::EOP_MIP_MAX) {
        // Low E/p → MIP behavior → μ+
        reconstructedPID = ExpConstants::PDG_MUON_PLUS;
      }
      else {
        // Ambiguous region - use decay information if available
        if (fDecayed) {
          // π+ → μ+ ν_μ (99.99% BR), K+ → various
          if (fDecayProductPDG == ExpConstants::PDG_MUON_PLUS || 
              fDecayProductPDG == ExpConstants::PDG_MUON_MINUS) {
            reconstructedPID = ExpConstants::PDG_PION_PLUS;  // π+ decayed to μ+
          }
        } else {
          // Default to π+ for high β particles without clear E/p signature
          reconstructedPID = ExpConstants::PDG_PION_PLUS;
        }
      }
    }
  }
  
  // ================================================================
  // FILL NTUPLE (must match column order in RunAction)
  // ================================================================
  analysisManager->FillNtupleIColumn(0, event->GetEventID());
  analysisManager->FillNtupleIColumn(1, G4RunManager::GetRunManager()->GetCurrentRun()->GetRunID());
  
  analysisManager->FillNtupleIColumn(2, fPrimaryPDG);
  analysisManager->FillNtupleDColumn(3, fPrimaryMom);
  analysisManager->FillNtupleDColumn(4, fPrimaryPosX);
  analysisManager->FillNtupleDColumn(5, fPrimaryPosY);
  analysisManager->FillNtupleDColumn(6, fPrimaryPosZ);
  
  analysisManager->FillNtupleDColumn(7, fRICH1_Beta);
  analysisManager->FillNtupleIColumn(8, fRICH1_NPE);
  analysisManager->FillNtupleDColumn(9, fRICH2_Beta);
  analysisManager->FillNtupleIColumn(10, fRICH2_NPE);
  
  analysisManager->FillNtupleDColumn(11, fCaloEnergy);
  analysisManager->FillNtupleDColumn(12, EoP);
  
  analysisManager->FillNtupleIColumn(13, fDWC1_NHits);
  analysisManager->FillNtupleDColumn(14, 0.0);  // Track angle (not implemented)
  analysisManager->FillNtupleIColumn(15, fDWC2_NHits);
  analysisManager->FillNtupleDColumn(16, 0.0);
  analysisManager->FillNtupleIColumn(17, fDecayed ? 1 : 0);
  
  analysisManager->FillNtupleIColumn(18, fSC1_Hit ? 1 : 0);
  analysisManager->FillNtupleIColumn(19, fSC2_Hit ? 1 : 0);
  analysisManager->FillNtupleDColumn(20, TOF);
  
  analysisManager->FillNtupleIColumn(21, fDecayed ? 1 : 0);
  analysisManager->FillNtupleDColumn(22, fDecayPosX);
  analysisManager->FillNtupleDColumn(23, fDecayPosY);
  analysisManager->FillNtupleDColumn(24, fDecayPosZ);
  analysisManager->FillNtupleDColumn(25, fDecayTime);
  analysisManager->FillNtupleIColumn(26, fDecayProductPDG);
  
  analysisManager->FillNtupleIColumn(27, reconstructedPID);
  analysisManager->FillNtupleIColumn(28, survived ? 1 : 0);
  
  analysisManager->AddNtupleRow();
}
