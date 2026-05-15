export const APP_VERSION = '1.1.0';
export const INITIAL_ENERGY = 20;
export const STARTING_LIVES = 5;
export const MAX_ACTIVE_CREATURES = 3;
export const MAX_SELECTED_LETTERS = 8;
export const LETTER_COLS = 5;
export const LETTER_SIZE = 44;
export const LETTER_GAP = 8;
export const MIN_WORD_LENGTH = 3;
export const FIELD_HEIGHT_RESERVE = 280;

export const SPEED_TABLE: { speed: number; interval: number; minLen: number }[] = [
  { speed: 60,  interval: 1800, minLen: 3 },
  { speed: 72,  interval: 1600, minLen: 3 },
  { speed: 86,  interval: 1400, minLen: 3 },
  { speed: 103, interval: 1200, minLen: 4 },
  { speed: 124, interval: 1000, minLen: 4 },
  { speed: 149, interval: 850,  minLen: 4 },
  { speed: 179, interval: 700,  minLen: 5 },
  { speed: 215, interval: 600,  minLen: 5 },
  { speed: 250, interval: 500,  minLen: 5 },
  { speed: 260, interval: 400,  minLen: 6 },
];

export const DIFFICULTY_WORDS_PER_LEVEL = 5;
export const DAILY_BONUS_ENERGY = 5;

export const LETTER_WEIGHTS: Record<string, number> = {
  A: 9, B: 4, C: 5, D: 5, E: 12, F: 3, G: 3, H: 4,
  I: 9, J: 1, K: 3, L: 6, M: 4, N: 7, O: 8, P: 4,
  Q: 1, R: 7, S: 8, T: 7, U: 5, V: 2, W: 3, X: 1,
  Y: 4, Z: 1,
};

export const EGG_SLOT_MILESTONES = [
  { words: 0, slots: 2 },
  { words: 30, slots: 3 },
  { words: 100, slots: 4 },
];
