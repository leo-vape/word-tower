import { useRef, useCallback, useState } from 'react';
import type { Creature } from '../types/creature';
import type { FallingWordView } from '../types/tower';
import {
  createEngineState,
  startGame,
  tick,
  tapWord,
  type EngineState,
  type GameEvent,
} from '../game/engine';
import { STARTING_LIVES } from '../utils/constants';

export interface GameViewState {
  phase: EngineState['phase'];
  fallingWords: FallingWordView[];
  targetChinese: string;
  targetLetterCount: number;
  targetPhonetic: string;
  correctWordId: string | null;
  feedback: 'correct' | 'wrong' | 'boss_defeated' | null;
  isBossRound: boolean;
  wordsCompleted: number;
  currentHeight: number;
  energyEarnedThisSession: number;
  combo: number;
  maxCombo: number;
  livesRemaining: number;
  difficultyLevel: number;
  elapsedMs: number;
  roundTrigger: number;
}

const FIELD_H = 400;
const TICK_MS = 50;
const COL_COUNT = 3;

export function useGameLoop(activeCreatures: Creature[]) {
  const engineRef = useRef<EngineState | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);
  const roundCountRef = useRef(0);

  const [view, setView] = useState<GameViewState>(() => ({
    phase: 'idle',
    fallingWords: [],
    targetChinese: '',
    targetLetterCount: 0,
    targetPhonetic: '',
    correctWordId: null,
    feedback: null,
    isBossRound: false,
    wordsCompleted: 0,
    currentHeight: 0,
    energyEarnedThisSession: 0,
    combo: 0,
    maxCombo: 0,
    livesRemaining: STARTING_LIVES,
    difficultyLevel: 1,
    elapsedMs: 0,
    roundTrigger: 0,
  }));
  const [events, setEvents] = useState<GameEvent[]>([]);

  const syncView = useCallback(() => {
    if (!engineRef.current) return;
    const s = engineRef.current;

    const targetWord = s.targetWord;
    const correctWord = s.words.find(w => w.isCorrect);

    setView({
      phase: s.phase,
      fallingWords: s.words.map(w => {
        const colPercent = (w.col + 0.5) / COL_COUNT * 100;
        return {
          id: w.id,
          word: w.word,
          x: colPercent,
          y: w.y * 100,
          col: w.col,
          speed: w.speed,
          opacity: 1,
          isCorrect: w.isCorrect,
        };
      }),
      targetChinese: targetWord?.zh ?? '',
      targetLetterCount: targetWord?.en.length ?? 0,
      targetPhonetic: targetWord?.phonetic ?? '',
      correctWordId: correctWord?.id ?? null,
      feedback: s.feedbackState,
      isBossRound: s.isBossRound,
      wordsCompleted: s.wordsCompleted,
      currentHeight: s.currentHeight,
      energyEarnedThisSession: s.energyEarnedThisSession,
      combo: s.combo,
      maxCombo: s.maxCombo,
      livesRemaining: s.livesRemaining,
      difficultyLevel: s.difficulty.level,
      elapsedMs: s.elapsedMs,
      roundTrigger: roundCountRef.current,
    });
  }, []);

  const handleStart = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    roundCountRef.current = 0;

    const state = createEngineState(activeCreatures);
    engineRef.current = startGame(state);
    roundCountRef.current++;
    setEvents([]);
    syncView();

    timerRef.current = setInterval(() => {
      const eng = engineRef.current;
      if (!eng || eng.phase !== 'playing') {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return;
      }

      const fieldHeight = fieldRef.current?.clientHeight || FIELD_H;
      const result = tick(eng, TICK_MS, fieldHeight);
      engineRef.current = result.state;

      if (result.events.length > 0) {
        setEvents(prev => [...prev, ...result.events]);
      }

      // Check if feedback just ended (new round started)
      if (eng.feedbackState && !result.state.feedbackState) {
        roundCountRef.current++;
      }

      syncView();

      if (result.state.phase !== 'playing') {
        syncView();
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, TICK_MS);
  }, [activeCreatures, syncView]);

  const handleStop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    engineRef.current = null;
    startedRef.current = false;
  }, []);

  const handleWordTap = useCallback((wordId: string) => {
    const eng = engineRef.current;
    if (!eng || eng.phase !== 'playing') return;

    const result = tapWord(eng, wordId);
    engineRef.current = result.state;

    if (result.events.length > 0) {
      setEvents(prev => [...prev, ...result.events]);
    }

    // Check if feedback ended → new round
    if (result.state.feedbackState === null && eng.feedbackState) {
      roundCountRef.current++;
    }

    syncView();
  }, [syncView]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    view,
    events,
    fieldRef,
    handleStart,
    handleStop,
    handleWordTap,
    clearEvents,
  };
}
