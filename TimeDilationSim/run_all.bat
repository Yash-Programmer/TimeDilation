@echo off
REM =====================================================
REM Run All Simulations Script
REM Executes TimeDilationSim for all Station2 positions
REM =====================================================

echo =====================================================
echo  TimeDilationSim - Full Experiment Run
echo  Testing Time Dilation Universality
echo =====================================================
echo.

REM Set paths
set SIM_DIR=%~dp0
set BUILD_DIR=%SIM_DIR%build\Release
set OUTPUT_DIR=%SIM_DIR%output

REM Setup Geant4 environment
call "%SIM_DIR%setup_env.bat"

REM Check if executable exists
if not exist "%BUILD_DIR%\TimeDilationSim.exe" (
    echo ERROR: TimeDilationSim.exe not found!
    echo Please run build.bat first.
    pause
    exit /b 1
)

REM Create output directory
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

cd /d "%BUILD_DIR%"

echo [1/4] Running simulation with Station2 at x=0m (Run 0)...
TimeDilationSim.exe "%SIM_DIR%run_x0.mac"
if %errorlevel% neq 0 echo Warning: Run 0 completed with warnings

echo [2/4] Running simulation with Station2 at x=5m (Run 1)...
TimeDilationSim.exe "%SIM_DIR%run_x5.mac"
if %errorlevel% neq 0 echo Warning: Run 1 completed with warnings

echo [3/4] Running simulation with Station2 at x=10m (Run 2)...
TimeDilationSim.exe "%SIM_DIR%run_x10.mac"
if %errorlevel% neq 0 echo Warning: Run 2 completed with warnings

echo [4/4] Running simulation with Station2 at x=15m (Run 3)...
TimeDilationSim.exe "%SIM_DIR%run_x15.mac"
if %errorlevel% neq 0 echo Warning: Run 3 completed with warnings

REM Move output files to output directory
echo.
echo Moving output files to %OUTPUT_DIR%...
move /Y TimeDilation_Run*.csv "%OUTPUT_DIR%" 2>nul
move /Y TimeDilation_Run*.root "%OUTPUT_DIR%" 2>nul

echo.
echo =====================================================
echo  ALL SIMULATIONS COMPLETE!
echo =====================================================
echo.
echo Output files are in: %OUTPUT_DIR%
echo.
echo To analyze results, run:
echo   cd analysis
echo   python analyze_decay_csv.py
echo   python plot_survival_curves.py
echo.
pause
