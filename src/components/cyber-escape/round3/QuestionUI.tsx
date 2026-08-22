'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Terminal, Cpu, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { soundEngine } from '@/lib/cyber-escape/round3/soundEngine';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function QuestionUI() {
  const activeQuestion = useGameStore((state) => state.activeQuestion);
  const currentCheckpoint = useGameStore((state) => state.currentCheckpoint);
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const soundEnabled = useGameStore((state) => state.soundEnabled);

  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    setFeedback(null);
    setSelectedIdx(null);
  }, [activeQuestion]);

  if (!activeQuestion) return null;

  const handleChoice = (optionIdx: number) => {
    if (feedback) return; // Prevent double submit

    setSelectedIdx(optionIdx);
    const result = submitAnswer(currentCheckpoint, optionIdx);
    const store = useGameStore.getState();

    if (result.isCorrect) {
      soundEngine.playCorrect(soundEnabled);
      soundEngine.playGateOpen(soundEnabled);
      
      const currentPos = store.playerPosition;
      // Nudge player forward slightly so they don't instantly re-trigger the same node
      const nudgeZ = result.isCheckpointComplete ? -4.5 : -2.5;
      store.setPlayerPosition([currentPos[0], currentPos[1], currentPos[2] + nudgeZ]);

      store.setActiveQuestion(null);
      store.setGameStatus('playing');
    } else {
      soundEngine.playWrong(soundEnabled);
      soundEngine.playGateOpen(soundEnabled);
      
      setFeedback({
        isCorrect: false,
        text: 'SECURITY BREACH // RE-ROUTING TO DETOUR',
      });

      setTimeout(() => {
        setFeedback(null);
        const currentPos = store.playerPosition;
        const nudgeZ = result.isCheckpointComplete ? -4.5 : -2.5;
        store.setPlayerPosition([currentPos[0], currentPos[1], currentPos[2] + nudgeZ]);

        store.setActiveQuestion(null);
        store.setGameStatus('playing');
      }, 1800);
    }
  };

  return (
    <AnimatePresence>
      {/* Light translucent backdrop allowing focused 3D terminal to remain visible behind projection */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-[5px] select-none [perspective:1500px]">
        {/* Holographic grid matrix background lines */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,180,212,0.15)_100%)] pointer-events-none" />

        {/* 3D Tilted Projected Panel */}
        <motion.div
          initial={{ opacity: 0, rotateX: 20, rotateY: -10, scale: 0.9, z: -100 }}
          animate={{ opacity: 1, rotateX: 8, rotateY: -5, scale: 1, z: 0 }}
          exit={{ opacity: 0, rotateX: -20, rotateY: 10, scale: 0.9, z: -100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
          className="relative w-full max-w-2xl p-6 sm:p-8 rounded-[2rem] border border-cyan-400/40 shadow-[0_0_50px_rgba(34,211,238,0.25),inset_0_0_30px_rgba(34,211,238,0.05)] text-white overflow-hidden bg-slate-950/85 backdrop-blur-xl [transform-style:preserve-3d]"
        >
          {/* Tech Scan Line & Flicker Animations */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(34,211,238,0.04)_50%)] bg-[length:100%_4px] pointer-events-none" />
          
          {/* Sweeping Laser Scan Line */}
          <motion.div 
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 pointer-events-none"
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          {/* Glowing Corner Accents */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60" />

          {/* Top Projector Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-950/80 relative z-10 [transform:translateZ(20px)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <Terminal className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[8px] font-mono font-bold text-cyan-400/80 uppercase tracking-[0.2em] block">
                  SYSTEM QUERY NODE_0{currentCheckpoint + 1}
                </span>
                <h3 className="text-sm sm:text-base font-bold font-mono text-white tracking-wide uppercase mt-0.5">
                  {activeQuestion.title || 'SECURITY ENCRYPT'}
                </h3>
              </div>
            </div>
            <div className="px-3 py-1 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>LEVEL 0{currentCheckpoint + 1}</span>
            </div>
          </div>

          {/* Question Prompt Section */}
          <div className="mb-6 p-5 rounded-2xl bg-black/40 border border-cyan-950/80 relative z-10 [transform:translateZ(15px)] shadow-inner">
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-sans font-semibold">
              {activeQuestion.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative z-10 [transform:translateZ(10px)]">
            {activeQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(idx)}
                disabled={!!feedback}
                className={`group relative p-4 rounded-2xl border transition-all text-left text-xs sm:text-sm font-mono cursor-pointer active:scale-[0.98] disabled:opacity-70 flex items-center gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.2)] ${feedback
                    ? idx === selectedIdx
                      ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3),inset_0_0_10px_rgba(245,158,11,0.15)]'
                      : 'bg-black/10 border-cyan-950/30 text-slate-500'
                    : 'bg-cyan-950/10 border-cyan-900/30 hover:border-cyan-400/80 hover:bg-cyan-900/20 text-slate-200 hover:text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                  }`}
              >
                {/* Option Identifier Badge */}
                <span className={`flex-shrink-0 w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${feedback
                    ? idx === selectedIdx
                      ? 'bg-amber-900/80 border-amber-500 text-amber-350'
                      : 'bg-slate-950 text-slate-700 border-slate-900'
                    : 'bg-cyan-950/80 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black group-hover:shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                  }`}>
                  {OPTION_LABELS[idx] || idx + 1}
                </span>
                <span className="leading-snug pt-0.5">{opt}</span>
              </button>
            ))}
          </div>

          {/* Feedback Overlay Banner */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`p-4 rounded-2xl flex items-center justify-between border relative z-10 [transform:translateZ(25px)] ${feedback.isCorrect
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.4)]'
                  : 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                }`}
            >
              <div className="flex items-center gap-3">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-xs sm:text-sm font-mono uppercase tracking-wider block">
                    {feedback.text}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 leading-tight">
                    {feedback.isCorrect
                      ? 'Decryption confirmed. Redirecting to shortcut tunnel...'
                      : 'Access breach detected. Re-routing through bypass detour.'}
                  </span>
                </div>
              </div>
              <ArrowRight className={`w-5 h-5 shrink-0 ${feedback.isCorrect ? 'text-cyan-400' : 'text-amber-500'} animate-pulse`} />
            </motion.div>
          )}

          {/* Console Tech Details footer */}
          <div className="flex items-center justify-between text-[8px] font-mono text-cyan-500/40 pt-3 mt-2 border-t border-cyan-950/80 relative z-10">
            <span>SEC_LOG // QUANTUM_DEC: COMPUTE_GRID</span>
            <span className="flex items-center gap-1">
              DECISION_SUBMIT <CornerDownLeft className="w-2.5 h-2.5" />
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
