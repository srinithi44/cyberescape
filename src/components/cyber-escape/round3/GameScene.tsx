'use client';

import { WorldEnvironment } from './WorldEnvironment';
import { Player } from './Player';
import { OtherPlayers } from './OtherPlayers';
import { PlayerController } from './PlayerController';
import { CameraController } from './CameraController';
import { QuestionTerminal } from './QuestionTerminal';
import { CodingTerminal } from './CodingTerminal';
import { PhysicalGates } from './PhysicalGates';
import { FinalPortal } from './FinalPortal';

import { useGameStore } from '@/lib/cyber-escape/round3/gameState';

export function GameScene() {
  const routeBranches = useGameStore((state) => state.routeBranches);
  const route0 = routeBranches[0] || 'none';
  const route2 = routeBranches[2] || 'none';

  return (
    <>
      <CameraController />
      <PlayerController />

      <WorldEnvironment />
      <Player />
      <OtherPlayers />

      {/* Physical Branch Gates */}
      <PhysicalGates />

      {/* Checkpoint Terminals (0 to 7) */}
      <QuestionTerminal checkpointIndex={0} />
      {route0 === 'detour' && <QuestionTerminal checkpointIndex={1} />}
      <QuestionTerminal checkpointIndex={2} />
      <QuestionTerminal checkpointIndex={3} />
      {route2 === 'detour' && <QuestionTerminal checkpointIndex={4} />}
      {route2 === 'shortcut' && <QuestionTerminal checkpointIndex={5} />}
      <QuestionTerminal checkpointIndex={6} />
      <QuestionTerminal checkpointIndex={7} />

      {/* Coding Terminals (1, 2) */}
      <CodingTerminal challengeIndex={0} />
      <CodingTerminal challengeIndex={1} />

      {/* Final Quantum Portal */}
      <FinalPortal />
    </>
  );
}
