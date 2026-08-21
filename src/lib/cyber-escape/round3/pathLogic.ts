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

  // 1. Enforce sequential checkpoint gates globally to prevent lag/tunneling bypasses
  // Checkpoint 1 (Index 0) at Z = -30
  if (!checkpointAnswers[0] && clampedZ < -30) {
    clampedZ = -30;
  }
  // Detour 1 (Index 1) at Z = -60 (Gated at Z = -65)
  if (routeBranch1 === 'detour' && !checkpointAnswers[1] && clampedZ < -65) {
    clampedZ = -65;
  }
  // Checkpoint 2 (Index 2) at Z = -90
  if (checkpointAnswers[0] && !checkpointAnswers[2] && clampedZ < -90) {
    clampedZ = -90;
  }
  // Checkpoint 3 (Index 3) at Z = -105
  if (checkpointAnswers[2] && !checkpointAnswers[3] && clampedZ < -105) {
    clampedZ = -105;
  }
  // Detour 2 (Index 4) at Z = -150 (Gated at Z = -155)
  if (routeBranch2 === 'detour' && !checkpointAnswers[4] && clampedZ < -155) {
    clampedZ = -155;
  }
  // Shortcut 2 (Index 5) at Z = -150 (Gated at Z = -155)
  if (routeBranch2 === 'shortcut' && !checkpointAnswers[5] && clampedZ < -155) {
    clampedZ = -155;
  }
  // Checkpoint 5 (Index 6) at Z = -180
  if ((checkpointAnswers[4] || checkpointAnswers[5]) && !checkpointAnswers[6] && clampedZ < -180) {
    clampedZ = -180;
  }
  // Checkpoint 6 (Index 7) at Z = -200
  if (checkpointAnswers[6] && !checkpointAnswers[7] && clampedZ < -200) {
    clampedZ = -200;
  }
  // Coding Challenge 1 (Index 8) at Z = -215
  if (checkpointAnswers[7] && !coding1Solved && clampedZ < -215) {
    clampedZ = -215;
  }
  // Coding Challenge 2 (Index 9) at Z = -230
  if (coding1Solved && !coding2Solved && clampedZ < -230) {
    clampedZ = -230;
  }

  // 2. Enforce X road boundaries based on clamped Z position
  if (clampedZ > -30) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  } else if (clampedZ <= -30 && clampedZ > -38) {
    clampedX = Math.max(-8, Math.min(8, clampedX));
  } else if (clampedZ <= -38 && clampedZ > -85) {
    if (routeBranch1 === 'shortcut') {
      clampedX = Math.max(-6, Math.min(6, clampedX));
    } else if (routeBranch1 === 'detour') {
      clampedX = Math.max(12, Math.min(24, clampedX));
    } else {
      clampedX = Math.max(-8, Math.min(8, clampedX));
    }
  } else if (clampedZ <= -85 && clampedZ > -90) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  } else if (clampedZ <= -90 && clampedZ > -100) {
    clampedX = Math.max(-8, Math.min(8, clampedX));
  } else if (clampedZ <= -100 && clampedZ > -105) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  } else if (clampedZ <= -105 && clampedZ > -118) {
    clampedX = Math.max(-8, Math.min(8, clampedX));
  } else if (clampedZ <= -118 && clampedZ > -175) {
    if (routeBranch2 === 'shortcut') {
      clampedX = Math.max(-6, Math.min(6, clampedX));
    } else if (routeBranch2 === 'detour') {
      clampedX = Math.max(-24, Math.min(-12, clampedX));
    } else {
      clampedX = Math.max(-8, Math.min(8, clampedX));
    }
  } else if (clampedZ <= -175 && clampedZ > -180) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  } else if (clampedZ <= -180 && clampedZ > -190) {
    clampedX = Math.max(-8, Math.min(8, clampedX));
  } else if (clampedZ <= -190 && clampedZ > -200) {
    clampedX = Math.max(-12, Math.min(12, clampedX));
  } else if (clampedZ <= -200 && clampedZ > -210) {
    clampedX = Math.max(-8, Math.min(8, clampedX));
  } else {
    clampedX = Math.max(-14, Math.min(14, clampedX));
  }

  return { x: clampedX, z: clampedZ };
}
