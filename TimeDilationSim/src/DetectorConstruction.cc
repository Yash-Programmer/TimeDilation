//
// DetectorConstruction.cc
// Implementation of the detector geometry
//

#include "DetectorConstruction.hh"
#include "DetectorMessenger.hh"

#include "G4NistManager.hh"
#include "G4Box.hh"
#include "G4Tubs.hh"
#include "G4LogicalVolume.hh"
#include "G4PVPlacement.hh"
#include "G4SystemOfUnits.hh"
#include "G4PhysicalConstants.hh"
#include "G4VisAttributes.hh"
#include "G4Colour.hh"
#include "G4MaterialPropertiesTable.hh"
#include "G4OpticalSurface.hh"
#include "G4LogicalBorderSurface.hh"
#include "G4SDManager.hh"

// Include sensitive detector headers (will create these)
// #include "RICHDetector.hh"
// #include "CalorimeterSD.hh"
// #include "DWChamberSD.hh"
// #include "ScintillatorSD.hh"

DetectorConstruction::DetectorConstruction()
: G4VUserDetectorConstruction(),
  fVacuum(nullptr), fAir(nullptr), fC4F10(nullptr),
  fPolystyrene(nullptr), fLead(nullptr), fArCO2(nullptr), fGlass(nullptr),
  fWorldLog(nullptr), fBeamPipeLog(nullptr),
  fStation2PosZ(10.0*m),  // Default to 10 m (within world volume)
  fWorldSizeX(2.0*m), fWorldSizeY(2.0*m), fWorldSizeZ(16.0*m),  // Centered world
  fMessenger(nullptr)
{
  fMessenger = new DetectorMessenger(this);
}

DetectorConstruction::~DetectorConstruction()
{
  delete fMessenger;
}

G4VPhysicalVolume* DetectorConstruction::Construct()
{
  DefineMaterials();
  return ConstructGeometry();
}

void DetectorConstruction::DefineMaterials()
{
  G4NistManager* nist = G4NistManager::Instance();

  // Vacuum for beam pipe
  fVacuum = nist->FindOrBuildMaterial("G4_Galactic");

  // Air for world
  fAir = nist->FindOrBuildMaterial("G4_AIR");

  // C4F10 (perfluorobutane) for RICH radiator
  G4double a, z, density;
  G4int ncomponents;
  
  G4Element* elC = nist->FindOrBuildElement("C");
  G4Element* elF = nist->FindOrBuildElement("F");
  
  density = 10.0*kg/m3;  // At 1 atm, 300 K
  fC4F10 = new G4Material("C4F10", density, ncomponents=2);
  fC4F10->AddElement(elC, 4);
  fC4F10->AddElement(elF, 10);

  // Add optical properties for C4F10 (for Cherenkov radiation)
  const G4int nEntries = 2;
  G4double photonEnergy[nEntries] = {2.0*eV, 4.0*eV};  // Visible range
  G4double rindexC4F10[nEntries] = {1.0014, 1.0014};  // Refractive index n=1.0014
  
  G4MaterialPropertiesTable* mptC4F10 = new G4MaterialPropertiesTable();
  mptC4F10->AddProperty("RINDEX", photonEnergy, rindexC4F10, nEntries);
  fC4F10->SetMaterialPropertiesTable(mptC4F10);

  // Polystyrene for scintillators (BC-408 equivalent)
  fPolystyrene = nist->FindOrBuildMaterial("G4_POLYSTYRENE");
  
  // Add scintillation properties
  G4double scintFast[nEntries] = {1.0, 1.0};  // Emission spectrum (simplified)
  G4double rindexPS[nEntries] = {1.58, 1.58};
  
  G4MaterialPropertiesTable* mptPS = new G4MaterialPropertiesTable();
  mptPS->AddProperty("RINDEX", photonEnergy, rindexPS, nEntries);
  mptPS->AddProperty("SCINTILLATIONCOMPONENT1", photonEnergy, scintFast, nEntries);
  mptPS->AddConstProperty("SCINTILLATIONYIELD", 10000./MeV);
  mptPS->AddConstProperty("RESOLUTIONSCALE", 1.0);
  mptPS->AddConstProperty("SCINTILLATIONTIMECONSTANT1", 2.1*ns);
  fPolystyrene->SetMaterialPropertiesTable(mptPS);

  // Lead for calorimeter
  fLead = nist->FindOrBuildMaterial("G4_Pb");

  // Ar/CO2 80/20 mix for drift chambers
  G4Element* elAr = nist->FindOrBuildElement("Ar");
  G4Element* elCO2_C = nist->FindOrBuildElement("C");
  G4Element* elCO2_O = nist->FindOrBuildElement("O");
  
  G4Material* CO2 = new G4Material("CarbonDioxide", 1.977*kg/m3, ncomponents=2);
  CO2->AddElement(elCO2_C, 1);
  CO2->AddElement(elCO2_O, 2);
  
  density = 1.782*kg/m3;  // At STP
  fArCO2 = new G4Material("ArCO2_80_20", density, ncomponents=2);
  fArCO2->AddElement(elAr, 80*perCent);
  fArCO2->AddMaterial(CO2, 20*perCent);

  // Glass for PMT photocathodes
  fGlass = nist->FindOrBuildMaterial("G4_GLASS_PLATE");
  
  G4double rindexGlass[nEntries] = {1.55, 1.55};
  G4MaterialPropertiesTable* mptGlass = new G4MaterialPropertiesTable();
  mptGlass->AddProperty("RINDEX", photonEnergy, rindexGlass, nEntries);
  fGlass->SetMaterialPropertiesTable(mptGlass);
}

G4VPhysicalVolume* DetectorConstruction::ConstructGeometry()
{
  // ==== World Volume (centered at origin, large enough for all detectors) ====
  // World spans from -1m to +15m in Z to accommodate beam pipe and detectors
  G4Box* worldSolid = new G4Box("World", fWorldSizeX/2, fWorldSizeY/2, fWorldSizeZ/2);
  fWorldLog = new G4LogicalVolume(worldSolid, fAir, "WorldLog");
  G4VPhysicalVolume* worldPhys = new G4PVPlacement(
    nullptr, G4ThreeVector(), fWorldLog, "World", nullptr, false, 0, true);

  // ==== Beam Pipe (vacuum) ====
  // Beam pipe from entrance to before Station2, avoiding overlap with detectors
  G4double beamPipeLength = fStation2PosZ - 1.5*m;  // Stop before Station2
  
  // Only create beam pipe if Station2 is far enough (> 2m)
  if (beamPipeLength > 1.0*m) {
    G4double beamPipeRadius = 5.0*cm;
    G4double beamPipeOffset = -fWorldSizeZ/2 + 0.5*m + beamPipeLength/2;  // Position relative to world center
    
    G4Tubs* beamPipeSolid = new G4Tubs("BeamPipe", 0, beamPipeRadius,
                                        beamPipeLength/2, 0, 360*deg);
    fBeamPipeLog = new G4LogicalVolume(beamPipeSolid, fVacuum, "BeamPipeLog");
    new G4PVPlacement(nullptr, G4ThreeVector(0, 0, beamPipeOffset),
                      fBeamPipeLog, "BeamPipe", fWorldLog, false, 0, true);

    // Visualization attributes
    G4VisAttributes* beamPipeVis = new G4VisAttributes(G4Colour(0.5, 0.5, 0.5, 0.3));
    beamPipeVis->SetForceSolid(true);
    fBeamPipeLog->SetVisAttributes(beamPipeVis);
  } else {
    G4cout << "INFO: Skipping beam pipe creation (Station2 too close at "
           << fStation2PosZ/m << " m)" << G4endl;
    fBeamPipeLog = nullptr;
  }

  // Reference point: world center is at Z=0 in world coordinates
  // We place Station1 near the start and Station2 at variable distance
  G4double worldZmin = -fWorldSizeZ/2;
  G4double station1Z = worldZmin + 0.5*m;  // Station 1 near start of world
  G4double station2Z = station1Z + fStation2PosZ;  // Station 2 at flight distance from Station 1

  // ==== Station 1 ====
  ConstructStation1(station1Z);

  // ==== Station 2 ====
  ConstructStation2(station2Z);

  return worldPhys;
}

G4VPhysicalVolume* DetectorConstruction::ConstructStation1(G4double z_pos)
{
  // Station 1 contains: SC1, RICH1, DWC1
  G4double offset = z_pos;

  // SC1 Scintillator (10 cm × 10 cm × 1 cm)
  G4Box* sc1Solid = new G4Box("SC1", 10*cm/2, 10*cm/2, 1*cm/2);
  G4LogicalVolume* sc1Log = new G4LogicalVolume(sc1Solid, fPolystyrene, "SC1_Log");
  new G4PVPlacement(nullptr, G4ThreeVector(0, 0, offset - 0.5*cm),
                    sc1Log, "SC1", fWorldLog, false, 0, true);

  G4VisAttributes* scintVis = new G4VisAttributes(G4Colour(0.0, 1.0, 0.0, 0.5));
  sc1Log->SetVisAttributes(scintVis);

  // RICH1 Detector (1 m radiator + PMT array)
  G4LogicalVolume* rich1Log = ConstructRICH("RICH1");
  new G4PVPlacement(nullptr, G4ThreeVector(0, 0, offset + 50*cm),
                    rich1Log, "RICH1", fWorldLog, false, 0, true);

  // DWC1 Drift Wire Chamber
  G4LogicalVolume* dwc1Log = ConstructDWC("DWC1");
  new G4PVPlacement(nullptr, G4ThreeVector(0, 0, offset + 120*cm),
                    dwc1Log, "DWC1", fWorldLog, false, 0, true);

  return nullptr;
}

G4VPhysicalVolume* DetectorConstruction::ConstructStation2(G4double z_pos)
{
  // Station 2 contains: SC2, RICH2, DWC2, Calorimeter
  G4double offset = z_pos;

  // SC2 Scintillator
  G4Box* sc2Solid = new G4Box("SC2", 10*cm/2, 10*cm/2, 1*cm/2);
  G4LogicalVolume* sc2Log = new G4LogicalVolume(sc2Solid, fPolystyrene, "SC2_Log");
  new G4PVPlacement(nullptr, G4ThreeVector(0, 0, offset - 0.5*cm),
                    sc2Log, "SC2", fWorldLog, false, 0, true);

  G4VisAttributes* scintVis = new G4VisAttributes(G4Colour(0.0, 1.0, 0.0, 0.5));
  sc2Log->SetVisAttributes(scintVis);

  // RICH2 Detector
  G4LogicalVolume* rich2Log = ConstructRICH("RICH2");
  new G4PVPlacement(nullptr, G4ThreeVector(0, 0, offset + 50*cm),
                    rich2Log, "RICH2", fWorldLog, false, 0, true);

  // DWC2 Drift Wire Chamber
  G4LogicalVolume* dwc2Log = ConstructDWC("DWC2");
  new G4PVPlacement(nullptr, G4ThreeVector(0, 0, offset + 120*cm),
                    dwc2Log, "DWC2", fWorldLog, false, 0, true);

  // Calorimeter (20 X0 deep, Pb-scintillator sandwich)
  G4LogicalVolume* caloLog = ConstructCalorimeter("Calorimeter");
  new G4PVPlacement(nullptr, G4ThreeVector(0, 0, offset + 200*cm),
                    caloLog, "Calorimeter", fWorldLog, false, 0, true);

  return nullptr;
}

G4LogicalVolume* DetectorConstruction::ConstructRICH(const G4String& name)
{
  // RICH detector: C4F10 radiator (1 m long, 30 cm × 30 cm cross-section)
  // followed by PMT photocathode array
  
  G4double richLength = 100*cm;
  G4double richSize = 30*cm;

  // Container volume
  G4Box* richContainerSolid = new G4Box(name + "_Container",
                                         richSize/2, richSize/2, richLength/2);
  G4LogicalVolume* richContainerLog = new G4LogicalVolume(
    richContainerSolid, fAir, name + "_ContainerLog");

  // C4F10 Radiator
  G4Box* radiatorSolid = new G4Box(name + "_Radiator",
                                    richSize/2, richSize/2, 90*cm/2);
  G4LogicalVolume* radiatorLog = new G4LogicalVolume(
    radiatorSolid, fC4F10, name + "_RadiatorLog");
  new G4PVPlacement(nullptr, G4ThreeVector(0, 0, -5*cm),
                    radiatorLog, name + "_Radiator", richContainerLog, false, 0, true);

  // Visualization
  G4VisAttributes* richVis = new G4VisAttributes(G4Colour(0.0, 0.5, 1.0, 0.3));
  radiatorLog->SetVisAttributes(richVis);

  // PMT Photocathode (glass, 10 cm × 10 cm × 0.5 cm)
  G4Box* pmtSolid = new G4Box(name + "_PMT", 10*cm/2, 10*cm/2, 0.5*cm/2);
  G4LogicalVolume* pmtLog = new G4LogicalVolume(pmtSolid, fGlass, name + "_PMTLog");
  new G4PVPlacement(nullptr, G4ThreeVector(0, 0, 45*cm + 0.25*cm),
                    pmtLog, name + "_PMT", richContainerLog, false, 0, true);

  return richContainerLog;
}

G4LogicalVolume* DetectorConstruction::ConstructCalorimeter(const G4String& name)
{
  // EM Calorimeter: 20 layers of Pb (2 mm) + Scintillator (5 mm)
  // Total depth ~ 20 X0 (X0_Pb = 0.56 cm, X0_PS = 43 cm)
  
  G4int nLayers = 20;
  G4double pbThickness = 2.0*mm;
  G4double scintThickness = 5.0*mm;
  G4double layerThickness = pbThickness + scintThickness;
  G4double caloDepth = nLayers * layerThickness;
  G4double caloSize = 30*cm;

  // Container
  G4Box* caloContainerSolid = new G4Box(name + "_Container",
                                         caloSize/2, caloSize/2, caloDepth/2);
  G4LogicalVolume* caloContainerLog = new G4LogicalVolume(
    caloContainerSolid, fAir, name + "_ContainerLog");

  // Build layers
  for (G4int i = 0; i < nLayers; ++i) {
    G4double zLayer = -caloDepth/2 + i*layerThickness + layerThickness/2;

    // Pb absorber
    G4Box* pbSolid = new G4Box(name + "_Pb", caloSize/2, caloSize/2, pbThickness/2);
    G4LogicalVolume* pbLog = new G4LogicalVolume(pbSolid, fLead,
                                                   name + "_PbLog");
    new G4PVPlacement(nullptr, G4ThreeVector(0, 0, zLayer - scintThickness/2),
                      pbLog, name + "_Pb", caloContainerLog, false, i, true);

    // Scintillator
    G4Box* scintSolid = new G4Box(name + "_Scint", caloSize/2, caloSize/2,
                                   scintThickness/2);
    G4LogicalVolume* scintLog = new G4LogicalVolume(scintSolid, fPolystyrene,
                                                      name + "_ScintLog");
    new G4PVPlacement(nullptr, G4ThreeVector(0, 0, zLayer + pbThickness/2),
                      scintLog, name + "_Scint", caloContainerLog, false, i, true);
  }

  G4VisAttributes* caloVis = new G4VisAttributes(G4Colour(1.0, 0.5, 0.0, 0.5));
  caloContainerLog->SetVisAttributes(caloVis);

  return caloContainerLog;
}

G4LogicalVolume* DetectorConstruction::ConstructDWC(const G4String& name)
{
  // Drift Wire Chamber: Ar/CO2 gas volume (30 cm × 30 cm × 20 cm)
  // Simplified geometry (actual wire planes not modeled, just sensitive volume)
  
  G4double dwcSize = 30*cm;
  G4double dwcDepth = 20*cm;

  G4Box* dwcSolid = new G4Box(name, dwcSize/2, dwcSize/2, dwcDepth/2);
  G4LogicalVolume* dwcLog = new G4LogicalVolume(dwcSolid, fArCO2, name + "_Log");

  G4VisAttributes* dwcVis = new G4VisAttributes(G4Colour(1.0, 1.0, 0.0, 0.2));
  dwcLog->SetVisAttributes(dwcVis);

  return dwcLog;
}

void DetectorConstruction::ConstructSDandField()
{
  // Sensitive detectors will be attached here
  // (Implement after creating SD classes)
  
  // G4SDManager* sdMan = G4SDManager::GetSDMpointer();
  
  // RICHDetector* richSD = new RICHDetector("RICH");
  // sdMan->AddNewDetector(richSD);
  // SetSensitiveDetector("RICH1_PMTLog", richSD);
  // SetSensitiveDetector("RICH2_PMTLog", richSD);
  
  // ... similar for Calorimeter, DWC, Scintillators
}

void DetectorConstruction::SetStation2Position(G4double z)
{
  fStation2PosZ = z;
  // Note: This requires re-initialization of geometry
  // Call /run/initialize after changing this
}
