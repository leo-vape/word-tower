import type { FallingWord, GamePhase } from '../types/game';
import type { Creature } from '../types/creature';
import type { WordEntry } from '../data/wordBank';
import { createRound, createBossRound } from './wordPool';
import { calculateScore } from './scoring';
import { getDifficulty } from './difficulty';
import { resolveActiveEffects, getActiveSkillEffects } from './skillResolver';
import { STARTING_LIVES } from '../utils/constants';

export interface EngineState {
  phase: GamePhase;
  words: FallingWord[];
  targetWord: WordEntry | null;
  wordsCompleted: number;
  currentHeight: number;
  energyEarnedThisSession: number;
  combo: number;
  maxCombo: number;
  elapsedMs: number;
  livesRemaining: number;
  spawnTimer: number;
  difficulty: ReturnType<typeof getDifficulty>;
  activeCreatures: Creature[];
  resolvedEffects: ReturnType<typeof resolveActiveEffects>;
  feedbackState: 'correct' | 'wrong' | 'boss_defeated' | null;
  feedbackTimer: number;
  isBossRound: boolean;
}

const BOSS_INTERVAL = 10; // boss every 10 words
const BOSS_FEEDBACK_DURATION = 800; // longer feedback for boss defeat

const FEEDBACK_DURATION = 500; // ms to show feedback before next round

export function createEngineState(activeCreatures: Creature[]): EngineState {
  const effects = resolveActiveEffects(activeCreatures);
  const diff = getDifficulty(0, effects.slowPercent);
  const round = createRound(diff);

  return {
    phase: 'idle',
    words: round.allWords,
    targetWord: round.target,
    wordsCompleted: 0,
    currentHeight: 0,
    energyEarnedThisSession: 0,
    combo: 0,
    maxCombo: 0,
    elapsedMs: 0,
    livesRemaining: STARTING_LIVES + effects.extraLives,
    spawnTimer: 0,
    difficulty: diff,
    activeCreatures,
    resolvedEffects: effects,
    feedbackState: null,
    feedbackTimer: 0,
    isBossRound: false,
  };
}

export interface TickResult {
  state: EngineState;
  events: GameEvent[];
}

export type GameEvent =
  | { type: 'word_missed'; word: string }
  | { type: 'word_correct'; word: string; energy: number; height: number; combo: number; isDouble: boolean; phonetic: string }
  | { type: 'word_wrong'; word: string; correctWord: string }
  | { type: 'game_over'; result: { words: string[]; totalEnergy: number; maxCombo: number; height: number } }
  | { type: 'egg_drop'; rarity: 'rare' | 'epic' | 'legendary' }
  | { type: 'difficulty_up'; level: number }
  | { type: 'boss_start'; word: string; chinese: string; phonetic: string }
  | { type: 'boss_defeated'; word: string; energy: number; eggRarity: 'rare' | 'epic' | 'legendary'; phonetic: string };

export function startGame(state: EngineState): EngineState {
  return { ...state, phase: 'playing' };
}

function startNewRound(state: EngineState): EngineState {
  const nextWordCount = state.wordsCompleted + 1;
  const isBoss = nextWordCount > 0 && nextWordCount % BOSS_INTERVAL === 0;
  const diff = getDifficulty(state.wordsCompleted, state.resolvedEffects.slowPercent);

  let words: FallingWord[];
  let targetWord: WordEntry;

  if (isBoss) {
    const bossRound = createBossRound(diff);
    words = bossRound.allWords;
    targetWord = bossRound.target;
  } else {
    const round = createRound(diff);
    words = round.allWords;
    targetWord = round.target;
  }

  return {
    ...state,
    words,
    targetWord,
    difficulty: diff,
    feedbackState: null,
    feedbackTimer: 0,
    isBossRound: isBoss,
  };
}

export function tick(state: EngineState, deltaMs: number, fieldHeight: number): TickResult {
  if (state.phase !== 'playing') return { state, events: [] };

  const events: GameEvent[] = [];
  let { words, elapsedMs, livesRemaining, combo, currentHeight, energyEarnedThisSession, maxCombo, wordsCompleted, feedbackState, feedbackTimer } = state;

  elapsedMs += deltaMs;

  // Handle feedback timer (pause during feedback)
  if (feedbackState) {
    const fbDuration = feedbackState === 'boss_defeated' ? BOSS_FEEDBACK_DURATION : FEEDBACK_DURATION;
    feedbackTimer += deltaMs;
    if (feedbackTimer >= fbDuration) {
      // Feedback over, start new round
      const nextState = startNewRound({ ...state, elapsedMs, feedbackState: null, feedbackTimer: 0 });
      if (nextState.isBossRound && nextState.targetWord) {
        events.push({ type: 'boss_start', word: nextState.targetWord.en, chinese: nextState.targetWord.zh, phonetic: nextState.targetWord.phonetic });
      }
      return { state: nextState, events };
    }
    return {
      state: { ...state, elapsedMs, feedbackTimer },
      events,
    };
  }

  // Move words down
  const fallDist = fieldHeight * (deltaMs / 1000);
  const missedWords: FallingWord[] = [];

  words = words.map(w => {
    const newY = w.y + (w.speed / fieldHeight) * (deltaMs / 1000);
    if (newY >= 1) {
      missedWords.push(w);
    }
    return { ...w, y: newY };
  });

  let targetMissed = false;

  // Handle words that hit bottom
  for (const mw of missedWords) {
    if (mw.isCorrect) {
      events.push({ type: 'word_missed', word: mw.word });
      livesRemaining--;
      combo = 0;
      targetMissed = true;
    }
  }

  // Remove fallen words
  words = words.filter(w => w.y < 1);

  // If correct word was missed, start new round
  if (targetMissed) {
    if (livesRemaining <= 0) {
      return buildGameOverResult(state, events, energyEarnedThisSession, maxCombo, currentHeight);
    }
    const nextState = startNewRound({
      ...state,
      words: [],
      elapsedMs,
      livesRemaining,
      combo: 0,
      currentHeight,
      energyEarnedThisSession,
      maxCombo,
      wordsCompleted,
    });
    if (nextState.isBossRound && nextState.targetWord) {
      events.push({ type: 'boss_start', word: nextState.targetWord.en, chinese: nextState.targetWord.zh, phonetic: nextState.targetWord.phonetic });
    }
    return { state: nextState, events };
  }

  // Check game over
  if (livesRemaining <= 0) {
    return buildGameOverResult(state, events, energyEarnedThisSession, maxCombo, currentHeight);
  }

  return {
    state: {
      ...state,
      words,
      elapsedMs,
      livesRemaining,
      combo,
      wordsCompleted,
      currentHeight,
      energyEarnedThisSession,
      maxCombo,
    },
    events,
  };
}

export interface TapResult {
  state: EngineState;
  events: GameEvent[];
}

export function tapWord(state: EngineState, wordId: string): TapResult {
  if (state.phase !== 'playing') return { state, events: [] };
  if (state.feedbackState) return { state, events: [] }; // ignore during feedback

  const word = state.words.find(w => w.id === wordId);
  if (!word) return { state, events: [] };

  const events: GameEvent[] = [];
  let { combo, maxCombo, wordsCompleted, currentHeight, energyEarnedThisSession, livesRemaining } = state;

  if (word.isCorrect) {
    // Correct answer
    combo++;
    maxCombo = Math.max(maxCombo, combo);
    wordsCompleted++;

    const effects = getActiveSkillEffects(state.activeCreatures);
    const score = calculateScore(word.word.length, combo, effects, wordsCompleted);
    currentHeight += score.heightGain;
    energyEarnedThisSession += score.totalEnergy;

    if (state.isBossRound) {
      // Boss defeated — guaranteed rare+ egg
      const rarityRoll = Math.random() * 100;
      let eggRarity: 'rare' | 'epic' | 'legendary' = 'rare';
      if (rarityRoll < 50) eggRarity = 'epic';
      else if (rarityRoll < 80) eggRarity = 'legendary';

      events.push({
        type: 'boss_defeated',
        word: word.word,
        energy: score.totalEnergy + 5, // bonus for boss
        eggRarity,
        phonetic: state.targetWord?.phonetic ?? '',
      });
      energyEarnedThisSession += 5; // extra boss energy
    } else {
      events.push({
        type: 'word_correct',
        word: word.word,
        energy: score.totalEnergy,
        height: score.heightGain,
        combo,
        isDouble: score.isDouble,
        phonetic: state.targetWord?.phonetic ?? '',
      });

      // Check egg drop (random, not guaranteed)
      checkEggDrop(state, events);
    }

    // Check difficulty up
    const newDiff = getDifficulty(wordsCompleted, state.resolvedEffects.slowPercent);
    if (newDiff.level > state.difficulty.level) {
      events.push({ type: 'difficulty_up', level: newDiff.level });
    }
  } else {
    // Wrong answer
    livesRemaining--;
    combo = 0;
    const correctWord = state.targetWord?.en ?? '';
    events.push({ type: 'word_wrong', word: word.word, correctWord });
  }

  if (livesRemaining <= 0) {
    return buildGameOverResult(
      { ...state, combo, maxCombo, wordsCompleted, currentHeight, energyEarnedThisSession, livesRemaining: 0 },
      events,
      energyEarnedThisSession,
      maxCombo,
      currentHeight,
    );
  }

  return {
    state: {
      ...state,
      combo,
      maxCombo,
      wordsCompleted,
      currentHeight,
      energyEarnedThisSession,
      livesRemaining,
      feedbackState: word.isCorrect && state.isBossRound ? 'boss_defeated' : word.isCorrect ? 'correct' : 'wrong',
      feedbackTimer: 0,
    },
    events,
  };
}

function checkEggDrop(state: EngineState, events: GameEvent[]): void {
  if (state.resolvedEffects.eggDropChance > 0 && Math.random() * 100 < state.resolvedEffects.eggDropChance) {
    const roll = Math.random() * 100;
    if (roll < 70) events.push({ type: 'egg_drop', rarity: 'rare' });
    else if (roll < 95) events.push({ type: 'egg_drop', rarity: 'epic' });
    else events.push({ type: 'egg_drop', rarity: 'legendary' });
  }
}

function buildGameOverResult(
  state: EngineState,
  events: GameEvent[],
  totalEnergy: number,
  maxCombo: number,
  height: number,
): TickResult | TapResult {
  return {
    state: { ...state, phase: 'gameover' },
    events: [
      ...events,
      {
        type: 'game_over',
        result: { words: [], totalEnergy, maxCombo, height },
      },
    ],
  };
}
