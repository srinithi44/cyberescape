'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, Float } from '@react-three/drei';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { CHECKPOINTS } from '@/lib/cyber-escape/round3/pathLogic';
import { CODING_CHALLENGES } from '@/lib/cyber-escape/round3/questions';
import { soundEngine } from '@/lib/cyber-escape/round3/soundEngine';

export function CodingTerminal({ challengeIndex = 0 }: { challengeIndex?: number }) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const [isNear, setIsNear] = useState(false);

  const checkpointIndex = challengeIndex === 0 ? 8 : 9;
  const cpInfo = CHECKPOINTS[checkpointIndex];
  const pos = cpInfo.position;

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Rotate the glowing data matrix core
    if (crystalRef.current) {
      crystalRef.current.rotation.y = -time * 1.5;
      crystalRef.current.rotation.x = time * 0.8;
      crystalRef.current.position.y = 2.4 + Math.sin(time * 3) * 0.1;
    }

    const gameState = useGameStore.getState();
    if (gameState.gameStatus !== 'playing') return;

    const challenge = CODING_CHALLENGES[challengeIndex];
    const isSolved = !!gameState.codingSolved[challenge.id];
    if (isSolved) return;

    // Check distance
    const pPos = gameState.playerPosition;
    const dx = pPos[0] - pos[0];
    const dz = pPos[2] - pos[2];
    const distSq = dx * dx + dz * dz;
    const radius = cpInfo.triggerRadius;

    const nearStatus = distSq < (radius + 4) * (radius + 4);
    if (nearStatus !== isNear) setIsNear(nearStatus);

    if (pointLightRef.current) {
      pointLightRef.current.intensity = nearStatus ? 4.5 : 2.0;
    }

    if (distSq < radius * radius) {
      soundEngine.playTerminalActivate(gameState.soundEnabled);
      gameState.setCurrentCheckpoint(checkpointIndex);
      gameState.setActiveCodingChallenge(challenge);
      gameState.setGameStatus('coding');
    }
  });

  const challenge = CODING_CHALLENGES[challengeIndex];
  const isSolved = useGameStore((state) => !!state.codingSolved[challenge.id]);

  // Premium Gold / Cyan / Ocean Blue themes
  const mainColor = isSolved ? '#22D3EE' : (isNear ? '#F4B942' : '#0E5AA7');
  const lightColor = isSolved ? '#22D3EE' : '#F4B942';

  return (
    <group position={pos}>
      <pointLight ref={pointLightRef} position={[0, 3.5, 0]} intensity={2.0} color={lightColor} distance={18} />

      {/* Podium base */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.5, 2.8, 0.4, 6]} />
        <meshStandardMaterial color="#071A2F" roughness={0.6} metalness={0.9} />
      </mesh>
      
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[2.0, 2.2, 0.15, 6]} />
        <meshStandardMaterial color="#0E5AA7" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Octagonal column */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.65, 1.5, 8]} />
        <meshStandardMaterial color="#071A2F" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Screen frame */}
      <group position={[0, 2.1, 0]} rotation={[-0.15, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.8, 0.4]} />
          <meshStandardMaterial color="#0E5AA7" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glow surface */}
        <mesh position={[0, 0, 0.21]}>
          <planeGeometry args={[1.6, 0.65]} />
          <meshBasicMaterial color={mainColor} transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Rotating floating core */}
      <mesh ref={crystalRef} position={[0, 2.4, 0]}>
        <dodecahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={mainColor}
          emissive={mainColor}
          emissiveIntensity={isNear ? 2.5 : 1.2}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Visual ring projections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[2.6, 2.9, 6]} />
        <meshBasicMaterial color={mainColor} transparent opacity={0.6} />
      </mesh>

      {/* Hologram details */}
      <Float speed={2.0} rotationIntensity={0.1} floatIntensity={0.5}>
        <Html position={[0, 3.8, 0]} center distanceFactor={18}>
          <div className="flex flex-col items-center gap-1 select-none text-white whitespace-nowrap font-mono font-bold">
            <span className="text-[9px] text-[#F4B942] bg-[#071A2F]/95 px-2.5 py-0.5 rounded border border-[#F4B942]/60 shadow-[0_0_10px_rgba(244,185,66,0.3)] uppercase tracking-wider">
              {challenge.title}
            </span>
            <span className={`text-[7px] px-1.5 py-0.5 rounded border uppercase ${
              isSolved 
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300' 
                : 'bg-amber-950/80 border-amber-500/60 text-amber-300 animate-pulse'
            }`}>
              {isSolved ? 'SOLVED // ACCESSIBLE' : 'LOCKED // CODING REQUIRED'}
            </span>
          </div>
        </Html>
      </Float>
    </group>
  );
}
