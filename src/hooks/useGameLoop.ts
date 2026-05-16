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
const TICK_MS = 33;
const COL_COUNT = 3;

export function useGameLoop(activeCreatures: Creature[]) {
  const engineRef = useRef<EngineState | null>(null);
  const rafRef = useRef<number>(0);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);
  const roundCountRef = useRef(0);
  // Track last rendered view to skip redundant setView calls
  const lastViewRef = useRef<GameViewState | null>(null);

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

  const buildView = useCallback((): GameViewState => {
    const s = engineRef.current!;
    const targetWord = s.targetWord;
    const correctWord = s.words.find(w => w.isCorrect);

    return {
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
    };
  }, []);

  // Only update React state if the view actually changed
  const syncViewIfChanged = useCallback(() => {
    if (!engineRef.current) return;
    const next = buildView();
    const prev = lastViewRef.current;
    // Quick check: if fallingWords positions are the same and feedback/phase unchanged, skip
    if (prev && prev.phase === next.phase && prev.feedback === next.feedback) {
      const positionsSame = next.fallingWords.length === prev.fallingWords.length
        && next.fallingWords.every((w, i) => w.y === prev!.fallingWords[i]?.y && w.id === prev!.fallingWords[i]?.id);
      if (positionsSame && prev.combo === next.combo && prev.elapsedMs === next.elapsedMs) {
        return; // No meaningful change, skip re-render
      }
    }
    lastViewRef.current = next;
    setView(next);
  }, [buildView]);

  const handleStart = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    roundCountRef.current = 0;

    const state = createEngineState(activeCreatures);
    engineRef.current = startGame(state);
    roundCountRef.current++;
    setEvents([]);
    lastViewRef.current = null;
    syncViewIfChanged();

    let lastTime = performance.now();
    let accumulator = 0;

    const loop = (now: number) => {
      const eng = engineRef.current;
      if (!eng || eng.phase !== 'playing') {
        rafRef.current = 0;
        syncViewIfChanged(); // final render
        return;
      }

      const rawDelta = now - lastTime;
      lastTime = now;
      // Clamp to avoid spiral of death after tab hidden
      const delta = Math.min(rawDelta, 200);
      accumulator += delta;

      let eventsEmitted = false;
      while (accumulator >= TICK_MS) {
        const fieldHeight = fieldRef.current?.clientHeight || FIELD_H;
        const result = tick(eng, TICK_MS, fieldHeight);
        engineRef.current = result.state;

        if (result.events.length > 0) {
          setEvents(prev => [...prev, ...result.events]);
          eventsEmitted = true;
        }

        if (eng.feedbackState && !result.state.feedbackState) {
          roundCountRef.current++;
        }

        accumulator -= TICK_MS;

        if (result.state.phase !== 'playing') {
          syncViewIfChanged();
          rafRef.current = 0;
          return;
        }
      }

      syncViewIfChanged();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [activeCreatures, syncViewIfChanged]);

  const handleStop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    engineRef.current = null;
    startedRef.current = false;
    lastViewRef.current = null;
  }, []);

  const handleWordTap = useCallback((wordId: string) => {
    const eng = engineRef.current;
    if (!eng || eng.phase !== 'playing') return;

    const result = tapWord(eng, wordId);
    engineRef.current = result.state;

    if (result.events.length > 0) {
      setEvents(prev => [...prev, ...result.events]);
    }

    if (result.state.feedbackState === null && eng.feedbackState) {
      roundCountRef.current++;
    }

    syncViewIfChanged();
  }, [syncViewIfChanged]);

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
