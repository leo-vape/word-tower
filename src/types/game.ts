export interface FallingWord {
  id: string;
  word: string;
  isCorrect: boolean;
  col: number;
  y: number;
  speed: number;
}

export type GamePhase = 'idle' | 'playing' | 'paused' | 'gameover';

export interface RoundResult {
  wordsSpelled: string[];
  totalEnergyEarned: number;
  maxCombo: number;
  heightReached: number;
  duration: number;
  date: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
