'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Info, ShieldAlert } from 'lucide-react';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { soundEngine } from '@/lib/cyber-escape/round3/soundEngine';

interface PlayersPanelProps {
  onClose: () => void;
}

export function PlayersPanel({ onClose }: PlayersPanelProps) {
  const roomCode = useGameStore((state) => state.roomCode);
  const displayName = useGameStore((state) => state.displayName);
  const connectionStatus = useGameStore((state) => state.connectionStatus);
  const soundEnabled = useGameStore((state) => state.soundEnabled);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-black/40 backdrop-blur-sm">
        {/* Backdrop clickable space */}
        <div className="absolute inset-0 cursor-default" onClick={() => {
          soundEngine.playClick(soundEnabled);
          onClose();
        }} />

        <motion.div
          initial={{ opacity: 0, x: 250 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 250 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-sm h-[90vh] p-6 rounded-3xl border border-[#22D3EE]/30 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col bg-[#071A2F]/95 text-white z-10"
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(34,211,238,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-800/30">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold font-mono tracking-wider uppercase">SESSION PARTICIPANTS</h3>
                <span className="text-[9px] font-mono text-cyan-300/70">ROOM IDENTIFIER OVERVIEW</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick(soundEnabled);
                onClose();
              }}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-white cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 py-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Room Stats */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-950 flex flex-col gap-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ACTIVE ROOM:</span>
                  <span className="text-[#F4B942] font-bold tracking-wider">{roomCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">LINK STATUS:</span>
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    {connectionStatus}
                  </span>
                </div>
              </div>

              {/* Connected Players list */}
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 block tracking-widest uppercase mb-3">
                  ONLINE CLIENTS (1)
                </span>
                
                <div className="space-y-2">
                  <div className="px-4 py-3 rounded-xl border border-[#22D3EE]/30 bg-cyan-950/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500 flex items-center justify-center text-[9px] font-bold text-[#22D3EE]">
                        P1
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{displayName}</span>
                    </div>
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#071A2F]/90 border border-cyan-500 text-cyan-400 uppercase font-bold">
                      YOU (LOKI)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending alert warnings */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 text-[10px] leading-relaxed text-amber-300 font-mono flex gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-[#F4B942]" />
                <div>
                  <span className="font-bold text-[#F4B942] block mb-1">REAL-TIME NOTICE:</span>
                  Multiplayer synchronization requires backend/realtime integration. Other connected players will not render in the 3D world until a WebSocket endpoint is linked.
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[#22D3EE]/20 bg-[#0E5AA7]/10 text-[10px] leading-relaxed text-cyan-300 font-mono flex gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <div>
                  <span className="font-bold block mb-1">LEADERBOARD TUNNEL:</span>
                  You can register multiple competitive runs in the same Room Code locally by replaying with different names on this device.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
