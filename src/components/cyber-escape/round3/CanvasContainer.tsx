'use client';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { GameScene } from './GameScene';

export function CanvasContainer() {
  return (
    <div className="relative w-full h-screen bg-[#020b07] overflow-hidden select-none">
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{ position: [0, 9, 15], fov: 50, near: 0.1, far: 350 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        dpr={[1, 2]}
      >
        <GameScene />
      </Canvas>
    </div>
  );
}
