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
  category: 'CS_FUNDAMENTALS' | 'DBMS' | 'COMPUTER_NETWORKS' | 'CODING';
  isDetour?: boolean;
}

export const CHECKPOINTS: CheckpointInfo[] = [
  // 1. Checkpoint 1 (CS Fundamentals)
  {
    index: 0,
    position: [0, 0.5, -30],
    name: 'CHECKPOINT 1: NETWORK NODE',
    district: 'CYBER DISTRICT',
    triggerRadius: 4.5,
    category: 'CS_FUNDAMENTALS',
  },
  // Detour Checkpoint 1-D (Only active if CP 1 is WRONG)
  {
    index: 1,
    position: [18, 0.5, -60],
    name: 'DETOUR TERMINAL 1-D',
    district: 'DETOUR CANYON',
    triggerRadius: 4.5,
    category: 'CS_FUNDAMENTALS',
    isDetour: true,
  },
  // 2. Checkpoint 2 (DBMS)
  {
    index: 2,
    position: [0, 0.5, -90],
    name: 'CHECKPOINT 2: GRID CONTROL',
    district: 'CITY CENTER',
    triggerRadius: 4.5,
    category: 'DBMS',
  },
  // 3. Checkpoint 3 (Computer Networks)
  {
    index: 3,
    position: [0, 0.5, -105],
    name: 'CHECKPOINT 3: KERNEL CORE',
    district: 'NETWORK DISTRICT',
    triggerRadius: 4.5,
    category: 'COMPUTER_NETWORKS',
  },
  // Detour Checkpoint 2-D (Only active if CP 3 is WRONG)
  {
    index: 4,
    position: [-18, 0.5, -150],
    name: 'DETOUR TERMINAL 2-D',
    district: 'DETOUR TUNNEL',
    triggerRadius: 4.5,
    category: 'DBMS',
    isDetour: true,
  },
  // 4. Checkpoint 4 (CS Fundamentals)
  {
    index: 5,
    position: [0, 0.5, -150],
    name: 'CHECKPOINT 4: DATA HUB',
    district: 'DATA CENTER',
    triggerRadius: 4.5,
    category: 'CS_FUNDAMENTALS',
  },
  // 5. Checkpoint 5 (DBMS)
  {
    index: 6,
    position: [0, 0.5, -180],
    name: 'CHECKPOINT 5: VAULT SECURITY',
    district: 'DATABASE VAULT',
    triggerRadius: 4.5,
    category: 'DBMS',
  },
  // 6. Checkpoint 6 (Computer Networks)
  {
    index: 7,
    position: [0, 0.5, -200],
    name: 'CHECKPOINT 6: QUANTUM DEC COMP',
    district: 'AI RESEARCH',
    triggerRadius: 4.5,
    category: 'COMPUTER_NETWORKS',
  },
  // Coding Challenge 1
  {
    index: 8,
    position: [0, 0.5, -215],
    name: 'CODING CHALLENGE 1',
    district: 'AI RESEARCH',
    triggerRadius: 4.0,
    category: 'CODING',
  },
  // Coding Challenge 2
  {
    index: 9,
    position: [0, 0.5, -230],
    name: 'CODING CHALLENGE 2',
    district: 'AI RESEARCH',
    triggerRadius: 4.0,
    category: 'CODING',
  },
];

export const FINAL_PORTAL_POSITION: [number, number, number] = [0, 0.5, -245];

// Collision wall boundaries for 3D world to keep character inside navigable roads & paths
export function checkWorldBoundaries(
  x: number,
  z: number,
  routeBranch1: string,
  routeBranch2: string,
  coding1Solved: boolean,
  coding2Solved: boolean,
  checkpointAnswers: Record<number, any>
): { x: number; z: number } {
  let clampedX = x;
  let clampedZ = Math.min(5, Math.max(-250, z));

  // 1. Start area to Checkpoint 1 (Z: 5 to -30)
  if (clampedZ > -30) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  }
  // Gated at Checkpoint 1 (Z = -30)
  else if (clampedZ <= -30 && clampedZ > -38) {
    clampedX = Math.max(-8, Math.min(8, clampedX));
    if (!checkpointAnswers[0] && clampedZ < -30) {
      clampedZ = -30;
    }
  }
  // 2. Fork 1 Area (Z: -38 to -85)
  else if (clampedZ <= -38 && clampedZ > -85) {
    if (routeBranch1 === 'shortcut') {
      clampedX = Math.max(-6, Math.min(6, clampedX));
    } else if (routeBranch1 === 'detour') {
      clampedX = Math.max(12, Math.min(24, clampedX));
      // Detour checkpoint 1-D (Index 1) is at Z = -60. Gate past Z = -65 if not solved.
      if (!checkpointAnswers[1] && clampedZ < -65) {
        clampedZ = -65;
      }
    } else {
      clampedX = Math.max(-8, Math.min(8, clampedX));
      clampedZ = -38;
    }
  }
  // 3. Network District to Checkpoint 2 (Z: -85 to -90)
  else if (clampedZ <= -85 && clampedZ > -90) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  }
  // Gated at Checkpoint 2 (Z = -90)
  else if (clampedZ <= -90 && clampedZ > -100) {
    clampedX = Math.max(-8, Math.min(8, clampedX));
    if (!checkpointAnswers[2] && clampedZ < -90) {
      clampedZ = -90;
    }
  }
  // 4. Highway 2 to Checkpoint 3 (Z: -100 to -105)
  else if (clampedZ <= -100 && clampedZ > -105) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  }
  // Gated at Checkpoint 3 (Z = -105)
  else if (clampedZ <= -105 && clampedZ > -118) {
    clampedX = Math.max(-8, Math.min(8, clampedX));
    if (!checkpointAnswers[3] && clampedZ < -105) {
      clampedZ = -105;
    }
  }
  // 5. Fork 2 Area (Z: -118 to -175)
  else if (clampedZ <= -118 && clampedZ > -175) {
    if (routeBranch2 === 'shortcut') {
      clampedX = Math.max(-6, Math.min(6, clampedX));
      // Shortcut Checkpoint 4 (Index 5) is at Z = -150. Gate past Z = -155 if not solved.
      if (!checkpointAnswers[5] && clampedZ < -155) {
        clampedZ = -155;
      }
    } else if (routeBranch2 === 'detour') {
      clampedX = Math.max(-24, Math.min(-12, clampedX));
      // Detour Checkpoint 2-D (Index 4) is at Z = -150. Gate past Z = -155 if not solved.
      if (!checkpointAnswers[4] && clampedZ < -155) {
        clampedZ = -155;
      }
    } else {
      clampedX = Math.max(-8, Math.min(8, clampedX));
      clampedZ = -118;
    }
  }
  // 6. Network District to Checkpoint 5 (Z: -175 to -180)
  else if (clampedZ <= -175 && clampedZ > -180) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  }
  // Gated at Checkpoint 5 (Z = -180)
  else if (clampedZ <= -180 && clampedZ > -190) {
    clampedX = Math.max(-8, Math.min(8, clampedX));
    if (!checkpointAnswers[6] && clampedZ < -180) {
      clampedZ = -180;
    }
  }
  // 7. Highway 3 to Checkpoint 6 (Z: -190 to -200)
  else if (clampedZ <= -190 && clampedZ > -200) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  }
  // Gated at Checkpoint 6 (Z = -200)
  else if (clampedZ <= -200 && clampedZ > -210) {
    clampedX = Math.max(-8, Math.min(8, clampedX));
    if (!checkpointAnswers[7] && clampedZ < -200) {
      clampedZ = -200;
    }
  }
  // 8. Coding Challenge 1 & 2 & Portal (Z: -210 to -250)
  else {
    clampedX = Math.max(-14, Math.min(14, clampedX));

    // Block at Coding Terminal 1 if not solved
    if (!coding1Solved && clampedZ < -215) {
      clampedZ = -215;
    }
    // Block at Coding Terminal 2 if not solved
    if (!coding2Solved && clampedZ < -230) {
      clampedZ = -230;
    }
  }

  return { x: clampedX, z: clampedZ };
}
