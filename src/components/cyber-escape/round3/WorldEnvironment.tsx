'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Html } from '@react-three/drei';
import { Shield, Zap, Terminal, Award, AlertTriangle, Compass, Cpu, Database, Server, Radio, Cog, Lightbulb } from 'lucide-react';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';

// ── Moving Vehicle on Highway ──
function MovingVehicle({ startZ, endZ, speed, laneX, color = '#22D3EE' }: {
  startZ: number;
  endZ: number;
  speed: number;
  laneX: number;
  color?: string;
}) {
  const vehicleRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (vehicleRef.current) {
      const t = state.clock.getElapsedTime() * speed;
      const dist = Math.abs(startZ - endZ);
      const z = startZ - (t % dist);
      vehicleRef.current.position.z = z;
    }
  });
  return (
    <group ref={vehicleRef} position={[laneX, 0.45, startZ]}>
      <mesh castShadow>
        <boxGeometry args={[1.5, 0.8, 3.2]} />
        <meshStandardMaterial color="#0b1329" roughness={0.15} metalness={0.9} />
      </mesh>
      {/* Front and underglow lights */}
      <pointLight position={[0, -0.2, 0]} intensity={1.8} distance={7} color={color} />
      <mesh position={[0, 0.25, -1.61]}>
        <planeGeometry args={[1.2, 0.3]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.2, 1.61]}>
        <planeGeometry args={[1.2, 0.2]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}

// ── Futuristic Bus Stop Shelter ──
function FuturisticBusStop({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[4.0, 0.2, 2.0]} />
        <meshStandardMaterial color="#071A2F" roughness={0.5} />
      </mesh>
      <mesh position={[-1.9, 1.5, -0.9]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3.0]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.9} />
      </mesh>
      <mesh position={[1.9, 1.5, -0.9]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3.0]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.9} />
      </mesh>
      <mesh position={[0, 1.5, -0.95]} castShadow>
        <planeGeometry args={[3.8, 3.0]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.6} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 3.0, 0]} castShadow>
        <boxGeometry args={[4.2, 0.15, 2.2]} />
        <meshStandardMaterial color="#071A2F" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.45, -0.2]} castShadow>
        <boxGeometry args={[2.5, 0.5, 0.6]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.7} />
      </mesh>
      <Float speed={1.5} floatIntensity={0.3}>
        <Html position={[0, 2.2, 0]} center distanceFactor={15}>
          <div className="px-2 py-0.5 rounded border border-cyan-500/30 bg-slate-950/80 backdrop-blur-sm text-[6px] font-mono font-bold text-cyan-300 tracking-wider whitespace-nowrap animate-pulse shadow-md">
            TRANSIT NODE
          </div>
        </Html>
      </Float>
      <group position={[0, 0.8, -0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.5, 0.4]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.75} />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// ── Overhauled Layered Cyber Mountain ──
function CyberMountain({
  position,
  scale = [1, 1, 1],
  color = '#0b132b',
  emissive = '#22D3EE',
}: {
  position: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  emissive?: string;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Base massive rocky formation */}
      <mesh position={[0, 2, 0]} receiveShadow castShadow>
        <dodecahedronGeometry args={[12, 1]} />
        <meshStandardMaterial color="#0c1524" roughness={0.95} metalness={0.15} flatShading />
      </mesh>

      {/* Main Jagged Peak */}
      <mesh position={[0, 10, 0]} receiveShadow castShadow>
        <coneGeometry args={[10, 24, 6]} />
        <meshStandardMaterial color="#070c14" roughness={0.9} metalness={0.25} flatShading />
      </mesh>

      {/* Ridge Flanker Left */}
      <mesh position={[-5, 4, 3]} scale={[0.8, 0.7, 0.8]} receiveShadow castShadow>
        <coneGeometry args={[8, 16, 5]} />
        <meshStandardMaterial color="#0c1524" roughness={0.9} flatShading />
      </mesh>

      {/* Ridge Flanker Right */}
      <mesh position={[4, 2, -4]} scale={[0.7, 0.6, 0.7]} receiveShadow castShadow>
        <coneGeometry args={[9, 14, 5]} />
        <meshStandardMaterial color="#0c1524" roughness={0.9} flatShading />
      </mesh>

      {/* Floating Spire Power Reactor Core */}
      <group position={[0, 23.5, 0]}>
        <Float speed={2.5} rotationIntensity={1.2} floatIntensity={0.8}>
          <mesh castShadow>
            <octahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={3.2} metalness={0.9} roughness={0.05} />
          </mesh>
          <pointLight intensity={2.2} color={emissive} distance={16} />
        </Float>
      </group>

      {/* Structural Support Lattice Spire */}
      <mesh position={[0, 16, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 10, 4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} wireframe />
      </mesh>

      {/* Tech Energy Veins on Ridges */}
      {Array.from({ length: 4 }).map((_, idx) => {
        const angle = (idx / 4) * Math.PI * 2;
        const radius = 6.2;
        return (
          <mesh
            key={idx}
            position={[Math.sin(angle) * radius, 8, Math.cos(angle) * radius]}
            rotation={[0.25, angle, 0]}
          >
            <cylinderGeometry args={[0.06, 0.12, 18, 4]} />
            <meshBasicMaterial color={emissive} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Bioluminescent Cyber Tree ──
function CyberTree({ position, color = '#14B8A6', scale = 1 }: { position: [number, number, number]; color?: string; scale?: number }) {
  const rotationOffset = useMemo(() => Math.random() * Math.PI, []);
  const heightScale = useMemo(() => 0.85 + Math.random() * 0.3, []);
  
  return (
    <group position={position} scale={[scale, scale * heightScale, scale]} rotation={[0, rotationOffset, 0]}>
      {/* Carbon Trunk */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.26, 2.8, 8]} />
        <meshStandardMaterial color="#0c1524" roughness={0.65} metalness={0.85} />
      </mesh>
      {/* Main glowing foliage */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <dodecahedronGeometry args={[1.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.9} roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Side details foliage */}
      <mesh position={[0.7, 2.6, 0.4]} scale={0.55} castShadow>
        <dodecahedronGeometry args={[1.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.6, 2.9, -0.5]} scale={0.45} castShadow>
        <dodecahedronGeometry args={[1.2]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.4} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

// ── Cyber Rock Formation ──
function CyberRock({ position, scale = [1, 1, 1], rotation = [0, 0, 0] }: { position: [number, number, number]; scale?: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <dodecahedronGeometry args={[2.0, 1]} />
        <meshStandardMaterial color="#0c1524" roughness={0.9} metalness={0.2} flatShading />
      </mesh>
      <mesh position={[0.2, 0.4, 1.2]} rotation={[0.4, 0.2, 0.1]} castShadow>
        <boxGeometry args={[1.5, 0.8, 0.2]} />
        <meshStandardMaterial color="#0e5aa7" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.5, 0.8, 1.25]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#F4B942" />
      </mesh>
    </group>
  );
}

// ── Glowing Energy Crystal ──
function EnergyCrystal({ position, color = '#22D3EE' }: { position: [number, number, number]; color?: string }) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (crystalRef.current) {
      crystalRef.current.rotation.y = time * 1.5;
      crystalRef.current.position.y = 1.2 + Math.sin(time * 2.2) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.8;
      ringRef.current.rotation.y = time * 0.4;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.3, 0.6, 6]} />
        <meshStandardMaterial color="#071A2F" roughness={0.7} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.5} />
      </mesh>

      <mesh ref={crystalRef} position={[0, 1.2, 0]} castShadow>
        <octahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} roughness={0.05} metalness={0.95} />
      </mesh>

      <group ref={ringRef} position={[0, 1.2, 0]}>
        <mesh>
          <torusGeometry args={[1.55, 0.05, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      </group>

      <pointLight position={[0, 1.2, 0]} intensity={2.2} color={color} distance={9} />
    </group>
  );
}

// ── Animated Energy River ──
function EnergyRiver({ position, width = 160, length = 12, color = '#0E5AA7' }: { position: [number, number, number]; width?: number; length?: number; color?: string }) {
  const riverRef1 = useRef<THREE.Mesh>(null);
  const riverRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (riverRef1.current) {
      riverRef1.current.position.x = Math.sin(time * 0.3) * 1.5;
      riverRef1.current.position.y = -0.16 + Math.cos(time * 1.2) * 0.03;
    }
    if (riverRef2.current) {
      riverRef2.current.position.x = -Math.sin(time * 0.35) * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* River Basin Containment */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[width, 1.2, length + 2]} />
        <meshStandardMaterial color="#0c1524" roughness={0.95} metalness={0.3} />
      </mesh>

      {/* Fluid base layer */}
      <mesh position={[0, -0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Wave overlays */}
      <mesh ref={riverRef1} position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 10, length - 0.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
      </mesh>
      <mesh ref={riverRef2} position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 10, length - 2.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} wireframe />
      </mesh>

      {/* Flow lights */}
      {[-40, 0, 40].map((offsetX, idx) => (
        <pointLight key={idx} position={[offsetX, 0.4, 0]} intensity={2.2} color={color} distance={25} />
      ))}
    </group>
  );
}

// ── Building 1: Cyber Lab ──
function CyberLab({ position, scale = [1, 1, 1] }: { position: [number, number, number]; scale?: [number, number, number] }) {
  const reactorRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (reactorRef.current) {
      reactorRef.current.rotation.y = state.clock.getElapsedTime() * 1.5;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[11, 1.0, 11]} />
        <meshStandardMaterial color="#071A2F" roughness={0.8} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[9.5, 0.8, 9.5]} />
        <meshStandardMaterial color="#071A2F" roughness={0.65} metalness={0.85} />
      </mesh>

      {/* Glass facade block */}
      <mesh position={[0, 5.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[8.0, 6.4, 8.0]} />
        <meshStandardMaterial color="#0e5aa7" roughness={0.1} metalness={0.9} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Outer pillars */}
      {[-4.1, 4.1].map((x, i) =>
        [-4.1, 4.1].map((z, j) => (
          <mesh key={`${i}_${j}`} position={[x, 5.0, z]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 6.4, 8]} />
            <meshStandardMaterial color="#071A2F" metalness={0.9} roughness={0.2} />
          </mesh>
        ))
      )}

      {/* Floating Reactor core */}
      <mesh ref={reactorRef} position={[0, 4.2, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 4.2, 8]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.6} wireframe />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.85, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0, 8.5, 0]} castShadow>
        <boxGeometry args={[7.2, 0.6, 7.2]} />
        <meshStandardMaterial color="#071A2F" metalness={0.85} roughness={0.4} />
      </mesh>
      
      {/* Exhaust stacks */}
      <group position={[-2.2, 9.2, -2.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.35, 1.4, 8]} />
          <meshStandardMaterial color="#071A2F" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.5} />
        </mesh>
      </group>

      <mesh position={[2.2, 9.6, 2.2]} castShadow>
        <cylinderGeometry args={[0.05, 0.1, 2.6, 8]} />
        <meshStandardMaterial color="#071A2F" metalness={0.9} />
      </mesh>
      <mesh position={[2.2, 10.8, 2.2]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#22D3EE" />
      </mesh>

      <Float speed={2.0} rotationIntensity={0} floatIntensity={0.4}>
        <Html position={[0, 12, 0]} center distanceFactor={28}>
          <div className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.5)] text-[8px] font-mono font-bold tracking-widest text-[#22D3EE] uppercase whitespace-nowrap">
            <span>LAB_NODE_01</span>
            <span className="text-[6px] text-cyan-500/60 border-t border-cyan-500/10 pt-0.5">SYS_LOCK // RUNNING</span>
          </div>
        </Html>
      </Float>
    </group>
  );
}

// ── Building 2: Network Center ──
function NetworkCenter({ position, scale = [1, 1, 1] }: { position: [number, number, number]; scale?: [number, number, number] }) {
  const radarRef = useRef<THREE.Group>(null);
  const coreBeaconRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (radarRef.current) {
      radarRef.current.rotation.y = time * 0.55;
    }
    if (coreBeaconRef.current) {
      coreBeaconRef.current.scale.setScalar(1.0 + Math.sin(time * 3.5) * 0.12);
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[5, 6, 1.2, 6]} />
        <meshStandardMaterial color="#071A2F" roughness={0.8} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.2, 4.6, 0.4, 6]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[0, 7.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 1.8, 12, 4, 6, true]} />
        <meshStandardMaterial color="#071A2F" roughness={0.3} metalness={0.95} wireframe />
      </mesh>
      <mesh position={[0, 7.5, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 12.0, 8]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.8} />
      </mesh>

      {/* Rotating Radar Hub */}
      <group position={[0, 10.5, 0]} ref={radarRef}>
        <mesh castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.3, 6]} />
          <meshStandardMaterial color="#071A2F" metalness={0.9} />
        </mesh>
        <group position={[0, 0.8, 1.4]} rotation={[0.4, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.5, 0.3, 0.6, 16, 1, true]} />
            <meshStandardMaterial color="#0E5AA7" roughness={0.2} metalness={0.9} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.07, 0.07, 0.8, 8]} />
            <meshStandardMaterial color="#22D3EE" />
          </mesh>
        </group>
      </group>

      <mesh position={[0, 14.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.25, 3.2, 8]} />
        <meshStandardMaterial color="#071A2F" metalness={0.9} />
      </mesh>
      
      <mesh ref={coreBeaconRef} position={[0, 16.3, 0]}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshBasicMaterial color="#22D3EE" />
      </mesh>
      <pointLight position={[0, 16.3, 0]} intensity={3.0} color="#22D3EE" distance={22} />
    </group>
  );
}

// ── Building 3: Database Vault ──
function DatabaseVault({ position, scale = [1, 1, 1] }: { position: [number, number, number]; scale?: [number, number, number] }) {
  const neonPulseRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (neonPulseRef.current) {
      neonPulseRef.current.opacity = 0.5 + Math.sin(time * 5.0) * 0.35;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[13, 0.8, 13]} />
        <meshStandardMaterial color="#071A2F" roughness={0.9} metalness={0.4} />
      </mesh>

      <mesh position={[0, 4.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[11, 6.4, 11]} />
        <meshStandardMaterial color="#071A2F" roughness={0.45} metalness={0.85} />
      </mesh>

      {/* Side reinforcement plating */}
      {[-5.6, 5.6].map((x, idx) => (
        <mesh key={idx} position={[x, 3.6, 0]} rotation={[0, 0, x > 0 ? 0.15 : -0.15]} castShadow>
          <boxGeometry args={[0.4, 5.8, 9]} />
          <meshStandardMaterial color="#0E5AA7" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}

      <mesh position={[0, 6.4, 0]}>
        <boxGeometry args={[11.2, 0.3, 11.2]} />
        <meshBasicMaterial ref={neonPulseRef} color="#F4B942" transparent />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[11.2, 0.3, 11.2]} />
        <meshBasicMaterial color="#F4B942" />
      </mesh>

      {/* Entry vault door */}
      <group position={[0, 2.0, 5.55]}>
        <mesh castShadow>
          <boxGeometry args={[4.2, 3.8, 0.4]} />
          <meshStandardMaterial color="#071A2F" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[3.4, 3.2]} />
          <meshStandardMaterial color="#0E5AA7" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.4, 0.25]}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshBasicMaterial color="#F4B942" />
        </mesh>
        <pointLight position={[0, 1.4, 0.4]} intensity={1.8} color="#F4B942" distance={8} />
      </group>

      {/* Mechanical vents */}
      {[-4, 0, 4].map((offsetX, idx) => (
        <group key={idx} position={[offsetX, 7.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.85, 0.85, 1.2, 12]} />
            <meshStandardMaterial color="#071A2F" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.75, 12]} />
            <meshBasicMaterial color="#F4B942" />
          </mesh>
        </group>
      ))}

      {/* Dual side storage vessels */}
      <group position={[-7.2, 2.5, -2.5]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[1.35, 1.35, 4.2, 12]} />
          <meshStandardMaterial color="#0E5AA7" roughness={0.4} metalness={0.9} />
        </mesh>
        <mesh position={[0, 3.2, 1.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 3.6, 8]} />
          <meshStandardMaterial color="#071A2F" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// ── Building 4: AI Research Center ──
function AIResearchCenter({ position, scale = [1, 1, 1] }: { position: [number, number, number]; scale?: [number, number, number] }) {
  const innerRingRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = time * 1.2;
      innerRingRef.current.rotation.x = time * 0.7;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = -time * 0.8;
      outerRingRef.current.rotation.z = time * 0.5;
    }
    if (coreRef.current) {
      coreRef.current.position.y = 2.8 + Math.sin(time * 3.0) * 0.2;
      coreRef.current.rotation.y = time * 1.8;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[7.2, 8.0, 0.6, 32]} />
        <meshStandardMaterial color="#071A2F" roughness={0.7} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.8, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[6.0, 6.6, 0.4, 32]} />
        <meshStandardMaterial color="#0E5AA7" roughness={0.5} metalness={0.9} />
      </mesh>

      <mesh position={[0, 3.2, 0]} receiveShadow castShadow>
        <sphereGeometry args={[4.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#22D3EE" roughness={0.1} metalness={0.95} transparent opacity={0.55} wireframe />
      </mesh>

      <mesh ref={coreRef} position={[0, 2.8, 0]} castShadow>
        <octahedronGeometry args={[1.15, 0]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2.5} roughness={0.1} metalness={0.9} />
      </mesh>
      <pointLight position={[0, 2.8, 0]} intensity={3.0} color="#22D3EE" distance={22} />

      <group ref={innerRingRef} position={[0, 3.2, 0]}>
        <mesh>
          <torusGeometry args={[5.6, 0.08, 8, 48]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.75} />
        </mesh>
      </group>
      <group ref={outerRingRef} position={[0, 3.2, 0]}>
        <mesh>
          <torusGeometry args={[6.4, 0.1, 8, 48]} />
          <meshBasicMaterial color="#F4B942" transparent opacity={0.55} />
        </mesh>
      </group>
    </group>
  );
}

// ── Building 5: Industrial Facility ──
function IndustrialFacility({ position, scale = [1, 1, 1] }: { position: [number, number, number]; scale?: [number, number, number] }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[14, 0.6, 10]} />
        <meshStandardMaterial color="#071A2F" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Left utility stack */}
      <group position={[-3.8, 4.0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.7, 2.3, 7.0, 16]} />
          <meshStandardMaterial color="#071A2F" roughness={0.6} metalness={0.9} />
        </mesh>
        <mesh position={[0, 3.55, 0]}>
          <cylinderGeometry args={[1.72, 1.72, 0.2, 16]} />
          <meshBasicMaterial color="#F4B942" />
        </mesh>
      </group>

      {/* Right utility stack */}
      <group position={[3.8, 3.0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.9, 2.5, 5.0, 16]} />
          <meshStandardMaterial color="#071A2F" roughness={0.6} metalness={0.9} />
        </mesh>
        <mesh position={[0, 2.55, 0]}>
          <cylinderGeometry args={[1.92, 1.92, 0.2, 16]} />
          <meshBasicMaterial color="#F4B942" />
        </mesh>
      </group>

      {/* Connecting pipes */}
      <group position={[0, 4.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 8.0, 12]} />
          <meshStandardMaterial color="#0E5AA7" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.8, 0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 8.0, 8]} />
          <meshStandardMaterial color="#F4B942" emissive="#F4B942" emissiveIntensity={0.8} />
        </mesh>
      </group>

      <group position={[0, 5.2, -3.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.45, 0.65, 10.0, 8]} />
          <meshStandardMaterial color="#071A2F" metalness={0.9} />
        </mesh>
        <mesh position={[0, 5.15, 0]}>
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshBasicMaterial color="#F4B942" />
        </mesh>
        <pointLight position={[0, 5.2, 0]} intensity={1.8} color="#F4B942" distance={10} />
      </group>
    </group>
  );
}

// ── Building 6: Stepped Skyscraper Landmark ──
function CyberTower({ position, stepCount = 5, stepHeight = 7, color = '#071A2F', emissive = '#22D3EE' }: { position: [number, number, number]; stepCount?: number; stepHeight?: number; color?: string; emissive?: string }) {
  const beaconRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y = state.clock.getElapsedTime() * 0.85;
    }
  });

  const steps = useMemo(() => {
    const list = [];
    const baseW = 12;
    const baseD = 12;
    for (let i = 0; i < stepCount; i++) {
      const shrinkFactor = 1 - (i / stepCount) * 0.55;
      const w = baseW * shrinkFactor;
      const d = baseD * shrinkFactor;
      const y = i * stepHeight + stepHeight / 2;
      list.push({ w, d, y, key: i });
    }
    return list;
  }, [stepCount, stepHeight]);

  const totalH = stepCount * stepHeight;

  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[16, 0.8, 16]} />
        <meshStandardMaterial color="#071A2F" roughness={0.9} metalness={0.5} />
      </mesh>

      {steps.map((s) => (
        <group key={s.key} position={[0, s.y, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[s.w, stepHeight - 0.2, s.d]} />
            <meshStandardMaterial color={color} roughness={0.25} metalness={0.9} />
          </mesh>
          
          {/* Glass structural glow panel grids */}
          {[-s.w / 2 - 0.05, s.w / 2 + 0.05].map((xOffset, sideIdx) => (
            <mesh key={`win_x_${sideIdx}`} position={[xOffset, 0, 0]}>
              <boxGeometry args={[0.02, stepHeight - 1.2, s.d - 1.5]} />
              <meshBasicMaterial color={emissive} transparent opacity={0.35} />
            </mesh>
          ))}
          {[-s.d / 2 - 0.05, s.d / 2 + 0.05].map((zOffset, sideIdx) => (
            <mesh key={`win_z_${sideIdx}`} position={[0, 0, zOffset]}>
              <boxGeometry args={[s.w - 1.5, stepHeight - 1.2, 0.02]} />
              <meshBasicMaterial color={emissive} transparent opacity={0.35} />
            </mesh>
          ))}

          <mesh position={[0, stepHeight / 2 - 0.1, 0]}>
            <boxGeometry args={[s.w + 0.12, 0.15, s.d + 0.12]} />
            <meshBasicMaterial color={emissive} />
          </mesh>
        </group>
      ))}

      {/* Sweeping rooftop beacon searchlight */}
      <group position={[0, totalH + 1.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.95, 1.4, 2.4, 8]} />
          <meshStandardMaterial color="#071A2F" metalness={0.9} />
        </mesh>
        
        <mesh ref={beaconRef} position={[0, 1.6, 0]}>
          <boxGeometry args={[1.7, 0.5, 1.7]} />
          <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={3.0} />
        </mesh>
        
        <pointLight position={[0, 2, 0]} intensity={4.0} color={emissive} distance={55} />
      </group>
    </group>
  );
}

// ── Distant Skyline Block ──
function DistantSkylineTower({ position, height = 35, width = 12 }: { position: [number, number, number]; height?: number; width?: number }) {
  return (
    <mesh position={[position[0], height / 2 - 2.0, position[2]]}>
      <boxGeometry args={[width, height, width]} />
      <meshStandardMaterial color="#050a14" roughness={0.95} metalness={0.2} />
      <mesh position={[0, height / 3, 0]}>
        <boxGeometry args={[width + 0.1, 1.2, width + 0.1]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, -height / 4, 0]}>
        <boxGeometry args={[width + 0.1, 1.2, width + 0.1]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.2} />
      </mesh>
    </mesh>
  );
}

// ── Streetlight ──
function StreetLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.8, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.15, 5.6, 8]} />
        <meshStandardMaterial color="#071A2F" roughness={0.4} metalness={0.9} />
      </mesh>

      <mesh position={[0.7, 5.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.4, 8]} />
        <meshStandardMaterial color="#071A2F" roughness={0.4} />
      </mesh>

      <mesh position={[1.4, 5.4, 0]}>
        <boxGeometry args={[0.55, 0.22, 0.35]} />
        <meshStandardMaterial color="#071A2F" />
      </mesh>
      <mesh position={[1.4, 5.26, 0]}>
        <boxGeometry args={[0.45, 0.04, 0.25]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <spotLight
        position={[1.4, 5.1, 0]}
        angle={0.6}
        penumbra={0.6}
        intensity={2.8}
        color="#cffafe"
        distance={20}
      />
    </group>
  );
}

// ── Floating Regional Map Pin ──
function FloatingMapPin({
  position,
  label,
  icon: Icon,
  color = 'bg-cyan-600',
  borderColor = 'border-cyan-400',
}: {
  position: [number, number, number];
  label: string;
  icon: any;
  color?: string;
  borderColor?: string;
}) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[0, 1.5, 32]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.2} />
      </mesh>
      
      <mesh position={[0, 3.0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 6, 8, 1, true]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.15} />
      </mesh>

      <Float speed={2.5} rotationIntensity={0} floatIntensity={0.6} floatingRange={[0, 0.3]}>
        <Html position={[0, 2.8, 0]} center distanceFactor={22} zIndexRange={[0, 10]}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.5)] select-none text-white whitespace-nowrap">
            <div className={`p-1 rounded-full ${color} ${borderColor} border text-white`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-wider">{label}</span>
          </div>
        </Html>
      </Float>
    </group>
  );
}

// ── SkyGrid Horizon Dome ──
function SkyGrid() {
  return (
    <mesh position={[0, 0, -120]} rotation={[Math.PI / 2, 0, 0]}>
      <sphereGeometry args={[260, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial color="#0e7490" transparent opacity={0.03} wireframe />
    </mesh>
  );
}

// ── Floating Ambient Particle Field ──
function FloatingParticleField() {
  const count = 350;
  const particlesRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorChoices = [
      new THREE.Color('#22D3EE'), // Cyan
      new THREE.Color('#F4B942'), // Gold
      new THREE.Color('#0E5AA7'), // Ocean Blue
      new THREE.Color('#14B8A6'), // Teal
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 250;
      pos[i * 3 + 1] = Math.random() * 65 + 1;
      pos[i * 3 + 2] = -Math.random() * 300;

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── MAIN ENVIRONMENT SCENE ──
export function WorldEnvironment() {
  const playerZ = useGameStore((state) => state.playerPosition[2]);
  
  // Detailed landscape terrain with valleys, mountain ridges, and river channels
  const terrainGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(380, 480, 100, 100);
    const pos = geo.attributes.position;
    const colors = [];

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const worldZ = -y;
      const distFromCenter = Math.abs(x);

      let zVal = 0;
      let terrainType = 'valley'; // valley, hill, mountain, riverbed

      const river1Dist = Math.abs(worldZ - (-62));
      const river2Dist = Math.abs(worldZ - (-147));

      // Height Profile Calculation
      if (distFromCenter > 18) {
        const elevationFactor = (distFromCenter - 18) * 0.45;
        zVal = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 3.0 + Math.sin(y * 0.03) * 5.0 + elevationFactor;
        terrainType = zVal > 15 ? 'mountain' : 'hill';
      } else {
        zVal = Math.sin(x * 0.25) * Math.cos(y * 0.25) * 0.12;
        terrainType = 'valley';
      }

      // Carve Rivers
      if (river1Dist < 12) {
        const factor = (12 - river1Dist) / 12;
        zVal -= factor * 4.5;
        if (zVal < -3) zVal = -3;
        terrainType = 'riverbed';
      }
      if (river2Dist < 14) {
        const factor = (14 - river2Dist) / 14;
        zVal -= factor * 5.0;
        if (zVal < -4) zVal = -4;
        terrainType = 'riverbed';
      }

      pos.setZ(i, zVal);

      // Procedural Styling Color Interpolation
      const color = new THREE.Color();
      if (terrainType === 'riverbed') {
        color.setHSL(0.58, 0.7, 0.1); // Cool river channels
      } else if (terrainType === 'valley') {
        if (distFromCenter < 12.5) {
          color.setHSL(0.6, 0.35, 0.06); // Dark road foundations
        } else {
          color.setHSL(0.55, 0.4, 0.1); // Rich navy precinct fields
        }
      } else if (terrainType === 'hill') {
        color.setHSL(0.48, 0.5, 0.12); // Neon teal biome slopes
      } else {
        color.setHSL(0.6, 0.2, 0.22); // Deep slate-colored mountain peaks
      }

      // Fine-grained texture noise
      const noise = (Math.sin(x * 0.5) * Math.cos(y * 0.5) + 1.0) * 0.015;
      color.r += noise;
      color.g += noise;
      color.b += noise;

      colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  const rockPlacements = useMemo<Array<{ pos: [number, number, number]; scale: [number, number, number]; rot: [number, number, number] }>>(() => {
    return [
      { pos: [-16, 0.1, -66], scale: [1.2, 0.8, 1.2], rot: [0.2, 0.5, 0.1] },
      { pos: [-24, 0.3, -58], scale: [1.8, 1.4, 1.5], rot: [-0.4, 1.1, 0.2] },
      { pos: [15, 0.1, -56], scale: [0.9, 0.9, 1.1], rot: [0.5, 0.1, 0.4] },
      { pos: [22, 0.4, -68], scale: [1.6, 1.5, 1.4], rot: [0.1, -0.9, 0.3] },
      
      { pos: [-15, 0.1, -152], scale: [1.1, 0.9, 1.2], rot: [0.3, 0.2, 0.1] },
      { pos: [-22, 0.5, -142], scale: [1.9, 1.6, 1.7], rot: [-0.2, 0.8, 0.4] },
      { pos: [16, 0.1, -144], scale: [1.0, 0.8, 1.1], rot: [0.4, -0.4, 0.2] },
      { pos: [25, 0.4, -154], scale: [1.7, 1.5, 1.6], rot: [0.2, -1.2, 0.3] },

      { pos: [-13.5, 0.2, -108], scale: [1.2, 2.0, 1.5], rot: [0.1, 0.2, 0.3] },
      { pos: [13.5, 0.2, -94], scale: [1.3, 1.8, 1.4], rot: [-0.2, 0.5, -0.1] },
    ];
  }, []);

  return (
    <group>
      {/* ── Moving Vehicles ── */}
      <MovingVehicle startZ={12} endZ={-40} speed={1.2} laneX={4} color="#22D3EE" />
      <MovingVehicle startZ={12} endZ={-40} speed={1.8} laneX={-4} color="#F4B942" />
      <MovingVehicle startZ={-85} endZ={-118} speed={1.4} laneX={3} color="#0E5AA7" />
      <MovingVehicle startZ={-85} endZ={-118} speed={2.0} laneX={-3} color="#22D3EE" />
      <MovingVehicle startZ={-175} endZ={-250} speed={1.0} laneX={5} color="#F4B942" />
      <MovingVehicle startZ={-175} endZ={-250} speed={1.5} laneX={-5} color="#22D3EE" />

      {/* ── Shelter Stops ── */}
      <FuturisticBusStop position={[-15, 0, -15]} rotationY={Math.PI / 2} />
      <FuturisticBusStop position={[15, 0, -100]} rotationY={-Math.PI / 2} />
      <FuturisticBusStop position={[-16, 0, -210]} rotationY={Math.PI / 2} />

      {/* ── 1. FOG & ATMOSPHERICS ── */}
      <color attach="background" args={['#020813']} />
      <fog attach="fog" args={['#020813', 60, 240]} />

      <SkyGrid />
      <FloatingParticleField />

      {/* ── 2. STAGE LIGHTING ── */}
      <ambientLight intensity={1.35} color="#D2E8FF" />
      <directionalLight
        position={[40, 75, 45]}
        intensity={2.2}
        color="#93C5FD"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={400}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-bias={-0.0002}
      />

      {/* Regional underglow lights */}
      <pointLight position={[0, 15, -20]} intensity={3.0} color="#22D3EE" distance={70} />
      <pointLight position={[0, 18, -100]} intensity={3.5} color="#F4B942" distance={75} />
      <pointLight position={[0, 16, -170]} intensity={3.5} color="#0E5AA7" distance={75} />
      <pointLight position={[0, 22, -235]} intensity={4.0} color="#22D3EE" distance={80} />

      {/* ── 3. TERRAIN HEIGHT MATRIX ── */}
      <mesh geometry={terrainGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.8} metalness={0.2} flatShading />
      </mesh>

      {/* ── 4. MOUNTAINS (Faceted Peaks) ── */}
      {/* Left side mountains */}
      <CyberMountain position={[-42, 0, -28]} scale={[1.4, 1.25, 1.4]} color="#071A2F" emissive="#22D3EE" />
      <CyberMountain position={[-46, 0, -88]} scale={[1.7, 1.6, 1.7]} color="#071A2F" emissive="#F4B942" />
      <CyberMountain position={[-48, 0, -155]} scale={[1.9, 1.7, 1.9]} color="#071A2F" emissive="#0E5AA7" />
      <CyberMountain position={[-40, 0, -215]} scale={[1.6, 1.4, 1.6]} color="#071A2F" emissive="#22D3EE" />

      {/* Right side mountains */}
      <CyberMountain position={[42, 0, -32]} scale={[1.35, 1.15, 1.35]} color="#071A2F" emissive="#22D3EE" />
      <CyberMountain position={[48, 0, -98]} scale={[1.8, 1.65, 1.8]} color="#071A2F" emissive="#F4B942" />
      <CyberMountain position={[45, 0, -170]} scale={[1.6, 1.5, 1.6]} color="#071A2F" emissive="#0E5AA7" />
      <CyberMountain position={[38, 0, -230]} scale={[1.4, 1.3, 1.4]} color="#071A2F" emissive="#22D3EE" />

      {/* ── 5. ROCKS ── */}
      {rockPlacements.map((r, idx) => (
        <CyberRock key={idx} position={r.pos} scale={r.scale} rotation={r.rot} />
      ))}

      {/* ── 6. ENERGY RIVERS ── */}
      <EnergyRiver position={[0, 0.01, -62]} width={180} length={10} color="#22D3EE" />
      <EnergyRiver position={[0, 0.01, -147]} width={180} length={12} color="#0E5AA7" />

      {/* ── 7. ROADS & PATHS WITH MATRIX GRIDS ── */}
      {/* Highway 1 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -14]} receiveShadow>
        <planeGeometry args={[24, 52]} />
        <meshStandardMaterial color="#08182B" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -14]}>
        <planeGeometry args={[23.8, 51.8]} />
        <meshStandardMaterial color="#22D3EE" transparent opacity={0.1} wireframe />
      </mesh>
      <mesh position={[-12.4, 0.2, -14]} receiveShadow castShadow>
        <boxGeometry args={[0.8, 0.35, 52]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[12.4, 0.2, -14]} receiveShadow castShadow>
        <boxGeometry args={[0.8, 0.35, 52]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.8} roughness={0.4} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`dash1_${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 8 - i * 9]}>
          <planeGeometry args={[0.3, 4.0]} />
          <meshBasicMaterial color="#22D3EE" />
        </mesh>
      ))}

      {/* Highway 2 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -101.5]} receiveShadow>
        <planeGeometry args={[24, 33]} />
        <meshStandardMaterial color="#08182B" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -101.5]}>
        <planeGeometry args={[23.8, 32.8]} />
        <meshStandardMaterial color="#F4B942" transparent opacity={0.08} wireframe />
      </mesh>
      <mesh position={[-12.4, 0.2, -101.5]} receiveShadow castShadow>
        <boxGeometry args={[0.8, 0.35, 33]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[12.4, 0.2, -101.5]} receiveShadow castShadow>
        <boxGeometry args={[0.8, 0.35, 33]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.8} roughness={0.4} />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`dash2_${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, -88 - i * 8]}>
          <planeGeometry args={[0.3, 3.5]} />
          <meshBasicMaterial color="#F4B942" />
        </mesh>
      ))}

      {/* Highway 3 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -212.5]} receiveShadow>
        <planeGeometry args={[28, 75]} />
        <meshStandardMaterial color="#08182B" roughness={0.35} metalness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, -212.5]}>
        <planeGeometry args={[27.8, 74.8]} />
        <meshStandardMaterial color="#22D3EE" transparent opacity={0.08} wireframe />
      </mesh>
      <mesh position={[-14.4, 0.2, -212.5]} receiveShadow castShadow>
        <boxGeometry args={[0.8, 0.35, 75]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[14.4, 0.2, -212.5]} receiveShadow castShadow>
        <boxGeometry args={[0.8, 0.35, 75]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.8} roughness={0.4} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={`dash3_${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, -178 - i * 8]}>
          <planeGeometry args={[0.3, 3.5]} />
          <meshBasicMaterial color="#22D3EE" />
        </mesh>
      ))}

      <StreetLight position={[-11.5, 0, 0]} />
      <StreetLight position={[11.5, 0, -20]} />
      <StreetLight position={[-11.5, 0, -90]} />
      <StreetLight position={[11.5, 0, -112]} />
      <StreetLight position={[-13.5, 0, -190]} />
      <StreetLight position={[13.5, 0, -220]} />

      {/* ── 8. DISTRICT LANDMARKS & BUILDINGS ── */}
      {/* DISTRICT 1 */}
      <CyberLab position={[-25, 0, -15]} scale={[1.1, 1.0, 1.1]} />
      <CyberTower position={[26, 0, -18]} stepCount={5} stepHeight={6.5} color="#071A2F" emissive="#22D3EE" />
      <AIResearchCenter position={[-26, 0, -32]} scale={[0.9, 0.9, 0.9]} />

      {/* DISTRICT 2 */}
      <NetworkCenter position={[26, 0, -92]} scale={[0.95, 0.95, 0.95]} />
      <IndustrialFacility position={[-26, 0, -100]} scale={[0.95, 1.0, 0.95]} />
      <CyberLab position={[25, 0, -112]} scale={[0.95, 0.95, 0.95]} />

      {/* DISTRICT 3 */}
      <DatabaseVault position={[-26, 0, -195]} scale={[0.95, 1.0, 0.95]} />
      <AIResearchCenter position={[27, 0, -205]} scale={[1.05, 1.05, 1.05]} />
      <CyberTower position={[-27, 0, -230]} stepCount={6} stepHeight={6.0} color="#071A2F" emissive="#0E5AA7" />
      <NetworkCenter position={[26, 0, -232]} scale={[1.0, 1.0, 1.0]} />

      {/* ── 9. PROCEDURAL VEGETATION ── */}
      <CyberTree position={[-18, 0, 4]} color="#14B8A6" scale={1.1} />
      <CyberTree position={[-22, 0, -4]} color="#22D3EE" scale={0.9} />
      <CyberTree position={[-19, 0, -26]} color="#0E5AA7" scale={1.0} />
      <CyberTree position={[-23, 0, -22]} color="#14B8A6" scale={0.8} />

      <CyberTree position={[18, 0, 6]} color="#22D3EE" scale={1.0} />
      <CyberTree position={[22, 0, -6]} color="#14B8A6" scale={1.2} />
      <CyberTree position={[20, 0, -28]} color="#0E5AA7" scale={0.9} />
      <CyberTree position={[23, 0, -25]} color="#22D3EE" scale={1.1} />

      <CyberTree position={[-19, 0, -86]} color="#0E5AA7" scale={1.0} />
      <CyberTree position={[-22, 0, -90]} color="#14B8A6" scale={0.8} />
      <CyberTree position={[-18, 0, -112]} color="#22D3EE" scale={1.1} />
      <CyberTree position={[19, 0, -102]} color="#0E5AA7" scale={1.1} />
      <CyberTree position={[22, 0, -106]} color="#22D3EE" scale={0.9} />

      <CyberTree position={[-20, 0, -188]} color="#22D3EE" scale={1.1} />
      <CyberTree position={[-23, 0, -184]} color="#0E5AA7" scale={0.9} />
      <CyberTree position={[20, 0, -192]} color="#22D3EE" scale={1.0} />
      <CyberTree position={[22, 0, -186]} color="#14B8A6" scale={1.2} />

      <EnergyCrystal position={[-15, 0.2, -12]} color="#14B8A6" />
      <EnergyCrystal position={[15, 0.2, -10]} color="#22D3EE" />
      <EnergyCrystal position={[17, 0.2, -96]} color="#0E5AA7" />
      <EnergyCrystal position={[-16, 0.2, -200]} color="#22D3EE" />
      <EnergyCrystal position={[16, 0.2, -218]} color="#22D3EE" />

      {/* ── 10. BACKGROUND LANDSCAPE SKYLINE ── */}
      <DistantSkylineTower position={[-110, 60, -295]} height={80} width={18} />
      <DistantSkylineTower position={[-85, 48, -290]} height={60} width={14} />
      <DistantSkylineTower position={[-55, 70, -288]} height={90} width={20} />
      <DistantSkylineTower position={[55, 68, -288]} height={85} width={20} />
      <DistantSkylineTower position={[85, 46, -290]} height={55} width={14} />
      <DistantSkylineTower position={[110, 75, -295]} height={100} width={18} />

      <DistantSkylineTower position={[-75, 44, -50]} height={55} width={15} />
      <DistantSkylineTower position={[-75, 52, -120]} height={65} width={16} />
      <DistantSkylineTower position={[-75, 50, -200]} height={62} width={15} />
      <DistantSkylineTower position={[75, 46, -50]} height={58} width={15} />
      <DistantSkylineTower position={[75, 55, -120]} height={70} width={16} />
      <DistantSkylineTower position={[75, 48, -200]} height={58} width={15} />

      {/* ── 11. WORLD TELEMETRY MAP PINS ── */}
      <FloatingMapPin position={[0, 0.2, -40]} label="CP 1: LINK CORE" icon={Terminal} color="bg-cyan-600" borderColor="border-cyan-400" />
      <FloatingMapPin position={[0, 0.2, -45]} label="SHORTCUT VECTOR" icon={Zap} color="bg-cyan-700" borderColor="border-cyan-300" />
      <FloatingMapPin position={[14, 0.2, -44]} label="DETOUR VECTOR" icon={AlertTriangle} color="bg-amber-600" borderColor="border-amber-400" />

      <FloatingMapPin position={[0, 0.2, -120]} label="CP 2: INTEGRATION CORE" icon={Shield} color="bg-cyan-600" borderColor="border-cyan-400" />
      <FloatingMapPin position={[0, 0.2, -125]} label="SHORTCUT VECTOR" icon={Zap} color="bg-cyan-700" borderColor="border-cyan-300" />
      <FloatingMapPin position={[-14, 0.2, -124]} label="DETOUR VECTOR" icon={AlertTriangle} color="bg-amber-600" borderColor="border-amber-400" />

      <FloatingMapPin position={[0, 0.2, -180]} label="CP 3: CENTRAL DATA" icon={Compass} color="bg-[#0E5AA7]" borderColor="border-cyan-400" />
      <FloatingMapPin position={[0, 0.2, -240]} label="ESCAPE PORTAL" icon={Award} color="bg-amber-500" borderColor="border-amber-300" />

      {/* ── 12. LEVEL ARCHWAY ── */}
      <group position={[0, 0, 6]}>
        <mesh position={[-12.2, 6.2, 0]} castShadow>
          <boxGeometry args={[1.5, 12.4, 1.5]} />
          <meshStandardMaterial color="#0E5AA7" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[12.2, 6.2, 0]} castShadow>
          <boxGeometry args={[1.5, 12.4, 1.5]} />
          <meshStandardMaterial color="#0E5AA7" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 12.5, 0]} castShadow>
          <boxGeometry args={[25.9, 1.6, 1.6]} />
          <meshStandardMaterial color="#071A2F" metalness={0.8} />
        </mesh>
        <mesh position={[0, 10.4, 0]}>
          <planeGeometry args={[11, 2.0]} />
          <meshBasicMaterial color="#22D3EE" />
        </mesh>
        {playerZ > -5.0 && (
          <Html position={[0, 10.4, 0.06]} center distanceFactor={22} zIndexRange={[0, 10]}>
            <div className="flex flex-col items-center select-none text-white whitespace-nowrap">
              <span className="text-[14px] font-mono font-black tracking-widest text-black">CYBER ESCAPE</span>
              <span className="text-[7px] font-mono font-bold text-cyan-950 uppercase tracking-wider">ROUND 3 // QUANTUM INTERLINK</span>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
