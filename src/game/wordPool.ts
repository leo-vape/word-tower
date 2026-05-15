import type { FallingWord } from '../types/game';
import type { WordEntry } from '../data/wordBank';
import { getWordsByDifficulty } from '../data/wordBank';
import { generateDistractors } from './distractors';
import type { DifficultyParams } from './difficulty';

let nextId = 0;

export interface RoundWords {
  target: WordEntry;
  allWords: FallingWord[];
}

const COL_COUNT = 3;

export function createRound(difficulty: DifficultyParams): RoundWords {
  const pool = getWordsByDifficulty(difficulty.level);

  const idx = Math.floor(Math.random() * pool.length);
  const target = pool[idx];

  const distractors = generateDistractors(target.en, pool, difficulty.distractorCount);
  const options = [target.en, ...distractors];
  shuffleArray(options);

  // Distribute words evenly across columns and stagger Y positions
  const totalWords = options.length;
  const allWords: FallingWord[] = options.map((word, i) => {
    const col = i % COL_COUNT;
    // Stagger Y: spread words across top portion of screen
    const y = 0.03 + (i / totalWords) * 0.18 + Math.random() * 0.03;

    return {
      id: `w_${Date.now()}_${nextId++}`,
      word,
      isCorrect: word === target.en,
      col,
      y,
      speed: difficulty.speed + (Math.random() - 0.5) * 15,
    };
  });

  return { target, allWords };
}

function shuffleArray<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function createBossRound(difficulty: DifficultyParams): RoundWords {
  // Boss: pick the longest word available at this difficulty
  const pool = getWordsByDifficulty(difficulty.level);
  const longWords = pool.filter(w => w.en.length >= Math.min(difficulty.maxWordLength, 7));
  const candidates = longWords.length > 0 ? longWords : pool;

  const idx = Math.floor(Math.random() * candidates.length);
  const target = candidates[idx];

  // Boss round: only ONE word, drops fast, centered
  const bossWord: FallingWord = {
    id: `boss_${Date.now()}_${nextId++}`,
    word: target.en,
    isCorrect: true,
    col: 1, // center column
    y: 0.05,
    speed: difficulty.speed * 1.4, // 40% faster
  };

  return { target, allWords: [bossWord] };
}

export { COL_COUNT };
