'use client';

import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { Volume2, VolumeX, Map, Shield, Clock, Compass, Activity, Navigation, Radio, Users, BookOpen, AlertTriangle } from 'lucide-react';

function formatTimer(ms: number) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const millis = Math.floor(ms % 1000);
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

interface GameHUDProps {
  onOpenPlayers: () => void;
}

// Separate component for the timer to avoid re-rendering the whole HUD 60fps
function HUDTimer() {
  const timerMs = useGameStore((state) => state.timerMs);
  return (
    <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-wider">
      {formatTimer(timerMs)}
    </span>
  );
}

// Separate component for position telemetry to avoid re-rendering the whole HUD on movement
function HUDTelemetry() {
  const playerPos = useGameStore((state) => state.playerPosition);
  
  // Compute escape progress percentage (Start: Z = 5, End/Portal: Z = -240)
  const zPos = playerPos[2];
  const progressPercent = Math.round(Math.min(100, Math.max(0, ((5 - zPos) / 245) * 100)));

  return (
    <div className="flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full">
      {/* Minimal Coords */}
      <div className="flex items-center gap-3 text-[9px] font-mono text-cyan-400/80">
        <span className="flex items-center gap-1">
          <Navigation className="w-3 h-3 text-cyan-500" />
          X: {Math.round(playerPos[0])}m
        </span>
        <span className="w-1 h-1 rounded-full bg-cyan-950" />
        <span>
          Z: {Math.round(playerPos[2])}m
        </span>
      </div>

      {/* Slim Progress Bar */}
      <div className="flex flex-col gap-1 w-full bg-black/40 backdrop-blur-md border border-cyan-500/10 p-2.5 rounded-xl">
        <div className="flex items-center justify-between text-[8px] font-mono text-cyan-400/80 uppercase tracking-widest leading-none mb-1">
          <span>VECTOR</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-1 rounded-full bg-cyan-950 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function GameHUD({ onOpenPlayers }: GameHUDProps) {
  const currentCheckpoint = useGameStore((state) => state.currentCheckpoint);
  const toggleMap = useGameStore((state) => state.toggleMap);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);

  const correctAnswers = useGameStore((state) => state.correctAnswers);
  const wrongAnswers = useGameStore((state) => state.wrongAnswers);
  const extraQuestions = useGameStore((state) => state.extraQuestionsAdded);
  const mcqQueue = useGameStore((state) => state.mcqQueue);
  const currentQIndex = useGameStore((state) => state.currentQueueIndex);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none p-4 sm:p-8 flex flex-col justify-between select-none">
      {/* Top Bar HUD */}
      <div className="flex flex-row items-start justify-between w-full pointer-events-auto">
        {/* Top-Left: Minimal Title */}
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-cyan-400 leading-none">
            CYBER ESCAPE
          </span>
          <span className="text-lg sm:text-2xl font-black font-mono tracking-wider text-white mt-1 leading-none">
            ROUND 03
          </span>
        </div>

        {/* Top-Right: TIME & CHECKPOINT Badge */}
        <div className="flex items-center gap-6 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-cyan-500/20 shadow-[0_0_20px_rgba(6,180,212,0.15)]">
          {/* Time Counter */}
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-cyan-500/60 uppercase tracking-widest leading-none mb-1">
              TIME
            </span>
            <HUDTimer />
          </div>

          {/* Checkpoint Counter */}
          <div className="flex flex-col items-end pl-5 border-l border-cyan-500/10">
            <span className="text-[8px] font-mono text-[#F4B942]/80 uppercase tracking-widest leading-none mb-1">
              CHECKPOINT
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300 tracking-wider">
              {(currentCheckpoint + 1).toString().padStart(2, '0')} / {mcqQueue.length.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Middle-Left: Very Minimal MCQ Stat details */}
      <div className="absolute top-28 left-4 pointer-events-auto hidden sm:flex flex-col gap-2">
        <div className="px-3.5 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-cyan-500/10 flex flex-col gap-1.5 text-[9px] font-mono shadow-[0_0_20px_rgba(6,180,212,0.05)] w-44 text-slate-300">
          <div className="flex items-center gap-1.5 border-b border-cyan-950 pb-1.5 mb-1 text-cyan-400 font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            TELEMETRY
          </div>
          <div className="flex justify-between items-center">
            <span>SOLVED:</span>
            <span className="text-cyan-400 font-bold">{currentQIndex} / {mcqQueue.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>CORRECT:</span>
            <span className="text-[#10B981] font-bold">{correctAnswers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>INCORRECT:</span>
            <span className="text-[#EF4444] font-bold">{wrongAnswers}</span>
          </div>
          {extraQuestions > 0 && (
            <div className="flex justify-between items-center text-[#F59E0B] border-t border-cyan-950 pt-1.5 mt-1 font-bold">
              <span>PENALTIES:</span>
              <span>+{extraQuestions}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row HUD */}
      <div className="flex flex-row items-end justify-between w-full pointer-events-auto gap-4">
        {/* Bottom-Left: Coordinates & Progress */}
        <HUDTelemetry />

        {/* Bottom-Right: Tiny Glass Controls */}
        <div className="flex items-center gap-2">
          {/* Room / Lobby */}
          <button
            onClick={onOpenPlayers}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/20 text-[9px] font-mono font-bold text-cyan-300 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Users className="w-3 h-3 text-cyan-400" />
            <span>ROOM</span>
          </button>

          {/* Map [M] */}
          <button
            onClick={toggleMap}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/20 text-[9px] font-mono font-bold text-cyan-300 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Map className="w-3 h-3 text-cyan-400" />
            <span>MAP [M]</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-black/40 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/20 text-cyan-300 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>
      </div>
    </div>
  );
}
