'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore, RemotePlayer } from '@/lib/cyber-escape/round3/gameState';

function OtherPlayerInstance({ player }: { player: RemotePlayer }) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const chestRef = useRef<THREE.Mesh>(null);
  const droneRef = useRef<THREE.Group>(null);
  
  const animTime = useRef(0);
  const prevRot = useRef(player.rotation);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Lerp position (0.2 for smooth network transition)
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, player.position[0], 0.2);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, player.position[1], 0.2);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, player.position[2], 0.2);

    // 2. Lerp rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, player.rotation, 0.2);

    const rotDelta = player.rotation - prevRot.current;
    prevRot.current = player.rotation;
    const targetRoll = Math.max(-0.25, Math.min(0.25, rotDelta * 0.8));
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -targetRoll, 0.15);

    // 3. Companion Drone Bobbing
    if (droneRef.current) {
      droneRef.current.position.x = -1.1 + Math.sin(time * 2.1) * 0.15;
      droneRef.current.position.y = 2.2 + Math.cos(time * 3.1) * 0.15;
      droneRef.current.position.z = -0.5 + Math.sin(time * 1.6) * 0.15;
      droneRef.current.rotation.y = time * 1.8;
    }

    // 4. Walk Cycle Animation
    if (player.isMoving) {
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
    <group ref={groupRef} position={[player.position[0], player.position[1], player.position[2]]}>
      {/* Dynamic Nametag Overlay */}
      <Html position={[0, 3.4, 0]} center distanceFactor={18}>
        <div className="flex flex-col items-center select-none whitespace-nowrap">
          <div className="px-2 py-0.5 rounded bg-black/85 border border-[#F4B942]/60 shadow-[0_0_10px_rgba(244,185,66,0.3)] text-[8px] font-mono font-bold tracking-widest text-[#F4B942] uppercase">
            {player.name}
          </div>
          <div className="w-1.5 h-1.5 rotate-45 bg-[#F4B942] border-r border-b border-[#F4B942]/60 -mt-1" />
        </div>
      </Html>

      {/* Gold/Orange localized accent light to differentiate peer from local player */}
      <pointLight position={[0, 2.6, 0]} intensity={1.8} color="#F4B942" distance={8} />

      {/* Aura Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.95, 1.35, 32]} />
        <meshBasicMaterial color="#F4B942" transparent opacity={0.65} />
      </mesh>

      {/* Shadow Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0, 1.0, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} />
      </mesh>

      {/* Legs */}
      <mesh ref={leftLegRef} position={[-0.26, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.85, 0.26]} />
        <meshStandardMaterial color="#071A2F" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.26, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.85, 0.26]} />
        <meshStandardMaterial color="#071A2F" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Chest */}
      <mesh ref={chestRef} position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 0.95, 0.48]} />
        <meshStandardMaterial color="#071A2F" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Arms & Shoulders */}
      <group position={[-0.52, 1.35, 0]}>
        <mesh ref={leftArmRef} castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.85, 0.24]} />
          <meshStandardMaterial color="#0E5AA7" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[-0.05, 0.38, 0]} castShadow>
          <boxGeometry args={[0.3, 0.22, 0.32]} />
          <meshStandardMaterial color="#22D3EE" roughness={0.15} metalness={0.9} />
        </mesh>
      </group>

      <group position={[0.52, 1.35, 0]}>
        <mesh ref={rightArmRef} castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.85, 0.24]} />
          <meshStandardMaterial color="#0E5AA7" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.05, 0.38, 0]} castShadow>
          <boxGeometry args={[0.3, 0.22, 0.32]} />
          <meshStandardMaterial color="#22D3EE" roughness={0.15} metalness={0.9} />
        </mesh>
      </group>

      {/* Core Reactor */}
      <mesh position={[0, 1.48, 0.26]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#F4B942" />
      </mesh>
      <mesh position={[0, 1.48, 0.22]}>
        <torusGeometry args={[0.22, 0.03, 8, 24]} />
        <meshStandardMaterial color="#22D3EE" metalness={0.9} />
      </mesh>

      {/* Cyber Helmet */}
      <mesh position={[0, 2.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.48, 0.48]} />
        <meshStandardMaterial color="#071A2F" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 2.12, 0.25]}>
        <boxGeometry args={[0.4, 0.14, 0.05]} />
        <meshBasicMaterial color="#F4B942" />
      </mesh>

      {/* Horns */}
      <group position={[-0.22, 2.32, 0]} rotation={[0, 0, 0.38]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.09, 0.8, 16]} />
          <meshStandardMaterial color="#22D3EE" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>
      <group position={[0.22, 2.32, 0]} rotation={[0, 0, -0.38]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.09, 0.8, 16]} />
          <meshStandardMaterial color="#22D3EE" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* Companion Drone */}
      <group ref={droneRef} position={[-1.1, 2.2, -0.5]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color="#F4B942" emissive="#F4B942" emissiveIntensity={2.5} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.42, 0.02, 6, 24]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.6} />
        </mesh>
        <pointLight intensity={1.8} color="#F4B942" distance={3} />
      </group>
    </group>
  );
}

export function OtherPlayers() {
  const otherPlayers = useGameStore((state) => state.otherPlayers);

  return (
    <>
      {Object.values(otherPlayers).map((player) => (
        <OtherPlayerInstance key={player.id} player={player} />
      ))}
    </>
  );
}
