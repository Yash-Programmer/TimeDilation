//
// RunAction.cc
// Creates CSV/ROOT ntuple and manages output file
//

#include "RunAction.hh"
#include "G4RunManager.hh"
#include "G4Run.hh"
#include "G4SystemOfUnits.hh"

RunAction::RunAction()
: G4UserRunAction(),
  fAnalysisManager(nullptr)
{
  // Create analysis manager (CSV format - works without ROOT)
  fAnalysisManager = G4AnalysisManager::Instance();
  fAnalysisManager->SetVerboseLevel(1);
  fAnalysisManager->SetNtupleMerging(true);
  
  // Set default file type to CSV (change to "root" if ROOT is available)
  fAnalysisManager->SetDefaultFileType("csv");

  // Create ntuple
  fAnalysisManager->CreateNtuple("TimeDilation", "Pion-Kaon Decay Data");
  
  // Event info
  fAnalysisManager->CreateNtupleIColumn("EventID");
  fAnalysisManager->CreateNtupleIColumn("RunNumber");
  
  // Primary particle
  fAnalysisManager->CreateNtupleIColumn("PrimaryPDG");    // 211 (π+), 321 (K+)
  fAnalysisManager->CreateNtupleDColumn("PrimaryMom");   // GeV/c
  fAnalysisManager->CreateNtupleDColumn("PrimaryPosX");
  fAnalysisManager->CreateNtupleDColumn("PrimaryPosY");
  fAnalysisManager->CreateNtupleDColumn("PrimaryPosZ");
  
  // RICH data (Station 1 and 2)
  fAnalysisManager->CreateNtupleDColumn("RICH1_Beta");
  fAnalysisManager->CreateNtupleIColumn("RICH1_NPE");
  fAnalysisManager->CreateNtupleDColumn("RICH2_Beta");
  fAnalysisManager->CreateNtupleIColumn("RICH2_NPE");
  
  // Calorimeter
  fAnalysisManager->CreateNtupleDColumn("Calo_TotalE");  // GeV
  fAnalysisManager->CreateNtupleDColumn("Calo_EoP");
  
  // DWC tracking
  fAnalysisManager->CreateNtupleIColumn("DWC1_NHits");
  fAnalysisManager->CreateNtupleDColumn("DWC1_TrackAngle");
  fAnalysisManager->CreateNtupleIColumn("DWC2_NHits");
  fAnalysisManager->CreateNtupleDColumn("DWC2_TrackAngle");
  fAnalysisManager->CreateNtupleIColumn("DecayKinkDetected");
  
  // Scintillator triggers
  fAnalysisManager->CreateNtupleIColumn("SC1_Hit");
  fAnalysisManager->CreateNtupleIColumn("SC2_Hit");
  fAnalysisManager->CreateNtupleDColumn("TOF");  // ns
  
  // Decay information
  fAnalysisManager->CreateNtupleIColumn("Decayed");
  fAnalysisManager->CreateNtupleDColumn("DecayPosX");
  fAnalysisManager->CreateNtupleDColumn("DecayPosY");
  fAnalysisManager->CreateNtupleDColumn("DecayPosZ");
  fAnalysisManager->CreateNtupleDColumn("DecayTime");
  fAnalysisManager->CreateNtupleIColumn("DecayProductPDG");
  
  // Analysis results
  fAnalysisManager->CreateNtupleIColumn("ReconstructedPID");
  fAnalysisManager->CreateNtupleIColumn("Survived");
  
  fAnalysisManager->FinishNtuple();
}

RunAction::~RunAction()
{
  delete G4AnalysisManager::Instance();
}

void RunAction::BeginOfRunAction(const G4Run* run)
{
  G4int runID = run->GetRunID();
  
  // Open output file (CSV format, name includes run number)
  G4String fileName = "TimeDilation_Run" + std::to_string(runID);
  fAnalysisManager->OpenFile(fileName);
  
  G4cout << "### Run " << runID << " start. Output: " << fileName << ".csv" << G4endl;
}

void RunAction::EndOfRunAction(const G4Run* run)
{
  // Save and close file
  fAnalysisManager->Write();
  fAnalysisManager->CloseFile();
  
  G4cout << "### Run " << run->GetRunID() << " end." << G4endl;
}
