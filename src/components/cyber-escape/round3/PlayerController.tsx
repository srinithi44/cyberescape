'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { checkWorldBoundaries } from '@/lib/cyber-escape/round3/pathLogic';
import { soundEngine } from '@/lib/cyber-escape/round3/soundEngine';

export function PlayerController() {
  const keysPressed = useRef<Record<string, boolean>>({});
  const footstepTimer = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'm') {
        useGameStore.getState().toggleMap();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const state = useGameStore.getState();
    if (state.gameStatus !== 'playing' || state.isMapOpen) {
      if (state.isMoving) state.setIsMoving(false);
      return;
    }

    // Tick continuous timer
    state.tickTimer(delta * 1000);

    let moveX = 0;
    let moveZ = 0;

    // 1. Keyboard Inputs
    const k = keysPressed.current;
    if (k['w'] || k['arrowup']) moveZ -= 1;
    if (k['s'] || k['arrowdown']) moveZ += 1;
    if (k['a'] || k['arrowleft']) moveX -= 1;
    if (k['d'] || k['arrowright']) moveX += 1;

    // 2. Mobile Joystick Inputs
    const joy = state.joystickVector;
    if (joy.x !== 0 || joy.y !== 0) {
      moveX += joy.x;
      moveZ += joy.y;
    }

    const isInputActive = moveX !== 0 || moveZ !== 0;

    if (isInputActive) {
      // Normalize movement vector
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      const dirX = moveX / len;
      const dirZ = moveZ / len;

      const speed = 14; // units per second
      const currentPos = state.playerPosition;

      let nextX = currentPos[0] + dirX * speed * delta;
      let nextZ = currentPos[2] + dirZ * speed * delta;

      // Apply world boundary collisions & branch route gating
      const route1 = state.routeBranches[0] || 'none';
      const route2 = state.routeBranches[1] || 'none';
      const coding1Solved = !!state.codingSolved['CODE-01'];
      const coding2Solved = !!state.codingSolved['CODE-02'];
      const clamped = checkWorldBoundaries(nextX, nextZ, route1, route2, coding1Solved, coding2Solved, state.checkpointAnswers);

      state.setPlayerPosition([clamped.x, 0.5, clamped.z]);

      // Calculate smooth character facing rotation
      const targetAngle = Math.atan2(dirX, dirZ);
      state.setPlayerRotation(targetAngle);

      if (!state.isMoving) state.setIsMoving(true);

      // Footstep sound tick
      footstepTimer.current += delta;
      if (footstepTimer.current > 0.25) {
        soundEngine.playFootstep(state.soundEnabled);
        footstepTimer.current = 0;
      }
    } else {
      if (state.isMoving) state.setIsMoving(false);
    }
  });

  return null;
}
