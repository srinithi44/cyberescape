'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, Float } from '@react-three/drei';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';

// ── Reusable Sliding Laser Gate Component ──
function SlidingGate({ position, rotationY = 0, isOpen, color = '#22D3EE', label }: {
  position: [number, number, number];
  rotationY?: number;
  isOpen: boolean;
  color?: string;
  label: string;
}) {
  const panelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (panelRef.current) {
      const targetY = isOpen ? 6.5 : 1.5;
      panelRef.current.position.y = THREE.MathUtils.lerp(panelRef.current.position.y, targetY, delta * 5.0);
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Side Pillars */}
      <mesh position={[-4.5, 3.5, 0]} castShadow>
        <boxGeometry args={[1.0, 7.0, 1.0]} />
        <meshStandardMaterial color={isOpen ? color : '#071A2F'} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[4.5, 3.5, 0]} castShadow>
        <boxGeometry args={[1.0, 7.0, 1.0]} />
        <meshStandardMaterial color={isOpen ? color : '#071A2F'} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Overhead Beam */}
      <mesh position={[0, 7.1, 0]} castShadow>
        <boxGeometry args={[10.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#071A2F" metalness={0.8} />
      </mesh>

      {/* Sliding Laser Barrier */}
      <group ref={panelRef} position={[0, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[8.0, 3.8, 0.15]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isOpen ? 3.0 : 0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Glowing laser lines */}
        {[-1.0, 0, 1.0].map((yOffset, idx) => (
          <mesh key={idx} position={[0, yOffset, 0.1]}>
            <planeGeometry args={[7.6, 0.08]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Floating Indicator Sign */}
      <Float speed={2.0} floatIntensity={0.3}>
        <Html position={[0, 8.2, 0]} center distanceFactor={18}>
          <div className={`px-2 py-0.5 rounded border font-mono font-bold text-[7px] tracking-widest uppercase whitespace-nowrap shadow-md transition-all duration-300 ${
            isOpen
              ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
              : 'bg-black/90 border-cyan-950 text-cyan-700/60'
          }`}>
            {label} {isOpen ? 'OPEN' : 'LOCKED'}
          </div>
        </Html>
      </Float>
    </group>
  );
}

// ── Bridge Truss Frame ──
function BridgeTruss({ length = 40, width = 10, height = 4.5, color = '#22D3EE' }) {
  return (
    <group>
      {[-width / 2 - 0.25, width / 2 + 0.25].map((xSide, sideIdx) => (
        <group key={sideIdx} position={[xSide, height / 2, 0]}>
          <mesh castShadow position={[0, height / 2, 0]}>
            <boxGeometry args={[0.3, 0.3, length]} />
            <meshStandardMaterial color="#071A2F" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh castShadow position={[0, -height / 2, 0]}>
            <boxGeometry args={[0.3, 0.3, length]} />
            <meshStandardMaterial color="#071A2F" metalness={0.9} roughness={0.2} />
          </mesh>
          {Array.from({ length: 6 }).map((_, i) => {
            const zPos = -length / 2 + (i / 5) * length;
            return (
              <mesh key={`stud_${i}`} position={[0, 0, zPos]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, height, 8]} />
                <meshStandardMaterial color="#071A2F" metalness={0.95} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// ── Detour Curved Tunnel ──
function DetourTunnel({ length = 48, width = 12, rotationY = 0, color = '#F4B942' }) {
  return (
    <group rotation={[0, rotationY, 0]}>
      <mesh position={[0, 3.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[width / 2 + 0.5, width / 2 + 0.5, length, 12, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color="#071A2F" roughness={0.8} metalness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const zPos = -length / 2 + (i / 4) * length;
        return (
          <group key={`rib_${i}`} position={[0, 3.4, zPos]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <torusGeometry args={[width / 2 + 0.4, 0.2, 8, 24, Math.PI]} />
              <meshStandardMaterial color="#071A2F" roughness={0.7} metalness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <torusGeometry args={[width / 2 + 0.3, 0.06, 8, 24, Math.PI]} />
              <meshBasicMaterial color={color} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function PhysicalGates() {
  const routeBranches = useGameStore((state) => state.routeBranches);

  const route0 = routeBranches[0] || 'none';
  const route1 = routeBranches[1] || 'none';
  const route2 = routeBranches[2] || 'none';
  const route3 = routeBranches[3] || 'none';
  const route4 = routeBranches[4] || 'none';
  const route5 = routeBranches[5] || 'none';

  return (
    <group>
      {/* ── GATE 0: Checkpoint 1 (Z = -38) ── */}
      <SlidingGate
        position={[0, 0, -38]}
        isOpen={route0 === 'shortcut'}
        label="SHORTCUT 1"
        color="#22D3EE"
      />
      <SlidingGate
        position={[14, 0, -38]}
        rotationY={-0.2}
        isOpen={route0 === 'detour'}
        label="DETOUR 1"
        color="#F4B942"
      />
      {/* Shortcut 1 bridge */}
      <group position={[0, 0, -62]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[8, 0.2, 40]} />
          <meshStandardMaterial color={route0 === 'shortcut' ? '#0E5AA7' : '#071A2F'} roughness={0.2} metalness={0.8} />
        </mesh>
        <BridgeTruss length={40} width={8} height={4.0} color="#22D3EE" />
      </group>
      {/* Detour 1 tunnel */}
      <group position={[18, 0, -62]}>
        <mesh position={[0, 0.1, 0]} rotation={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[8, 0.2, 40]} />
          <meshStandardMaterial color={route0 === 'detour' ? '#B45309' : '#071A2F'} roughness={0.3} metalness={0.8} />
        </mesh>
        <DetourTunnel length={40} width={10} rotationY={-0.2} color="#F4B942" />
      </group>


      {/* ── GATE 1: Checkpoint 2 (Z = -95) ── */}
      <SlidingGate
        position={[0, 0, -95]}
        isOpen={route1 === 'shortcut'}
        label="GATE 2 SHORTCUT"
        color="#22D3EE"
      />
      <SlidingGate
        position={[8, 0, -95]}
        isOpen={route1 === 'detour'}
        label="GATE 2 DETOUR"
        color="#F4B942"
      />
      {/* Detour 2 lane connector */}
      <mesh position={[4, 0.1, -97.5]} receiveShadow>
        <boxGeometry args={[8, 0.2, 5]} />
        <meshStandardMaterial color="#071A2F" roughness={0.5} />
      </mesh>


      {/* ── GATE 2: Checkpoint 3 (Z = -118) ── */}
      <SlidingGate
        position={[0, 0, -118]}
        isOpen={route2 === 'shortcut'}
        label="SHORTCUT 2"
        color="#22D3EE"
      />
      <SlidingGate
        position={[-14, 0, -118]}
        rotationY={0.2}
        isOpen={route2 === 'detour'}
        label="DETOUR 2"
        color="#F4B942"
      />
      {/* Shortcut 2 bridge */}
      <group position={[0, 0, -147]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[8, 0.2, 50]} />
          <meshStandardMaterial color={route2 === 'shortcut' ? '#0E5AA7' : '#071A2F'} roughness={0.2} metalness={0.8} />
        </mesh>
        <BridgeTruss length={50} width={8} height={4.0} color="#22D3EE" />
      </group>
      {/* Detour 2 tunnel */}
      <group position={[-18, 0, -147]}>
        <mesh position={[0, 0.1, 0]} rotation={[0, 0.2, 0]} receiveShadow>
          <boxGeometry args={[8, 0.2, 50]} />
          <meshStandardMaterial color={route2 === 'detour' ? '#B45309' : '#071A2F'} roughness={0.3} metalness={0.8} />
        </mesh>
        <DetourTunnel length={50} width={10} rotationY={0.2} color="#F4B942" />
      </group>


      {/* ── GATE 3: Checkpoint 4 (Z = -155) ── */}
      <SlidingGate
        position={[0, 0, -155]}
        isOpen={route3 === 'shortcut'}
        label="GATE 4 SHORTCUT"
        color="#22D3EE"
      />
      <SlidingGate
        position={[-8, 0, -155]}
        isOpen={route3 === 'detour'}
        label="GATE 4 DETOUR"
        color="#F4B942"
      />


      {/* ── GATE 4: Checkpoint 5 (Z = -185) ── */}
      <SlidingGate
        position={[0, 0, -185]}
        isOpen={route4 === 'shortcut'}
        label="GATE 5 SHORTCUT"
        color="#22D3EE"
      />
      <SlidingGate
        position={[8, 0, -185]}
        isOpen={route4 === 'detour'}
        label="GATE 5 DETOUR"
        color="#F4B942"
      />


      {/* ── GATE 5: Checkpoint 6 (Z = -205) ── */}
      <SlidingGate
        position={[0, 0, -205]}
        isOpen={route5 === 'shortcut'}
        label="GATE 6 SHORTCUT"
        color="#22D3EE"
      />
      <SlidingGate
        position={[-8, 0, -205]}
        isOpen={route5 === 'detour'}
        label="GATE 6 DETOUR"
        color="#F4B942"
      />
    </group>
  );
}
