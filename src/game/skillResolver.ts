import type { SkillEffect, Creature } from '../types/creature';

export interface ResolvedEffects {
  bonusEnergy: number;
  slowPercent: number;
  extraLives: number;
  reviveCount: number;
  eggDropChance: number;
  hasHint: boolean;
  doubleEveryN: number[];
}

export function resolveActiveEffects(creatures: Creature[]): ResolvedEffects {
  const effects: ResolvedEffects = {
    bonusEnergy: 0,
    slowPercent: 0,
    extraLives: 0,
    reviveCount: 0,
    eggDropChance: 0,
    hasHint: false,
    doubleEveryN: [],
  };

  for (const c of creatures) {
    const e = c.skill.effect;
    switch (e.type) {
      case 'bonus_energy':
        effects.bonusEnergy += e.amount;
        break;
      case 'slow_letters':
        effects.slowPercent += e.percent;
        break;
      case 'extra_life':
        effects.extraLives += e.count;
        break;
      case 'revive':
        effects.reviveCount += e.count;
        break;
      case 'egg_drop_chance':
        effects.eggDropChance += e.percent;
        break;
      case 'hint_first_letter':
        effects.hasHint = true;
        break;
      case 'double_energy_every_n':
        effects.doubleEveryN.push(e.n);
        break;
    }
  }

  // Caps
  effects.slowPercent = Math.min(effects.slowPercent, 50);
  effects.bonusEnergy = Math.min(effects.bonusEnergy, 6);
  effects.eggDropChance = Math.min(effects.eggDropChance, 25);

  return effects;
}

export function getActiveSkillEffects(creatures: Creature[]): SkillEffect[] {
  return creatures.map(c => c.skill.effect);
}
