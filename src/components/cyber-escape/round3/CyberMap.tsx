'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Navigation, Award, Cpu, Shield, Database, Compass, Landmark, Activity, AlertTriangle, CpuIcon } from 'lucide-react';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';

export function CyberMap() {
  const isMapOpen = useGameStore((state) => state.isMapOpen);
  const setIsMapOpen = useGameStore((state) => state.setIsMapOpen);
  const playerPos = useGameStore((state) => state.playerPosition);
  
  const route0 = useGameStore((state) => state.routeBranches[0] || 'none');
  const route1 = useGameStore((state) => state.routeBranches[1] || 'none');
  const route2 = useGameStore((state) => state.routeBranches[2] || 'none');
  const route3 = useGameStore((state) => state.routeBranches[3] || 'none');
  const route4 = useGameStore((state) => state.routeBranches[4] || 'none');
  const route5 = useGameStore((state) => state.routeBranches[5] || 'none');
  
  const checkpointAnswers = useGameStore((state) => state.checkpointAnswers);

  if (!isMapOpen) return null;

  // Convert player 3D coordinates (X: -36 to 36, Z: 5 to -250) to tactical map percentage (X: 10% to 90%, Y: 92% to 8%)
  const playerXPercent = Math.min(95, Math.max(5, 50 + (playerPos[0] / 36) * 35));
  const playerYPercent = Math.min(95, Math.max(5, 90 - ((5 - playerPos[2]) / 255) * 82));

  return (
    <AnimatePresence>
      <div className="fixed right-4 top-28 bottom-24 w-80 z-30 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
          className="pointer-events-auto relative w-full h-full p-4 rounded-2xl border border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.25)] flex flex-col justify-between text-white bg-[#071A2F]/90 backdrop-blur-md"
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
              <line x1="0" y1="80" x2="100" y2="80" stroke="#083a3f" strokeWidth="0.2" strokeDasharray="3,3" />
              <line x1="0" y1="60" x2="100" y2="60" stroke="#083a3f" strokeWidth="0.2" strokeDasharray="3,3" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#083a3f" strokeWidth="0.2" strokeDasharray="3,3" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="#083a3f" strokeWidth="0.2" strokeDasharray="3,3" />

              {/* ── HIGHWAY PATHS ── */}
              {/* Start (Y=90) to Checkpoint 1 (Y=82) */}
              <line x1="50" y1="90" x2="50" y2="82" stroke="#0E5AA7" strokeWidth="2.0" />
              <line x1="50" y1="90" x2="50" y2="82" stroke="#22D3EE" strokeWidth="0.6" filter="url(#glow-cyan)" />

              {/* Fork 1: Shortcut 1 (straight, Y=82 to 72) */}
              <line
                x1="50" y1="82" x2="50" y2="72"
                stroke={route0 === 'shortcut' ? '#22D3EE' : '#071A2F'}
                strokeWidth={route0 === 'shortcut' ? '2.0' : '1.0'}
                filter={route0 === 'shortcut' ? 'url(#glow-cyan)' : 'none'}
              />
              {/* Fork 1: Detour 1 (curving right, Y=82 to 72) */}
              <path
                d="M 50 82 C 65 82, 65 72, 50 72"
                fill="none"
                stroke={route0 === 'detour' ? '#F4B942' : '#071A2F'}
                strokeWidth={route0 === 'detour' ? '2.0' : '1.0'}
                strokeDasharray={route0 === 'detour' ? 'none' : '1.5,1.5'}
                filter={route0 === 'detour' ? 'url(#glow-orange)' : 'none'}
              />

              {/* Segment 2: Fork 1 output (Y=72) to CP 2 (Y=62) */}
              <line x1="50" y1="72" x2="50" y2="62" stroke="#0E5AA7" strokeWidth="2.0" />

              {/* Segment 3: CP 2 (Y=62) to CP 3 (Y=56) */}
              <line x1="50" y1="62" x2="50" y2="56" stroke="#0E5AA7" strokeWidth="2.0" />

              {/* Fork 2: Shortcut 2 (straight, Y=56 to 40) */}
              <line
                x1="50" y1="56" x2="50" y2="40"
                stroke={route2 === 'shortcut' ? '#22D3EE' : '#071A2F'}
                strokeWidth={route2 === 'shortcut' ? '2.0' : '1.0'}
                filter={route2 === 'shortcut' ? 'url(#glow-cyan)' : 'none'}
              />
              {/* Fork 2: Detour 2 (curving left, Y=56 to 40) */}
              <path
                d="M 50 56 C 35 56, 35 40, 50 40"
                fill="none"
                stroke={route2 === 'detour' ? '#F4B942' : '#071A2F'}
                strokeWidth={route2 === 'detour' ? '2.0' : '1.0'}
                strokeDasharray={route2 === 'detour' ? 'none' : '1.5,1.5'}
                filter={route2 === 'detour' ? 'url(#glow-orange)' : 'none'}
              />

              {/* Segment 4: Fork 2 output (Y=40) to CP 5 (Y=32) */}
              <line x1="50" y1="40" x2="50" y2="32" stroke="#0E5AA7" strokeWidth="2.0" />

              {/* Segment 5: CP 5 (Y=32) to CP 6 (Y=24) */}
              <line x1="50" y1="32" x2="50" y2="24" stroke="#0E5AA7" strokeWidth="2.0" />

              {/* Segment 6: CP 6 (Y=24) to Coding 1 (Y=18) */}
              <line x1="50" y1="24" x2="50" y2="18" stroke="#0E5AA7" strokeWidth="2.0" />

              {/* Segment 7: Coding 1 to Coding 2 (Y=13) */}
              <line x1="50" y1="18" x2="50" y2="13" stroke="#0E5AA7" strokeWidth="2.0" />

              {/* Segment 8: Coding 2 to Portal (Y=8) */}
              <line x1="50" y1="13" x2="50" y2="8" stroke="#0E5AA7" strokeWidth="2.0" />
              <line x1="50" y1="13" x2="50" y2="8" stroke="#22D3EE" strokeWidth="0.6" filter="url(#glow-cyan)" />
            </svg>

            {/* ── DISTRICT LABELS ── */}
            <div className="absolute top-[84%] left-4 text-[7px] font-mono text-cyan-400/50 uppercase">District 01: Cyber Precinct</div>
            <div className="absolute top-[66%] left-4 text-[7px] font-mono text-cyan-400/50 uppercase">District 02: City Grid</div>
            <div className="absolute top-[46%] left-4 text-[7px] font-mono text-cyan-400/50 uppercase">District 03: Data Vaults</div>
            <div className="absolute top-[26%] left-4 text-[7px] font-mono text-cyan-400/50 uppercase">District 04: AI Core</div>

            {/* ── LANDMARK NODES ── */}
            {/* Start Node */}
            <div className="absolute top-[90%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-900 border border-white flex items-center justify-center text-[7px] font-bold">
                S
              </div>
            </div>

            {/* CP 1 Node */}
            <div className="absolute top-[82%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold ${
                checkpointAnswers[0] ? 'bg-[#071A2F] border-cyan-400 text-cyan-400 shadow-[0_0_8px_#22D3EE]' : 'bg-black border-cyan-600 text-cyan-300'
              }`}>
                CP1
              </div>
            </div>

            {/* Detour 1-D Node (X=60, Y=77) */}
            {route0 === 'detour' && (
              <div className="absolute top-[77%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold ${
                  checkpointAnswers[1] ? 'bg-[#071A2F] border-amber-400 text-amber-400 shadow-[0_0_8px_#F4B942]' : 'bg-black border-amber-600 text-amber-300'
                }`}>
                  1D
                </div>
              </div>
            )}

            {/* CP 2 Node */}
            <div className="absolute top-[62%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold ${
                checkpointAnswers[2] ? 'bg-[#071A2F] border-cyan-400 text-cyan-400 shadow-[0_0_8px_#22D3EE]' : 'bg-black border-cyan-600 text-cyan-300'
              }`}>
                CP2
              </div>
            </div>

            {/* CP 3 Node */}
            <div className="absolute top-[56%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold ${
                checkpointAnswers[3] ? 'bg-[#071A2F] border-cyan-400 text-cyan-400 shadow-[0_0_8px_#22D3EE]' : 'bg-black border-cyan-600 text-cyan-300'
              }`}>
                CP3
              </div>
            </div>

            {/* Detour 2-D Node (X=40, Y=48) */}
            {route2 === 'detour' && (
              <div className="absolute top-[48%] left-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold ${
                  checkpointAnswers[4] ? 'bg-[#071A2F] border-amber-400 text-amber-400 shadow-[0_0_8px_#F4B942]' : 'bg-black border-amber-600 text-amber-300'
                }`}>
                  2D
                </div>
              </div>
            )}

            {/* CP 4 Node (X=50, Y=48) */}
            {route2 === 'shortcut' && (
              <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold ${
                  checkpointAnswers[5] ? 'bg-[#071A2F] border-cyan-400 text-cyan-400 shadow-[0_0_8px_#22D3EE]' : 'bg-black border-cyan-600 text-cyan-300'
                }`}>
                  CP4
                </div>
              </div>
            )}

            {/* CP 5 Node */}
            <div className="absolute top-[32%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold ${
                checkpointAnswers[6] ? 'bg-[#071A2F] border-cyan-400 text-cyan-400 shadow-[0_0_8px_#22D3EE]' : 'bg-black border-cyan-600 text-cyan-300'
              }`}>
                CP5
              </div>
            </div>

            {/* CP 6 Node */}
            <div className="absolute top-[24%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold ${
                checkpointAnswers[7] ? 'bg-[#071A2F] border-cyan-400 text-cyan-400 shadow-[0_0_8px_#22D3EE]' : 'bg-black border-cyan-600 text-cyan-300'
              }`}>
                CP6
              </div>
            </div>

            {/* Coding Challenge 1 Node */}
            <div className="absolute top-[18%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-5 h-5 rounded bg-black border border-cyan-600 flex items-center justify-center text-[7px] font-bold">
                C1
              </div>
            </div>

            {/* Coding Challenge 2 Node */}
            <div className="absolute top-[13%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-5 h-5 rounded bg-black border border-cyan-600 flex items-center justify-center text-[7px] font-bold">
                C2
              </div>
            </div>

            {/* Portal Destination Node */}
            <div className="absolute top-[8%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#071A2F] border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_#22D3EE] animate-pulse">
                <Award className="w-3 h-3" />
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
              <div className="w-4.5 h-4.5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_15px_#22D3EE] flex items-center justify-center">
                <MapPin className="w-2.5 h-2.5 text-black" />
              </div>
              <span className="px-1 py-0.2 rounded bg-black/90 border border-cyan-400 text-[6px] font-bold text-cyan-300 tracking-wider">
                LOKI
              </span>
            </motion.div>
          </div>

          {/* Footer controls & spatial status readout */}
          <div className="flex items-center justify-between text-[8px] font-mono text-cyan-400 pt-2 border-t border-cyan-800/40 relative z-10">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              PRESS [M] OR CLOSE TO HIDE MAP
            </span>
            <span>Z={Math.round(playerPos[2])}m // X={Math.round(playerPos[0])}m</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
