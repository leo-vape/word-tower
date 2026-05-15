export interface DifficultyParams {
  speed: number;
  interval: number;
  distractorCount: number;
  maxWordLength: number;
  level: number;
}

const TOTAL_LEVELS = 30;
const WORDS_PER_LEVEL = 3;

// Distractor progression: 2→3→4
function getDistractorCount(levelIdx: number): number {
  if (levelIdx < 8) return 2;    // levels 1-8
  if (levelIdx < 18) return 3;   // levels 9-18
  return 4;                        // levels 19-30
}

// Speed: 50 → 160 across 30 levels
function getBaseSpeed(levelIdx: number): number {
  const t = levelIdx / (TOTAL_LEVELS - 1); // 0 → 1
  return Math.round(50 + t * 110);
}

// Interval: 1500ms → 450ms
function getInterval(levelIdx: number): number {
  const t = levelIdx / (TOTAL_LEVELS - 1);
  return Math.round(1500 - t * 1050);
}

// Word length: 4 → 8
function getMaxWordLength(levelIdx: number): number {
  const t = levelIdx / (TOTAL_LEVELS - 1);
  return Math.min(8, Math.round(4 + t * 4));
}

export function getDifficulty(wordsCompleted: number, slowPercent: number = 0): DifficultyParams {
  const levelIdx = Math.min(
    Math.floor(wordsCompleted / WORDS_PER_LEVEL),
    TOTAL_LEVELS - 1,
  );
  const slowMultiplier = 1 - slowPercent / 100;

  return {
    speed: getBaseSpeed(levelIdx) * slowMultiplier,
    interval: getInterval(levelIdx),
    distractorCount: getDistractorCount(levelIdx),
    maxWordLength: getMaxWordLength(levelIdx),
    level: levelIdx + 1,
  };
}
