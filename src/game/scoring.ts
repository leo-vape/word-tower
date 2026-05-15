import type { SkillEffect } from '../types/creature';

export interface ScoreResult {
  baseEnergy: number;
  comboBonus: number;
  skillBonus: number;
  totalEnergy: number;
  heightGain: number;
  isDouble: boolean;
}

export function calculateScore(
  wordLength: number,
  combo: number,
  activeEffects: SkillEffect[],
  wordsCompleted: number,
): ScoreResult {
  const baseEnergy = Math.floor(wordLength / 2);
  const comboBonus = Math.floor(combo / 3);

  let skillBonus = 0;
  for (const effect of activeEffects) {
    if (effect.type === 'bonus_energy') {
      skillBonus += effect.amount;
    }
  }

  let totalEnergy = baseEnergy + comboBonus + skillBonus;

  let isDouble = false;
  for (const effect of activeEffects) {
    if (effect.type === 'double_energy_every_n') {
      if ((wordsCompleted + 1) % effect.n === 0) {
        totalEnergy *= 2;
        isDouble = true;
      }
    }
  }

  const heightGain = 1 + Math.floor(wordLength / 5);

  return { baseEnergy, comboBonus, skillBonus, totalEnergy: Math.max(1, totalEnergy), heightGain, isDouble };
}
