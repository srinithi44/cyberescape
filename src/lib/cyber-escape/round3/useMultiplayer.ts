'use client';

import { useEffect, useRef } from 'react';
import Pusher, { PresenceChannel } from 'pusher-js';
import { useGameStore, RouteBranch, LeaderboardEntry } from './gameState';

export function useMultiplayer() {
  const roomCode = useGameStore((state) => state.roomCode);
  const displayName = useGameStore((state) => state.displayName);
  const connectionStatus = useGameStore((state) => state.connectionStatus);
  const playerPosition = useGameStore((state) => state.playerPosition);
  const playerRotation = useGameStore((state) => state.playerRotation);
  const isMoving = useGameStore((state) => state.isMoving);

  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<PresenceChannel | null>(null);
  const lastSentMoveRef = useRef<{ position: [number, number, number]; rotation: number; isMoving: boolean } | null>(null);
  const moveThrottleRef = useRef<number | null>(null);

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
        members.push({ id: member.id, name: member.info.name });
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
      console.log(`Pusher: User joined the network: ${member.info.name}`);
      const current = useGameStore.getState().connectedPlayers;
      useGameStore.getState().setConnectedPlayers([
        ...current.filter(m => m.id !== member.id),
        { id: member.id, name: member.info.name }
      ]);
    });

    // Remove user
    channel.bind('pusher:member_removed', (member: any) => {
      console.log(`Pusher: User severed connection: ${member.info.name}`);
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

    // Checkpoint MCQ Solved sync
    channel.bind('client-terminal-solved', (data: { checkpointIdx: number; branch: RouteBranch; optionIdx: number; isCorrect: boolean }) => {
      console.log(`Pusher: Checkpoint ${data.checkpointIdx} resolved by peer.`);
      useGameStore.setState((state) => ({
        checkpointAnswers: {
          ...state.checkpointAnswers,
          [data.checkpointIdx]: { selectedIndex: data.optionIdx, isCorrect: data.isCorrect },
        },
        routeBranches: {
          ...state.routeBranches,
          [data.checkpointIdx]: data.branch,
        },
      }));
    });

    // Coding Challenge Solved sync
    channel.bind('client-coding-solved', (data: { challengeId: string }) => {
      console.log(`Pusher: Coding Challenge ${data.challengeId} accepted by peer.`);
      useGameStore.setState((state) => ({
        codingSolved: {
          ...state.codingSolved,
          [data.challengeId]: true,
        },
      }));
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
    if (connectionStatus !== 'CONNECTED' || !channelRef.current) return;

    // Retrieve local ID from socket channel
    const myId = channelRef.current.members.me.id;

    const checkAndSendMovement = () => {
      const last = lastSentMoveRef.current;
      const posChanged = !last ||
        Math.abs(playerPosition[0] - last.position[0]) > 0.05 ||
        Math.abs(playerPosition[2] - last.position[2]) > 0.05;
      const rotChanged = !last || Math.abs(playerRotation - last.rotation) > 0.05;
      const motionChanged = !last || isMoving !== last.isMoving;

      if (posChanged || rotChanged || motionChanged) {
        channelRef.current?.trigger('client-player-move', {
          id: myId,
          name: displayName,
          position: playerPosition,
          rotation: playerRotation,
          isMoving,
        });
        lastSentMoveRef.current = { position: playerPosition, rotation: playerRotation, isMoving };
      }
    };

    if (moveThrottleRef.current === null) {
      checkAndSendMovement();
      moveThrottleRef.current = window.setInterval(checkAndSendMovement, 60);
    }

    return () => {
      if (moveThrottleRef.current !== null) {
        clearInterval(moveThrottleRef.current);
        moveThrottleRef.current = null;
      }
    };
  }, [playerPosition, playerRotation, isMoving, connectionStatus, displayName]);

  // 3. Game State Event Broadcasting
  useEffect(() => {
    if (connectionStatus !== 'CONNECTED' || !channelRef.current) return;

    let prevBranches = { ...useGameStore.getState().routeBranches };
    let prevCodingSolved = { ...useGameStore.getState().codingSolved };
    let prevStatus = useGameStore.getState().gameStatus;
    let prevLeaderboardLength = useGameStore.getState().leaderboard.length;

    const unsubscribe = useGameStore.subscribe((state) => {
      // 3.1 Start Game
      if (state.gameStatus === 'loading' && prevStatus === 'lobby') {
        console.log('Pusher: Dispatching game start sequence...');
        channelRef.current?.trigger('client-game-started', {});
      }
      prevStatus = state.gameStatus;

      // 3.2 MCQ Terminal Finished
      for (const idxStr of Object.keys(state.routeBranches)) {
        const idx = parseInt(idxStr);
        if (state.routeBranches[idx] !== 'none' && prevBranches[idx] === 'none') {
          const ans = state.checkpointAnswers[idx];
          channelRef.current?.trigger('client-terminal-solved', {
            checkpointIdx: idx,
            branch: state.routeBranches[idx],
            optionIdx: ans?.selectedIndex ?? 0,
            isCorrect: ans?.isCorrect ?? true,
          });
        }
      }
      prevBranches = { ...state.routeBranches };

      // 3.3 Coding Terminal Finished
      for (const cid of Object.keys(state.codingSolved)) {
        if (state.codingSolved[cid] === true && prevCodingSolved[cid] !== true) {
          channelRef.current?.trigger('client-coding-solved', {
            challengeId: cid,
          });
        }
      }
      prevCodingSolved = { ...state.codingSolved };

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
