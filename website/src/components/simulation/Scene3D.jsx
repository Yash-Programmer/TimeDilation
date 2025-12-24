import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import {
    BeamSource,
    TOFDetector,
    ScintillatorArray,
    CherenkovDetector,
    DecayZone
} from './SimulationComponents';
import ParticleSystem from './ParticleSystem';

const Scene3D = ({
    interactive = true,
    showLabels = true,
    simulationState = { running: true }
}) => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]">
      <Canvas camera={{ position: [0, 2, 12], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* 1. Beam Source */}
        <BeamSource position={[-6, 0, 0]} />

        {/* 2. TOF Start */}
        <TOFDetector position={[-4, 0, 0]} label="TOF Start" isStart={true} />

        {/* 3. Decay Zone (Visual) */}
        <DecayZone position={[1, 0, 0]} length={8} />

        {/* 4. Scintillator Array */}
        <ScintillatorArray position={[2, 0, 0]} />

        {/* 5. Cherenkov */}
        <CherenkovDetector position={[6, 0, 0]} />

        {/* 6. TOF End */}
        <TOFDetector position={[8, 0, 0]} label="TOF End" isStart={false} />

        {/* 7. Particle System */}
        <ParticleSystem
            count={interactive ? 50 : 20}
            decayEnabled={true}
        />

        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.5} far={10} color="#000000" />

        {/* Effects */}
        <EffectComposer disableNormalPass>
           <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
        </EffectComposer>

        {/* Controls */}
        <OrbitControls
            enablePan={interactive}
            enableZoom={interactive}
            autoRotate={!interactive}
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default Scene3D;
