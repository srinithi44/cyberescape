'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { LoadingScreen } from '@/components/cyber-escape/round3/LoadingScreen';
import { GameHUD } from '@/components/cyber-escape/round3/GameHUD';
import { QuestionUI } from '@/components/cyber-escape/round3/QuestionUI';
import { CyberMap } from '@/components/cyber-escape/round3/CyberMap';
import { CompletionModal } from '@/components/cyber-escape/round3/CompletionModal';
import { VirtualJoystick } from '@/components/cyber-escape/round3/VirtualJoystick';
import { PlayersPanel } from '@/components/cyber-escape/round3/PlayersPanel';
import { RoomSelectionUI } from '@/components/cyber-escape/round3/RoomSelectionUI';
import { CodingUI } from '@/components/cyber-escape/round3/CodingUI';

// Dynamic import of 3D R3F Canvas to prevent SSR canvas issues
const CanvasContainer = dynamic(
  () =>
    import('@/components/cyber-escape/round3/CanvasContainer').then(
      (mod) => mod.CanvasContainer
    ),
  { ssr: false }
);

export default function Round3Page() {
  const [isPlayersOpen, setIsPlayersOpen] = useState(false);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#071A2F] select-none">
      {/* 3D WebGL Canvas */}
      <CanvasContainer />

      {/* 2D In-world UI & HUD Overlays */}
      <GameHUD onOpenPlayers={() => setIsPlayersOpen(true)} />
      <QuestionUI />
      <CodingUI />
      <CyberMap />
      <CompletionModal />
      <VirtualJoystick />
      {isPlayersOpen && <PlayersPanel onClose={() => setIsPlayersOpen(false)} />}
      <RoomSelectionUI />
      <LoadingScreen />
    </main>
  );
}
