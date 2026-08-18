'use client';

import { useState } from 'react';
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

  if (!activeQuestion) return null;

  const handleChoice = (optionIdx: number) => {
    if (feedback) return; // Prevent double submit

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-[4px] select-none [perspective:1200px]">
        {/* Holographic grid matrix background lines */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(34,211,238,0.1)_100%)] pointer-events-none" />

        {/* 3D Tilted Projected Panel */}
        <motion.div
          initial={{ opacity: 0, rotateX: 25, rotateY: -15, scale: 0.85, z: -100 }}
          animate={{ opacity: 1, rotateX: 8, rotateY: -6, scale: 1, z: 0 }}
          exit={{ opacity: 0, rotateX: -25, rotateY: 15, scale: 0.85, z: -100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 80 }}
          className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-cyan-400/60 shadow-[0_0_60px_rgba(34,211,238,0.4)] text-white overflow-hidden bg-[#071A2F]/95 backdrop-blur-md [transform-style:preserve-3d]"
        >
          {/* Tech Scan Line & Flicker Animations */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(34,211,238,0.06)_50%)] bg-[length:100%_4px] pointer-events-none" />

          {/* Neon Grid Layer */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #22D3EE 1px, transparent 1px), linear-gradient(to bottom, #22D3EE 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />

          {/* Top Projector Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-900/40 relative z-10 [transform:translateZ(15px)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#071A2F]/90 border border-cyan-500/50 text-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                <Terminal className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                  ◈ QUANTUM TERMINAL INTERFACE // NODE_0{currentCheckpoint + 1}
                </span>
                <h3 className="text-sm sm:text-base font-bold font-mono text-white tracking-wide uppercase">
                  {activeQuestion.title || 'SECURITY QUESTION'}
                </h3>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#071A2F]/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>NODE 0{currentCheckpoint + 1}</span>
            </div>
          </div>

          {/* Question Prompt Section */}
          <div className="mb-6 p-5 rounded-2xl bg-[#071A2F]/50 border border-cyan-900/60 relative z-10 [transform:translateZ(10px)] shadow-inner">
            <p className="text-sm sm:text-[15px] text-slate-100 leading-relaxed font-sans font-semibold">
              {activeQuestion.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative z-10 [transform:translateZ(5px)]">
            {activeQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(idx)}
                disabled={!!feedback}
                className={`group relative p-4 rounded-2xl border transition-all text-left text-xs sm:text-sm font-mono cursor-pointer active:scale-[0.98] disabled:opacity-75 flex items-start gap-3 shadow-md ${feedback
                    ? idx === activeQuestion.correctAnswer
                      ? 'bg-cyan-950/80 border-[#22D3EE] text-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                      : 'bg-slate-950/30 border-slate-900 text-slate-500'
                    : 'bg-[#071A2F]/40 border-cyan-900/50 hover:border-cyan-400 hover:bg-cyan-900/40 text-slate-200 hover:text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                  }`}
              >
                {/* Option Identifier Badge */}
                <span className={`flex-shrink-0 w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${feedback
                    ? idx === activeQuestion.correctAnswer
                      ? 'bg-cyan-800 border-[#22D3EE] text-[#22D3EE]'
                      : 'bg-slate-900 text-slate-600 border-slate-950'
                    : 'bg-[#071A2F] border border-cyan-500/30 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-black'
                  }`}>
                  {OPTION_LABELS[idx] || idx + 1}
                </span>
                <span className="leading-tight pt-0.5">{opt}</span>
              </button>
            ))}
          </div>

          {/* Feedback Overlay Banner */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`p-4 rounded-2xl flex items-center justify-between border relative z-10 [transform:translateZ(20px)] ${feedback.isCorrect
                  ? 'bg-[#071A2F] border-[#22D3EE] text-[#22D3EE] shadow-[0_0_35px_rgba(34,211,238,0.7)]'
                  : 'bg-amber-950/95 border-[#F4B942] text-[#F4B942] shadow-[0_0_35px_rgba(244,185,66,0.7)]'
                }`}
            >
              <div className="flex items-center gap-3">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-[#F4B942] shrink-0" />
                )}
                <div>
                  <span className="font-bold text-xs sm:text-sm font-mono uppercase tracking-wide block">
                    {feedback.text}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 leading-tight">
                    {feedback.isCorrect
                      ? 'Bypass decryption successful. Connecting shortcut pathway...'
                      : 'Incorrect decrypt vector. Connecting alternate detour route.'}
                  </span>
                </div>
              </div>
              <ArrowRight className={`w-5 h-5 shrink-0 ${feedback.isCorrect ? 'text-cyan-400' : 'text-[#F4B942]'} animate-pulse`} />
            </motion.div>
          )}

          {/* Console Tech Details footer */}
          <div className="flex items-center justify-between text-[8px] font-mono text-cyan-500/70 pt-2 border-t border-cyan-900/30">
            <span>SYS_SYS // DEC_MOD: COMPUTE_DYNAMICS</span>
            <span className="flex items-center gap-1">
              SUBMIT_DECISION <CornerDownLeft className="w-2.5 h-2.5" />
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
