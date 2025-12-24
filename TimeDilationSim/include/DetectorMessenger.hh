//
// DetectorMessenger.hh
// UI commands for detector configuration
//

#ifndef DetectorMessenger_h
#define DetectorMessenger_h 1

#include "G4UImessenger.hh"
#include "globals.hh"

class DetectorConstruction;
class G4UIdirectory;
class G4UIcmdWithADoubleAndUnit;

class DetectorMessenger : public G4UImessenger
{
public:
  DetectorMessenger(DetectorConstruction* detector);
  ~DetectorMessenger() override;

  void SetNewValue(G4UIcommand* command, G4String newValue) override;

private:
  DetectorConstruction* fDetector;
  
  G4UIdirectory* fDetDirectory;
  G4UIcmdWithADoubleAndUnit* fStation2PosCmd;
};

#endif
