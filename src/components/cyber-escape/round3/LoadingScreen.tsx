'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';

export function LoadingScreen() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const startTimer = useGameStore((state) => state.startTimer);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (gameStatus !== 'loading') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setGameStatus('playing');
            startTimer();
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15 + 10);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [gameStatus, setGameStatus, startTimer]);

  if (gameStatus !== 'loading') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 bg-[#071A2F] flex flex-col items-center justify-center p-6 text-white font-sans select-none"
      >
        {/* Swirling Background Rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
          {/* Logo Emblem */}
          <div className="w-16 h-16 rounded-2xl bg-[#071A2F] border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.5)] mb-6">
            <Shield className="w-8 h-8 animate-pulse" />
          </div>

          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            CYBER ESCAPE • ROUND 3
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-wider text-white mb-6">
            INITIALIZING 3D WORLD
          </h1>

          {/* Progress Bar Container */}
          <div className="w-full h-3 rounded-full bg-cyan-950/80 border border-cyan-800/50 p-0.5 overflow-hidden mb-3">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#0E5AA7] via-[#22D3EE] to-[#F4B942] shadow-[0_0_15px_#22D3EE]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>

          {/* Percentage Indicator */}
          <div className="flex items-center justify-between w-full font-mono text-xs text-cyan-300/80">
            <span>LOADING ASSETS & SHADERS...</span>
            <span className="font-bold text-white">{progress}%</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
