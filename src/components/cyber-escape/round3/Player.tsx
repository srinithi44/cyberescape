'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';

export function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const chestRef = useRef<THREE.Mesh>(null);
  const droneRef = useRef<THREE.Group>(null);
  
  const animTime = useRef(0);
  const prevRot = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const { playerPosition, playerRotation, isMoving } = useGameStore.getState();
    const time = state.clock.getElapsedTime();

    // 1. Smooth position lerping
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, playerPosition[0], 0.35);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, playerPosition[1], 0.35);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, playerPosition[2], 0.35);

    // 2. Smooth rotation & banking tilt when turning
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, playerRotation, 0.25);

    const rotDelta = playerRotation - prevRot.current;
    prevRot.current = playerRotation;
    const targetRoll = Math.max(-0.25, Math.min(0.25, rotDelta * 0.8));
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -targetRoll, 0.2);

    // 3. Helper Drone Animation (bobbing and orbit)
    if (droneRef.current) {
      droneRef.current.position.x = -1.1 + Math.sin(time * 2) * 0.15;
      droneRef.current.position.y = 2.2 + Math.cos(time * 3) * 0.15;
      droneRef.current.position.z = -0.5 + Math.sin(time * 1.5) * 0.15;
      droneRef.current.rotation.y = time * 2;
    }

    // 4. Walking animation swing
    if (isMoving) {
      animTime.current += delta * 14;
      const swing = Math.sin(animTime.current) * 0.55;
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.8;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.8;
      if (chestRef.current) chestRef.current.position.y = 1.35 + Math.abs(Math.sin(animTime.current * 2)) * 0.09;
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.2);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.2);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.2);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.2);
      if (chestRef.current) chestRef.current.position.y = THREE.MathUtils.lerp(chestRef.current.position.y, 1.35, 0.2);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* High-visibility Local Point Light */}
      <pointLight position={[0, 2.6, 0]} intensity={2.2} color="#22D3EE" distance={10} />

      {/* Ground Dynamic Shadow Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0, 1.0, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} />
      </mesh>

      {/* Ground Energy Aura Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.95, 1.35, 32]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.7} />
      </mesh>

      {/* ── LEGS ── */}
      <mesh ref={leftLegRef} position={[-0.26, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.85, 0.26]} />
        <meshStandardMaterial color="#071A2F" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.26, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.85, 0.26]} />
        <meshStandardMaterial color="#071A2F" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* ── ARMORED TORSO ── */}
      <mesh ref={chestRef} position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 0.95, 0.48]} />
        <meshStandardMaterial color="#071A2F" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* ── ARMS & SHOULDERS ── */}
      {/* Left Arm */}
      <group position={[-0.52, 1.35, 0]}>
        <mesh ref={leftArmRef} castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.85, 0.24]} />
          <meshStandardMaterial color="#0E5AA7" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Shoulder Pad */}
        <mesh position={[-0.05, 0.38, 0]} castShadow>
          <boxGeometry args={[0.3, 0.22, 0.32]} />
          <meshStandardMaterial color="#F4B942" roughness={0.15} metalness={0.9} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.52, 1.35, 0]}>
        <mesh ref={rightArmRef} castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.85, 0.24]} />
          <meshStandardMaterial color="#0E5AA7" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Shoulder Pad */}
        <mesh position={[0.05, 0.38, 0]} castShadow>
          <boxGeometry args={[0.3, 0.22, 0.32]} />
          <meshStandardMaterial color="#F4B942" roughness={0.15} metalness={0.9} />
        </mesh>
      </group>

      {/* ── GLOWING REACTOR CORE ── */}
      <mesh position={[0, 1.48, 0.26]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#22D3EE" />
      </mesh>
      {/* Reactor framing collar */}
      <mesh position={[0, 1.48, 0.22]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.22, 0.03, 8, 24]} />
        <meshStandardMaterial color="#F4B942" metalness={0.9} />
      </mesh>

      {/* ── CYBER HELMET ── */}
      <mesh position={[0, 2.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.48, 0.48]} />
        <meshStandardMaterial color="#071A2F" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 2.12, 0.25]}>
        <boxGeometry args={[0.4, 0.14, 0.05]} />
        <meshBasicMaterial color="#22D3EE" />
      </mesh>

      {/* Loki's Gold Horns */}
      <group position={[-0.22, 2.32, 0]} rotation={[0, 0, 0.38]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.09, 0.8, 16]} />
          <meshStandardMaterial color="#F4B942" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>
      <group position={[0.22, 2.32, 0]} rotation={[0, 0, -0.38]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.09, 0.8, 16]} />
          <meshStandardMaterial color="#F4B942" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* ── FLOATING COMPANION DRONE ── */}
      <group ref={droneRef} position={[-1.1, 2.2, -0.5]}>
        {/* Central Core */}
        <mesh castShadow>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2.5} />
        </mesh>
        {/* Orbital Ring */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.42, 0.02, 6, 24]} />
          <meshBasicMaterial color="#F4B942" transparent opacity={0.6} />
        </mesh>
        <pointLight intensity={1.8} color="#22D3EE" distance={3} />
      </group>
    </group>
  );
}
