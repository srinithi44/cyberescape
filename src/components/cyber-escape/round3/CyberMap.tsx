'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Navigation, Award, Cpu, Shield, Database, Compass, Landmark, Activity, AlertTriangle, Radio } from 'lucide-react';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';

export function CyberMap() {
  const isMapOpen = useGameStore((state) => state.isMapOpen);
  const setIsMapOpen = useGameStore((state) => state.setIsMapOpen);
  const playerPos = useGameStore((state) => state.playerPosition);
  
  const route0 = useGameStore((state) => state.routeBranches[0] || 'none');
  const route2 = useGameStore((state) => state.routeBranches[2] || 'none');
  const checkpointAnswers = useGameStore((state) => state.checkpointAnswers);

  if (!isMapOpen) return null;

  // Convert player 3D coordinates (X: -36 to 36, Z: 5 to -250) to tactical map percentage (X: 10% to 90%, Y: 92% to 8%)
  const playerXPercent = Math.min(95, Math.max(5, 50 + (playerPos[0] / 36) * 35));
  const playerYPercent = Math.min(95, Math.max(5, 90 - ((5 - playerPos[2]) / 255) * 82));

  return (
    <AnimatePresence>
      <div className="fixed right-4 top-24 bottom-24 w-80 z-30 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
          className="pointer-events-auto relative w-full h-full p-4 rounded-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,180,212,0.25),inset_0_0_15px_rgba(6,180,212,0.05)] flex flex-col justify-between text-white bg-slate-950/90 backdrop-blur-xl"
        >
          {/* Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(34,211,238,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-cyan-950/80 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xs font-bold font-mono tracking-widest uppercase flex items-center gap-1.5">
                  RADAR RADAR
                  <span className="text-[7px] px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-400 text-cyan-400 animate-pulse font-mono font-bold">
                    ACTIVE
                  </span>
                </h2>
                <span className="text-[8px] font-mono text-cyan-500/60 leading-none">
                  SPATIAL VECTOR COORDINATES
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMapOpen(false)}
              className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 hover:text-white hover:bg-cyan-950 transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tactical 3D Map Grid Area */}
          <div className="relative flex-1 my-3 rounded-2xl bg-black border border-cyan-950/80 overflow-hidden">
            {/* Background Tech Grid */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #22D3EE 1px, transparent 1px), linear-gradient(to bottom, #22D3EE 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />

            {/* Radar Sweep animation overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(34,211,238,0.06) 0%, transparent 60%)',
              }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Vector Map SVG */}
            <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.0" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.0" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* RIVERS */}
              {/* River 1 */}
              <path d="M -10 68 Q 50 63 110 68" stroke="#083a3f" strokeWidth="4.0" fill="none" opacity="0.3" />
              <path d="M -10 68 Q 50 63 110 68" stroke="#22d3ee" strokeWidth="0.8" fill="none" opacity="0.6" />

              {/* River 2 */}
              <path d="M -10 40 Q 50 43 110 40" stroke="#0b2545" strokeWidth="5.0" fill="none" opacity="0.3" />
              <path d="M -10 40 Q 50 43 110 40" stroke="#0e5aa7" strokeWidth="0.9" fill="none" opacity="0.6" />

              {/* MOUNTAINS */}
              {/* Left Ridge */}
              <polygon points="2,88 10,74 18,88" fill="#022c30" stroke="#083a3f" strokeWidth="0.4" opacity="0.5" />
              <polygon points="12,50 20,35 28,50" fill="#022c30" stroke="#083a3f" strokeWidth="0.4" opacity="0.5" />
              {/* Right Ridge */}
              <polygon points="82,88 90,75 98,88" fill="#022c30" stroke="#083a3f" strokeWidth="0.4" opacity="0.5" />
              <polygon points="76,48 84,33 92,48" fill="#022c30" stroke="#083a3f" strokeWidth="0.4" opacity="0.5" />

              {/* HIGHWAY PATHS */}
              {/* Start to CP 1 */}
              <line x1="50" y1="90" x2="50" y2="82" stroke="#0e5aa7" strokeWidth="1.5" />
              <line x1="50" y1="90" x2="50" y2="82" stroke="#22D3EE" strokeWidth="0.5" filter="url(#glow-cyan)" />

              {/* Fork 1: Shortcut */}
              <line
                x1="50" y1="82" x2="50" y2="72"
                stroke={route0 === 'shortcut' ? '#22D3EE' : '#071A2F'}
                strokeWidth={route0 === 'shortcut' ? '1.5' : '0.8'}
                filter={route0 === 'shortcut' ? 'url(#glow-cyan)' : 'none'}
              />
              {/* Fork 1: Detour */}
              <path
                d="M 50 82 C 64 82, 64 72, 50 72"
                fill="none"
                stroke={route0 === 'detour' ? '#F4B942' : '#071A2F'}
                strokeWidth={route0 === 'detour' ? '1.5' : '0.8'}
                strokeDasharray={route0 === 'detour' ? 'none' : '1,1'}
                filter={route0 === 'detour' ? 'url(#glow-gold)' : 'none'}
              />

              {/* Seg 2: to CP 2 */}
              <line x1="50" y1="72" x2="50" y2="62" stroke="#0e5aa7" strokeWidth="1.5" />

              {/* Seg 3: to CP 3 */}
              <line x1="50" y1="62" x2="50" y2="56" stroke="#0e5aa7" strokeWidth="1.5" />

              {/* Fork 2: Shortcut */}
              <line
                x1="50" y1="56" x2="50" y2="40"
                stroke={route2 === 'shortcut' ? '#22D3EE' : '#071A2F'}
                strokeWidth={route2 === 'shortcut' ? '1.5' : '0.8'}
                filter={route2 === 'shortcut' ? 'url(#glow-cyan)' : 'none'}
              />
              {/* Fork 2: Detour */}
              <path
                d="M 50 56 C 36 56, 36 40, 50 40"
                fill="none"
                stroke={route2 === 'detour' ? '#F4B942' : '#071A2F'}
                strokeWidth={route2 === 'detour' ? '1.5' : '0.8'}
                strokeDasharray={route2 === 'detour' ? 'none' : '1,1'}
                filter={route2 === 'detour' ? 'url(#glow-gold)' : 'none'}
              />

              {/* Seg 4: to CP 5 */}
              <line x1="50" y1="40" x2="50" y2="32" stroke="#0e5aa7" strokeWidth="1.5" />

              {/* Seg 5: to CP 6 */}
              <line x1="50" y1="32" x2="50" y2="24" stroke="#0e5aa7" strokeWidth="1.5" />

              {/* Seg 6: to C1 */}
              <line x1="50" y1="24" x2="50" y2="18" stroke="#0e5aa7" strokeWidth="1.5" />

              {/* Seg 7: to C2 */}
              <line x1="50" y1="18" x2="50" y2="13" stroke="#0e5aa7" strokeWidth="1.5" />

              {/* Seg 8: to Portal */}
              <line x1="50" y1="13" x2="50" y2="8" stroke="#0e5aa7" strokeWidth="1.5" />
              <line x1="50" y1="13" x2="50" y2="8" stroke="#22D3EE" strokeWidth="0.5" filter="url(#glow-cyan)" />
            </svg>

            {/* DISTRICT / LANDMARK OUTLINES */}
            {/* Start Node */}
            <div className="absolute top-[90%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-4.5 h-4.5 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-[7px] font-bold text-cyan-300 font-mono shadow-sm">
                S
              </div>
            </div>

            {/* Checkpoint 1 */}
            <div className="absolute top-[82%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold font-mono transition-all ${
                checkpointAnswers[0] ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-black border-cyan-900 text-cyan-600'
              }`}>
                01
              </div>
            </div>

            {/* Detour 1-D */}
            {route0 === 'detour' && (
              <div className="absolute top-[77%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold font-mono transition-all ${
                  checkpointAnswers[1] ? 'bg-amber-950 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-black border-amber-900 text-amber-600'
                }`}>
                  1D
                </div>
              </div>
            )}

            {/* Checkpoint 2 */}
            <div className="absolute top-[62%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold font-mono transition-all ${
                checkpointAnswers[2] ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-black border-cyan-900 text-cyan-600'
              }`}>
                02
              </div>
            </div>

            {/* Checkpoint 3 */}
            <div className="absolute top-[56%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold font-mono transition-all ${
                checkpointAnswers[3] ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-black border-cyan-900 text-cyan-600'
              }`}>
                03
              </div>
            </div>

            {/* Detour 2-D */}
            {route2 === 'detour' && (
              <div className="absolute top-[48%] left-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold font-mono transition-all ${
                  checkpointAnswers[4] ? 'bg-amber-950 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-black border-amber-900 text-amber-600'
                }`}>
                  2D
                </div>
              </div>
            )}

            {/* Checkpoint 4 */}
            {route2 === 'shortcut' && (
              <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold font-mono transition-all ${
                  checkpointAnswers[5] ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-black border-cyan-900 text-cyan-600'
                }`}>
                  04
                </div>
              </div>
            )}

            {/* Checkpoint 5 */}
            <div className="absolute top-[32%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold font-mono transition-all ${
                checkpointAnswers[6] ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-black border-cyan-900 text-cyan-600'
              }`}>
                05
              </div>
            </div>

            {/* Checkpoint 6 */}
            <div className="absolute top-[24%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[7px] font-bold font-mono transition-all ${
                checkpointAnswers[7] ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-black border-cyan-900 text-cyan-600'
              }`}>
                06
              </div>
            </div>

            {/* Coding Challenge 1 Node */}
            <div className="absolute top-[18%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-5 h-5 rounded bg-black border border-cyan-850 flex items-center justify-center text-[7px] font-bold font-mono text-cyan-500">
                C1
              </div>
            </div>

            {/* Coding Challenge 2 Node */}
            <div className="absolute top-[13%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-5 h-5 rounded bg-black border border-cyan-850 flex items-center justify-center text-[7px] font-bold font-mono text-cyan-500">
                C2
              </div>
            </div>

            {/* Portal Destination Node */}
            <div className="absolute top-[8%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.7)] animate-pulse">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* LANDMARKS */}
            {/* Cyber Lab label */}
            <div className="absolute top-[89%] left-[16%] flex items-center gap-1 opacity-70">
              <Cpu className="w-2.5 h-2.5 text-cyan-400" />
              <span className="text-[5px] font-mono text-cyan-400 tracking-wider">LAB_01</span>
            </div>
            {/* AI Dome label */}
            <div className="absolute top-[78%] left-[16%] flex items-center gap-1 opacity-70">
              <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
              <span className="text-[5px] font-mono text-cyan-400 tracking-wider">AI_DOME</span>
            </div>
            {/* Network Center label */}
            <div className="absolute top-[60%] left-[68%] flex items-center gap-1 opacity-70">
              <Compass className="w-2.5 h-2.5 text-amber-500" />
              <span className="text-[5px] font-mono text-amber-500 tracking-wider">NET_HUB</span>
            </div>
            {/* Database Vault label */}
            <div className="absolute top-[32%] left-[12%] flex items-center gap-1 opacity-70">
              <Database className="w-2.5 h-2.5 text-cyan-400" />
              <span className="text-[5px] font-mono text-cyan-400 tracking-wider">VAULT_03</span>
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

          {/* Footer controls */}
          <div className="flex items-center justify-between text-[8px] font-mono text-cyan-500/60 pt-2 border-t border-cyan-950/80 relative z-10">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              GPS LOCATOR STATUS // CONNECTED
            </span>
            <span>Z={Math.round(playerPos[2])}m</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
