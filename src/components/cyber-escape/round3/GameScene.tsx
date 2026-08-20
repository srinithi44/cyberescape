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

export function GameScene() {
  return (
    <>
      <CameraController />
      <PlayerController />

      <WorldEnvironment />
      <Player />
      <OtherPlayers />

      {/* Physical Branch Gates */}
      <PhysicalGates />

      {/* Checkpoint Terminals (1, 2, 3) */}
      <QuestionTerminal checkpointIndex={0} />
      <QuestionTerminal checkpointIndex={1} />
      <QuestionTerminal checkpointIndex={2} />

      {/* Coding Terminals (1, 2) */}
      <CodingTerminal challengeIndex={0} />
      <CodingTerminal challengeIndex={1} />

      {/* Final Quantum Portal */}
      <FinalPortal />
    </>
  );
}
