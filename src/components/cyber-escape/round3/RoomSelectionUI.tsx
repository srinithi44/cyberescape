'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Radio, HelpCircle, ArrowRight, Compass } from 'lucide-react';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { soundEngine } from '@/lib/cyber-escape/round3/soundEngine';

export function RoomSelectionUI() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const displayName = useGameStore((state) => state.displayName);
  const roomCode = useGameStore((state) => state.roomCode);
  const joinRoom = useGameStore((state) => state.joinRoom);
  const connectionStatus = useGameStore((state) => state.connectionStatus);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const initGame = useGameStore((state) => state.initGame);

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');

  if (gameStatus !== 'room_selection' && gameStatus !== 'lobby') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick(soundEnabled);

    if (!name.trim()) {
      setError('Player identity tag is required.');
      return;
    }
    if (!room.trim() || room.trim().length < 3) {
      setError('Room Code must be at least 3 characters (e.g. CYB-101).');
      return;
    }

    setError('');
    joinRoom(room, name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071A2F] text-white select-none">
      {/* Dynamic Background Grid & Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-[#22D3EE]/5 blur-[120px] animate-pulse" />
        <div className="w-[400px] h-[400px] rounded-full bg-[#0E5AA7]/5 blur-[100px] absolute -top-20 -right-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md p-8 rounded-3xl border border-[#22D3EE]/30 bg-[#071A2F]/90 shadow-[0_0_60px_rgba(34,211,238,0.2)] backdrop-blur-md overflow-hidden"
      >
        {/* Tech scanline overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(34,211,238,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

        {gameStatus === 'room_selection' ? (
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Badge */}
            <motion.div 
              animate={{ rotateY: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-2xl bg-[#071A2F] border border-[#22D3EE]/60 flex items-center justify-center text-[#22D3EE] shadow-[0_0_30px_rgba(34,211,238,0.4)] mb-5"
            >
              <Shield className="w-8 h-8" />
            </motion.div>

            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
              CYBER ESCAPE • COMPETITION
            </span>
            <h1 className="text-xl sm:text-2xl font-black font-mono uppercase tracking-wider text-white text-center mb-6">
              LOKI SECURE GATEWAY
            </h1>

            <form onSubmit={handleSubmit} className="w-full space-y-5">
              {/* Identity Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 block tracking-widest uppercase">
                  IDENTITY TAG // DISPLAY NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 16))}
                  disabled={connectionStatus === 'CONNECTING'}
                  placeholder="Enter display name..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:border-[#22D3EE]/50 font-sans text-sm shadow-inner transition-all disabled:opacity-50"
                />
              </div>

              {/* Room Code Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 block tracking-widest uppercase">
                  SESSION CODE // ROOM CODE
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 12))}
                  disabled={connectionStatus === 'CONNECTING'}
                  placeholder="e.g. CYB-4821"
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:border-[#22D3EE]/50 font-mono text-sm tracking-wider shadow-inner transition-all disabled:opacity-50"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-amber-950/90 border border-[#F4B942]/40 text-[#F4B942] font-mono text-xs text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={connectionStatus === 'CONNECTING'}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#0E5AA7] text-white hover:brightness-110 active:scale-[0.98] transition-all font-mono font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-70 disabled:pointer-events-none"
              >
                {connectionStatus === 'CONNECTING' ? (
                  <>
                    <Radio className="w-4 h-4 animate-pulse text-[#F4B942]" />
                    LINKING SECURE TUNNEL...
                  </>
                ) : (
                  <>
                    CONNECT TO SESSION
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Connected players info details */}
            <div className="mt-8 pt-4 border-t border-slate-800 w-full flex items-center justify-between text-[9px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                SOLO OR GROUP CODES SUPPORTED
              </span>
              <span className="flex items-center gap-0.5 text-slate-500 hover:text-slate-300 cursor-help">
                <HelpCircle className="w-3 h-3" />
                INFO
              </span>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            {/* Compass Loader */}
            <div className="relative mb-5">
              <Compass className="w-16 h-16 text-[#22D3EE] animate-spin" style={{ animationDuration: '10s' }} />
              <div className="absolute inset-0 w-16 h-16 rounded-full border border-cyan-500/30 animate-ping" />
            </div>

            <span className="text-[10px] font-mono font-bold text-[#F4B942] uppercase tracking-widest block mb-1">
              LINK SECURED // TUNNEL ONLINE
            </span>
            <h1 className="text-xl sm:text-2xl font-black font-mono uppercase tracking-wider text-white text-center mb-6">
              SESSION LOBBY
            </h1>

            {/* Room Info */}
            <div className="w-full p-4 rounded-2xl bg-slate-950/70 border border-cyan-950 flex flex-col gap-3 font-mono text-xs mb-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">ACTIVE ROOM:</span>
                <span className="text-[#F4B942] font-bold tracking-wider">{roomCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">LINK STATUS:</span>
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  CONNECTED
                </span>
              </div>
            </div>

            {/* Connected players list */}
            <div className="w-full space-y-2 mb-8 text-left">
              <span className="text-[10px] font-mono font-bold text-slate-400 block tracking-widest uppercase mb-1">
                ONLINE CLIENTS (1)
              </span>
              
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

            {/* Start button */}
            <button
              onClick={() => {
                soundEngine.playClick(soundEnabled);
                initGame();
              }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-[#F4B942] text-black hover:brightness-110 active:scale-[0.98] transition-all font-mono font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(244,185,66,0.4)]"
            >
              START MISSION
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
