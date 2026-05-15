import type { WordEntry } from '../data/wordBank';

export function generateDistractors(
  target: string,
  allWords: WordEntry[],
  count: number,
): string[] {
  const targetLen = target.length;
  const targetLower = target.toLowerCase();

  const candidates = allWords
    .filter(w => w.en.length === targetLen && w.en.toLowerCase() !== targetLower)
    .map(w => w.en);

  // Shuffle and prefer same first letter for some
  const sameFirst = candidates.filter(w => w[0].toLowerCase() === targetLower[0]);
  const diffFirst = candidates.filter(w => w[0].toLowerCase() !== targetLower[0]);

  shuffle(sameFirst);
  shuffle(diffFirst);

  // Mix: take some from same first letter, rest from different
  const result: string[] = [];
  const sameCount = Math.min(Math.ceil(count / 2), sameFirst.length);
  for (let i = 0; i < sameCount; i++) {
    result.push(sameFirst[i]);
  }
  for (let i = 0; result.length < count && i < diffFirst.length; i++) {
    result.push(diffFirst[i]);
  }

  // Fill remaining from any candidate not yet used
  const used = new Set(result.map(w => w.toLowerCase()));
  const remaining = candidates.filter(w => !used.has(w.toLowerCase()));
  shuffle(remaining);
  for (let i = 0; result.length < count && i < remaining.length; i++) {
    result.push(remaining[i]);
  }

  shuffle(result);
  return result.slice(0, count);
}

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
