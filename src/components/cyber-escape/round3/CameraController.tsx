'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { CHECKPOINTS } from '@/lib/cyber-escape/round3/pathLogic';

export function CameraController() {
  useFrame((state) => {
    const { playerPosition, playerRotation, isMoving, gameStatus, currentCheckpoint } = useGameStore.getState();

    let targetCamPos: THREE.Vector3;
    let targetLookAt: THREE.Vector3;

    if (gameStatus === 'question') {
      // Cinematic terminal focus mode
      const cpPos = CHECKPOINTS[currentCheckpoint]?.position || [0, 0.5, -40];
      targetCamPos = new THREE.Vector3(cpPos[0] + 3.2, cpPos[1] + 2.6, cpPos[2] + 5.5);
      targetLookAt = new THREE.Vector3(cpPos[0], cpPos[1] + 1.8, cpPos[2]);
    } else {
      // Bruno Simon style dynamic follow camera with look-ahead & lateral bank tilt
      const lookAheadZ = isMoving ? Math.cos(playerRotation) * -3 : -3;
      const lookAheadX = isMoving ? Math.sin(playerRotation) * 3 : 0;

      targetCamPos = new THREE.Vector3(
        playerPosition[0] + (isMoving ? Math.sin(playerRotation) * 1.5 : 0),
        playerPosition[1] + 9.5,
        playerPosition[2] + 15
      );

      targetLookAt = new THREE.Vector3(
        playerPosition[0] + lookAheadX,
        playerPosition[1] + 1.6,
        playerPosition[2] + lookAheadZ
      );
    }

    // Smooth lerp camera position with springy factor
    state.camera.position.lerp(targetCamPos, 0.08);

    // Smooth lerp camera lookAt vector
    const currentLookAt = state.camera.userData.lookAt || targetLookAt.clone();
    currentLookAt.lerp(targetLookAt, 0.08);
    state.camera.userData.lookAt = currentLookAt;
    state.camera.lookAt(currentLookAt);
  });

  return null;
}
