import type { RoundResult } from './game';
import type { Egg } from './hatchery';
import type { CollectionEntry, CreatureStats } from './collection';

export interface WordStat {
  correct: number;
  wrong: number;
  streak: number;
  lastSeen: string;
  mastery: number; // 0=新词, 1-2=初学, 3=熟悉, 4=熟练, 5=已掌握
}

export interface PersistedGameState {
  version: number;
  energyStones: number;
  totalWordsCompleted: number;
  bestHeight: number;
  bestRound: RoundResult | null;
  lastPlayedDate: string;
  eggs: Egg[];
  maxEggSlots: number;
  collection: CollectionEntry[];
  creatureStats: Record<string, CreatureStats>;
  activeCreatureIds: string[];
  settings: GameSettings;
  wordStats: Record<string, WordStat>;
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
}
