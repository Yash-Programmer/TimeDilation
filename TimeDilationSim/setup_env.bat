@echo off
REM =====================================================
REM Geant4 Environment Setup for TimeDilationSim
REM Run this script before executing the simulation
REM =====================================================

REM Set Geant4 paths
set GEANT4_INSTALL=C:\Geant4-install
set GEANT4_DATA_DIR=%GEANT4_INSTALL%\share\Geant4\data

REM Add Geant4 to PATH
set PATH=%GEANT4_INSTALL%\bin;%PATH%

REM Setup Geant4 data directories
set G4NEUTRONHPDATA=%GEANT4_DATA_DIR%\G4NDL4.7.1
set G4LEDATA=%GEANT4_DATA_DIR%\G4EMLOW8.8
set G4LEVELGAMMADATA=%GEANT4_DATA_DIR%\PhotonEvaporation6.1.2
set G4RADIOACTIVEDATA=%GEANT4_DATA_DIR%\RadioactiveDecay6.1.2
set G4PARTICLEXSDATA=%GEANT4_DATA_DIR%\G4PARTICLEXS4.2
set G4PIIDATA=%GEANT4_DATA_DIR%\G4PII1.3
set G4REALSURFACEDATA=%GEANT4_DATA_DIR%\RealSurface2.2
set G4SAIDXSDATA=%GEANT4_DATA_DIR%\G4SAIDDATA2.0
set G4ABLADATA=%GEANT4_DATA_DIR%\G4ABLA3.3
set G4INCLDATA=%GEANT4_DATA_DIR%\G4INCL1.3
set G4ENSDFSTATEDATA=%GEANT4_DATA_DIR%\G4ENSDFSTATE3.0

echo Geant4 environment configured successfully.
echo Data directory: %GEANT4_DATA_DIR%
