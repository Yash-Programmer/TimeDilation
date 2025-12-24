#!/bin/bash
# WSL script to build and run Geant4 visualization exports

echo "======================================"
echo "Geant4 Visualization Export via WSL"
echo "======================================"

# Set paths
PROJECT_DIR="/mnt/c/Users/Yash/Videos/one from gravity/TimeDilationSim"
OUTPUT_DIR="$PROJECT_DIR/geant4-result/figures/geant4-vis"

cd "$PROJECT_DIR" || exit 1

# Set Geant4 environment
export PATH="/mnt/c/Geant4-install/bin:$PATH"
export G4NEUTRONHPDATA="/mnt/c/Geant4-install/share/Geant4/data/G4NDL4.7"
export G4LEDATA="/mnt/c/Geant4-install/share/Geant4/data/G4EMLOW8.6"
export G4LEVELGAMMADATA="/mnt/c/Geant4-install/share/Geant4/data/PhotonEvaporation6.2"
export G4RADIOACTIVEDATA="/mnt/c/Geant4-install/share/Geant4/data/RadioactiveDecay6.2"
export G4PARTICLEXSDATA="/mnt/c/Geant4-install/share/Geant4/data/G4PARTICLEXS4.1"
export G4PIIDATA="/mnt/c/Geant4-install/share/Geant4/data/G4PII1.3"
export G4REALSURFACEDATA="/mnt/c/Geant4-install/share/Geant4/data/RealSurface2.2"
export G4SAIDXSDATA="/mnt/c/Geant4-install/share/Geant4/data/G4SAIDDATA2.0"
export G4ABLADATA="/mnt/c/Geant4-install/share/Geant4/data/G4ABLA3.3"
export G4INCLDATA="/mnt/c/Geant4-install/share/Geant4/data/G4INCL1.2"
export G4ENSDFSTATEDATA="/mnt/c/Geant4-install/share/Geant4/data/G4ENSDFSTATE2.3"

echo ""
echo "Checking Geant4 installation..."
geant4-config --version || { echo "ERROR: Geant4 not found!"; exit 1; }

echo ""
echo "Building TimeDilationSim with CMake..."
rm -rf build_linux
mkdir -p build_linux
cd build_linux || exit 1

cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_PREFIX_PATH=/mnt/c/Geant4-install
make -j4

if [ ! -f TimeDilationSim ]; then
    echo "ERROR: Build failed!"
    exit 1
fi

echo ""
echo "✓ Build successful!"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Run visualization exports
echo "Running visualization exports..."
echo ""

cd "$PROJECT_DIR" || exit 1

# Export 1: VRML format (3D web-viewable)
echo "[1/3] Generating VRML export..."
./build_linux/TimeDilationSim vis_export_vrml.mac > /dev/null 2>&1 &
VRML_PID=$!

# Export 2: ASCII Tree (text-based geometry)
echo "[2/3] Generating ASCII Tree..."
./build_linux/TimeDilationSim vis_export_ascii.mac > "$OUTPUT_DIR/geometry_tree.txt" 2>&1 &
ASCII_PID=$!

# Export 3: RayTracer (high-quality rendering)
echo "[3/3] Generating RayTracer images..."
./build_linux/TimeDilationSim vis_export_raytracer.mac > /dev/null 2>&1 &
RT_PID=$!

# Wait for all processes
wait $VRML_PID $ASCII_PID $RT_PID

echo ""
echo "Moving generated files..."

# Move all generated files
mv *.wrl "$OUTPUT_DIR/" 2>/dev/null
mv *.heprep "$OUTPUT_DIR/" 2>/dev/null
mv *.prim "$OUTPUT_DIR/" 2>/dev/null
mv *.eps "$OUTPUT_DIR/" 2>/dev/null
mv g4_*.jpg "$OUTPUT_DIR/" 2>/dev/null
mv g4_*.png "$OUTPUT_DIR/" 2>/dev/null

echo ""
echo "======================================"
echo "Generated files:"
ls -lh "$OUTPUT_DIR/" | tail -n +2
echo "======================================"

echo ""
echo "✓ Visualization export complete!"
