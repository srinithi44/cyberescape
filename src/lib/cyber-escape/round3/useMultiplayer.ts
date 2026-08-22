'use client';

import { useEffect, useRef } from 'react';
import Pusher, { PresenceChannel } from 'pusher-js';
import { useGameStore, RouteBranch, LeaderboardEntry } from './gameState';
import { CODING_CHALLENGES } from './questions';

export function useMultiplayer() {
  const roomCode = useGameStore((state) => state.roomCode);
  const displayName = useGameStore((state) => state.displayName);
  const connectionStatus = useGameStore((state) => state.connectionStatus);

  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<PresenceChannel | null>(null);
  const lastSentMoveRef = useRef<{ position: [number, number, number]; rotation: number; isMoving: boolean } | null>(null);

  // 1. Pusher Connection Management
  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster || !roomCode || !displayName) {
      return;
    }

    console.log(`Pusher: Establishing tunnel for room: ${roomCode} display_name: ${displayName}...`);

    // Suppress console spam from Pusher
    Pusher.logToConsole = false;

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      channelAuthorization: {
        endpoint: `/api/pusher/auth?name=${encodeURIComponent(displayName)}`,
        transport: 'ajax',
      },
    });

    pusherRef.current = pusher;

    const channelName = `presence-cyber-escape-${roomCode.toLowerCase()}`;
    const channel = pusher.subscribe(channelName) as PresenceChannel;
    channelRef.current = channel;

    // Subscription success handler
    channel.bind('pusher:subscription_succeeded', () => {
      console.log('Pusher: Secure channel connected.');
      useGameStore.setState({
        connectionStatus: 'CONNECTED',
        gameStatus: 'lobby'
      });

      // Populating initial members in the lobby
      const members: { id: string; name: string }[] = [];
      channel.members.each((member: any) => {
        members.push({ id: member.id, name: member.info?.name || 'Cadet' });
      });
      useGameStore.getState().setConnectedPlayers(members);
    });

    // Subscription error handler
    channel.bind('pusher:subscription_error', (status: any) => {
      console.error('Pusher: Subscription refused/failed:', status);
      useGameStore.getState().setConnectionStatus('DISCONNECTED');
    });

    // Add new dynamic player
    channel.bind('pusher:member_added', (member: any) => {
      console.log(`Pusher: User joined the network: ${member.info?.name || 'Cadet'}`);
      const current = useGameStore.getState().connectedPlayers;
      useGameStore.getState().setConnectedPlayers([
        ...current.filter(m => m.id !== member.id),
        { id: member.id, name: member.info?.name || 'Cadet' }
      ]);
    });

    // Remove user
    channel.bind('pusher:member_removed', (member: any) => {
      console.log(`Pusher: User severed connection: ${member.info?.name || 'Cadet'}`);
      const current = useGameStore.getState().connectedPlayers;
      useGameStore.getState().setConnectedPlayers(current.filter((m) => m.id !== member.id));
      useGameStore.getState().removeOtherPlayer(member.id);
    });

    // Listen to peer updates (Coordinates + Rotation)
    channel.bind('client-player-move', (data: { id: string; name: string; position: [number, number, number]; rotation: number; isMoving: boolean }) => {
      useGameStore.getState().updateOtherPlayer(data.id, {
        name: data.name,
        position: data.position,
        rotation: data.rotation,
        isMoving: data.isMoving,
      });

      // Lazy initialization of peer model
      if (!useGameStore.getState().otherPlayers[data.id]) {
        useGameStore.setState((state) => ({
          otherPlayers: {
            ...state.otherPlayers,
            [data.id]: {
              id: data.id,
              name: data.name,
              position: data.position,
              rotation: data.rotation,
              isMoving: data.isMoving,
            }
          }
        }));
      }
    });

    // Synchronized mission start
    channel.bind('client-game-started', () => {
      console.log('Pusher: Session starting signal received.');
      useGameStore.getState().initGame();
    });



    // Synchronize peer completions on the leaderboard
    channel.bind('client-leaderboard-entry', (data: { entry: LeaderboardEntry }) => {
      console.log('Pusher: Received peer completion entry:', data.entry);
      useGameStore.setState((state) => {
        // Prevent duplicate entries
        const exists = state.leaderboard.some(e => e.playerId === data.entry.playerId);
        if (exists) return {};

        const updated = [...state.leaderboard, data.entry];
        if (typeof window !== 'undefined') {
          localStorage.setItem('cyber_escape_round3_results', JSON.stringify(updated));
        }
        return { leaderboard: updated };
      });
    });

    return () => {
      console.log('Pusher: Unsubscribing and closing socket...');
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
      pusherRef.current = null;
      channelRef.current = null;
    };
  }, [roomCode, displayName]);

  // 2. Transmit coordinates (Throttled loop)
  useEffect(() => {
    if (connectionStatus !== 'CONNECTED') return;

    const checkAndSendMovement = () => {
      if (!channelRef.current) return;
      const myId = channelRef.current.members?.me?.id;
      if (!myId) return;

      const store = useGameStore.getState();
      const currentPos = store.playerPosition;
      const currentRot = store.playerRotation;
      const currentMoving = store.isMoving;

      const last = lastSentMoveRef.current;
      const posChanged = !last ||
        Math.abs(currentPos[0] - last.position[0]) > 0.05 ||
        Math.abs(currentPos[2] - last.position[2]) > 0.05;
      const rotChanged = !last || Math.abs(currentRot - last.rotation) > 0.05;
      const motionChanged = !last || currentMoving !== last.isMoving;

      if (posChanged || rotChanged || motionChanged) {
        channelRef.current.trigger('client-player-move', {
          id: myId,
          name: displayName,
          position: currentPos,
          rotation: currentRot,
          isMoving: currentMoving,
        });
        lastSentMoveRef.current = { position: currentPos, rotation: currentRot, isMoving: currentMoving };
      }
    };

    // Low-overhead stable interval setup at 80ms (approx 12Hz, ideal for movement replication)
    const intervalId = window.setInterval(checkAndSendMovement, 80);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [connectionStatus, displayName]);

  // 3. Game State Event Broadcasting
  useEffect(() => {
    if (connectionStatus !== 'CONNECTED' || !channelRef.current) return;

    let prevStatus = useGameStore.getState().gameStatus;
    let prevLeaderboardLength = useGameStore.getState().leaderboard.length;

    const unsubscribe = useGameStore.subscribe((state) => {
      // 3.1 Start Game
      if (state.gameStatus === 'loading' && prevStatus === 'lobby') {
        console.log('Pusher: Dispatching game start sequence...');
        channelRef.current?.trigger('client-game-started', {});
      }

      prevStatus = state.gameStatus;

      // 3.4 Leaderboard Entry Broadcast
      if (state.leaderboard.length > prevLeaderboardLength) {
        const newEntry = state.leaderboard[state.leaderboard.length - 1];
        if (newEntry && newEntry.displayName === state.displayName) {
          console.log('Pusher: Broadcasting leaderboard completion entry to peers...');
          channelRef.current?.trigger('client-leaderboard-entry', { entry: newEntry });
        }
      }
      prevLeaderboardLength = state.leaderboard.length;
    });

    return () => {
      unsubscribe();
    };
  }, [connectionStatus]);
}
