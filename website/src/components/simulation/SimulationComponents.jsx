import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

// --- Shared Material/Styles ---
const metallicMaterial = {
  roughness: 0.2,
  metalness: 0.8,
  color: "#a0a0a0"
};

const glassMaterial = {
  roughness: 0.1,
  metalness: 0.1,
  transmission: 0.6,
  thickness: 0.5,
  color: "#3498DB",
  transparent: true,
  opacity: 0.7
};

const glowMaterial = {
  emissive: "#3498DB",
  emissiveIntensity: 2,
  toneMapped: false,
  color: "#3498DB",
  transparent: true,
  opacity: 0.8
};

// --- Hover Card Component ---
const LabelCard = ({ title, description, visible }) => {
  return (
      <div
        className={`
            absolute pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-20px] ml-[20px]
            bg-white rounded-lg p-4 w-64 shadow-[0_8px_24px_rgba(0,51,160,0.15)] border-l-4 border-[#0033A0]
            transition-all duration-300
            ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        <h4 className="font-bold text-[#0033A0] text-sm">{title}</h4>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{description}</p>
      </div>
  );
};

// --- 1. Particle Beam Source ---
export const BeamSource = ({ position = [-8, 0, 0] }) => {
  const [hovered, setHover] = useState(false);

  return (
    <group position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <mesh rotation={[0, 0, Math.PI / 2]} scale={hovered ? 1.05 : 1}>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 32]} />
        <meshStandardMaterial {...metallicMaterial} />
      </mesh>
      {/* End cap glow */}
      <mesh position={[0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
         <ringGeometry args={[0.1, 0.3, 32]} />
         <meshBasicMaterial color="#E74C3C" side={2} />
      </mesh>

      <Html distanceFactor={15}>
          <LabelCard
            title="Beam Injector"
            description="Sources hadrons (pions, kaons, protons) from the T9 target."
            visible={hovered}
          />
      </Html>
    </group>
  );
};

// --- 2. TOF Detector (Start/End) ---
export const TOFDetector = ({ position, label, isStart }) => {
  const [hovered, setHover] = useState(false);

  return (
    <group position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
    >
      <mesh scale={hovered ? 1.05 : 1}>
        <boxGeometry args={[0.1, 2, 2]} />
        <meshPhysicalMaterial {...glassMaterial} color={isStart ? "#3498DB" : "#2ECC71"} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
         <boxGeometry args={[0.2, 0.1, 2]} />
         <meshStandardMaterial color="#333" />
      </mesh>
      <Html distanceFactor={15}>
          <LabelCard
            title={label}
            description="Measures exact time particle passes to calculate velocity."
            visible={hovered}
          />
      </Html>
    </group>
  );
};

// --- 3. Decay Zone ---
export const DecayZone = ({ position = [0, 0, 0], length = 10 }) => {
   // Just a visual guide, usually invisible or very subtle
   return (
     <group position={position}>
       <mesh rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.5, 0.5, length, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} wireframe />
       </mesh>
     </group>
   );
};

// --- 4. Scintillator Array ---
export const ScintillatorArray = ({ position }) => {
  const [hovered, setHover] = useState(false);

  return (
    <group position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
    >
       <group scale={hovered ? 1.05 : 1}>
        {/* 3x3 Grid */}
        {[-0.5, 0, 0.5].map((y) => (
             [-0.5, 0, 0.5].map((z) => (
                 <mesh key={`${y}-${z}`} position={[0, y, z]}>
                    <boxGeometry args={[0.1, 0.45, 0.45]} />
                    <meshStandardMaterial color="#F1C40F" transparent opacity={0.8} />
                 </mesh>
             ))
        ))}
       </group>
       <Html distanceFactor={15}>
          <LabelCard
            title="Scintillator Tracker"
            description="Detects charged particles and tracks their position."
            visible={hovered}
          />
      </Html>
    </group>
  );
};

// --- 5. Cherenkov Detector ---
export const CherenkovDetector = ({ position }) => {
  const [hovered, setHover] = useState(false);

  return (
    <group position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
    >
       <mesh rotation={[0, 0, -Math.PI/2]} scale={hovered ? 1.05 : 1}>
          <cylinderGeometry args={[0.8, 0.2, 1.5, 32]} />
          <meshPhysicalMaterial {...glowMaterial} opacity={0.3} />
       </mesh>
       <Html distanceFactor={15}>
          <LabelCard
            title="Cherenkov Counter"
            description="Identifies particles by their velocity based on light emission angle."
            visible={hovered}
          />
      </Html>
    </group>
  );
};
