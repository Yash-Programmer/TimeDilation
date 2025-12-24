//
// DetectorConstruction.hh
// Defines the beamline geometry and detector components
//

#ifndef DetectorConstruction_h
#define DetectorConstruction_h 1

#include "G4VUserDetectorConstruction.hh"
#include "G4LogicalVolume.hh"
#include "G4VPhysicalVolume.hh"
#include "globals.hh"

class G4Box;
class G4Tubs;
class G4Material;
class G4OpticalSurface;
class DetectorMessenger;

class DetectorConstruction : public G4VUserDetectorConstruction
{
public:
  DetectorConstruction();
  ~DetectorConstruction() override;

  G4VPhysicalVolume* Construct() override;
  void ConstructSDandField() override;

  // Set position of Station 2 (for parameterized scans at 5, 10, 15 m)
  void SetStation2Position(G4double z);
  G4double GetStation2Position() const { return fStation2PosZ; }

private:
  // Geometry construction methods
  void DefineMaterials();
  G4VPhysicalVolume* ConstructGeometry();

  G4VPhysicalVolume* ConstructStation1(G4double z_pos);
  G4VPhysicalVolume* ConstructStation2(G4double z_pos);
  
  G4LogicalVolume* ConstructRICH(const G4String& name);
  G4LogicalVolume* ConstructCalorimeter(const G4String& name);
  G4LogicalVolume* ConstructDWC(const G4String& name);
  G4LogicalVolume* ConstructScintillator(const G4String& name);

  // Materials
  G4Material* fVacuum;
  G4Material* fAir;
  G4Material* fC4F10;  // RICH radiator
  G4Material* fPolystyrene;  // Scintillators
  G4Material* fLead;
  G4Material* fArCO2;  // DWC gas
  G4Material* fGlass;  // PMT photocathode

  // Logical volumes
  G4LogicalVolume* fWorldLog;
  G4LogicalVolume* fBeamPipeLog;

  // Station 2 position (configurable)
  G4double fStation2PosZ;

  // World dimensions
  G4double fWorldSizeX, fWorldSizeY, fWorldSizeZ;
  
  // Messenger for UI commands
  DetectorMessenger* fMessenger;
};

#endif
