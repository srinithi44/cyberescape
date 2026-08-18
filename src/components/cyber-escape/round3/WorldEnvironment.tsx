'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Html } from '@react-three/drei';
import { Shield, Zap, Terminal, Award, AlertTriangle, Compass, Cpu, Database, Server, Radio, Cog, Lightbulb } from 'lucide-react';

// ── Low-Poly Cyber Mountain ──
// Overhauled to be a layered, jagged mountain peak with metal structures, glowing conduits, and secondary cliffs
function CyberMountain({
  position,
  scale = [1, 1, 1],
  color = '#071A2F',
  emissive = '#22D3EE',
}: {
  position: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  emissive?: string;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Primary Jagged Peak */}
      <mesh receiveShadow castShadow>
        <coneGeometry args={[12, 22, 5]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.3} flatShading />
      </mesh>
      
      {/* Secondary Peak */}
      <mesh position={[-4, -2, 4]} scale={[0.65, 0.75, 0.65]} receiveShadow castShadow>
        <coneGeometry args={[10, 18, 5]} />
        <meshStandardMaterial color={color} roughness={0.85} flatShading />
      </mesh>
      
      {/* Tech energy crystal floating at the peak */}
      <group position={[0, 11.5, 0]}>
        <Float speed={3} rotationIntensity={1.5} floatIntensity={1.0}>
          <mesh castShadow>
            <octahedronGeometry args={[1.8, 0]} />
            <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={2.2} metalness={0.9} roughness={0.1} />
          </mesh>
        </Float>
      </group>

      {/* Glowing tech veins climbing up the mountain sides */}
      {Array.from({ length: 5 }).map((_, idx) => {
        const angle = (idx / 5) * Math.PI * 2;
        const radius = 5.8;
        return (
          <mesh
            key={idx}
            position={[Math.sin(angle) * radius, 2, Math.cos(angle) * radius]}
            rotation={[0.3, angle, 0]}
          >
            <cylinderGeometry args={[0.08, 0.15, 14, 4]} />
            <meshBasicMaterial color={emissive} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Bioluminescent Cyber Tree ──
// Redesigned with organic variations, floating seeds, and glowing polygonal nodes
function CyberTree({ position, color = '#14B8A6', scale = 1 }: { position: [number, number, number]; color?: string; scale?: number }) {
  const rotationOffset = useMemo(() => Math.random() * Math.PI, []);
  const heightScale = useMemo(() => 0.8 + Math.random() * 0.4, []);
  
  return (
    <group position={position} scale={[scale, scale * heightScale, scale]} rotation={[0, rotationOffset, 0]}>
      {/* Curved organic carbon-fiber trunk */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.28, 2.8, 8]} />
        <meshStandardMaterial color="#071A2F" roughness={0.6} metalness={0.9} />
      </mesh>
      {/* Main glowing dodecahedron foliage */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <dodecahedronGeometry args={[1.6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} transparent opacity={0.9} roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Side small glowing foliage clumps */}
      <mesh position={[0.8, 2.6, 0.5]} scale={0.6} castShadow>
        <dodecahedronGeometry args={[1.3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.7, 3.0, -0.6]} scale={0.5} castShadow>
        <dodecahedronGeometry args={[1.3]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.4} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

// ── Cyber Rock ──
// Detailed low-poly stone formations with metal plating or warning nodes
function CyberRock({ position, scale = [1, 1, 1], rotation = [0, 0, 0] }: { position: [number, number, number]; scale?: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* The core rock body */}
      <mesh castShadow receiveShadow>
        <dodecahedronGeometry args={[2.0, 1]} />
        <meshStandardMaterial color="#071A2F" roughness={0.9} metalness={0.2} flatShading />
      </mesh>
      {/* Metal accent plate bolted onto the rock */}
      <mesh position={[0.2, 0.4, 1.2]} rotation={[0.4, 0.2, 0.1]} castShadow>
        <boxGeometry args={[1.5, 0.8, 0.2]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Small glowing power node */}
      <mesh position={[0.5, 0.8, 1.25]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#F4B942" />
      </mesh>
    </group>
  );
}

// ── Glowing Energy Crystals ──
// Redesigned with secondary floating rings, pulsing light, and high-frequency refraction
function EnergyCrystal({ position, color = '#22D3EE' }: { position: [number, number, number]; color?: string }) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (crystalRef.current) {
      crystalRef.current.rotation.y = time * 1.8;
      crystalRef.current.position.y = 1.2 + Math.sin(time * 2.5) * 0.18;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.9;
      ringRef.current.rotation.y = time * 0.45;
    }
  });

  return (
    <group position={position}>
      {/* Heavy base frame */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.4, 0.6, 6]} />
        <meshStandardMaterial color="#071A2F" roughness={0.7} metalness={0.9} />
      </mesh>
      {/* Double stacked base collars */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.5} />
      </mesh>

      {/* Floating Refractive Octahedral Crystal */}
      <mesh ref={crystalRef} position={[0, 1.2, 0]} castShadow>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} roughness={0.05} metalness={0.95} />
      </mesh>

      {/* Floating Orbital Ring */}
      <group ref={ringRef} position={[0, 1.2, 0]}>
        <mesh>
          <torusGeometry args={[1.5, 0.06, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      </group>

      <pointLight position={[0, 1.2, 0]} intensity={2.5} color={color} distance={9} />
    </group>
  );
}

// ── Animated Energy River ──
// Overhauled with glowing flow normal layers, particle bubbles, and shoreline rock clusters
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
      {/* Carved concrete river containment canal */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[width, 1.2, length + 2]} />
        <meshStandardMaterial color="#071A2F" roughness={0.9} metalness={0.4} />
      </mesh>

      {/* Deep coolant fluid base layer */}
      <mesh position={[0, -0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Animated glowing plasma wave grids */}
      <mesh ref={riverRef1} position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 10, length - 0.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} wireframe />
      </mesh>
      <mesh ref={riverRef2} position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width + 10, length - 2.5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} wireframe />
      </mesh>

      {/* Localized point lights simulating glowing fluid */}
      {[-40, 0, 40].map((offsetX, idx) => (
        <pointLight key={idx} position={[offsetX, 0.4, 0]} intensity={2.8} color={color} distance={30} />
      ))}
    </group>
  );
}

// ── Building 1: Cyber Lab ──
// Overhauled: Multi-tier console base, rotating core core reactor, glass pillars, glowing display panels
function CyberLab({ position, scale = [1, 1, 1] }: { position: [number, number, number]; scale?: [number, number, number] }) {
  const reactorRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (reactorRef.current) {
      reactorRef.current.rotation.y = state.clock.getElapsedTime() * 1.8;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* 3D concrete foundation step */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[11, 1.0, 11]} />
        <meshStandardMaterial color="#071A2F" roughness={0.8} metalness={0.4} />
      </mesh>
      
      {/* Stepped secondary tech pedestal */}
      <mesh position={[0, 1.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[9.5, 0.8, 9.5]} />
        <meshStandardMaterial color="#071A2F" roughness={0.6} metalness={0.85} />
      </mesh>

      {/* Main glass frame laboratory block */}
      <mesh position={[0, 5.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[8.0, 6.4, 8.0]} />
        <meshStandardMaterial color="#0E5AA7" roughness={0.1} metalness={0.95} transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Core vertical structural columns */}
      {[-4.1, 4.1].map((x, i) =>
        [-4.1, 4.1].map((z, j) => (
          <mesh key={`${i}_${j}`} position={[x, 5.0, z]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 6.4, 8]} />
            <meshStandardMaterial color="#071A2F" metalness={0.9} roughness={0.1} />
          </mesh>
        ))
      )}

      {/* Glowing Inner Quantum Core Reactor */}
      <mesh ref={reactorRef} position={[0, 4.2, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 4.2, 8]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.7} wireframe />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Roof mechanical decks, exhaust pipes, and antenna spires */}
      <mesh position={[0, 8.5, 0]} castShadow>
        <boxGeometry args={[7.2, 0.6, 7.2]} />
        <meshStandardMaterial color="#071A2F" metalness={0.85} roughness={0.4} />
      </mesh>
      
      {/* Exhaust Pipes */}
      <group position={[-2.2, 9.2, -2.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 1.4, 8]} />
          <meshStandardMaterial color="#071A2F" metalness={0.9} />
        </mesh>
        {/* Steam outlet */}
        <mesh position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Comms tower node */}
      <mesh position={[2.2, 9.6, 2.2]} castShadow>
        <cylinderGeometry args={[0.06, 0.12, 2.6, 8]} />
        <meshStandardMaterial color="#071A2F" metalness={0.9} />
      </mesh>
      <mesh position={[2.2, 10.9, 2.2]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial color="#22D3EE" />
      </mesh>

      {/* Floating Holographic district label */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
        <Html position={[0, 12, 0]} center distanceFactor={28}>
          <div className="flex flex-col items-center gap-1 px-3 py-1 rounded bg-black/95 border border-cyan-500/60 shadow-[0_0_15px_rgba(34,211,238,0.7)] text-[8px] font-mono font-bold tracking-widest text-[#22D3EE] uppercase whitespace-nowrap">
            <span>LAB_NODE_01</span>
            <span className="text-[6px] text-cyan-500/70 border-t border-cyan-500/20 pt-0.5">STATUS: RUNNING</span>
          </div>
        </Html>
      </Float>
    </group>
  );
}

// ── Building 2: Network Center ──
// Overhauled: Multi-tier hexagonal concrete pad, truss tower structure, rotating radar array, beacon
function NetworkCenter({ position, scale = [1, 1, 1] }: { position: [number, number, number]; scale?: [number, number, number] }) {
  const radarRef = useRef<THREE.Group>(null);
  const coreBeaconRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (radarRef.current) {
      radarRef.current.rotation.y = time * 0.65;
    }
    if (coreBeaconRef.current) {
      coreBeaconRef.current.scale.setScalar(1.0 + Math.sin(time * 4) * 0.15);
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Hexagonal Step Base */}
      <mesh position={[0, 0.6, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[5, 6, 1.2, 6]} />
        <meshStandardMaterial color="#071A2F" roughness={0.8} metalness={0.5} />
      </mesh>
      {/* Tech Collar */}
      <mesh position={[0, 1.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.2, 4.6, 0.4, 6]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* High-tech lattice tower spire */}
      <mesh position={[0, 7.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 1.8, 12, 4, 6, true]} />
        <meshStandardMaterial color="#071A2F" roughness={0.3} metalness={0.95} wireframe />
      </mesh>
      {/* Central power conduits running down */}
      <mesh position={[0, 7.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 12.0, 8]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.8} />
      </mesh>

      {/* Mid-tower platforms and rotating radars */}
      <group position={[0, 10.5, 0]} ref={radarRef}>
        <mesh castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.3, 6]} />
          <meshStandardMaterial color="#071A2F" metalness={0.9} />
        </mesh>
        
        {/* Curved Satellite Dish */}
        <group position={[0, 0.8, 1.4]} rotation={[0.4, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.5, 0.3, 0.6, 16, 1, true]} />
            <meshStandardMaterial color="#0E5AA7" roughness={0.2} metalness={0.9} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#22D3EE" />
          </mesh>
        </group>
      </group>

      {/* Spire top and flashing communications beacon */}
      <mesh position={[0, 14.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.3, 3.2, 8]} />
        <meshStandardMaterial color="#071A2F" metalness={0.9} />
      </mesh>
      
      <mesh ref={coreBeaconRef} position={[0, 16.3, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#22D3EE" />
      </mesh>
      <pointLight position={[0, 16.3, 0]} intensity={3.5} color="#22D3EE" distance={25} />
    </group>
  );
}

// ── Building 3: Database Vault ──
// Overhauled: Fortified armored shell, piping network, glowing server nodes visible, hazard flashing lights
function DatabaseVault({ position, scale = [1, 1, 1] }: { position: [number, number, number]; scale?: [number, number, number] }) {
  const neonPulseRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (neonPulseRef.current) {
      neonPulseRef.current.opacity = 0.5 + Math.sin(time * 6) * 0.4;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Heavy stepped vault base */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[13, 0.8, 13]} />
        <meshStandardMaterial color="#071A2F" roughness={0.9} metalness={0.4} />
      </mesh>

      {/* Main armored block */}
      <mesh position={[0, 4.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[11, 6.4, 11]} />
        <meshStandardMaterial color="#071A2F" roughness={0.45} metalness={0.85} />
      </mesh>

      {/* Slanted armor panels on the sides */}
      {[-5.6, 5.6].map((x, idx) => (
        <mesh key={idx} position={[x, 3.6, 0]} rotation={[0, 0, x > 0 ? 0.15 : -0.15]} castShadow>
          <boxGeometry args={[0.4, 5.8, 9]} />
          <meshStandardMaterial color="#0E5AA7" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}

      {/* Glowing Neon warning stripes (Gold instead of Red) */}
      <mesh position={[0, 6.4, 0]}>
        <boxGeometry args={[11.2, 0.3, 11.2]} />
        <meshBasicMaterial ref={neonPulseRef} color="#F4B942" transparent />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[11.2, 0.3, 11.2]} />
        <meshBasicMaterial color="#F4B942" />
      </mesh>

      {/* Vault entry port with decorative conduits */}
      <group position={[0, 2.0, 5.55]}>
        {/* Portal frame */}
        <mesh castShadow>
          <boxGeometry args={[4.2, 3.8, 0.4]} />
          <meshStandardMaterial color="#071A2F" metalness={0.9} />
        </mesh>
        {/* Vault door panel */}
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[3.4, 3.2]} />
          <meshStandardMaterial color="#0E5AA7" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Indicator lamp */}
        <mesh position={[0, 1.4, 0.25]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#F4B942" />
        </mesh>
        <pointLight position={[0, 1.4, 0.4]} intensity={2.0} color="#F4B942" distance={8} />
      </group>

      {/* Server Exhaust units with glowing heat cores */}
      {[-4, 0, 4].map((offsetX, idx) => (
        <group key={idx} position={[offsetX, 7.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.9, 0.9, 1.2, 12]} />
            <meshStandardMaterial color="#071A2F" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.8, 12]} />
            <meshBasicMaterial color="#F4B942" />
          </mesh>
        </group>
      ))}

      {/* Industrial side storage containers and pipes */}
      <group position={[-7.2, 2.5, -2.5]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[1.4, 1.4, 4.2, 12]} />
          <meshStandardMaterial color="#0E5AA7" roughness={0.4} metalness={0.9} />
        </mesh>
        {/* Pipe curve */}
        <mesh position={[0, 3.2, 1.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 3.6, 8]} />
          <meshStandardMaterial color="#071A2F" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// ── Building 4: AI Research Center ──
// Overhauled: Dome step base, rotating energy orbit rings, glowing core crystal, projection beams
// Uses gold and cyan energy elements
function AIResearchCenter({ position, scale = [1, 1, 1] }: { position: [number, number, number]; scale?: [number, number, number] }) {
  const innerRingRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = time * 1.5;
      innerRingRef.current.rotation.x = time * 0.8;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = -time * 0.9;
      outerRingRef.current.rotation.z = time * 0.55;
    }
    if (coreRef.current) {
      coreRef.current.position.y = 2.8 + Math.sin(time * 3) * 0.25;
      coreRef.current.rotation.y = time * 2.2;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Circular terraced steps */}
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[7.2, 8.0, 0.6, 32]} />
        <meshStandardMaterial color="#071A2F" roughness={0.7} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.8, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[6.0, 6.6, 0.4, 32]} />
        <meshStandardMaterial color="#0E5AA7" roughness={0.5} metalness={0.9} />
      </mesh>

      {/* Geodesic structural glass dome */}
      <mesh position={[0, 3.2, 0]} receiveShadow castShadow>
        <sphereGeometry args={[4.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#22D3EE" roughness={0.1} metalness={0.95} transparent opacity={0.6} wireframe />
      </mesh>

      {/* Floating internal crystal reactor */}
      <mesh ref={coreRef} position={[0, 2.8, 0]} castShadow>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2.5} roughness={0.1} metalness={0.9} />
      </mesh>
      <pointLight position={[0, 2.8, 0]} intensity={3.5} color="#22D3EE" distance={25} />

      {/* Concentric rotating orbital rings */}
      <group ref={innerRingRef} position={[0, 3.2, 0]}>
        <mesh>
          <torusGeometry args={[5.6, 0.1, 8, 48]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.8} />
        </mesh>
      </group>
      <group ref={outerRingRef} position={[0, 3.2, 0]}>
        <mesh>
          <torusGeometry args={[6.4, 0.12, 8, 48]} />
          <meshBasicMaterial color="#F4B942" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// ── Building 5: Industrial Facility ──
// Overhauled: Foundation pad, dual cooling towers, interlocking metal pipelines, exhaust vents
function IndustrialFacility({ position, scale = [1, 1, 1] }: { position: [number, number, number]; scale?: [number, number, number] }) {
  return (
    <group position={position} scale={scale}>
      {/* Heavy textured concrete pad */}
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[14, 0.6, 10]} />
        <meshStandardMaterial color="#071A2F" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Left cooling tower */}
      <group position={[-3.8, 4.0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 2.4, 7.0, 16]} />
          <meshStandardMaterial color="#071A2F" roughness={0.6} metalness={0.95} />
        </mesh>
        {/* Top rim warning stripe */}
        <mesh position={[0, 3.55, 0]}>
          <cylinderGeometry args={[1.82, 1.82, 0.2, 16]} />
          <meshBasicMaterial color="#F4B942" />
        </mesh>
      </group>

      {/* Right cooling tower (shorter, wider) */}
      <group position={[3.8, 3.0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[2.0, 2.6, 5.0, 16]} />
          <meshStandardMaterial color="#071A2F" roughness={0.6} metalness={0.95} />
        </mesh>
        <mesh position={[0, 2.55, 0]}>
          <cylinderGeometry args={[2.02, 2.02, 0.2, 16]} />
          <meshBasicMaterial color="#F4B942" />
        </mesh>
      </group>

      {/* Heavy horizontal utility pipelines linking the systems */}
      <group position={[0, 4.5, 0]}>
        {/* Main conduit */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 8.0, 12]} />
          <meshStandardMaterial color="#0E5AA7" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Side hot core pipe */}
        <mesh position={[0, -0.8, 0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 8.0, 8]} />
          <meshStandardMaterial color="#F4B942" emissive="#F4B942" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* High-pressure vertical exhaust stacks emitting steam lights */}
      <group position={[0, 5.2, -3.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.7, 10.0, 8]} />
          <meshStandardMaterial color="#071A2F" metalness={0.9} />
        </mesh>
        {/* Exhaust beacon */}
        <mesh position={[0, 5.15, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshBasicMaterial color="#F4B942" />
        </mesh>
        <pointLight position={[0, 5.2, 0]} intensity={2.0} color="#F4B942" distance={10} />
      </group>
    </group>
  );
}

// ── Building 6: Cyber Tower (Stepped Skyscraper Landmark) ──
// Overhauled: Multi-tier skyscraper, glowing window grid planes, corner structural braces, searchlight beacon
function CyberTower({ position, stepCount = 5, stepHeight = 7, color = '#071A2F', emissive = '#22D3EE' }: { position: [number, number, number]; stepCount?: number; stepHeight?: number; color?: string; emissive?: string }) {
  const beaconRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y = state.clock.getElapsedTime() * 0.95;
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
      {/* Massive base pedestal */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[16, 0.8, 16]} />
        <meshStandardMaterial color="#071A2F" roughness={0.9} metalness={0.5} />
      </mesh>

      {/* Stepped skyscraper core blocks */}
      {steps.map((s) => (
        <group key={s.key} position={[0, s.y, 0]}>
          {/* Main metal structure */}
          <mesh receiveShadow castShadow>
            <boxGeometry args={[s.w, stepHeight - 0.2, s.d]} />
            <meshStandardMaterial color={color} roughness={0.25} metalness={0.9} />
          </mesh>
          
          {/* Glowing window panel facades */}
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

          {/* Neon horizontal ring details */}
          <mesh position={[0, stepHeight / 2 - 0.1, 0]}>
            <boxGeometry args={[s.w + 0.15, 0.18, s.d + 0.15]} />
            <meshBasicMaterial color={emissive} />
          </mesh>
        </group>
      ))}

      {/* High-intensity sweeping searchlight array */}
      <group position={[0, totalH + 1.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.0, 1.5, 2.4, 8]} />
          <meshStandardMaterial color="#071A2F" metalness={0.9} />
        </mesh>
        
        {/* Sweeping Beacon Light Hub */}
        <mesh ref={beaconRef} position={[0, 1.6, 0]}>
          <boxGeometry args={[1.8, 0.6, 1.8]} />
          <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={3.0} />
        </mesh>
        
        <pointLight position={[0, 2, 0]} intensity={4.5} color={emissive} distance={60} />
      </group>
    </group>
  );
}

// ── Distant City Skyline Block ──
function DistantSkylineTower({ position, height = 35, width = 12 }: { position: [number, number, number]; height?: number; width?: number }) {
  return (
    <mesh position={[position[0], height / 2 - 2.0, position[2]]}>
      <boxGeometry args={[width, height, width]} />
      <meshStandardMaterial color="#071A2F" roughness={0.95} metalness={0.2} />
      {/* Decorative cyber stripes indicating tall glowing windows */}
      <mesh position={[0, height / 3, 0]}>
        <boxGeometry args={[width + 0.1, 1.2, width + 0.1]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, -height / 4, 0]}>
        <boxGeometry args={[width + 0.1, 1.2, width + 0.1]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.25} />
      </mesh>
    </mesh>
  );
}

// ── Streetlight ──
// Overhauled: Industrial poles casting spotLight cones down onto highway path
function StreetLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Structural Pole */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.16, 5.6, 8]} />
        <meshStandardMaterial color="#071A2F" roughness={0.4} metalness={0.9} />
      </mesh>

      {/* Horizontal neck extension */}
      <mesh position={[0.7, 5.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 1.4, 8]} />
        <meshStandardMaterial color="#071A2F" roughness={0.4} />
      </mesh>

      {/* Dynamic light fixtures */}
      <mesh position={[1.4, 5.4, 0]}>
        <boxGeometry args={[0.6, 0.25, 0.4]} />
        <meshStandardMaterial color="#071A2F" />
      </mesh>
      <mesh position={[1.4, 5.26, 0]}>
        <boxGeometry args={[0.5, 0.05, 0.3]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Downward street illumination */}
      <spotLight
        position={[1.4, 5.1, 0]}
        angle={0.65}
        penumbra={0.65}
        intensity={3.2}
        color="#cffafe"
        distance={22}
        castShadow
        shadow-bias={-0.0003}
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
      {/* Pulse ground projection rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[0, 1.6, 32]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.25} />
      </mesh>
      
      {/* Light beam cylinder */}
      <mesh position={[0, 3.0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 6, 8, 1, true]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.18} />
      </mesh>

      {/* Floating HTML Badge Panel */}
      <Float speed={2.5} rotationIntensity={0} floatIntensity={0.8} floatingRange={[0, 0.4]}>
        <Html position={[0, 6.2, 0]} center distanceFactor={28}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.6)] select-none text-white whitespace-nowrap">
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
        size={0.5}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── MAIN ENVIRONMENT SCENE ──
export function WorldEnvironment() {
  // Procedurally generate a detailed terrain mesh with valleys, side hills, mountain peaks, and riverbeds
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

      // River zones
      const river1Dist = Math.abs(worldZ - (-62));
      const river2Dist = Math.abs(worldZ - (-147));

      // 1. Calculate height profile
      if (distFromCenter > 18) {
        const elevationFactor = (distFromCenter - 18) * 0.45;
        zVal = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 3.2 + Math.sin(y * 0.03) * 6.0 + elevationFactor;
        terrainType = zVal > 15 ? 'mountain' : 'hill';
      } else {
        zVal = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 0.15;
        terrainType = 'valley';
      }

      // 2. Carve energy rivers
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

      // 3. Assign stylized procedural colors (Cyan, Navy, Teal, Gold themes)
      const color = new THREE.Color();
      if (terrainType === 'riverbed') {
        color.setHSL(0.55, 0.8, 0.12); // Deep blue riverbed mud
      } else if (terrainType === 'valley') {
        if (distFromCenter < 12.5) {
          color.setHSL(0.6, 0.35, 0.08); // Dark navy road base
        } else {
          color.setHSL(0.55, 0.45, 0.12); // Cool slate blue/teal fields
        }
      } else if (terrainType === 'hill') {
        color.setHSL(0.52, 0.4, 0.16); // Cyan-shaded slopes
      } else {
        // Mountain peaks
        color.setHSL(0.62, 0.3, 0.2); // Sleek metallic blue peaks
      }

      // Add texturing detail noise
      const noise = (Math.sin(x * 0.6) * Math.cos(y * 0.6) + 1.0) * 0.02;
      color.r += noise;
      color.g += noise;
      color.b += noise;

      colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Procedural rock placements (X, Y, Z, scaleX, scaleY, scaleZ, rotX, rotY, rotZ)
  const rockPlacements = useMemo<Array<{ pos: [number, number, number]; scale: [number, number, number]; rot: [number, number, number] }>>(() => {
    return [
      // Checkpoint 1 River area
      { pos: [-16, 0.1, -66], scale: [1.2, 0.8, 1.2], rot: [0.2, 0.5, 0.1] },
      { pos: [-24, 0.3, -58], scale: [1.8, 1.4, 1.5], rot: [-0.4, 1.1, 0.2] },
      { pos: [15, 0.1, -56], scale: [0.9, 0.9, 1.1], rot: [0.5, 0.1, 0.4] },
      { pos: [22, 0.4, -68], scale: [1.6, 1.5, 1.4], rot: [0.1, -0.9, 0.3] },
      
      // Checkpoint 2 River area
      { pos: [-15, 0.1, -152], scale: [1.1, 0.9, 1.2], rot: [0.3, 0.2, 0.1] },
      { pos: [-22, 0.5, -142], scale: [1.9, 1.6, 1.7], rot: [-0.2, 0.8, 0.4] },
      { pos: [16, 0.1, -144], scale: [1.0, 0.8, 1.1], rot: [0.4, -0.4, 0.2] },
      { pos: [25, 0.4, -154], scale: [1.7, 1.5, 1.6], rot: [0.2, -1.2, 0.3] },

      // Midground canyon walls
      { pos: [-13.5, 0.2, -108], scale: [1.2, 2.0, 1.5], rot: [0.1, 0.2, 0.3] },
      { pos: [13.5, 0.2, -94], scale: [1.3, 1.8, 1.4], rot: [-0.2, 0.5, -0.1] },
    ];
  }, []);

  return (
    <group>
      {/* ── 1. SKYBOX DOME, ATMOSPHERE & VOLUME FOG ── */}
      <color attach="background" args={['#020D1A']} />
      <fog attach="fog" args={['#020D1A', 50, 240]} />

      {/* ── 2. CINEMATIC DAYLIGHT AND REGIONAL COLORED LIGHTS ── */}
      {/* Soft fill light */}
      <ambientLight intensity={1.25} color="#D2E8FF" />
      
      {/* Key Directional Sun casting soft shadow maps */}
      <directionalLight
        position={[45, 80, 50]}
        intensity={2.5}
        color="#93C5FD"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={400}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-bias={-0.0002}
      />

      {/* Glowing regional district overlay nodes */}
      <pointLight position={[0, 16, -20]} intensity={3.5} color="#22D3EE" distance={70} />
      <pointLight position={[0, 20, -100]} intensity={4.0} color="#F4B942" distance={75} />
      <pointLight position={[0, 18, -170]} intensity={4.0} color="#0E5AA7" distance={75} />
      <pointLight position={[0, 24, -235]} intensity={4.5} color="#22D3EE" distance={80} />

      <FloatingParticleField />

      {/* ── 3. TERRAIN HEIGHT MATRIX ── */}
      <mesh geometry={terrainGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.82} metalness={0.18} flatShading />
      </mesh>

      {/* ── 4. MOUNTAINS (Background Skyline Flankers) ── */}
      {/* Left side flanking peaks */}
      <CyberMountain position={[-42, 0, -28]} scale={[1.4, 1.25, 1.4]} color="#071A2F" emissive="#22D3EE" />
      <CyberMountain position={[-46, 0, -88]} scale={[1.7, 1.6, 1.7]} color="#071A2F" emissive="#F4B942" />
      <CyberMountain position={[-48, 0, -155]} scale={[1.9, 1.7, 1.9]} color="#071A2F" emissive="#0E5AA7" />
      <CyberMountain position={[-40, 0, -215]} scale={[1.6, 1.4, 1.6]} color="#071A2F" emissive="#22D3EE" />

      {/* Right side flanking peaks */}
      <CyberMountain position={[42, 0, -32]} scale={[1.35, 1.15, 1.35]} color="#071A2F" emissive="#22D3EE" />
      <CyberMountain position={[48, 0, -98]} scale={[1.8, 1.65, 1.8]} color="#071A2F" emissive="#F4B942" />
      <CyberMountain position={[45, 0, -170]} scale={[1.6, 1.5, 1.6]} color="#071A2F" emissive="#0E5AA7" />
      <CyberMountain position={[38, 0, -230]} scale={[1.4, 1.3, 1.4]} color="#071A2F" emissive="#22D3EE" />

      {/* ── 5. DETAILED SHORELINE ROCKS ── */}
      {rockPlacements.map((r, idx) => (
        <CyberRock key={idx} position={r.pos} scale={r.scale} rotation={r.rot} />
      ))}

      {/* ── 6. COOLANT / ENERGY RIVERS ── */}
      <EnergyRiver position={[0, 0.01, -62]} width={180} length={10} color="#22D3EE" />
      <EnergyRiver position={[0, 0.01, -147]} width={180} length={12} color="#0E5AA7" />

      {/* ── 7. STYLIZED ROADS & HIGHWAYS ── */}
      {/* Main Highway 1 (Z: 10 to -38) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -14]} receiveShadow>
        <planeGeometry args={[24, 52]} />
        <meshStandardMaterial color="#08182B" roughness={0.4} metalness={0.75} />
      </mesh>
      {/* 3D Curbs with safety grid */}
      <mesh position={[-12.4, 0.2, -14]} receiveShadow castShadow>
        <boxGeometry args={[0.8, 0.35, 52]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[12.4, 0.2, -14]} receiveShadow castShadow>
        <boxGeometry args={[0.8, 0.35, 52]} />
        <meshStandardMaterial color="#0E5AA7" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Lane Indicators */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`dash1_${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 8 - i * 9]}>
          <planeGeometry args={[0.3, 4.0]} />
          <meshBasicMaterial color="#22D3EE" />
        </mesh>
      ))}

      {/* Highway 2 (Z: -85 to -118) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -101.5]} receiveShadow>
        <planeGeometry args={[24, 33]} />
        <meshStandardMaterial color="#08182B" roughness={0.4} metalness={0.75} />
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

      {/* Highway 3 (Z: -175 to -250) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -212.5]} receiveShadow>
        <planeGeometry args={[28, 75]} />
        <meshStandardMaterial color="#08182B" roughness={0.35} metalness={0.8} />
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

      {/* Streetlights lining highways */}
      <StreetLight position={[-11.5, 0, 0]} />
      <StreetLight position={[11.5, 0, -20]} />
      <StreetLight position={[-11.5, 0, -90]} />
      <StreetLight position={[11.5, 0, -112]} />
      <StreetLight position={[-13.5, 0, -190]} />
      <StreetLight position={[13.5, 0, -220]} />

      {/* ── 8. FUTURISTIC BUILDINGS & DISTRICT LANDMARKS ── */}
      {/* DISTRICT 1 (Cyber & Start Area) */}
      <CyberLab position={[-25, 0, -15]} scale={[1.1, 1.0, 1.1]} />
      <CyberTower position={[26, 0, -18]} stepCount={5} stepHeight={6.5} color="#071A2F" emissive="#22D3EE" />
      <AIResearchCenter position={[-26, 0, -32]} scale={[0.9, 0.9, 0.9]} />

      {/* DISTRICT 2 (Network & Industrial) */}
      <NetworkCenter position={[26, 0, -92]} scale={[0.95, 0.95, 0.95]} />
      <IndustrialFacility position={[-26, 0, -100]} scale={[0.95, 1.0, 0.95]} />
      <CyberLab position={[25, 0, -112]} scale={[0.95, 0.95, 0.95]} />

      {/* DISTRICT 3 (Database & Quantum Core) */}
      <DatabaseVault position={[-26, 0, -195]} scale={[0.95, 1.0, 0.95]} />
      <AIResearchCenter position={[27, 0, -205]} scale={[1.05, 1.05, 1.05]} />
      <CyberTower position={[-27, 0, -230]} stepCount={6} stepHeight={6.0} color="#071A2F" emissive="#0E5AA7" />
      <NetworkCenter position={[26, 0, -232]} scale={[1.0, 1.0, 1.0]} />

      {/* ── 9. RICH VEGETATION FORESTS (Procedural Cluster Scatters) ── */}
      {/* Start Precinct */}
      <CyberTree position={[-18, 0, 4]} color="#14B8A6" scale={1.1} />
      <CyberTree position={[-22, 0, -4]} color="#22D3EE" scale={0.9} />
      <CyberTree position={[-19, 0, -26]} color="#0E5AA7" scale={1.0} />
      <CyberTree position={[-23, 0, -22]} color="#14B8A6" scale={0.8} />

      <CyberTree position={[18, 0, 6]} color="#22D3EE" scale={1.0} />
      <CyberTree position={[22, 0, -6]} color="#14B8A6" scale={1.2} />
      <CyberTree position={[20, 0, -28]} color="#0E5AA7" scale={0.9} />
      <CyberTree position={[23, 0, -25]} color="#22D3EE" scale={1.1} />

      {/* Network precinct */}
      <CyberTree position={[-19, 0, -86]} color="#0E5AA7" scale={1.0} />
      <CyberTree position={[-22, 0, -90]} color="#14B8A6" scale={0.8} />
      <CyberTree position={[-18, 0, -112]} color="#22D3EE" scale={1.1} />
      <CyberTree position={[19, 0, -102]} color="#0E5AA7" scale={1.1} />
      <CyberTree position={[22, 0, -106]} color="#22D3EE" scale={0.9} />

      {/* Database Vault precinct */}
      <CyberTree position={[-20, 0, -188]} color="#22D3EE" scale={1.1} />
      <CyberTree position={[-23, 0, -184]} color="#0E5AA7" scale={0.9} />
      <CyberTree position={[20, 0, -192]} color="#22D3EE" scale={1.0} />
      <CyberTree position={[22, 0, -186]} color="#14B8A6" scale={1.2} />

      {/* Bioluminescent crystals along hills */}
      <EnergyCrystal position={[-15, 0.2, -12]} color="#14B8A6" />
      <EnergyCrystal position={[15, 0.2, -10]} color="#22D3EE" />
      <EnergyCrystal position={[17, 0.2, -96]} color="#0E5AA7" />
      <EnergyCrystal position={[-16, 0.2, -200]} color="#22D3EE" />
      <EnergyCrystal position={[16, 0.2, -218]} color="#22D3EE" />

      {/* ── 10. BACKGROUND CITY SPYRES & DETAILED SKYLINE ── */}
      {/* Far Background Skyline */}
      <DistantSkylineTower position={[-110, 60, -295]} height={80} width={18} />
      <DistantSkylineTower position={[-85, 48, -290]} height={60} width={14} />
      <DistantSkylineTower position={[-55, 70, -288]} height={90} width={20} />
      <DistantSkylineTower position={[55, 68, -288]} height={85} width={20} />
      <DistantSkylineTower position={[85, 46, -290]} height={55} width={14} />
      <DistantSkylineTower position={[110, 75, -295]} height={100} width={18} />

      {/* Side Skyline bounding blocks */}
      <DistantSkylineTower position={[-75, 44, -50]} height={55} width={15} />
      <DistantSkylineTower position={[-75, 52, -120]} height={65} width={16} />
      <DistantSkylineTower position={[-75, 50, -200]} height={62} width={15} />
      <DistantSkylineTower position={[75, 46, -50]} height={58} width={15} />
      <DistantSkylineTower position={[75, 55, -120]} height={70} width={16} />
      <DistantSkylineTower position={[75, 48, -200]} height={58} width={15} />

      {/* ── 11. REGIONAL MAP MARKERS ── */}
      <FloatingMapPin position={[0, 0.2, -40]} label="CP 1: NETWORK NODE" icon={Terminal} color="bg-cyan-600" borderColor="border-cyan-400" />
      <FloatingMapPin position={[0, 0.2, -45]} label="SHORTCUT ROUTE" icon={Zap} color="bg-cyan-700" borderColor="border-cyan-300" />
      <FloatingMapPin position={[14, 0.2, -44]} label="DETOUR ROUTE" icon={AlertTriangle} color="bg-amber-600" borderColor="border-amber-400" />

      <FloatingMapPin position={[0, 0.2, -120]} label="CP 2: KERNEL CORE" icon={Shield} color="bg-cyan-600" borderColor="border-cyan-400" />
      <FloatingMapPin position={[0, 0.2, -125]} label="SHORTCUT ROUTE" icon={Zap} color="bg-cyan-700" borderColor="border-cyan-300" />
      <FloatingMapPin position={[-14, 0.2, -124]} label="DETOUR ROUTE" icon={AlertTriangle} color="bg-amber-600" borderColor="border-amber-400" />

      <FloatingMapPin position={[0, 0.2, -180]} label="CP 3: DATABASE VAULT" icon={Compass} color="bg-[#0E5AA7]" borderColor="border-cyan-400" />
      <FloatingMapPin position={[0, 0.2, -240]} label="FINAL PORTAL" icon={Award} color="bg-amber-500" borderColor="border-amber-300" />

      {/* ── 12. LEVEL ENTRANCE ARCHWAY ── */}
      <group position={[0, 0, 6]}>
        <mesh position={[-12.2, 6.2, 0]} castShadow>
          <boxGeometry args={[1.5, 12.4, 1.5]} />
          <meshStandardMaterial color="#0E5AA7" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[12.2, 6.2, 0]} castShadow>
          <boxGeometry args={[1.5, 12.4, 1.5]} />
          <meshStandardMaterial color="#0E5AA7" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Overhead beam */}
        <mesh position={[0, 12.5, 0]} castShadow>
          <boxGeometry args={[25.9, 1.6, 1.6]} />
          <meshStandardMaterial color="#071A2F" metalness={0.8} />
        </mesh>
        {/* Glowing banner screen */}
        <mesh position={[0, 10.4, 0]}>
          <planeGeometry args={[11, 2.0]} />
          <meshBasicMaterial color="#22D3EE" />
        </mesh>
        <Html position={[0, 10.4, 0.06]} center distanceFactor={22}>
          <div className="flex flex-col items-center select-none text-white whitespace-nowrap">
            <span className="text-[14px] font-mono font-black tracking-widest text-black">CYBER ESCAPE</span>
            <span className="text-[7px] font-mono font-bold text-cyan-950 uppercase tracking-wider">ROUND 3 // QUANTUM GATEWAY</span>
          </div>
        </Html>
      </group>
    </group>
  );
}
