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

export function GameHUD({ onOpenPlayers }: GameHUDProps) {
  const timerMs = useGameStore((state) => state.timerMs);
  const currentCheckpoint = useGameStore((state) => state.currentCheckpoint);
  const playerPos = useGameStore((state) => state.playerPosition);
  const toggleMap = useGameStore((state) => state.toggleMap);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);

  const correctAnswers = useGameStore((state) => state.correctAnswers);
  const wrongAnswers = useGameStore((state) => state.wrongAnswers);
  const extraQuestions = useGameStore((state) => state.extraQuestionsAdded);
  const mcqQueue = useGameStore((state) => state.mcqQueue);
  const currentQIndex = useGameStore((state) => state.currentQueueIndex);

  // Compute escape progress percentage (Start: Z = 5, End/Portal: Z = -240)
  const zPos = playerPos[2];
  const progressPercent = Math.round(Math.min(100, Math.max(0, ((5 - zPos) / 245) * 100)));

  return (
    <div className="fixed inset-0 z-40 pointer-events-none p-4 sm:p-6 flex flex-col justify-between select-none">
      {/* Top Bar HUD */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full pointer-events-auto gap-4">
        {/* Top-Left: Game Title Badge */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#071A2F]/80 backdrop-blur-md border border-[#22D3EE]/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
          <div className="relative">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '16s' }} />
            <div className="absolute inset-0 w-5 h-5 rounded-full border border-cyan-400/30 animate-ping" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest block leading-tight">
              CYBER ESCAPE // ROUND 3
            </span>
            <span className="text-[11px] font-black text-white font-mono tracking-wider uppercase">
              NODE QUANTUM ESCAPE
            </span>
          </div>
        </div>

        {/* Top-Right Metrics Panel */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          {/* Room / Players Button */}
          <button
            onClick={onOpenPlayers}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#071A2F]/80 border border-cyan-500/50 hover:border-cyan-400 text-xs font-mono font-bold text-cyan-300 hover:text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(6,180,212,0.25)] active:scale-95"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>ROOM</span>
          </button>

          {/* Checkpoint Counter */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#071A2F]/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
            <Shield className="w-4 h-4 text-[#F4B942]" />
            <span>NODE {currentCheckpoint + 1} / 10</span>
          </div>

          {/* Stopwatch */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#071A2F]/80 border border-[#22D3EE]/50 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-cyan-400/80 uppercase tracking-widest block leading-tight">
                ELAPSED TIME
              </span>
              <span className="text-sm sm:text-base font-mono font-bold text-white tracking-wider">
                {formatTimer(timerMs)}
              </span>
            </div>
          </div>

          {/* Tactical Map Trigger */}
          <button
            onClick={toggleMap}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#071A2F]/80 border border-cyan-500/50 hover:border-cyan-400 text-xs font-mono font-bold text-cyan-300 hover:text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(6,180,212,0.3)] active:scale-95"
          >
            <Map className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">MAP [M]</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-2xl bg-[#071A2F]/80 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Middle side: MCQ Stat summary panel */}
      <div className="absolute top-28 left-4 pointer-events-auto flex flex-col gap-2">
        <div className="px-4 py-3 rounded-2xl bg-[#071A2F]/90 border border-cyan-500/30 flex flex-col gap-2 text-[10px] font-mono shadow-[0_0_20px_rgba(34,211,238,0.1)] w-48 text-slate-300">
          <div className="flex items-center gap-1.5 border-b border-cyan-950 pb-1.5 mb-1 text-cyan-400 font-bold uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            MCQ TELEMETRY
          </div>
          <div className="flex justify-between items-center">
            <span>SOLVED:</span>
            <span className="text-[#22D3EE] font-bold">{currentQIndex} / {mcqQueue.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>CORRECT:</span>
            <span className="text-cyan-400 font-bold">{correctAnswers}</span>
          </div>
          <div className="flex justify-between items-center text-[#F4B942]">
            <span>INCORRECT:</span>
            <span className="font-bold">{wrongAnswers}</span>
          </div>
          {extraQuestions > 0 && (
            <div className="flex justify-between items-center text-[#F4B942] animate-pulse border-t border-cyan-950 pt-1.5 mt-1 font-bold">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-[#F4B942]" />
                PENALTY MCQs:
              </span>
              <span>+{extraQuestions}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom HUD: Coordinates & Escaping Vector Progress */}
      <div className="w-full flex flex-col gap-3 pointer-events-auto max-w-xl mx-auto sm:mx-0">
        {/* Progress Tracker bar */}
        <div className="w-full p-3 rounded-2xl bg-[#071A2F]/90 border border-[#22D3EE]/30 shadow-[0_0_25px_rgba(34,211,238,0.15)] flex flex-col gap-2">
          <div className="flex items-center justify-between text-[8px] font-mono text-cyan-400 tracking-wider">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              ESCAPE VECTOR PROGRESS
            </span>
            <span>{progressPercent}% COMPLETE</span>
          </div>
          
          {/* Progress Bar Track */}
          <div className="w-full h-2 rounded-full bg-[#071A2F]/40 border border-[#0E5AA7]/40 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0E5AA7] via-[#22D3EE] to-[#F4B942] shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Telemetry Coordinate strip */}
        <div className="flex items-center justify-between">
          <div className="px-4 py-2.5 rounded-xl bg-slate-950/90 border border-cyan-900/60 text-[9px] font-mono text-cyan-300/90 shadow-xl flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>
              LOKI CONTROLS: <span className="text-cyan-400 font-bold">[W][A][S][D]</span> TO MOVE • <span className="text-cyan-400 font-bold">[M]</span> FOR MAP
            </span>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-slate-950/90 border border-cyan-900/60 text-[9px] font-mono text-cyan-300/90 shadow-xl flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              COORDS: X={Math.round(playerPos[0])}m // Z={Math.round(playerPos[2])}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
