'use client';

import { useState, useRef } from 'react';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';

export function VirtualJoystick() {
  const [active, setActive] = useState(false);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setActive(true);
    updateJoystick(e.touches[0]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!active) return;
    updateJoystick(e.touches[0]);
  };

  const handleTouchEnd = () => {
    setActive(false);
    setStickPos({ x: 0, y: 0 });
    useGameStore.getState().setJoystickVector({ x: 0, y: 0 });
  };

  const updateJoystick = (touch: React.Touch) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    const maxRadius = rect.width / 2;

    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(deltaY, deltaX);

    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;

    setStickPos({ x: stickX, y: stickY });

    // Normalized vector -1 to +1
    useGameStore.getState().setJoystickVector({
      x: stickX / maxRadius,
      y: stickY / maxRadius,
    });
  };

  return (
    <div className="sm:hidden fixed bottom-8 left-8 z-40">
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-32 h-32 rounded-full bg-emerald-950/40 border-2 border-emerald-500/40 backdrop-blur-md flex items-center justify-center touch-none select-none"
      >
        {/* Joystick Stick Handle */}
        <div
          className="w-12 h-12 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_15px_#34D399] transition-transform duration-75"
          style={{
            transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
          }}
        />
      </div>
    </div>
  );
}
