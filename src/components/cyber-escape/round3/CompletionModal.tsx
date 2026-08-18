'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, RotateCcw, Trophy, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { useGameStore } from '@/lib/cyber-escape/round3/gameState';
import { soundEngine } from '@/lib/cyber-escape/round3/soundEngine';

function formatTimer(ms: number) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const millis = Math.floor(ms % 1000);
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

export function CompletionModal() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const resetGame = useGameStore((state) => state.resetGame);
  const timerMs = useGameStore((state) => state.timerMs);
  const correctAnswers = useGameStore((state) => state.correctAnswers);
  const wrongAnswers = useGameStore((state) => state.wrongAnswers);
  const totalQuestions = useGameStore((state) => state.totalQuestionsServed);
  const extraQuestions = useGameStore((state) => state.extraQuestionsAdded);
  const codingSolved = useGameStore((state) => state.codingSolved);
  const codingAttempts = useGameStore((state) => state.codingAttempts);
  
  const roomCode = useGameStore((state) => state.roomCode);
  const leaderboard = useGameStore((state) => state.leaderboard);
  const loadLeaderboard = useGameStore((state) => state.loadLeaderboard);
  const saveResult = useGameStore((state) => state.saveResult);
  const soundEnabled = useGameStore((state) => state.soundEnabled);

  // Save the result once on mount when game finishes
  useEffect(() => {
    if (gameStatus === 'completed') {
      saveResult();
      loadLeaderboard();
    }
  }, [gameStatus]);

  const codingProblemsSolved = useMemo(() => {
    return Object.values(codingSolved).filter(Boolean).length;
  }, [codingSolved]);

  const totalCodingAttempts = useMemo(() => {
    return Object.values(codingAttempts).reduce((acc, curr) => acc + curr, 0);
  }, [codingAttempts]);

  // Filter by current room code, sort by completion time ascending, then by wrongs, then by corrects, then by date
  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard]
      .filter((entry) => entry.roomId === roomCode)
      .sort((a, b) => {
        if (a.completionTime !== b.completionTime) {
          return a.completionTime - b.completionTime;
        }
        if (a.wrongAnswers !== b.wrongAnswers) {
          return a.wrongAnswers - b.wrongAnswers;
        }
        if (a.correctAnswers !== b.correctAnswers) {
          return b.correctAnswers - a.correctAnswers;
        }
        return a.completedAt - b.completedAt;
      });
  }, [leaderboard, roomCode]);

  if (gameStatus !== 'completed') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071A2F]/80 backdrop-blur-md overflow-y-auto">
      {/* Golden spotlight ambient beam */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[100px] absolute -top-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl p-6 sm:p-8 rounded-3xl border border-[#22D3EE]/30 bg-[#071A2F]/95 text-white shadow-[0_0_60px_rgba(34,211,238,0.25)] flex flex-col gap-6 md:gap-8 max-h-[92vh] overflow-y-auto"
      >
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(34,211,238,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

        {/* Header */}
        <div className="text-center relative z-10 flex flex-col items-center gap-2 border-b border-cyan-800/30 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-[#22D3EE]/55 flex items-center justify-center text-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.3)] mb-2">
            <Trophy className="w-7 h-7 animate-bounce text-[#F4B942]" />
          </div>
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
            QUANTUM GATE PASSED // SEQUENCE SOLVED
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-mono uppercase tracking-wider text-white">
            MISSION COMPLETED
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs relative z-10">
          {/* Final Time */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-cyan-950/80 flex flex-col gap-1 shadow-inner">
            <span className="text-slate-400 text-[10px] uppercase">FINAL TIME:</span>
            <span className="text-sm font-bold text-[#22D3EE] flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-[#22D3EE]" />
              {formatTimer(timerMs)}
            </span>
          </div>

          {/* Correct Questions */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-cyan-950/80 flex flex-col gap-1 shadow-inner text-[#22D3EE]">
            <span className="text-slate-400 text-[10px] uppercase">CORRECT MCQs:</span>
            <span className="text-sm font-bold flex items-center gap-1.5 mt-0.5">
              <CheckCircle className="w-4 h-4 text-[#22D3EE]" />
              {correctAnswers} / {totalQuestions}
            </span>
          </div>

          {/* Wrong Questions */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-cyan-950/80 flex flex-col gap-1 shadow-inner text-[#F4B942]">
            <span className="text-slate-400 text-[10px] uppercase">WRONG MCQs:</span>
            <span className="text-sm font-bold flex items-center gap-1.5 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-[#F4B942]" />
              {wrongAnswers} ({extraQuestions} penalty)
            </span>
          </div>

          {/* Coding Solved */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-cyan-950/80 flex flex-col gap-1 shadow-inner text-[#F4B942]">
            <span className="text-slate-400 text-[10px] uppercase">CODING SOLVED:</span>
            <span className="text-sm font-bold flex items-center gap-1.5 mt-0.5">
              <Award className="w-4 h-4 text-[#F4B942]" />
              {codingProblemsSolved} / 2 ({totalCodingAttempts} att)
            </span>
          </div>
        </div>

        {/* Champions Leaderboard */}
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
          <div className="flex items-center gap-2 mb-3.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            <Users className="w-4.5 h-4.5" />
            CHAMPIONS LEADERBOARD // ROOM: {roomCode}
          </div>

          <div className="flex-1 rounded-2xl border border-cyan-900/40 bg-slate-950/80 overflow-hidden flex flex-col">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-[#071A2F]/80 border-b border-cyan-900/40 text-[9px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
              <div className="col-span-1 text-center">RANK</div>
              <div className="col-span-4">PARTICIPANT</div>
              <div className="col-span-3 text-center">TIME</div>
              <div className="col-span-2 text-center">MCQ ACCURACY</div>
              <div className="col-span-2 text-center">CODE SOLVED</div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[30vh] divide-y divide-cyan-950/40">
              {sortedLeaderboard.map((entry, idx) => {
                const isChampion = idx === 0;
                return (
                  <div
                    key={entry.playerId}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 items-center font-mono text-xs transition-all ${
                      isChampion
                        ? 'bg-gradient-to-r from-amber-500/20 via-amber-600/5 to-transparent text-[#F4B942] font-bold border-l-2 border-amber-500'
                        : 'text-slate-300'
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-1 flex justify-center items-center">
                      {isChampion ? (
                        <Trophy className="w-4 h-4 text-amber-500 animate-pulse" />
                      ) : (
                        <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                      )}
                    </div>
                    {/* Name */}
                    <div className="col-span-4 truncate flex items-center gap-1.5">
                      <span className={isChampion ? 'text-white' : 'text-slate-200'}>
                        {entry.displayName}
                      </span>
                      {isChampion && (
                        <span className="text-[7px] font-bold px-1 py-0.2 rounded bg-cyan-950 border border-cyan-500 text-cyan-400 scale-90 uppercase">
                          CHAMPION
                        </span>
                      )}
                    </div>
                    {/* Time */}
                    <div className="col-span-3 text-center font-bold">
                      {formatTimer(entry.completionTime)}
                    </div>
                    {/* Accuracy */}
                    <div className="col-span-2 text-center text-[10px]">
                      {entry.totalQuestions - entry.wrongAnswers} / {entry.totalQuestions}
                    </div>
                    {/* Code */}
                    <div className="col-span-2 text-center text-[10px]">
                      {entry.codingProblemsSolved} / 2
                    </div>
                  </div>
                );
              })}
              {sortedLeaderboard.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs font-mono">
                  NO COMPLETED RUNS YET.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-cyan-800/30 pt-4 relative z-10">
          <button
            onClick={() => {
              soundEngine.playClick(soundEnabled);
              resetGame();
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-[#22D3EE] to-[#0E5AA7] text-white hover:brightness-110 active:scale-[0.98] transition-all font-mono font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            <RotateCcw className="w-4 h-4" />
            REPLAY MISSION
          </button>
        </div>
      </motion.div>
    </div>
  );
}
