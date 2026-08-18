'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, Float } from '@react-three/drei';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { CHECKPOINTS } from '@/lib/cyber-escape/round3/pathLogic';
import { soundEngine } from '@/lib/cyber-escape/round3/soundEngine';

export function QuestionTerminal({ checkpointIndex = 0 }: { checkpointIndex?: number }) {
  const outerRingRef = useRef<THREE.Group>(null);
  const midRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const coreCrystalRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const [isNear, setIsNear] = useState(false);

  const cpInfo = CHECKPOINTS[checkpointIndex] || CHECKPOINTS[0];
  const pos = cpInfo.position;

  // Render variables for surrounding pillars
  const pillarOffsets = useMemo<Array<[number, number]>>(() => {
    const angleStep = (Math.PI * 2) / 3;
    const distance = 4.2;
    return [
      [Math.sin(0) * distance, Math.cos(0) * distance],
      [Math.sin(angleStep) * distance, Math.cos(angleStep) * distance],
      [Math.sin(angleStep * 2) * distance, Math.cos(angleStep * 2) * distance],
    ];
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Concentric Ring Rotations
    if (outerRingRef.current) outerRingRef.current.rotation.y = time * 1.8;
    if (midRingRef.current) midRingRef.current.rotation.x = -time * 1.4;
    if (innerRingRef.current) innerRingRef.current.rotation.z = time * 2.2;

    // 2. Holographic Floating Crystal Animation
    if (coreCrystalRef.current) {
      coreCrystalRef.current.rotation.y = time * 2.8;
      coreCrystalRef.current.position.y = 2.8 + Math.sin(time * 3.5) * 0.16;
    }

    const gameState = useGameStore.getState();
    if (gameState.gameStatus !== 'playing') return;

    // Skip trigger if already solved
    if (gameState.checkpointAnswers[checkpointIndex]) return;

    // Proximity logic
    const pPos = gameState.playerPosition;
    const dx = pPos[0] - pos[0];
    const dz = pPos[2] - pos[2];
    const distSq = dx * dx + dz * dz;
    const radius = cpInfo.triggerRadius;

    const nearStatus = distSq < (radius + 4) * (radius + 4);
    if (nearStatus !== isNear) setIsNear(nearStatus);

    if (pointLightRef.current) {
      pointLightRef.current.intensity = nearStatus ? 5.0 : 2.5;
    }

    // Trigger question overlay
    if (distSq < radius * radius) {
      soundEngine.playTerminalActivate(gameState.soundEnabled);
      gameState.setCurrentCheckpoint(checkpointIndex);
      const currentQ = gameState.mcqQueue[gameState.currentQueueIndex];
      gameState.setActiveQuestion(currentQ || null);
      gameState.setGameStatus('question');
    }
  });

  const isSolved = useGameStore((state) => !!state.checkpointAnswers[checkpointIndex]);
  const isCorrect = useGameStore((state) => state.checkpointAnswers[checkpointIndex]?.isCorrect);

  const themeColor = isSolved ? (isCorrect ? '#22D3EE' : '#F4B942') : (isNear ? '#22D3EE' : '#0E5AA7');
  const accentLightColor = isSolved ? (isCorrect ? '#22D3EE' : '#F4B942') : '#22D3EE';

  return (
    <group position={pos}>
      {/* Light glow casting upwards */}
      <pointLight ref={pointLightRef} position={[0, 4.0, 0]} intensity={2.5} color={accentLightColor} distance={20} />

      {/* ── 1. PORTAL STRUCTURE BASE ── */}
      {/* Primary Circular Pad */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.2, 3.5, 0.4, 32]} />
        <meshStandardMaterial color="#071A2F" roughness={0.7} metalness={0.9} />
      </mesh>
      {/* Inner Circular Pedestal Step */}
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.5, 2.7, 0.15, 32]} />
        <meshStandardMaterial color="#071A2F" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* ── 2. SURROUNDING PYLONS / POWER PILLARS ── */}
      {pillarOffsets.map(([px, pz], idx) => (
        <group key={idx} position={[px, 0, pz]}>
          {/* Main Column */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <boxGeometry args={[0.5, 3.6, 0.5]} />
            <meshStandardMaterial color="#071A2F" metalness={0.9} roughness={0.4} />
          </mesh>
          {/* Glowing cap node */}
          <mesh position={[0, 3.7, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color={themeColor} />
          </mesh>
          {/* Conduits leading from column to ground */}
          <mesh position={[0, 0.3, 0.3]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#071A2F" />
          </mesh>
        </group>
      ))}

      {/* ── 3. DETAILED CONSOLE TERMINAL COLUMN ── */}
      <mesh position={[0, 1.3, 0.5]} castShadow>
        <boxGeometry args={[0.7, 1.7, 0.7]} />
        <meshStandardMaterial color="#0E5AA7" roughness={0.2} metalness={0.95} />
      </mesh>

      {/* Slanted mechanical keyboard deck */}
      <group position={[0, 2.1, 0.3]} rotation={[-0.4, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.3, 0.9]} />
          <meshStandardMaterial color="#071A2F" roughness={0.1} metalness={0.95} />
        </mesh>
        {/* Glow indicator grid */}
        <mesh position={[0, 0.16, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 0.6]} />
          <meshBasicMaterial color={themeColor} transparent opacity={0.65} />
        </mesh>
      </group>

      {/* Slanted Display Monitor */}
      <group position={[0, 2.4, -0.4]} rotation={[-0.15, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 0.9, 0.3]} />
          <meshStandardMaterial color="#071A2F" roughness={0.15} metalness={0.9} />
        </mesh>
        {/* Hologram monitor screen */}
        <mesh position={[0, 0, 0.16]}>
          <planeGeometry args={[2.0, 0.7]} />
          <meshBasicMaterial color={themeColor} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* ── 4. ENERGY MARKERS & FLOATING CRYSTAL ── */}
      {/* Ground Projection Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[3.3, 3.8, 32]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[2.2, 2.4, 32]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0.4} />
      </mesh>

      {/* Volumetric energy cylinder projection */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[2.0, 2.0, 6.2, 32, 1, true]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Central Floating core crystal */}
      <mesh ref={coreCrystalRef} position={[0, 2.8, 0]} castShadow>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color={themeColor}
          emissive={themeColor}
          emissiveIntensity={isNear ? 2.6 : 1.5}
          roughness={0.1}
          metalness={0.95}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ── 5. ROTATING HOLOGRAM CONCENTRIC RINGS ── */}
      <group ref={outerRingRef} position={[0, 2.8, 0]}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.8, 0.06, 8, 32]} />
          <meshBasicMaterial color={themeColor} />
        </mesh>
      </group>
      <group ref={midRingRef} position={[0, 2.8, 0]}>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[1.4, 0.04, 8, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      </group>
      <group ref={innerRingRef} position={[0, 2.8, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.0, 0.03, 8, 32]} />
          <meshBasicMaterial color={themeColor} />
        </mesh>
      </group>

      {/* ── 6. FLOATING CHECKPOINT BADGE ── */}
      <Float speed={2.2} rotationIntensity={0} floatIntensity={0.6}>
        <Html position={[0, 5.8, 0]} center distanceFactor={20}>
          <div className="flex flex-col items-center gap-1 select-none whitespace-nowrap font-mono font-bold">
            <span className="text-[10px] text-cyan-400 bg-black/90 px-2 py-0.5 rounded border border-cyan-500/50 shadow-md uppercase tracking-widest">
              CHECKPOINT 0{checkpointIndex + 1}
            </span>
            <span className={`text-[7px] px-1.5 py-0.5 rounded border ${isSolved
                ? isCorrect
                  ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                  : 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                : isNear
                  ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 animate-pulse'
                  : 'bg-cyan-950/50 border-cyan-900/60 text-cyan-500'
              }`}>
              {isSolved ? (isCorrect ? 'ACCESS GRANTED // SHORTCUT' : 'ACCESS DENIED // DETOUR') : 'TERMINAL READY'}
            </span>
          </div>
        </Html>
      </Float>
    </group>
  );
}
