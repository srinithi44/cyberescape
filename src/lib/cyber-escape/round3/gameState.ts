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
    0: 5, // 5 Computer Networks MCQs
    1: 5, // 5 CS Fundamentals MCQs
    2: 5  // 5 DBMS MCQs
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
    // Partition base questions into the starting queue
    const cnQuestions = MCQ_POOL.filter(q => q.category === 'COMPUTER_NETWORKS');
    const csQuestions = MCQ_POOL.filter(q => q.category === 'CS_FUNDAMENTALS');
    const dbQuestions = MCQ_POOL.filter(q => q.category === 'DBMS');

    // Slice 5 of each to create initial queue of 15 questions
    const initialQueue = [
      ...cnQuestions.slice(0, 5),
      ...csQuestions.slice(0, 5),
      ...dbQuestions.slice(0, 5),
    ];
    const initialUsedIds = initialQueue.map(q => q.id);

    set({
      gameStatus: 'playing',
      playerPosition: [0, 0.5, 0],
      playerRotation: 0,
      isMoving: false,
      currentCheckpoint: 0,
      activeQuestion: null,
      checkpointAnswers: {},
      routeBranches: { 0: 'none', 1: 'none', 2: 'none' },
      isMapOpen: false,
      timerMs: 0,
      isTimerRunning: true,
      checkpointTargetCounts: {
        0: 5,
        1: 5,
        2: 5
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
    // Partition base questions into the starting queue
    const cnQuestions = MCQ_POOL.filter(q => q.category === 'COMPUTER_NETWORKS');
    const csQuestions = MCQ_POOL.filter(q => q.category === 'CS_FUNDAMENTALS');
    const dbQuestions = MCQ_POOL.filter(q => q.category === 'DBMS');

    // Slice 5 of each to create initial queue of 15 questions
    const initialQueue = [
      ...cnQuestions.slice(0, 5),
      ...csQuestions.slice(0, 5),
      ...dbQuestions.slice(0, 5),
    ];
    const initialUsedIds = initialQueue.map(q => q.id);

    set({
      gameStatus: 'loading',
      playerPosition: [0, 0.5, 0],
      playerRotation: 0,
      isMoving: false,
      currentCheckpoint: 0,
      activeQuestion: null,
      checkpointAnswers: {},
      routeBranches: { 0: 'none', 1: 'none', 2: 'none' },
      isMapOpen: false,
      timerMs: 0,
      isTimerRunning: false,
      checkpointTargetCounts: {
        0: 5,
        1: 5,
        2: 5
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
    if (!question) return { isCorrect: false, isCheckpointComplete: false };

    const isCorrect = optionIdx === question.correctAnswer;
    const nextQueueIndex = get().currentQueueIndex + 1;
    const nextTotalServed = get().totalQuestionsServed + 1;

    // Apply basic updates first
    set((state) => ({
      totalQuestionsServed: nextTotalServed,
      currentQueueIndex: nextQueueIndex,
      questionsAnsweredAtCurrentCheckpoint: state.questionsAnsweredAtCurrentCheckpoint + 1
    }));

    if (isCorrect) {
      const nextCorrect = get().correctAnswers + 1;
      set({ correctAnswers: nextCorrect });
    } else {
      const nextWrong = get().wrongAnswers + 1;
      set((state) => ({
        wrongAnswers: nextWrong,
        wrongCategories: [...state.wrongCategories, question.category],
        checkpointAnswers: {
          ...state.checkpointAnswers,
          [checkpointIdx]: { selectedIndex: optionIdx, isCorrect: false },
        },
        routeBranches: {
          ...state.routeBranches,
          [checkpointIdx]: 'detour',
        }
      }));

      // Adaptive question addition logic (capped at 30 total queue size)
      const currentQueueSize = get().mcqQueue.length;
      if (currentQueueSize < 30) {
        // Find unused question from same category, or any category if none left
        let penaltyQuestion = MCQ_POOL.find(
          (q) => q.category === question.category && !get().usedQuestionIds.includes(q.id)
        );
        if (!penaltyQuestion) {
          penaltyQuestion = MCQ_POOL.find(
            (q) => !get().usedQuestionIds.includes(q.id)
          );
        }

        if (penaltyQuestion) {
          // Insert the penalty question into the queue right after current index
          const newQueue = [...get().mcqQueue];
          newQueue.splice(get().currentQueueIndex, 0, penaltyQuestion);

          // Update target count of the CURRENT checkpoint to include this penalty question
          const currentTarget = get().checkpointTargetCounts[checkpointIdx] || 5;

          set((state) => ({
            mcqQueue: newQueue,
            usedQuestionIds: [...state.usedQuestionIds, penaltyQuestion!.id],
            extraQuestionsAdded: state.extraQuestionsAdded + 1,
            checkpointTargetCounts: {
              ...state.checkpointTargetCounts,
              [checkpointIdx]: currentTarget + 1
            }
          }));
        }
      }
    }

    // Evaluate Checkpoint completion
    const targetCount = get().checkpointTargetCounts[checkpointIdx] || 5;
    const answered = get().questionsAnsweredAtCurrentCheckpoint;

    if (answered >= targetCount) {
      // Mark checkpoint terminal as completed
      set((state) => {
        const currentBranch = state.routeBranches[checkpointIdx];
        const branch = currentBranch === 'none' ? 'shortcut' : currentBranch;

        return {
          checkpointAnswers: {
            ...state.checkpointAnswers,
            [checkpointIdx]: { selectedIndex: optionIdx, isCorrect: isCorrect },
          },
          routeBranches: {
            ...state.routeBranches,
            [checkpointIdx]: branch,
          },
          questionsAnsweredAtCurrentCheckpoint: 0 // reset counter for this checkpoint
        };
      });
      return { isCorrect, isCheckpointComplete: true };
    } else {
      return { isCorrect, isCheckpointComplete: false };
    }
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
