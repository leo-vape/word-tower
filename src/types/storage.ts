import type { RoundResult } from './game';
import type { Egg } from './hatchery';
import type { CollectionEntry, CreatureStats } from './collection';

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
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
}
