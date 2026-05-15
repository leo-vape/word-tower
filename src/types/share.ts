import type { Creature } from './creature';

export interface ShareCardData {
  towerHeight: number;
  totalWordsCompleted: number;
  totalCreaturesCollected: number;
  rarestCreature: Creature | null;
  energyStones: number;
  date: string;
}
