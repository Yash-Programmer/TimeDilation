@echo off
REM =====================================================
REM Build Script for TimeDilationSim (Geant4 Simulation)
REM Windows Build using Visual Studio
REM =====================================================

echo =====================================================
echo  TimeDilationSim Build Script
echo  Geant4 Time Dilation Universality Experiment
echo =====================================================
echo.

REM Set Geant4 installation path
set GEANT4_INSTALL=C:\Geant4-install
set GEANT4_BUILD=C:\Geant4-build

REM Check if Geant4 is installed
if not exist "%GEANT4_INSTALL%" (
    echo ERROR: Geant4 not found at %GEANT4_INSTALL%
    echo Please install Geant4 first.
    exit /b 1
)

echo [1/4] Setting up Geant4 environment...
call "%GEANT4_INSTALL%\bin\geant4.bat"
if %errorlevel% neq 0 (
    echo Warning: geant4.bat not found, continuing anyway...
)

REM Navigate to project directory
cd /d "%~dp0"

echo [2/4] Creating build directory...
if not exist "build" mkdir build
cd build

echo [3/4] Running CMake configuration...
cmake -DCMAKE_BUILD_TYPE=Release -DGeant4_DIR="%GEANT4_INSTALL%\lib\cmake\Geant4" ..
if %errorlevel% neq 0 (
    echo ERROR: CMake configuration failed!
    pause
    exit /b 1
)

echo [4/4] Building project...
cmake --build . --config Release
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo =====================================================
echo  BUILD SUCCESSFUL!
echo =====================================================
echo.
echo Executable: build\Release\TimeDilationSim.exe
echo.
echo To run the simulation:
echo   1. Open a new command prompt
echo   2. Navigate to build directory
echo   3. Run: TimeDilationSim.exe run.mac
echo.
echo For visualization (interactive mode):
echo   Run: TimeDilationSim.exe
echo.
pause
