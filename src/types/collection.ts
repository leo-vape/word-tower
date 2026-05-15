export interface CollectionEntry {
  creatureId: string;
  obtainedAt: string;
  timesObtained: number;
  isFavorite: boolean;
}

export interface CreatureStats {
  wordsCompletedWhileEquipped: number;
  energyGenerated: number;
  timesUsed: number;
}
