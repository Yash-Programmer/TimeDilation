import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

// ============================================
// SHARED MATERIALS
// ============================================
const metallicMaterial = {
  roughness: 0.3,
  metalness: 0.8,
  color: "#8a8a9a"
};

const glassMaterial = {
  roughness: 0.1,
  metalness: 0.2,
  transmission: 0.6,
  thickness: 0.5,
  transparent: true,
  opacity: 0.8
};

const glowMaterial = {
  emissive: "#3498DB",
  emissiveIntensity: 2,
  toneMapped: false,
  transparent: true,
  opacity: 0.7
};

// ============================================
// HOVER LABEL CARD
// ============================================
const LabelCard = ({ title, description, visible, stats }) => {
  if (!visible) return null;

  return (
    <div className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px]">
      <div className="bg-white/95 backdrop-blur-md rounded-lg p-3 w-56 shadow-xl border-l-4 border-[#0033A0] animate-fadeIn">
        <h4 className="font-bold text-[#0033A0] text-sm">{title}</h4>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{description}</p>
        {stats && (
          <div className="mt-2 pt-2 border-t border-slate-100 font-mono text-xs text-slate-500">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span>{key}:</span>
                <span className="text-slate-700 font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// 1. BEAM SOURCE
// ============================================
export const BeamSource = ({ position = [-8, 0, 0], particleColor = "#E74C3C" }) => {
  const [hovered, setHover] = useState(false);
  const glowRef = useRef();

  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }
  });

  return (
    <group
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Main cylinder body */}
      <mesh rotation={[0, 0, Math.PI / 2]} scale={hovered ? 1.05 : 1}>
        <cylinderGeometry args={[0.35, 0.35, 1.8, 32]} />
        <meshStandardMaterial {...metallicMaterial} />
      </mesh>

      {/* Collimator rings */}
      {[0.6, 0.3, 0].map((offset, i) => (
        <mesh key={i} position={[0.9 - offset * 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.3 - i * 0.05, 0.03, 8, 32]} />
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Glowing beam aperture */}
      <mesh ref={glowRef} position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <ringGeometry args={[0.05, 0.2, 32]} />
        <meshStandardMaterial color={particleColor} emissive={particleColor} emissiveIntensity={2} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      <Html distanceFactor={15}>
        <LabelCard
          title="T9 Beam Injector"
          description="Sources hadrons (π, K, p) from the CERN PS target at selectable momenta."
          visible={hovered}
          stats={{ "Max p": "15 GeV/c", "Intensity": "10⁴/spill" }}
        />
      </Html>
    </group>
  );
};

// ============================================
// 2. TOF DETECTOR
// ============================================
export const TOFDetector = ({ position, label, isStart }) => {
  const [hovered, setHover] = useState(false);
  const glowRef = useRef();

  useFrame((state) => {
    if (glowRef.current && hovered) {
      glowRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.3;
    }
  });

  const color = isStart ? "#3498DB" : "#2ECC71";

  return (
    <group
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Main scintillator panel */}
      <mesh scale={hovered ? 1.05 : 1}>
        <boxGeometry args={[0.15, 2.2, 2.2]} />
        <meshPhysicalMaterial {...glassMaterial} color={color} />
      </mesh>

      {/* Frame */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.2, 0.1, 2.3]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -1.15, 0]}>
        <boxGeometry args={[0.2, 0.1, 2.3]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Glow effect on hover */}
      <mesh ref={glowRef} scale={1.1}>
        <boxGeometry args={[0.01, 2.2, 2.2]} />
        <meshBasicMaterial color={color} transparent opacity={0} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="bottom"
      >
        {label}
      </Text>

      <Html distanceFactor={15}>
        <LabelCard
          title={label}
          description={`High-precision timing detector. Measures particle arrival time with ~50ps resolution.`}
          visible={hovered}
          stats={{ "Resolution": "50 ps", "Area": "20×20 cm²" }}
        />
      </Html>
    </group>
  );
};

// ============================================
// 3. DECAY ZONE
// ============================================
export const DecayZone = ({ position = [0, 0, 0], length = 10, particleColor = "#E74C3C" }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.03 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
  });

  return (
    <group position={position}>
      {/* Wireframe tube */}
      <mesh ref={meshRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.6, 0.6, length, 16, 8, true]} />
        <meshBasicMaterial color={particleColor} transparent opacity={0.05} wireframe side={THREE.DoubleSide} />
      </mesh>

      {/* Entry/exit caps */}
      <mesh position={[-length / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.4, 0.6, 32]} />
        <meshBasicMaterial color={particleColor} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[length / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.4, 0.6, 32]} />
        <meshBasicMaterial color={particleColor} transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// ============================================
// 4. SCINTILLATOR ARRAY
// ============================================
export const ScintillatorArray = ({ position }) => {
  const [hovered, setHover] = useState(false);
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.children.forEach((child, i) => {
        if (child.material) {
          child.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.2;
        }
      });
    }
  });

  return (
    <group
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <group ref={groupRef} scale={hovered ? 1.05 : 1}>
        {/* 4x4 Grid of scintillator bars */}
        {[-0.6, -0.2, 0.2, 0.6].map((y) => (
          [-0.6, -0.2, 0.2, 0.6].map((z) => (
            <mesh key={`${y}-${z}`} position={[0, y, z]}>
              <boxGeometry args={[0.12, 0.35, 0.35]} />
              <meshStandardMaterial
                color="#F1C40F"
                emissive="#F1C40F"
                emissiveIntensity={0.2}
                transparent
                opacity={0.85}
              />
            </mesh>
          ))
        ))}
      </group>

      {/* Frame */}
      <mesh>
        <boxGeometry args={[0.05, 1.8, 1.8]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>

      <Html distanceFactor={15}>
        <LabelCard
          title="Scintillator Tracker"
          description="16-channel position-sensitive detector for charged particle tracking."
          visible={hovered}
          stats={{ "Channels": "4×4", "Efficiency": ">99%" }}
        />
      </Html>
    </group>
  );
};

// ============================================
// 5. CHERENKOV DETECTOR
// ============================================
export const CherenkovDetector = ({ position }) => {
  const [hovered, setHover] = useState(false);
  const coneRef = useRef();

  useFrame((state) => {
    if (coneRef.current) {
      const intensity = hovered ? 0.8 : 0.4;
      coneRef.current.material.opacity = intensity + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Aerogel radiator */}
      <mesh rotation={[0, 0, -Math.PI / 2]} scale={hovered ? 1.05 : 1}>
        <cylinderGeometry args={[0.9, 0.3, 1.8, 32]} />
        <meshPhysicalMaterial
          color="#3498DB"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Cherenkov light cone visualization */}
      <mesh ref={coneRef} rotation={[0, 0, -Math.PI / 2]} position={[0.5, 0, 0]}>
        <coneGeometry args={[0.8, 1.5, 32, 1, true]} />
        <meshBasicMaterial
          color="#00BFFF"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* PMT array ring */}
      <mesh position={[-0.9, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.7, 0.08, 8, 24]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} />
      </mesh>

      <Html distanceFactor={15}>
        <LabelCard
          title="Cherenkov Counter"
          description="Threshold detector using aerogel radiator. Identifies particles by velocity."
          visible={hovered}
          stats={{ "n": "1.05", "θ_c": "~13°" }}
        />
      </Html>
    </group>
  );
};

// ============================================
// 6. BEAMLINE RULER
// ============================================
export const BeamlineRuler = ({ start, end, length }) => {
  const points = useMemo(() => {
    return [
      new THREE.Vector3(start, -1.3, 0),
      new THREE.Vector3(end, -1.3, 0)
    ];
  }, [start, end]);

  // Generate tick marks
  const ticks = useMemo(() => {
    const numTicks = Math.min(10, Math.floor(length / 5) + 1);
    const spacing = (end - start) / numTicks;
    return Array.from({ length: numTicks + 1 }, (_, i) => ({
      x: start + spacing * i,
      label: Math.round((length / numTicks) * i)
    }));
  }, [start, end, length]);

  return (
    <group>
      {/* Main line */}
      <Line points={points} color="#666" lineWidth={2} />

      {/* Tick marks and labels */}
      {ticks.map((tick, i) => (
        <group key={i} position={[tick.x, -1.3, 0]}>
          <Line
            points={[[0, 0, 0], [0, 0.15, 0]]}
            color="#888"
            lineWidth={1}
          />
          <Text
            position={[0, -0.25, 0]}
            fontSize={0.15}
            color="#888"
            anchorX="center"
          >
            {tick.label}m
          </Text>
        </group>
      ))}

      {/* Total length label */}
      <Text
        position={[(start + end) / 2, -1.7, 0]}
        fontSize={0.18}
        color="#0033A0"
        anchorX="center"
        fontWeight="bold"
      >
        Total: {length}m
      </Text>
    </group>
  );
};
