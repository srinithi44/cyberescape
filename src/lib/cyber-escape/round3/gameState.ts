import { create } from 'zustand';
import { MCQ_POOL, CODING_CHALLENGES, ProgrammingChallenge } from './questions';

export interface Question {
  id: string;
  category: string;
  difficulty?: string;
  title: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export type RouteBranch = 'none' | 'shortcut' | 'detour';
export type ConnectionState = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

export interface LeaderboardEntry {
  playerId: string;
  displayName: string;
  roomId: string;
  completionTime: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  codingProblemsSolved: number;
  completedAt: number;
}

export interface ConnectedPlayer {
  id: string;
  name: string;
}

export interface RemotePlayer {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: number;
  isMoving: boolean;
}

interface GameState {
  // Multiplayer Room State
  roomCode: string;
  displayName: string;
  connectionStatus: ConnectionState;
  connectedPlayers: ConnectedPlayer[];
  otherPlayers: Record<string, RemotePlayer>;
  joinRoom: (roomCode: string, name: string) => void;
  leaveRoom: () => void;
  setConnectedPlayers: (players: ConnectedPlayer[]) => void;
  setOtherPlayers: (players: Record<string, RemotePlayer>) => void;
  updateOtherPlayer: (id: string, updates: Partial<Omit<RemotePlayer, 'id'>>) => void;
  removeOtherPlayer: (id: string) => void;
  setConnectionStatus: (status: ConnectionState) => void;

  // Gameplay status
  gameStatus: 'room_selection' | 'lobby' | 'loading' | 'playing' | 'question' | 'coding' | 'completed';
  setGameStatus: (status: 'room_selection' | 'lobby' | 'loading' | 'playing' | 'question' | 'coding' | 'completed') => void;

  // Player state
  playerPosition: [number, number, number];
  setPlayerPosition: (pos: [number, number, number]) => void;
  playerRotation: number;
  setPlayerRotation: (rot: number) => void;
  isMoving: boolean;
  setIsMoving: (moving: boolean) => void;

  // Checkpoints & Branch routes state
  currentCheckpoint: number; // 0: CN, 1: CSF, 2: DBMS, 3: Coding 1, 4: Coding 2
  setCurrentCheckpoint: (cp: number) => void;
  activeQuestion: Question | null;
  setActiveQuestion: (q: Question | null) => void;
  checkpointAnswers: Record<number, { selectedIndex: number; isCorrect: boolean }>;
  routeBranches: Record<number, RouteBranch>; // Checkpoint index -> 'shortcut' | 'detour'

  // MCQ Engine & Adaptation
  mcqQueue: Question[];
  currentQueueIndex: number;
  correctAnswers: number;
  wrongAnswers: number;
  extraQuestionsAdded: number;
  totalQuestionsServed: number;
  usedQuestionIds: string[];
  wrongCategories: string[];
  checkpointTargetCounts: Record<number, number>; // How many questions the player needs to answer at each checkpoint
  questionsAnsweredAtCurrentCheckpoint: number;

  // Programming Challenges State
  activeCodingChallenge: ProgrammingChallenge | null;
  setActiveCodingChallenge: (c: ProgrammingChallenge | null) => void;
  codingSolved: Record<string, boolean>;
  codingAttempts: Record<string, number>;
  submitCodingAnswer: (challengeId: string, submittedCode: string) => { isCorrect: boolean; feedback: string };

  // HUD & Modals
  isMapOpen: boolean;
  setIsMapOpen: (open: boolean) => void;
  toggleMap: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // Timer & Results
  timerMs: number;
  isTimerRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  tickTimer: (deltaMs: number) => void;
  resetGame: () => void;
  initGame: () => void;

  // Mobile virtual joystick input
  joystickVector: { x: number; y: number };
  setJoystickVector: (v: { x: number; y: number }) => void;

  // Answer handler
  submitAnswer: (checkpointIdx: number, optionIdx: number) => { isCorrect: boolean; isCheckpointComplete: boolean };

  // Leaderboard
  leaderboard: LeaderboardEntry[];
  loadLeaderboard: () => void;
  saveResult: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Multiplayer Room State
  roomCode: '',
  displayName: '',
  connectionStatus: 'DISCONNECTED',
  connectedPlayers: [],
  otherPlayers: {},
  joinRoom: (roomCode, name) => {
    set({
      roomCode: roomCode.trim().toUpperCase(),
      displayName: name.trim(),
      connectionStatus: 'CONNECTING'
    });

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    if (!pusherKey) {
      console.warn('Pusher App Key not found. Falling back to local multiplayer simulation.');
      // Simulate premium real-time connection delay
      setTimeout(() => {
        set((state) => ({
          connectionStatus: 'CONNECTED',
          connectedPlayers: [{ id: 'local_player', name: state.displayName }],
          gameStatus: 'lobby'
        }));
      }, 1200);
    }
  },
  leaveRoom: () => {
    set({
      roomCode: '',
      displayName: '',
      connectionStatus: 'DISCONNECTED',
      connectedPlayers: [],
      otherPlayers: {},
      gameStatus: 'room_selection'
    });
  },
  setConnectedPlayers: (players) => set({ connectedPlayers: players }),
  setOtherPlayers: (players) => set({ otherPlayers: players }),
  updateOtherPlayer: (id, updates) => set((state) => {
    const existing = state.otherPlayers[id];
    if (!existing) return state;
    return {
      otherPlayers: {
        ...state.otherPlayers,
        [id]: { ...existing, ...updates }
      }
    };
  }),
  removeOtherPlayer: (id) => set((state) => {
    const next = { ...state.otherPlayers };
    delete next[id];
    return { otherPlayers: next };
  }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),

  // Gameplay status
  gameStatus: 'room_selection',
  setGameStatus: (status) => set({ gameStatus: status }),

  playerPosition: [0, 0.5, 0],
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  playerRotation: 0,
  setPlayerRotation: (rot) => set({ playerRotation: rot }),
  isMoving: false,
  setIsMoving: (moving) => set({ isMoving: moving }),

  currentCheckpoint: 0,
  setCurrentCheckpoint: (cp) => set({ currentCheckpoint: cp }),
  activeQuestion: null,
  setActiveQuestion: (q) => set({ activeQuestion: q }),
  checkpointAnswers: {},
  routeBranches: {
    0: 'none',
    1: 'none',
    2: 'none',
    3: 'none',
    4: 'none',
    5: 'none',
  },

  // MCQ Engine & Adaptation
  mcqQueue: [],
  currentQueueIndex: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  extraQuestionsAdded: 0,
  totalQuestionsServed: 0,
  usedQuestionIds: [],
  wrongCategories: [],
  checkpointTargetCounts: {
    0: 1,
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
  },
  questionsAnsweredAtCurrentCheckpoint: 0,

  // Coding State
  activeCodingChallenge: null,
  setActiveCodingChallenge: (c) => set({ activeCodingChallenge: c }),
  codingSolved: {},
  codingAttempts: {},
  submitCodingAnswer: (challengeId, submittedCode) => {
    const challenge = CODING_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) return { isCorrect: false, feedback: 'Challenge not found.' };

    const attempts = (get().codingAttempts[challengeId] || 0) + 1;
    set((state) => ({
      codingAttempts: { ...state.codingAttempts, [challengeId]: attempts }
    }));

    const cleanInput = submittedCode.trim().toLowerCase();
    const cleanExpected = challenge.expectedOutput.trim().toLowerCase();

    const isCorrect = cleanInput === cleanExpected;

    if (isCorrect) {
      set((state) => ({
        codingSolved: { ...state.codingSolved, [challengeId]: true }
      }));
      return { isCorrect: true, feedback: 'CODE ACCEPTED // SEQUENCE MATCH' };
    } else {
      // Apply time penalty consequence: add 20 seconds to game timer
      set((state) => ({
        timerMs: state.timerMs + 20000 // 20s penalty
      }));
      return { isCorrect: false, feedback: '✕ INCORRECT // TIME PENALTY +20s APPLIED' };
    }
  },

  isMapOpen: false,
  setIsMapOpen: (open) => set({ isMapOpen: open }),
  toggleMap: () => set((state) => ({ isMapOpen: !state.isMapOpen })),
  soundEnabled: true,
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  timerMs: 0,
  isTimerRunning: false,
  startTimer: () => set({ isTimerRunning: true }),
  stopTimer: () => set({ isTimerRunning: false }),
  tickTimer: (deltaMs) => {
    if (get().isTimerRunning) {
      set((state) => ({ timerMs: state.timerMs + deltaMs }));
    }
  },

  resetGame: () => {
    const csQuestions = MCQ_POOL.filter(q => q.category === 'CS_FUNDAMENTALS');
    const dbQuestions = MCQ_POOL.filter(q => q.category === 'DBMS');
    const cnQuestions = MCQ_POOL.filter(q => q.category === 'COMPUTER_NETWORKS');

    const initialQueue = [
      csQuestions[0], // CP 1 (CS)
      csQuestions[1], // CP 1-D (CS)
      dbQuestions[0], // CP 2 (DBMS)
      cnQuestions[0], // CP 3 (CN)
      dbQuestions[1], // CP 2-D (DBMS)
      csQuestions[2], // CP 4 (CS)
      dbQuestions[2], // CP 5 (DBMS)
      cnQuestions[1], // CP 6 (CN)
    ];
    const initialUsedIds = initialQueue.map(q => q.id);

    set({
      gameStatus: 'playing',
      playerPosition: [0, 0.5, 0],
      playerRotation: Math.PI,
      isMoving: false,
      currentCheckpoint: 0,
      activeQuestion: null,
      checkpointAnswers: {},
      routeBranches: { 0: 'none', 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
      isMapOpen: false,
      timerMs: 0,
      isTimerRunning: true,
      checkpointTargetCounts: {
        0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1
      },

      mcqQueue: initialQueue,
      currentQueueIndex: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      extraQuestionsAdded: 0,
      totalQuestionsServed: 0,
      usedQuestionIds: initialUsedIds,
      wrongCategories: [],
      questionsAnsweredAtCurrentCheckpoint: 0,
      activeCodingChallenge: null,
      codingSolved: {},
      codingAttempts: {},
    });
  },

  initGame: () => {
    const csQuestions = MCQ_POOL.filter(q => q.category === 'CS_FUNDAMENTALS');
    const dbQuestions = MCQ_POOL.filter(q => q.category === 'DBMS');
    const cnQuestions = MCQ_POOL.filter(q => q.category === 'COMPUTER_NETWORKS');

    const initialQueue = [
      csQuestions[0], // CP 1 (CS)
      csQuestions[1], // CP 1-D (CS)
      dbQuestions[0], // CP 2 (DBMS)
      cnQuestions[0], // CP 3 (CN)
      dbQuestions[1], // CP 2-D (DBMS)
      csQuestions[2], // CP 4 (CS)
      dbQuestions[2], // CP 5 (DBMS)
      cnQuestions[1], // CP 6 (CN)
    ];
    const initialUsedIds = initialQueue.map(q => q.id);

    set({
      gameStatus: 'loading',
      playerPosition: [0, 0.5, 0],
      playerRotation: Math.PI,
      isMoving: false,
      currentCheckpoint: 0,
      activeQuestion: null,
      checkpointAnswers: {},
      routeBranches: { 0: 'none', 1: 'none', 2: 'none', 3: 'none', 4: 'none', 5: 'none' },
      isMapOpen: false,
      timerMs: 0,
      isTimerRunning: false,
      checkpointTargetCounts: {
        0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1
      },

      mcqQueue: initialQueue,
      currentQueueIndex: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      extraQuestionsAdded: 0,
      totalQuestionsServed: 0,
      usedQuestionIds: initialUsedIds,
      wrongCategories: [],
      questionsAnsweredAtCurrentCheckpoint: 0,
      activeCodingChallenge: null,
      codingSolved: {},
      codingAttempts: {},
    });
  },

  joystickVector: { x: 0, y: 0 },
  setJoystickVector: (v) => set({ joystickVector: v }),

  submitAnswer: (checkpointIdx, optionIdx) => {
    const question = get().activeQuestion;
    if (!question) return { isCorrect: false, isCheckpointComplete: true };

    const isCorrect = optionIdx === question.correctAnswer;
    const nextTotalServed = get().totalQuestionsServed + 1;

    set((state) => {
      const nextCorrect = isCorrect ? state.correctAnswers + 1 : state.correctAnswers;
      const nextWrong = !isCorrect ? state.wrongAnswers + 1 : state.wrongAnswers;
      const nextExtra = !isCorrect ? state.extraQuestionsAdded + 1 : state.extraQuestionsAdded;

      // Apply time penalty of 20 seconds for any wrong answer
      const timePenalty = isCorrect ? 0 : 20000;

      // Determine route branches for all checkpoints
      let updatedBranches = { ...state.routeBranches };
      
      // Map checkpointIdx to the respective gate index:
      // CP 1 (0) -> Gate 0
      // CP 2 (2) -> Gate 1
      // CP 3 (3) -> Gate 2
      // CP 4 (5) -> Gate 3
      // CP 5 (6) -> Gate 4
      // CP 6 (7) -> Gate 5
      let gateIdx = -1;
      if (checkpointIdx === 0) gateIdx = 0;
      else if (checkpointIdx === 2) gateIdx = 1;
      else if (checkpointIdx === 3) gateIdx = 2;
      else if (checkpointIdx === 5) gateIdx = 3;
      else if (checkpointIdx === 6) gateIdx = 4;
      else if (checkpointIdx === 7) gateIdx = 5;

      if (gateIdx !== -1) {
        updatedBranches[gateIdx] = isCorrect ? 'shortcut' : 'detour';
      }

      const updatedAnswers = {
        ...state.checkpointAnswers,
        [checkpointIdx]: { selectedIndex: optionIdx, isCorrect },
      };

      // Calculate new queue index based on total solved MCQ checkpoints
      // MCQ checkpoints are 0, 1, 2, 3, 4, 5, 6, 7
      const solvedMcqs = Object.keys(updatedAnswers).filter(
        (key) => Number(key) <= 7 && updatedAnswers[Number(key)]
      ).length;

      return {
        correctAnswers: nextCorrect,
        wrongAnswers: nextWrong,
        extraQuestionsAdded: nextExtra,
        totalQuestionsServed: nextTotalServed,
        checkpointAnswers: updatedAnswers,
        routeBranches: updatedBranches,
        timerMs: state.timerMs + timePenalty,
        currentQueueIndex: solvedMcqs,
      };
    });

    return { isCorrect, isCheckpointComplete: true };
  },

  // Leaderboard
  leaderboard: [],
  loadLeaderboard: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cyber_escape_round3_results');
      if (stored) {
        try {
          set({ leaderboard: JSON.parse(stored) });
        } catch (e) {
          console.error(e);
        }
      }
    }
  },
  saveResult: () => {
    const result: LeaderboardEntry = {
      playerId: Math.random().toString(36).substring(2, 11),
      displayName: get().displayName || 'Player',
      roomId: get().roomCode || 'SOLO',
      completionTime: get().timerMs,
      correctAnswers: get().correctAnswers,
      wrongAnswers: get().wrongAnswers,
      totalQuestions: get().totalQuestionsServed,
      codingProblemsSolved: Object.values(get().codingSolved).filter(Boolean).length,
      completedAt: Date.now(),
    };

    set((state) => {
      const updated = [...state.leaderboard, result];
      if (typeof window !== 'undefined') {
        localStorage.setItem('cyber_escape_round3_results', JSON.stringify(updated));
      }
      return { leaderboard: updated };
    });
  }
}));
