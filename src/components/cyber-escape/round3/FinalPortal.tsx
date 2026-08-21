'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Html } from '@react-three/drei';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { soundEngine } from '@/lib/cyber-escape/round3/soundEngine';

export function FinalPortal() {
  const vortexRef1 = useRef<THREE.Mesh>(null);
  const vortexRef2 = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const portalLightRef = useRef<THREE.PointLight>(null);

  // Position is at the end of Highway 3 (Z = -240)
  const portalPos: [number, number, number] = [0, 0, -240];
  const triggerRadius = 7.0;

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Vortex rotators
    if (vortexRef1.current) {
      vortexRef1.current.rotation.z = time * 0.9;
    }
    if (vortexRef2.current) {
      vortexRef2.current.rotation.z = -time * 1.5;
    }

    // 2. Orbital stabilizer ring
    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.4;
      ringRef.current.rotation.y = time * 0.8;
    }

    // 3. Pulsing light intensity
    if (portalLightRef.current) {
      portalLightRef.current.intensity = 5.0 + Math.sin(time * 4) * 1.5;
    }

    // 4. Proximity Win condition
    const store = useGameStore.getState();
    if (store.gameStatus !== 'playing') return;

    const pPos = store.playerPosition;
    const dx = pPos[0] - portalPos[0];
    const dz = pPos[2] - portalPos[2];
    const distSq = dx * dx + dz * dz;

    if (distSq < triggerRadius * triggerRadius) {
      // Trigger Completion Sequence
      store.stopTimer();
      store.setGameStatus('completed');
      soundEngine.playVictory(store.soundEnabled);
    }
  });

  // Generator spires coordinates (relative to portal center)
  const towerPositions = useMemo<Array<[number, number]>>(() => {
    return [
      [-7.5, -4],
      [7.5, -4],
      [-9.0, 3],
      [9.0, 3],
    ];
  }, []);

  return (
    <group position={portalPos}>
      {/* Dynamic Quantum light glow */}
      <pointLight ref={portalLightRef} position={[0, 6.0, 0]} intensity={5.0} color="#22D3EE" distance={38} />

      {/* ── 1. PORTAL CORE PODIUM ── */}
      {/* Main Base Step */}
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[8.5, 9.5, 0.6, 32]} />
        <meshStandardMaterial color="#071A2F" roughness={0.7} metalness={0.9} />
      </mesh>
      {/* Inner tech collar base */}
      <mesh position={[0, 0.7, 0]} receiveShadow>
        <cylinderGeometry args={[7.2, 7.8, 0.25, 32]} />
        <meshStandardMaterial color="#071A2F" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Concentric indicator rings on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.84, 0]}>
        <ringGeometry args={[6.8, 7.1, 32]} />
        <meshBasicMaterial color="#22D3EE" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.84, 0]}>
        <ringGeometry args={[4.5, 4.8, 32]} />
        <meshBasicMaterial color="#F4B942" />
      </mesh>

      {/* ── 2. FLANKING QUANTUM GENERATOR TOWERS ── */}
      {towerPositions.map(([tx, tz], idx) => (
        <group key={idx} position={[tx, 0, tz]}>
          {/* Hex base */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[1.2, 1.5, 0.8, 6]} />
            <meshStandardMaterial color="#071A2F" roughness={0.8} />
          </mesh>
          {/* Main spire pillar */}
          <mesh position={[0, 3.4, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.7, 5.2, 6]} />
            <meshStandardMaterial color="#071A2F" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Spire reactor node */}
          <mesh position={[0, 6.2, 0]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshBasicMaterial color="#22D3EE" />
          </mesh>
          {/* Linking power cables */}
          <mesh position={[-tx * 0.1, 3.0, -tz * 0.1]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 3.0, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      ))}

      {/* ── 3. COLOSSAL GATEWAY ARCH ── */}
      {/* Left heavy support tower */}
      <mesh position={[-6.8, 6.5, 0]} castShadow>
        <boxGeometry args={[1.8, 12.0, 1.8]} />
        <meshStandardMaterial color="#071A2F" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Right heavy support tower */}
      <mesh position={[6.8, 6.5, 0]} castShadow>
        <boxGeometry args={[1.8, 12.0, 1.8]} />
        <meshStandardMaterial color="#071A2F" metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Arch top lintel */}
      <mesh position={[0, 12.8, 0]} castShadow>
        <boxGeometry args={[15.4, 1.6, 2.0]} />
        <meshStandardMaterial color="#071A2F" metalness={0.85} roughness={0.4} />
      </mesh>

      {/* ── 4. DOUBLE ROTATING VORTEX CORE ── */}
      <group position={[0, 6.5, 0]}>
        {/* Stabilizing energy ring frame */}
        <mesh castShadow>
          <torusGeometry args={[5.2, 0.35, 12, 48]} />
          <meshStandardMaterial color="#071A2F" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <torusGeometry args={[5.2, 0.1, 8, 48]} />
          <meshBasicMaterial color="#22D3EE" />
        </mesh>

        {/* Vortex layer 1: Cyan wireframe cone */}
        <mesh ref={vortexRef1} position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[4.8, 0.1, 1.2, 24, 6, true]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.6} wireframe />
        </mesh>
        {/* Vortex layer 2: Gold inner cone */}
        <mesh ref={vortexRef2} position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[4.2, 0.1, 0.8, 16, 4, true]} />
          <meshBasicMaterial color="#F4B942" transparent opacity={0.45} wireframe />
        </mesh>

        {/* Central core white singularity sphere */}
        <mesh position={[0, 0, -0.5]}>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Upward Volumetric sky beam */}
      <mesh position={[0, 22.0, -0.5]}>
        <cylinderGeometry args={[3.2, 4.5, 30.0, 32, 1, true]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Floating stabilizer orbital ring */}
      <group ref={ringRef} position={[0, 6.5, 0]}>
        <mesh>
          <torusGeometry args={[6.8, 0.08, 8, 48]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* ── 5. FLOATING GATEWAY TEXT OVERLAY ── */}
      <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.8}>
        <Html position={[0, 14.8, 0]} center distanceFactor={22}>
          <div className="flex flex-col items-center gap-1.5 select-none text-white whitespace-nowrap font-mono font-bold">
            <span className="text-[11px] text-cyan-400 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.3)] uppercase tracking-[0.2em] animate-pulse">
              QUANTUM ESCAPE GATEWAY
            </span>
            <span className="text-[7px] text-cyan-400 bg-slate-950/60 border border-cyan-500/10 px-2 py-0.5 rounded-lg tracking-wider">
              STATUS: READY FOR TERMINAL OVERRIDE
            </span>
          </div>
        </Html>
      </Float>
    </group>
  );
}
