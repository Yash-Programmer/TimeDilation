import React, { useMemo } from 'react';
import {
    BeamSource,
    TOFDetector,
    ScintillatorArray,
    CherenkovDetector,
    DecayZone,
    BeamlineRuler
} from './SimulationComponents';
import ParticleSystem from './ParticleSystem';
import { useSimulationContext } from '../../context/SimulationContext';
import { Stars, ContactShadows } from '@react-three/drei';

// Reactive Scene Content - uses SimulationContext (for Simulator page)
const ReactiveSceneContent = () => {
    const { state } = useSimulationContext();
    const { beamline, detectors, physics, particle, beam } = state;

    const scaleFactor = useMemo(() => {
        return Math.max(0.5, Math.min(2, 15 / beamline.length));
    }, [beamline.length]);

    const positions = useMemo(() => {
        const length = beamline.length;
        return {
            beamSource: -6 * scaleFactor,
            tof1: -4 * scaleFactor,
            scintillator: (-4 + length * 0.3) * scaleFactor,
            cherenkov: (-4 + length * 0.6) * scaleFactor,
            tof2: (-4 + length * 0.9) * scaleFactor,
            decayZoneStart: -3 * scaleFactor,
            decayZoneLength: length * 0.8 * scaleFactor,
        };
    }, [beamline.length, scaleFactor]);

    return (
        <group>
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3498DB" />
            <pointLight position={[10, 5, -5]} intensity={0.2} color="#E74C3C" />

            <BeamSource position={[positions.beamSource, 0, 0]} particleColor={particle.color} />

            {detectors.tof1 && (
                <TOFDetector position={[positions.tof1, 0, 0]} label="TOF Start (T₁)" isStart={true} />
            )}

            <DecayZone
                position={[positions.decayZoneStart + positions.decayZoneLength / 2, 0, 0]}
                length={positions.decayZoneLength}
                particleColor={particle.color}
            />

            {detectors.scintillator && <ScintillatorArray position={[positions.scintillator, 0, 0]} />}
            {detectors.cherenkov && <CherenkovDetector position={[positions.cherenkov, 0, 0]} />}
            {detectors.tof2 && (
                <TOFDetector position={[positions.tof2, 0, 0]} label="TOF End (T₂)" isStart={false} />
            )}

            <BeamlineRuler start={positions.tof1} end={positions.tof2} length={beamline.length} />

            <ParticleSystem
                key={`ps-${particle.type}-${Math.round(beam.momentum)}-${Math.round(beam.intensity / 1000)}`}
                particleColor={particle.color}
                particleMass={particle.mass}
                particleLifetime={particle.lifetime}
                momentum={beam.momentum}
                magneticField={physics.magneticField}
                decayEnabled={physics.decayEnabled}
                beamlineLength={beamline.length}
                beamIntensity={beam.intensity}
                startX={positions.tof1}
                endX={positions.tof2}
            />

            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
            <ContactShadows resolution={512} scale={30} blur={2} opacity={0.4} far={10} color="#000" />
            <gridHelper args={[40, 40, '#1a1a3a', '#1a1a3a']} position={[0, -1.5, 0]} />
        </group>
    );
};

export default ReactiveSceneContent;
