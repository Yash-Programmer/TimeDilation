import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem = ({
  particleColor = '#E74C3C',
  particleMass = 0.14,
  particleLifetime = 2.6e-8,
  momentum = 8,
  magneticField = 0,
  decayEnabled = true,
  beamlineLength = 15,
  beamIntensity = 10000,
  startX = -4,
  endX = 8
}) => {
  // Scale particle count with beam intensity (capped for performance)
  const count = Math.min(100, Math.max(20, Math.floor(beamIntensity / 500)));

  const meshRef = useRef();
  const particlesRef = useRef([]);
  const timeRef = useRef(0);

  // Force re-render tracking
  const [updateKey, setUpdateKey] = useState(0);

  // Physics constants
  const C = 299792458;

  // Calculate kinematics - this recalculates when params change
  const physics = useMemo(() => {
    // Photon special case (massless)
    if (particleMass === 0) {
      return {
        beta: 1,
        gamma: Infinity,
        decayLength: Infinity,
        larmorRadius: Infinity
      };
    }

    const energy = Math.sqrt(momentum * momentum + particleMass * particleMass);
    const beta = momentum / energy;
    const gamma = energy / particleMass;
    const decayLength = particleLifetime === Infinity
      ? Infinity
      : beta * C * gamma * particleLifetime;
    const larmorRadius = magneticField > 0 ? (momentum * 3.336) / magneticField : Infinity;

    return { beta, gamma, decayLength, larmorRadius };
  }, [momentum, particleMass, particleLifetime, magneticField]);

  // Visual speed scales with β
  const visualSpeedMultiplier = useMemo(() => {
    const baseSpeed = 3;
    // More dramatic speed difference: low β = slow, high β = fast
    const betaFactor = Math.pow(physics.beta, 3); // Amplify the effect
    return baseSpeed + betaFactor * 10;
  }, [physics.beta]);

  // Reset particles when physics significantly changes
  useEffect(() => {
    const visualScale = (endX - startX) / beamlineLength;

    particlesRef.current = Array.from({ length: count }, (_, i) => {
      const decayAt = (!decayEnabled || particleLifetime === Infinity || !isFinite(physics.decayLength))
        ? Infinity
        : -physics.decayLength * visualScale * Math.log(Math.random());

      return {
        x: startX + Math.random() * (endX - startX) * 0.5,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2,
        baseSpeed: 0.7 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        decayAt,
        alive: true,
        opacity: 1
      };
    });

    setUpdateKey(k => k + 1);
  }, [count, startX, endX, physics.beta, physics.decayLength, decayEnabled, beamlineLength, particleLifetime]);

  // Animation frame - uses latest physics values
  useFrame((state, delta) => {
    if (!meshRef.current || !particlesRef.current.length) return;

    timeRef.current += delta;

    const positions = meshRef.current.geometry.attributes.position;
    const colors = meshRef.current.geometry.attributes.color;

    if (!positions || !colors) return;

    const travelDistance = endX - startX;
    const visualScale = travelDistance / beamlineLength;

    for (let i = 0; i < particlesRef.current.length && i < count; i++) {
      const particle = particlesRef.current[i];
      if (!particle) continue;

      // Move particle - speed proportional to β!
      const speed = delta * visualSpeedMultiplier * particle.baseSpeed;
      particle.x += speed;

      // Apply magnetic deflection
      if (magneticField > 0 && isFinite(physics.larmorRadius)) {
        const progress = (particle.x - startX) / travelDistance;
        const maxDeflection = Math.min(1.0, travelDistance / physics.larmorRadius);
        particle.y += Math.sin(progress * Math.PI * 2) * maxDeflection * delta * 2;
      }

      // Slight oscillation for visual interest
      const osc = Math.sin(timeRef.current * 3 + particle.phase) * 0.002;
      particle.y = particle.y * 0.98 + osc;
      particle.z = particle.z * 0.98 + Math.cos(timeRef.current * 2.5 + particle.phase) * 0.002;

      // Check decay
      if (decayEnabled && particle.alive) {
        const distanceTraveled = particle.x - startX;
        if (distanceTraveled > particle.decayAt) {
          particle.alive = false;
        }
      }

      // Reset particle at end or if decayed
      if (particle.x > endX || (!particle.alive && Math.random() < 0.03)) {
        particle.x = startX;
        particle.y = (Math.random() - 0.5) * 0.2;
        particle.z = (Math.random() - 0.5) * 0.2;
        particle.alive = true;
        particle.baseSpeed = 0.7 + Math.random() * 0.6;

        // Recalculate decay position with current physics
        if (decayEnabled && particleLifetime !== Infinity && isFinite(physics.decayLength)) {
          particle.decayAt = -physics.decayLength * visualScale * Math.log(Math.random());
        } else {
          particle.decayAt = Infinity;
        }
      }

      // Update geometry
      if (i < positions.count) {
        positions.setXYZ(i, particle.x, particle.y, particle.z);

        // Color: alive = full, decayed = dim
        const color = new THREE.Color(particleColor);
        if (!particle.alive) {
          color.multiplyScalar(0.15);
        }
        colors.setXYZ(i, color.r, color.g, color.b);
      }
    }

    positions.needsUpdate = true;
    colors.needsUpdate = true;
  });

  // Create geometry - recreate when count or color changes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color(particleColor);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = startX + Math.random() * (endX - startX);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count, startX, endX, particleColor, updateKey]); // Include updateKey to force geometry recreation

  // Particle size scales with momentum
  const particleSize = 0.1 + Math.min(0.08, momentum / 50);

  return (
    <group key={`${particleColor}-${count}-${updateKey}`}>
      {/* Main particles */}
      <points ref={meshRef} geometry={geometry}>
        <pointsMaterial
          size={particleSize}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Trailing glow */}
      <points geometry={geometry}>
        <pointsMaterial
          size={particleSize * 3}
          vertexColors
          transparent
          opacity={0.2}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Beam core line */}
      <mesh position={[(startX + endX) / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, endX - startX, 8]} />
        <meshBasicMaterial
          color={particleColor}
          transparent
          opacity={0.15 + physics.beta * 0.3}
        />
      </mesh>
    </group>
  );
};

export default ParticleSystem;
