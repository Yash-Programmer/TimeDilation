cmake_minimum_required(VERSION 3.16...3.27)
project(TimeDilationSim)

# Set Geant4 installation path (Windows)
set(Geant4_DIR "C:/Geant4-install/lib/cmake/Geant4")

# Find Geant4 package
find_package(Geant4 REQUIRED ui_all vis_all)

# Setup Geant4 include directories and compile definitions
include(${Geant4_USE_FILE})

# Locate project-specific header files
include_directories(${PROJECT_SOURCE_DIR}/include)

# Locate sources and headers
file(GLOB sources ${PROJECT_SOURCE_DIR}/src/*.cc)
file(GLOB headers ${PROJECT_SOURCE_DIR}/include/*.hh)

# Add the executable
add_executable(TimeDilationSim TimeDilationSim.cc ${sources} ${headers})

# Link Geant4 libraries
target_link_libraries(TimeDilationSim ${Geant4_LIBRARIES})

# Copy macros to build directory
# Copy macros to build directory
file(GLOB MAC_FILES "${PROJECT_SOURCE_DIR}/*.mac")
foreach(_file ${MAC_FILES})
  get_filename_component(_filename ${_file} NAME)
  configure_file(
    ${_file}
    ${PROJECT_BINARY_DIR}/${_filename}
    COPYONLY
  )
endforeach()

# Installation
install(TARGETS TimeDilationSim DESTINATION bin)
