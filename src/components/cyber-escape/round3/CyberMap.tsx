'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Navigation, Award, Cpu, Shield, Database, Compass, Landmark, Activity, AlertTriangle, CpuIcon } from 'lucide-react';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';

export function CyberMap() {
  const isMapOpen = useGameStore((state) => state.isMapOpen);
  const setIsMapOpen = useGameStore((state) => state.setIsMapOpen);
  const playerPos = useGameStore((state) => state.playerPosition);
  const route1 = useGameStore((state) => state.routeBranches[0] || 'none');
  const route2 = useGameStore((state) => state.routeBranches[1] || 'none');

  if (!isMapOpen) return null;

  // Convert player 3D coordinates (X: -36 to 36, Z: 5 to -250) to tactical map percentage (X: 10% to 90%, Y: 92% to 8%)
  const playerXPercent = Math.min(95, Math.max(5, 50 + (playerPos[0] / 36) * 35));
  const playerYPercent = Math.min(95, Math.max(5, 90 - ((5 - playerPos[2]) / 255) * 82));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.94, rotateX: 10 }}
          className="relative w-full max-w-4xl h-[88vh] p-6 rounded-3xl border border-cyan-500/60 shadow-[0_0_80px_rgba(34,211,238,0.45)] flex flex-col justify-between text-white bg-[#071A2F]/95"
        >
          {/* Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(34,211,238,0.04)_50%)] bg-[length:100%_4px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-cyan-800/40 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#071A2F]/85 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                <Navigation className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold font-mono tracking-widest uppercase flex items-center gap-2">
                  TACTICAL RADAR TELEMETRY
                  <span className="text-[8px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-400 animate-pulse font-mono font-bold">
                    GPS LOCK
                  </span>
                </h2>
                <span className="text-[9px] font-mono text-cyan-300/70">
                  REAL-TIME SPATIAL GRID MAPPING // LOCATOR ONLINE
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMapOpen(false)}
              className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-800 transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Tactical 3D Map Grid Area */}
          <div className="relative flex-1 my-4 rounded-2xl bg-[#01090a] border border-cyan-900/50 overflow-hidden">
            {/* Background Tech Mesh */}
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #22D3EE 1.5px, transparent 1.5px), linear-gradient(to bottom, #22D3EE 1.5px, transparent 1.5px)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Radar Sweep Animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)',
                backgroundPosition: '50% 50%',
              }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Vector Map SVG with Glowing Lines */}
            <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Region Grid Separators */}
              <line x1="0" y1="78" x2="100" y2="78" stroke="#083a3f" strokeWidth="0.25" strokeDasharray="3,3" />
              <line x1="0" y1="55" x2="100" y2="55" stroke="#083a3f" strokeWidth="0.25" strokeDasharray="3,3" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="#083a3f" strokeWidth="0.25" strokeDasharray="3,3" />

              {/* ── ENERGY RIVERS (GLOWING) ── */}
              {/* River 1 (Cyan, Y = 68) */}
              <path d="M 0 68 Q 25 66, 50 68 T 100 68" fill="none" stroke="#0E5AA7" strokeWidth="2.0" opacity="0.3" />
              <path d="M 0 68 Q 25 66, 50 68 T 100 68" fill="none" stroke="#22D3EE" strokeWidth="0.8" filter="url(#glow-cyan)" />

              {/* River 2 (Cyan-Blue, Y = 43) */}
              <path d="M 0 43 Q 25 45, 50 43 T 100 43" fill="none" stroke="#0E5AA7" strokeWidth="2.0" opacity="0.3" />
              <path d="M 0 43 Q 25 45, 50 43 T 100 43" fill="none" stroke="#22D3EE" strokeWidth="0.8" filter="url(#glow-cyan)" />

              {/* ── HIGHWAY PATHS (GLOWING) ── */}
              {/* Segment 1: Start to Checkpoint 1 */}
              <line x1="50" y1="90" x2="50" y2="78" stroke="#0E5AA7" strokeWidth="2.2" />
              <line x1="50" y1="90" x2="50" y2="78" stroke="#22D3EE" strokeWidth="0.8" filter="url(#glow-cyan)" />

              {/* Checkpoint 1 Fork Branches */}
              {/* Shortcut 1 (Straight, X=50) */}
              <line
                x1="50"
                y1="78"
                x2="50"
                y2="55"
                stroke={route1 === 'shortcut' ? '#22D3EE' : '#071A2F'}
                strokeWidth={route1 === 'shortcut' ? '2.2' : '1.2'}
                filter={route1 === 'shortcut' ? 'url(#glow-cyan)' : 'none'}
              />
              {/* Detour 1 (Curves Right, X=75) */}
              <path
                d="M 50 78 C 76 78, 76 55, 50 55"
                fill="none"
                stroke={route1 === 'detour' ? '#F4B942' : '#071A2F'}
                strokeWidth={route1 === 'detour' ? '2.0' : '1.0'}
                strokeDasharray={route1 === 'detour' ? 'none' : '1.5,1.5'}
                filter={route1 === 'detour' ? 'url(#glow-orange)' : 'none'}
              />

              {/* Segment 2: CP1/CP2 to Checkpoint 2 (X=50, Y=55) */}
              <line x1="50" y1="55" x2="50" y2="52" stroke="#0E5AA7" strokeWidth="2.2" />

              {/* Checkpoint 2 Fork Branches */}
              {/* Shortcut 2 (Straight, X=50) */}
              <line
                x1="50"
                y1="52"
                x2="50"
                y2="30"
                stroke={route2 === 'shortcut' ? '#22D3EE' : '#071A2F'}
                strokeWidth={route2 === 'shortcut' ? '2.2' : '1.2'}
                filter={route2 === 'shortcut' ? 'url(#glow-cyan)' : 'none'}
              />
              {/* Detour 2 (Curves Left, X=25) */}
              <path
                d="M 50 52 C 24 52, 24 30, 50 30"
                fill="none"
                stroke={route2 === 'detour' ? '#F4B942' : '#071A2F'}
                strokeWidth={route2 === 'detour' ? '2.0' : '1.0'}
                strokeDasharray={route2 === 'detour' ? 'none' : '1.5,1.5'}
                filter={route2 === 'detour' ? 'url(#glow-orange)' : 'none'}
              />

              {/* Segment 3: Checkpoint 3 to Final Portal */}
              <line x1="50" y1="30" x2="50" y2="10" stroke="#0E5AA7" strokeWidth="2.4" />
              <line x1="50" y1="30" x2="50" y2="10" stroke="#22D3EE" strokeWidth="0.8" filter="url(#glow-cyan)" />
            </svg>

            {/* ── DISTRICT LABELS ── */}
            <div className="absolute top-[82%] left-4 text-[8px] font-mono text-cyan-400/60 uppercase">District 01: Cyber Precinct</div>
            <div className="absolute top-[58%] left-4 text-[8px] font-mono text-cyan-400/60 uppercase">District 02: Network Grid</div>
            <div className="absolute top-[33%] left-4 text-[8px] font-mono text-cyan-400/60 uppercase">District 03: Data Vaults</div>
            <div className="absolute top-[12%] left-4 text-[8px] font-mono text-cyan-400/60 uppercase">District 04: Quantum Portal</div>

            {/* ── LANDMARK NODES ── */}
            {/* Cyber Lab (Left, Y=84) */}
            <div className="absolute top-[83%] left-[16%] flex flex-col items-center">
              <div className="w-5 h-5 rounded bg-[#071A2F] border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-[8px] shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <Cpu className="w-3 h-3" />
              </div>
              <span className="text-[7px] text-cyan-300/60 scale-90 mt-0.5">LAB-01</span>
            </div>
            {/* Cyber Tower (Right, Y=81) */}
            <div className="absolute top-[80%] left-[80%] flex flex-col items-center">
              <div className="w-5 h-5 rounded bg-[#071A2F] border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-[8px] shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <Landmark className="w-3 h-3" />
              </div>
              <span className="text-[7px] text-cyan-300/60 scale-90 mt-0.5">TOWER</span>
            </div>
            {/* Network Tower (Right, Y=50) */}
            <div className="absolute top-[49%] left-[81%] flex flex-col items-center">
              <div className="w-5 h-5 rounded bg-[#071A2F] border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-[8px] shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <Navigation className="w-3 h-3" />
              </div>
              <span className="text-[7px] text-cyan-300/60 scale-90 mt-0.5">NET-CTR</span>
            </div>
            {/* Database Vault (Left, Y=26) */}
            <div className="absolute top-[25%] left-[15%] flex flex-col items-center">
              <div className="w-5 h-5 rounded bg-[#071A2F] border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-[8px] shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                <Database className="w-3 h-3" />
              </div>
              <span className="text-[7px] text-cyan-300/60 scale-90 mt-0.5">VAULT</span>
            </div>

            {/* ── PHYSICAL LANDMARK NODES ── */}
            {/* Start Node */}
            <div className="absolute top-[90%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-cyan-900 border border-white flex items-center justify-center text-[7px] font-bold">
                S
              </div>
            </div>

            {/* Checkpoint 1 Node */}
            <div className="absolute top-[78%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[8px] font-bold ${
                route1 !== 'none' ? 'bg-[#071A2F] border-cyan-400 text-cyan-400 shadow-[0_0_10px_#22D3EE]' : 'bg-black border-cyan-600 text-cyan-300'
              }`}>
                CP1
              </div>
            </div>

            {/* Checkpoint 2 Node */}
            <div className="absolute top-[52%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[8px] font-bold ${
                route2 !== 'none' ? 'bg-[#071A2F] border-cyan-400 text-cyan-400 shadow-[0_0_10px_#22D3EE]' : 'bg-black border-cyan-600 text-cyan-300'
              }`}>
                CP2
              </div>
            </div>

            {/* Checkpoint 3 Node */}
            <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[8px] font-bold bg-black border-cyan-600 text-cyan-300`}>
                CP3
              </div>
            </div>

            {/* Portal Destination Node */}
            <div className="absolute top-[10%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#071A2F] border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_#22D3EE] animate-pulse">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* ── REAL-TIME PLAYER MARKER ── */}
            <motion.div
              className="absolute z-30 flex items-center gap-1.5 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${playerYPercent}%`,
                left: `${playerXPercent}%`,
              }}
              animate={{ scale: [0.94, 1.14, 0.94] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_20px_#22D3EE] flex items-center justify-center">
                <MapPin className="w-3 h-3 text-black" />
              </div>
              <span className="px-1.5 py-0.5 rounded bg-black/90 border border-cyan-400 text-[8px] font-bold text-cyan-300 tracking-wider">
                LOKI
              </span>
            </motion.div>
          </div>

          {/* Footer controls & spatial status readout */}
          <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400 pt-2 border-t border-cyan-800/40 relative z-10">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              PRESS [M] OR CLOSE TO RESUME GAMEPLAY
            </span>
            <span>TELEMETRY: Z = {Math.round(playerPos[2])}m // X = {Math.round(playerPos[0])}m</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
