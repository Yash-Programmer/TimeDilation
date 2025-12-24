//
// EventAction.hh
// Event-level data collection and particle ID logic
// Implements two-stage PID per proposal: RICH β + Calorimeter E/p
//

#ifndef EventAction_h
#define EventAction_h 1

#include "G4UserEventAction.hh"
#include "RunAction.hh"
#include "globals.hh"
#include <vector>

class G4Event;

class EventAction : public G4UserEventAction
{
public:
  EventAction(RunAction* runAction);
  ~EventAction() override;

  void BeginOfEventAction(const G4Event*) override;
  void EndOfEventAction(const G4Event*) override;

  // RICH photon accumulation for β reconstruction
  // Per proposal: β from Cherenkov angle, cos(θ_c) = 1/(nβ)
  void AddRICH1Photon(G4double beta) { 
    fRICH1_BetaSum += beta; 
    fRICH1_NPE++; 
  }
  void AddRICH2Photon(G4double beta) { 
    fRICH2_BetaSum += beta; 
    fRICH2_NPE++; 
  }
  
  // Legacy method (still useful for simple tests)
  void AddRICH1Hit(G4double beta, G4int npe) { fRICH1_Beta = beta; fRICH1_NPE = npe; }
  void AddRICH2Hit(G4double beta, G4int npe) { fRICH2_Beta = beta; fRICH2_NPE = npe; }
  
  // Calorimeter and tracking detectors
  void AddCaloEnergy(G4double energy) { fCaloEnergy += energy; }
  void AddDWC1Hit() { fDWC1_NHits++; }
  void AddDWC2Hit() { fDWC2_NHits++; }
  void RecordSC1Hit() { fSC1_Hit = true; }
  void RecordSC2Hit() { fSC2_Hit = true; }
  
  // Decay information recording
  void SetDecayInfo(G4bool decayed, G4double x, G4double y, G4double z, 
                    G4double t, G4int pdg) {
    fDecayed = decayed;
    fDecayPosX = x; fDecayPosY = y; fDecayPosZ = z;
    fDecayTime = t;
    fDecayProductPDG = pdg;
  }

private:
  RunAction* fRunAction;
  
  // RICH β reconstruction accumulators
  G4double fRICH1_BetaSum, fRICH2_BetaSum;  // Sum of β from each photon
  G4double fRICH1_Beta, fRICH2_Beta;        // Final averaged β
  G4int fRICH1_NPE, fRICH2_NPE;             // Number of photoelectrons
  
  // Calorimeter
  G4double fCaloEnergy;
  
  // Drift Wire Chambers
  G4int fDWC1_NHits, fDWC2_NHits;
  
  // Scintillator triggers
  G4bool fSC1_Hit, fSC2_Hit;
  
  // Decay tracking
  G4bool fDecayed;
  G4double fDecayPosX, fDecayPosY, fDecayPosZ, fDecayTime;
  G4int fDecayProductPDG;
  
  // Primary particle info (captured at begin of event)
  G4int fPrimaryPDG;
  G4double fPrimaryMom;
  G4double fPrimaryPosX, fPrimaryPosY, fPrimaryPosZ;
};

#endif
