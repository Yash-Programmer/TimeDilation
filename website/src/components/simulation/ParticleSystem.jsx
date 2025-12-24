import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Constants
const BEAM_START = -7;
const BEAM_END = 10;
const SPEED = 10; // Units per second

const ParticleSystem = ({
  count = 50,
  pionRatio = 0.7,
  kaonRatio = 0.25,
  muonRatio = 0.05,
  decayEnabled = true
}) => {
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => {
      // Determine type
      const r = Math.random();
      let type = 'pion';
      let color = new THREE.Color('#E74C3C'); // Red
      let decayProb = 0.003; // Chance per frame

      if (r > pionRatio) {
          if (r > pionRatio + kaonRatio) {
              type = 'muon';
              color = new THREE.Color('#2ECC71'); // Green
              decayProb = 0.00001;
          } else {
              type = 'kaon';
              color = new THREE.Color('#3498DB'); // Blue
              decayProb = 0.02; // Higher decay chance
          }
      }

      return {
        t: Math.random(), // 0 to 1 along path
        speed: (Math.random() * 0.2 + 0.9) * (SPEED / (BEAM_END - BEAM_START)),
        offset: new THREE.Vector3((Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2),
        type,
        color,
        decayProb,
        decayed: false,
        decayTime: 0
      };
    });
  }, [count, pionRatio, kaonRatio, muonRatio]);

  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
        if (particle.decayed) {
            // Animation for decay (explode/scale down)
             particle.decayTime += delta;
             if (particle.decayTime > 0.5) {
                 // Reset particle
                 particle.decayed = false;
                 particle.t = 0;
                 particle.decayTime = 0;
             }
             dummy.scale.setScalar(1 - (particle.decayTime * 2)); // Shrink
        } else {
            // Move forward
            particle.t += particle.speed * delta;

            // Decay Logic
            if (decayEnabled && Math.random() < particle.decayProb * delta * 60) {
                 particle.decayed = true;
            }

            // Loop
            if (particle.t > 1) {
                particle.t = 0;
            }

            dummy.scale.setScalar(1);
        }

        // Position
        const x = BEAM_START + (particle.t * (BEAM_END - BEAM_START));
        dummy.position.set(x, particle.offset.y, particle.offset.z);

        // Add wiggle
        dummy.position.y += Math.sin(state.clock.elapsedTime * 5 + i) * 0.02;

        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, particle.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial toneMapped={false} emissiveIntensity={2} />
    </instancedMesh>
  );
};

export default ParticleSystem;
