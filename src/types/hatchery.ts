export type EggRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Egg {
  id: string;
  rarity: EggRarity;
  energyRequired: number;
  energyFed: number;
  createdAt: string;
  hatchedAt: string | null;
  hatchedCreatureId: string | null;
}

export interface EggDefinition {
  rarity: EggRarity;
  energyRequired: number;
  possibleCreatureIds: string[];
  hatchChances: Record<string, number>;
}
