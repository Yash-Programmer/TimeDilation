//
// DetectorMessenger.cc
// Implementation of UI commands for detector configuration
//

#include "DetectorMessenger.hh"
#include "DetectorConstruction.hh"

#include "G4UIdirectory.hh"
#include "G4UIcmdWithADoubleAndUnit.hh"

DetectorMessenger::DetectorMessenger(DetectorConstruction* detector)
: G4UImessenger(),
  fDetector(detector),
  fDetDirectory(nullptr),
  fStation2PosCmd(nullptr)
{
  fDetDirectory = new G4UIdirectory("/det/");
  fDetDirectory->SetGuidance("Detector construction commands.");

  fStation2PosCmd = new G4UIcmdWithADoubleAndUnit("/det/setStation2Pos", this);
  fStation2PosCmd->SetGuidance("Set the Z position of Station 2.");
  fStation2PosCmd->SetParameterName("Station2Pos", false);
  fStation2PosCmd->SetDefaultUnit("m");
  fStation2PosCmd->SetUnitCategory("Length");
  fStation2PosCmd->AvailableForStates(G4State_PreInit, G4State_Idle);
}

DetectorMessenger::~DetectorMessenger()
{
  delete fStation2PosCmd;
  delete fDetDirectory;
}

void DetectorMessenger::SetNewValue(G4UIcommand* command, G4String newValue)
{
  if (command == fStation2PosCmd) {
    fDetector->SetStation2Position(fStation2PosCmd->GetNewDoubleValue(newValue));
  }
}
