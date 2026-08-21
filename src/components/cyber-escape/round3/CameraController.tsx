'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { CHECKPOINTS } from '@/lib/cyber-escape/round3/pathLogic';

export function CameraController() {
  const rotationRef = useRef({ theta: 0, phi: Math.PI / 3.2, isDragging: false });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Don't trigger orbit drag if clicking interactive HUD buttons
      if (
        (e.target as HTMLElement).tagName === 'BUTTON' ||
        (e.target as HTMLElement).closest('.pointer-events-auto')
      ) {
        return;
      }
      rotationRef.current.isDragging = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!rotationRef.current.isDragging) return;
      const sensitivity = 0.0055;
      rotationRef.current.theta -= e.movementX * sensitivity;
      rotationRef.current.phi = Math.max(
        0.15,
        Math.min(Math.PI / 2.15, rotationRef.current.phi + e.movementY * sensitivity)
      );
    };

    const handleMouseUp = () => {
      rotationRef.current.isDragging = false;
    };

    // Mobile touch drag supporting 360 look around
    let lastTouchX = 0;
    let lastTouchY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (
        (e.target as HTMLElement).tagName === 'BUTTON' ||
        (e.target as HTMLElement).closest('.pointer-events-auto')
      ) {
        return;
      }
      rotationRef.current.isDragging = true;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!rotationRef.current.isDragging) return;
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const deltaX = touchX - lastTouchX;
      const deltaY = touchY - lastTouchY;
      lastTouchX = touchX;
      lastTouchY = touchY;

      const sensitivity = 0.008;
      rotationRef.current.theta -= deltaX * sensitivity;
      rotationRef.current.phi = Math.max(
        0.15,
        Math.min(Math.PI / 2.15, rotationRef.current.phi + deltaY * sensitivity)
      );
    };

    const handleTouchEnd = () => {
      rotationRef.current.isDragging = false;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

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
      // Auto-align horizontal orientation behind player when running
      if (isMoving && !rotationRef.current.isDragging) {
        let diff = (playerRotation + Math.PI) - rotationRef.current.theta;
        // Find shortest angular distance
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        rotationRef.current.theta += diff * 0.05; // smooth responsive catch-up
      }

      const distance = 16.5;
      const theta = rotationRef.current.theta;
      const phi = rotationRef.current.phi;

      targetCamPos = new THREE.Vector3(
        playerPosition[0] + distance * Math.sin(phi) * Math.sin(theta),
        playerPosition[1] + Math.max(3.0, distance * Math.cos(phi)), // Prevent camera clipping below terrain floor
        playerPosition[2] + distance * Math.sin(phi) * Math.cos(theta)
      );

      targetLookAt = new THREE.Vector3(
        playerPosition[0],
        playerPosition[1] + 1.6, // Look at player chest/head level
        playerPosition[2]
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
