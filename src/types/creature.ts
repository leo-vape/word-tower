export type CreatureRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type Element = 'fire' | 'water' | 'earth' | 'wind' | 'light' | 'dark';
export type SkillTrigger = 'passive' | 'on_word';

export interface Creature {
  id: string;
  name: string;
  nameEn: string;
  rarity: CreatureRarity;
  element: Element;
  skill: Skill;
  description: string;
  hatchFromRarity: CreatureRarity;
  emoji: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  trigger: SkillTrigger;
  effect: SkillEffect;
}

export type SkillEffect =
  | { type: 'bonus_energy'; amount: number }
  | { type: 'slow_letters'; percent: number }
  | { type: 'extra_life'; count: number }
  | { type: 'hint_first_letter' }
  | { type: 'double_energy_every_n'; n: number }
  | { type: 'revive'; count: number }
  | { type: 'egg_drop_chance'; percent: number };
