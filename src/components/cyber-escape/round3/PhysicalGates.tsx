'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, Float } from '@react-three/drei';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';

// ── Bridge Truss Frame ──
function BridgeTruss({ length = 40, width = 10, height = 4.5, color = '#22D3EE' }) {
  return (
    <group>
      {/* Side handrail truss frameworks */}
      {[-width / 2 - 0.25, width / 2 + 0.25].map((xSide, sideIdx) => (
        <group key={sideIdx} position={[xSide, height / 2, 0]}>
          {/* Top structural bar */}
          <mesh castShadow position={[0, height / 2, 0]}>
            <boxGeometry args={[0.3, 0.3, length]} />
            <meshStandardMaterial color="#071A2F" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Bottom structural bar */}
          <mesh castShadow position={[0, -height / 2, 0]}>
            <boxGeometry args={[0.3, 0.3, length]} />
            <meshStandardMaterial color="#071A2F" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Vertical structural studs */}
          {Array.from({ length: 8 }).map((_, i) => {
            const zPos = -length / 2 + (i / 7) * length;
            return (
              <mesh key={`stud_${i}`} position={[0, 0, zPos]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, height, 8]} />
                <meshStandardMaterial color="#071A2F" metalness={0.95} />
              </mesh>
            );
          })}

          {/* Cross brace struts */}
          {Array.from({ length: 7 }).map((_, i) => {
            const zStart = -length / 2 + (i / 7) * length;
            const zEnd = -length / 2 + ((i + 1) / 7) * length;
            const zMid = (zStart + zEnd) / 2;
            const angle = Math.atan2(height, length / 7);
            const braceLen = Math.sqrt(height * height + (length / 7) * (length / 7));
            return (
              <group key={`cross_${i}`} position={[0, 0, zMid]}>
                <mesh rotation={[angle, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.08, braceLen, 8]} />
                  <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh rotation={[-angle, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.08, braceLen, 8]} />
                  <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* Floating horizontal guide cable lines */}
      {[-width / 2, width / 2].map((xSide, idx) => (
        <mesh key={idx} position={[xSide, height + 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, length, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

// ── Detour Curved Canyon Tunnel ──
function DetourTunnel({ length = 48, width = 12, rotationY = 0.25, color = '#F4B942' }) {
  return (
    <group rotation={[0, rotationY, 0]}>
      {/* Outer armored arched shell */}
      <mesh position={[0, 3.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[width / 2 + 0.6, width / 2 + 0.6, length, 16, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color="#071A2F" roughness={0.8} metalness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Heavy industrial reinforcement ribs */}
      {Array.from({ length: 9 }).map((_, i) => {
        const zPos = -length / 2 + (i / 8) * length;
        return (
          <group key={`rib_${i}`} position={[0, 3.4, zPos]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <torusGeometry args={[width / 2 + 0.45, 0.3, 8, 32, Math.PI]} />
              <meshStandardMaterial color="#071A2F" roughness={0.7} metalness={0.9} />
            </mesh>
            {/* Glowing neon rib indicator */}
            <mesh position={[0, 0, 0.05]}>
              <torusGeometry args={[width / 2 + 0.35, 0.08, 8, 32, Math.PI]} />
              <meshBasicMaterial color={color} />
            </mesh>
          </group>
        );
      })}

      {/* Inner overhead warning spotlights */}
      {[-length / 3, 0, length / 3].map((z, idx) => (
        <group key={`spot_${idx}`} position={[0, 6.0, z]}>
          <mesh castShadow>
            <boxGeometry args={[1.4, 0.4, 0.6]} />
            <meshStandardMaterial color="#071A2F" />
          </mesh>
          <mesh position={[0, -0.21, 0]}>
            <boxGeometry args={[1.2, 0.05, 0.5]} />
            <meshBasicMaterial color={color} />
          </mesh>
          {/* Spotlight projecting to ground */}
          <spotLight
            position={[0, -0.3, 0]}
            angle={0.85}
            penumbra={0.5}
            intensity={3.5}
            color={color}
            distance={18}
            castShadow
          />
        </group>
      ))}

      {/* Winding metal pipelines along detour walls */}
      {[-width / 2 + 0.4, width / 2 - 0.4].map((xSide, sideIdx) => (
        <group key={sideIdx}>
          <mesh position={[xSide, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, length, 8]} />
            <meshStandardMaterial color="#071A2F" metalness={0.8} />
          </mesh>
          <mesh position={[xSide, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, length, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Core Gating Component ──
export function PhysicalGates() {
  const shortcutGate1Ref = useRef<THREE.Group>(null);
  const detourGate1Ref = useRef<THREE.Group>(null);
  const shortcutGate2Ref = useRef<THREE.Group>(null);
  const detourGate2Ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const route1 = useGameStore.getState().routeBranches[0] || 'none';
    const route2 = useGameStore.getState().routeBranches[1] || 'none';

    // Gate open height animations (Standard y=1.5 is closed, y=6.5 is fully open/slid up)
    if (shortcutGate1Ref.current) {
      const targetY = route1 === 'shortcut' ? 6.5 : 1.5;
      shortcutGate1Ref.current.position.y = THREE.MathUtils.lerp(shortcutGate1Ref.current.position.y, targetY, delta * 4.5);
    }
    if (detourGate1Ref.current) {
      const targetY = route1 === 'detour' ? 6.5 : 1.5;
      detourGate1Ref.current.position.y = THREE.MathUtils.lerp(detourGate1Ref.current.position.y, targetY, delta * 4.5);
    }

    if (shortcutGate2Ref.current) {
      const targetY = route2 === 'shortcut' ? 6.5 : 1.5;
      shortcutGate2Ref.current.position.y = THREE.MathUtils.lerp(shortcutGate2Ref.current.position.y, targetY, delta * 4.5);
    }
    if (detourGate2Ref.current) {
      const targetY = route2 === 'detour' ? 6.5 : 1.5;
      detourGate2Ref.current.position.y = THREE.MathUtils.lerp(detourGate2Ref.current.position.y, targetY, delta * 4.5);
    }
  });

  const route1State = useGameStore((state) => state.routeBranches[0] || 'none');
  const route2State = useGameStore((state) => state.routeBranches[1] || 'none');

  return (
    <group>
      {/* ────────────────── CHECKPOINT 1 GATE & ROUTES (Z = -45) ────────────────── */}

      {/* 1. SHORTCUT GATE (Straight road X=0, Z=-45) */}
      <group position={[0, 0, -45]}>
        {/* Armored Gateway Pillars */}
        <mesh position={[-5.8, 3.5, 0]} castShadow>
          <boxGeometry args={[1.5, 7.2, 1.5]} />
          <meshStandardMaterial color={route1State === 'shortcut' ? '#22D3EE' : '#071A2F'} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[5.8, 3.5, 0]} castShadow>
          <boxGeometry args={[1.5, 7.2, 1.5]} />
          <meshStandardMaterial color={route1State === 'shortcut' ? '#22D3EE' : '#071A2F'} metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Overhead beam with status banners */}
        <mesh position={[0, 7.3, 0]} castShadow>
          <boxGeometry args={[13.1, 0.8, 1.6]} />
          <meshStandardMaterial color="#071A2F" metalness={0.8} />
        </mesh>

        {/* Lasers barrier panel that slides up */}
        <group ref={shortcutGate1Ref} position={[0, 1.5, 0]}>
          <mesh>
            <boxGeometry args={[10.1, 4.0, 0.2]} />
            <meshStandardMaterial
              color={route1State === 'shortcut' ? '#22D3EE' : '#071A2F'}
              emissive={route1State === 'shortcut' ? '#22D3EE' : '#071A2F'}
              emissiveIntensity={route1State === 'shortcut' ? 3.0 : 0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Laser beam strip accents */}
          {[-1.2, 0, 1.2].map((yOffset, lIdx) => (
            <mesh key={lIdx} position={[0, yOffset, 0.12]}>
              <planeGeometry args={[9.5, 0.1]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>

        {/* Hologram Sign */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <Html position={[0, 8.8, 0]} center distanceFactor={18}>
            <div className={`px-2.5 py-1 rounded border font-mono font-bold text-[8px] tracking-widest uppercase whitespace-nowrap shadow-lg ${
              route1State === 'shortcut'
                ? 'bg-cyan-950/90 border-[#22D3EE] text-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.6)]'
                : 'bg-black/90 border-cyan-900/60 text-cyan-600/70'
            }`}>
              {route1State === 'shortcut' ? 'SHORTCUT SECURED // ARCH_1' : 'SHORTCUT LOCKED'}
            </div>
          </Html>
        </Float>
      </group>

      {/* 2. DETOUR GATE (Right curving road segment X=14, Z=-44) */}
      <group position={[14, 0, -44]} rotation={[0, -0.25, 0]}>
        <mesh position={[-5.8, 3.5, 0]} castShadow>
          <boxGeometry args={[1.5, 7.2, 1.5]} />
          <meshStandardMaterial color={route1State === 'detour' ? '#F4B942' : '#071A2F'} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[5.8, 3.5, 0]} castShadow>
          <boxGeometry args={[1.5, 7.2, 1.5]} />
          <meshStandardMaterial color={route1State === 'detour' ? '#F4B942' : '#071A2F'} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 7.3, 0]} castShadow>
          <boxGeometry args={[13.1, 0.8, 1.6]} />
          <meshStandardMaterial color="#071A2F" metalness={0.8} />
        </mesh>

        {/* Mechanical slide panel */}
        <group ref={detourGate1Ref} position={[0, 1.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[10.1, 4.0, 0.25]} />
            <meshStandardMaterial
              color={route1State === 'detour' ? '#F4B942' : '#071A2F'}
              emissive={route1State === 'detour' ? '#F4B942' : '#071A2F'}
              emissiveIntensity={route1State === 'detour' ? 2.5 : 0.3}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Warning stripes */}
          <mesh position={[0, 0, 0.15]}>
            <planeGeometry args={[9.5, 0.6]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.6} />
          </mesh>
        </group>

        {/* Detour status indicator */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <Html position={[0, 8.8, 0]} center distanceFactor={18}>
            <div className={`px-2.5 py-1 rounded border font-mono font-bold text-[8px] tracking-widest uppercase whitespace-nowrap shadow-lg ${
              route1State === 'detour'
                ? 'bg-amber-950/90 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'bg-black/90 border-red-900/60 text-red-700/70'
            }`}>
              {route1State === 'detour' ? 'DETOUR ROUTE ACTIVE // DET_1' : 'DETOUR PASSAGE STANDBY'}
            </div>
          </Html>
        </Float>
      </group>

      {/* ── Checkpoint 1 Paths ── */}
      {/* Shortcut Bridge 1 (High-tech glass highway over river 1, Z: -45 to -85) */}
      <group position={[0, 0, -65]}>
        {/* Glass panel path base */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[10, 0.2, 40]} />
          <meshStandardMaterial
            color={route1State === 'shortcut' ? '#0E5AA7' : '#071A2F'}
            emissive={route1State === 'shortcut' ? '#22D3EE' : '#000000'}
            emissiveIntensity={route1State === 'shortcut' ? 0.9 : 0}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Structural pylons extending to river channel */}
        <mesh position={[0, -2.5, 6]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 5.0, 1.5]} />
          <meshStandardMaterial color="#071A2F" roughness={0.7} />
        </mesh>
        <mesh position={[0, -2.5, -6]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 5.0, 1.5]} />
          <meshStandardMaterial color="#071A2F" roughness={0.7} />
        </mesh>
        <BridgeTruss length={40} width={10} height={4.2} color="#22D3EE" />
      </group>

      {/* Detour Canyon Tunnel 1 (Right road segment with detailed warning arches, Z: -45 to -85) */}
      <group position={[18, 0, -65]}>
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0.25]} receiveShadow>
          <planeGeometry args={[12, 48]} />
          <meshStandardMaterial
            color={route1State === 'detour' ? '#F4B942' : '#071A2F'}
            emissive={route1State === 'detour' ? '#F4B942' : '#000000'}
            emissiveIntensity={route1State === 'detour' ? 0.8 : 0}
            roughness={0.35}
          />
        </mesh>
        <DetourTunnel length={48} width={12} rotationY={0.25} color="#F4B942" />
      </group>

      {/* ────────────────── CHECKPOINT 2 GATE & ROUTES (Z = -125) ────────────────── */}

      {/* 1. SHORTCUT GATE (Straight road X=0, Z=-125) */}
      <group position={[0, 0, -125]}>
        <mesh position={[-5.8, 3.5, 0]} castShadow>
          <boxGeometry args={[1.5, 7.2, 1.5]} />
          <meshStandardMaterial color={route2State === 'shortcut' ? '#22D3EE' : '#071A2F'} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[5.8, 3.5, 0]} castShadow>
          <boxGeometry args={[1.5, 7.2, 1.5]} />
          <meshStandardMaterial color={route2State === 'shortcut' ? '#22D3EE' : '#071A2F'} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 7.3, 0]} castShadow>
          <boxGeometry args={[13.1, 0.8, 1.6]} />
          <meshStandardMaterial color="#071A2F" metalness={0.8} />
        </mesh>

        <group ref={shortcutGate2Ref} position={[0, 1.5, 0]}>
          <mesh>
            <boxGeometry args={[10.1, 4.0, 0.2]} />
            <meshStandardMaterial
              color={route2State === 'shortcut' ? '#22D3EE' : '#071A2F'}
              emissive={route2State === 'shortcut' ? '#22D3EE' : '#071A2F'}
              emissiveIntensity={route2State === 'shortcut' ? 3.0 : 0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Laser indicators */}
          {[-1.2, 0, 1.2].map((yOffset, lIdx) => (
            <mesh key={lIdx} position={[0, yOffset, 0.12]}>
              <planeGeometry args={[9.5, 0.1]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <Html position={[0, 8.8, 0]} center distanceFactor={18}>
            <div className={`px-2.5 py-1 rounded border font-mono font-bold text-[8px] tracking-widest uppercase whitespace-nowrap shadow-lg ${
              route2State === 'shortcut'
                ? 'bg-cyan-950/90 border-[#22D3EE] text-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.6)]'
                : 'bg-black/90 border-cyan-900/60 text-cyan-600/70'
            }`}>
              {route2State === 'shortcut' ? 'SHORTCUT SECURED // ARCH_2' : 'SHORTCUT LOCKED'}
            </div>
          </Html>
        </Float>
      </group>

      {/* 2. DETOUR GATE (Left curving road X=-14, Z=-124) */}
      <group position={[-14, 0, -124]} rotation={[0, 0.25, 0]}>
        <mesh position={[-5.8, 3.5, 0]} castShadow>
          <boxGeometry args={[1.5, 7.2, 1.5]} />
          <meshStandardMaterial color={route2State === 'detour' ? '#F4B942' : '#071A2F'} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[5.8, 3.5, 0]} castShadow>
          <boxGeometry args={[1.5, 7.2, 1.5]} />
          <meshStandardMaterial color={route2State === 'detour' ? '#F4B942' : '#071A2F'} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 7.3, 0]} castShadow>
          <boxGeometry args={[13.1, 0.8, 1.6]} />
          <meshStandardMaterial color="#071A2F" metalness={0.8} />
        </mesh>

        <group ref={detourGate2Ref} position={[0, 1.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[10.1, 4.0, 0.25]} />
            <meshStandardMaterial
              color={route2State === 'detour' ? '#F4B942' : '#071A2F'}
              emissive={route2State === 'detour' ? '#F4B942' : '#071A2F'}
              emissiveIntensity={route2State === 'detour' ? 2.5 : 0.3}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Warning stripes */}
          <mesh position={[0, 0, 0.15]}>
            <planeGeometry args={[9.5, 0.6]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.6} />
          </mesh>
        </group>

        {/* Detour status indicator */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <Html position={[0, 8.8, 0]} center distanceFactor={18}>
            <div className={`px-2.5 py-1 rounded border font-mono font-bold text-[8px] tracking-widest uppercase whitespace-nowrap shadow-lg ${
              route2State === 'detour'
                ? 'bg-amber-950/90 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'bg-black/90 border-red-900/60 text-red-700/70'
            }`}>
              {route2State === 'detour' ? 'DETOUR ROUTE ACTIVE // DET_2' : 'DETOUR PASSAGE STANDBY'}
            </div>
          </Html>
        </Float>
      </group>

      {/* ── Checkpoint 2 Paths ── */}
      {/* Shortcut Bridge 2 (Glass suspension bridge crossing river 2, Z: -125 to -175) */}
      <group position={[0, 0, -150]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[10, 0.2, 50]} />
          <meshStandardMaterial
            color={route2State === 'shortcut' ? '#0E5AA7' : '#071A2F'}
            emissive={route2State === 'shortcut' ? '#22D3EE' : '#000000'}
            emissiveIntensity={route2State === 'shortcut' ? 1.1 : 0}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh position={[0, -2.6, 8]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 5.2, 1.6]} />
          <meshStandardMaterial color="#071A2F" roughness={0.7} />
        </mesh>
        <mesh position={[0, -2.6, -8]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 5.2, 1.6]} />
          <meshStandardMaterial color="#071A2F" roughness={0.7} />
        </mesh>
        <BridgeTruss length={50} width={10} height={4.2} color="#22D3EE" />
      </group>

      {/* Detour Canyon Tunnel 2 (Left curving road segment with warning tunnel shell, Z: -125 to -175) */}
      <group position={[-18, 0, -150]}>
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, -0.25]} receiveShadow>
          <planeGeometry args={[12, 55]} />
          <meshStandardMaterial
            color={route2State === 'detour' ? '#F4B942' : '#071A2F'}
            emissive={route2State === 'detour' ? '#F4B942' : '#000000'}
            emissiveIntensity={route2State === 'detour' ? 0.8 : 0}
            roughness={0.35}
          />
        </mesh>
        <DetourTunnel length={55} width={12} rotationY={-0.25} color="#F4B942" />
      </group>
    </group>
  );
}
