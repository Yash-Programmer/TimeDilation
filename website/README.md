# Time Dilation - Interactive Web Application

**An interactive, web-based particle simulator for visualizing relativistic motion, decay, and experimental geometry.**

An educational web platform for the BL4S 2025 proposal "Testing the Universality of Time Dilation."

> **Note:** This simulator focuses on kinematics and decay processes and is not a replacement for full Monte Carlo frameworks such as GEANT4. For research-grade physics validation, see the `TimeDilationSim/` directory containing our GEANT4 simulation.

## Overview
This project is an interactive educational platform designed for the CERN Beamline for Schools competition. It features:
- **3D Physics Simulation**: A real-time visualization of particle decay (Pions vs Kaons) built with React Three Fiber.
- **Physics Engine**: A custom JavaScript physics engine simulating relativistic kinematics and Monte Carlo decay events.
- **Educational Curriculum**: A 30-module interactive course.
- **Data Analysis**: Tools for students to analyze simulation results.

## Technology Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **3D**: Three.js + React Three Fiber + Drei
- **Charts**: Recharts
- **Math**: KaTeX

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd website
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
1. Build the app:
   ```bash
   npm run build
   ```
2. Preview the production build:
   ```bash
   npm run preview
   ```

## Project Structure
- `src/components`: Reusable UI and 3D components.
- `src/pages`: Main application routes (Home, Simulator, Learn, etc.).
- `src/utils/physicsEngine.js`: Core logic for particle simulation.
- `src/data`: Static content for modules and presets.

## License
MIT
