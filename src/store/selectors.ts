import { useGameStore } from './useGameStore';

export const useEnergyStones = () => useGameStore(s => s.energyStones);
export const useBestHeight = () => useGameStore(s => s.bestHeight);
export const useTotalWords = () => useGameStore(s => s.totalWordsCompleted);
export const useEggs = () => useGameStore(s => s.eggs);
export const useMaxEggSlots = () => useGameStore(s => s.maxEggSlots);
export const useCollection = () => useGameStore(s => s.collection);
export const useActiveCreatureIds = () => useGameStore(s => s.activeCreatureIds);
export const useSettings = () => useGameStore(s => s.settings);

export const useUnhatchedEggs = () =>
  useGameStore(s => s.eggs.filter(e => !e.hatchedAt));

export const useHatchedEggs = () =>
  useGameStore(s => s.eggs.filter(e => e.hatchedAt));

export const useCollectedCreatureIds = () =>
  useGameStore(s => new Set(s.collection.map(e => e.creatureId)));
