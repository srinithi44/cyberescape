'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Play, X, Code, FileCode, AlertTriangle } from 'lucide-react';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { soundEngine } from '@/lib/cyber-escape/round3/soundEngine';

export function CodingUI() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const activeChallenge = useGameStore((state) => state.activeCodingChallenge);
  const setActiveCodingChallenge = useGameStore((state) => state.setActiveCodingChallenge);
  const submitCodingAnswer = useGameStore((state) => state.submitCodingAnswer);
  const soundEnabled = useGameStore((state) => state.soundEnabled);

  const [outputVal, setOutputVal] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'none' | 'success' | 'error'; message: string }>({ type: 'none', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setOutputVal('');
    setFeedback({ type: 'none', message: '' });
  }, [activeChallenge]);

  if (gameStatus !== 'coding' || !activeChallenge) return null;

  const handleClose = () => {
    setOutputVal('');
    setFeedback({ type: 'none', message: '' });
    setActiveCodingChallenge(null);
    setGameStatus('playing');
  };

  const handleRun = () => {
    soundEngine.playClick(soundEnabled);
    if (!outputVal.trim()) {
      setFeedback({ type: 'error', message: '✕ RUNTIME ERROR: Empty output field.' });
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      const res = submitCodingAnswer(activeChallenge.id, outputVal);
      if (res.isCorrect) {
        soundEngine.playCorrect(soundEnabled);
        setFeedback({ type: 'success', message: `✔ SUCCESS: ${res.feedback}` });
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        soundEngine.playWrong(soundEnabled);
        setFeedback({ type: 'error', message: res.feedback });
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl h-[85vh] rounded-3xl border border-[#22D3EE]/40 shadow-[0_0_80px_rgba(34,211,238,0.3)] overflow-hidden flex flex-col bg-[#071A2F]/95 text-white"
        >
          {/* Top Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(34,211,238,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#22D3EE]/25 bg-slate-950/70">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-950 border border-[#22D3EE]/40">
                <Code className="w-5 h-5 text-[#22D3EE] animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#F4B942] uppercase font-bold">
                  CYBER DOCKER COMPILE-AGENT
                </span>
                <h3 className="text-sm sm:text-base font-bold font-mono tracking-wide uppercase">
                  {activeChallenge.title}
                </h3>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Main Workspace split */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left: Problem Details */}
            <div className="w-full md:w-1/2 p-6 border-r border-[#22D3EE]/25 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 text-cyan-400 font-mono text-xs">
                  <FileCode className="w-4 h-4" />
                  <span>SPECIFICATION_FILE.TXT</span>
                </div>
                <h4 className="text-base font-bold text-white mb-4">Problem Description</h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
                  {activeChallenge.description}
                </p>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">■ EVALUATION TEST INPUT:</span>
                    <pre className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-cyan-300 font-bold overflow-x-auto">
                      {activeChallenge.input}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Warning box */}
              <div className="mt-6 p-4 rounded-xl border border-amber-500/30 bg-amber-950/30 text-[11px] leading-relaxed text-amber-300 flex gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <div>
                  <span className="font-bold">CRITICAL GATING PROTOCOL:</span> Incorrect compiler submissions apply a <span className="font-bold text-[#F4B942] underline">+20 seconds penalty</span> directly to the active running timer, and lock/reject gate routes until resolved. Calculate carefully before submitting!
                </div>
              </div>
            </div>

            {/* Right: Simulated compiler input */}
            <div className="w-full md:w-1/2 bg-slate-950/40 p-6 flex flex-col justify-between">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#F4B942]" />
                    OUTPUT_STREAM.LOG
                  </span>
                  <span className="text-[9px] text-[#22D3EE] font-bold">STATUS: STANDBY</span>
                </div>
                
                {/* Compiler Output Input Box */}
                <div className="flex-1 flex flex-col rounded-2xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-xs relative overflow-hidden">
                  <div className="text-slate-500 mb-2">// CALCULATE AND TYPE THE EXACT EXPECTED OUTPUT VALUE BELOW:</div>
                  <div className="flex items-center gap-2 text-slate-300 mb-4">
                    <span>$ ./solution &lt; specification_file.txt</span>
                  </div>
                  
                  <textarea
                    value={outputVal}
                    onChange={(e) => setOutputVal(e.target.value)}
                    disabled={isSubmitting || feedback.type === 'success'}
                    placeholder={activeChallenge.placeholder}
                    className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-[#22D3EE] focus:outline-none focus:border-[#22D3EE]/50 resize-none font-bold text-sm tracking-wide shadow-inner select-text"
                  />

                  {/* Simulated output compiler lines */}
                  {feedback.type !== 'none' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-3 rounded-xl border text-xs font-bold font-mono ${
                        feedback.type === 'success'
                          ? 'bg-[#071A2F]/90 border-[#22D3EE]/40 text-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                          : 'bg-[#071A2F]/90 border-[#F4B942]/40 text-[#F4B942] shadow-[0_0_15px_rgba(244,185,66,0.2)]'
                      }`}
                    >
                      {feedback.message}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-mono text-xs font-bold cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleRun}
                  disabled={isSubmitting || !outputVal.trim() || feedback.type === 'success'}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#F4B942] text-black font-mono text-xs font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(244,185,66,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin" />
                      COMPILING...
                    </>
                  ) : (
                    <>
                      <Play className="w-4.5 h-4.5" />
                      COMPILE & RUN
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
