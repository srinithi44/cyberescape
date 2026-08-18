// Physical 3D Map Layout & Route Bounds Logic

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface CheckpointInfo {
  index: number;
  position: [number, number, number];
  name: string;
  district: string;
  triggerRadius: number;
}

export const CHECKPOINTS: CheckpointInfo[] = [
  {
    index: 0,
    position: [0, 0.5, -40],
    name: 'CHECKPOINT 1: NETWORK NODE',
    district: 'CYBER DISTRICT',
    triggerRadius: 4.5,
  },
  {
    index: 1,
    position: [0, 0.5, -120],
    name: 'CHECKPOINT 2: KERNEL CORE',
    district: 'NETWORK DISTRICT',
    triggerRadius: 4.5,
  },
  {
    index: 2,
    position: [0, 0.5, -180],
    name: 'CHECKPOINT 3: DATABASE VAULT',
    district: 'DATABASE VAULT',
    triggerRadius: 4.5,
  },
  {
    index: 3,
    position: [0, 0.5, -205],
    name: 'CODING CHALLENGE 1',
    district: 'AI RESEARCH',
    triggerRadius: 4.0,
  },
  {
    index: 4,
    position: [0, 0.5, -225],
    name: 'CODING CHALLENGE 2',
    district: 'AI RESEARCH',
    triggerRadius: 4.0,
  },
];

export const FINAL_PORTAL_POSITION: [number, number, number] = [0, 0.5, -240];

// Collision wall boundaries for 3D world to keep character inside navigable roads & paths
export function checkWorldBoundaries(
  x: number,
  z: number,
  routeBranch1: string,
  routeBranch2: string,
  coding1Solved: boolean,
  coding2Solved: boolean
): { x: number; z: number } {
  let clampedX = x;
  let clampedZ = Math.min(5, Math.max(-250, z));

  // 1. Cyber District Entry (Z: 5 to -38)
  if (clampedZ > -38) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  }
  // 2. Checkpoint 1 Fork Area (Z: -38 to -85)
  else if (clampedZ <= -38 && clampedZ > -85) {
    if (routeBranch1 === 'shortcut') {
      // Confine player to narrow straight shortcut bridge
      clampedX = Math.max(-6, Math.min(6, clampedX));
    } else if (routeBranch1 === 'detour') {
      // Allow detour curve to the right side (+X), centered on X=18 road
      clampedX = Math.max(12, Math.min(24, clampedX));
    } else {
      // Gate closed area: keep in front of checkpoint
      clampedX = Math.max(-8, Math.min(8, clampedX));
      if (clampedZ < -44) clampedZ = -44; // Blocked by closed gates
    }
  }
  // 3. Network District (Z: -85 to -118)
  else if (clampedZ <= -85 && clampedZ > -118) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  }
  // 4. Checkpoint 2 Fork Area (Z: -118 to -175)
  else if (clampedZ <= -118 && clampedZ > -175) {
    if (routeBranch2 === 'shortcut') {
      clampedX = Math.max(-6, Math.min(6, clampedX));
    } else if (routeBranch2 === 'detour') {
      // Detour to the left (-X), centered on X=-18 road
      clampedX = Math.max(-24, Math.min(-12, clampedX));
    } else {
      clampedX = Math.max(-8, Math.min(8, clampedX));
      if (clampedZ < -124) clampedZ = -124;
    }
  }
  // 5. Final Quantum Approach (Z: -175 to -250)
  else {
    clampedX = Math.max(-14, Math.min(14, clampedX));

    // Block at Coding Terminal 1 if not solved
    if (!coding1Solved && clampedZ < -205) {
      clampedZ = -205;
    }
    // Block at Coding Terminal 2 if not solved
    if (!coding2Solved && clampedZ < -225) {
      clampedZ = -225;
    }
  }

  return { x: clampedX, z: clampedZ };
}
