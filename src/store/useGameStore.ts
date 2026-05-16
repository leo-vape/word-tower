import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistedGameState, WordStat } from '../types/storage';
import type { RoundResult } from '../types/game';
import type { Egg, EggRarity } from '../types/hatchery';
import type { Creature } from '../types/creature';
import type { CollectionEntry } from '../types/collection';
import { eggDefinitions, rollCreature } from '../data/eggs';
import { getCreature } from '../data/creatures';
import { wordBank } from '../data/wordBank';
import { INITIAL_ENERGY, DAILY_BONUS_ENERGY, EGG_SLOT_MILESTONES } from '../utils/constants';
import { getTodayISO } from '../utils/storage';

interface GameStore extends PersistedGameState {
  addEnergy: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  completeWord: (word: string, combo: number) => { energy: number; heightGain: number };
  recordGameOver: (result: RoundResult) => void;
  feedEgg: (eggId: string, amount: number) => boolean;
  hatchEgg: (eggId: string) => Creature | null;
  addEgg: (rarity: EggRarity) => Egg | null;
  setActiveCreatures: (ids: string[]) => void;
  getActiveCreatures: () => Creature[];
  checkDailyBonus: () => number;
  checkEggSlotUnlock: () => void;
  getShareData: () => { towerHeight: number; totalWordsCompleted: number; totalCreaturesCollected: number; rarestCreature: Creature | null; energyStones: number; date: string };
  recordWordResult: (word: string, correct: boolean) => void;
  getWeakWords: (limit?: number) => Array<{ word: string; zh: string; wrong: number; mastery: number }>;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      version: 1,
      energyStones: INITIAL_ENERGY,
      totalWordsCompleted: 0,
      bestHeight: 0,
      bestRound: null,
      lastPlayedDate: '',
      eggs: [],
      maxEggSlots: 2,
      collection: [],
      creatureStats: {},
      activeCreatureIds: [],
      settings: { soundEnabled: true, hapticEnabled: true },
      wordStats: {},

      addEnergy: (amount) => set(s => ({ energyStones: s.energyStones + amount })),

      spendEnergy: (amount) => {
        const state = get();
        if (state.energyStones < amount) return false;
        set(s => ({ energyStones: s.energyStones - amount }));
        return true;
      },

      completeWord: (word, combo) => {
        let energy = Math.floor(word.length / 2);
        energy += Math.floor(combo / 3);

        const state = get();
        for (const id of state.activeCreatureIds) {
          const c = getCreature(id);
          // Energy bonuses from creature skills are resolved in the engine
        }

        const heightGain = 1 + Math.floor(word.length / 5);
        set(s => ({
          energyStones: s.energyStones + energy,
          totalWordsCompleted: s.totalWordsCompleted + 1,
        }));

        return { energy, heightGain };
      },

      recordGameOver: (result) => {
        set(s => ({
          bestHeight: Math.max(s.bestHeight, result.heightReached),
          bestRound: !s.bestRound || result.heightReached > s.bestRound.heightReached
            ? result : s.bestRound,
          lastPlayedDate: getTodayISO(),
        }));
      },

      feedEgg: (eggId, amount) => {
        const state = get();
        if (!state.spendEnergy(amount)) return false;

        set(s => ({
          eggs: s.eggs.map(e =>
            e.id === eggId
              ? { ...e, energyFed: Math.min(e.energyFed + amount, e.energyRequired) }
              : e
          ),
        }));
        return true;
      },

      hatchEgg: (eggId) => {
        const state = get();
        const egg = state.eggs.find(e => e.id === eggId);
        if (!egg || egg.energyFed < egg.energyRequired) return null;

        const eggDef = eggDefinitions[egg.rarity];
        const creatureId = rollCreature(eggDef);
        const creature = getCreature(creatureId);
        if (!creature) return null;

        const now = new Date().toISOString();
        const existing = state.collection.find(e => e.creatureId === creature.id);

        set(s => ({
          eggs: s.eggs.map(e =>
            e.id === eggId
              ? { ...e, hatchedAt: now, hatchedCreatureId: creature.id }
              : e
          ),
          collection: existing
            ? s.collection.map(e =>
                e.creatureId === creature.id
                  ? { ...e, timesObtained: e.timesObtained + 1 }
                  : e
              )
            : [...s.collection, {
                creatureId: creature.id,
                obtainedAt: now,
                timesObtained: 1,
                isFavorite: false,
              }],
        }));

        return creature;
      },

      addEgg: (rarity) => {
        const state = get();
        if (state.eggs.filter(e => !e.hatchedAt).length >= state.maxEggSlots) return null;

        const eggDef = eggDefinitions[rarity];
        const egg: Egg = {
          id: `egg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          rarity: eggDef.rarity,
          energyRequired: eggDef.energyRequired,
          energyFed: 0,
          createdAt: new Date().toISOString(),
          hatchedAt: null,
          hatchedCreatureId: null,
        };

        set(s => ({ eggs: [...s.eggs, egg] }));
        return egg;
      },

      setActiveCreatures: (ids) => set({ activeCreatureIds: ids }),

      getActiveCreatures: () => {
        return get().activeCreatureIds
          .map(id => getCreature(id))
          .filter((c): c is Creature => c != null);
      },

      checkDailyBonus: () => {
        const state = get();
        const today = getTodayISO();
        if (state.lastPlayedDate !== today && state.lastPlayedDate !== '') {
          set({ energyStones: state.energyStones + DAILY_BONUS_ENERGY });
          return DAILY_BONUS_ENERGY;
        }
        if (state.lastPlayedDate === '') {
          set({ lastPlayedDate: today });
        }
        return 0;
      },

      checkEggSlotUnlock: () => {
        const state = get();
        let newMax = state.maxEggSlots;
        for (const milestone of EGG_SLOT_MILESTONES) {
          if (state.totalWordsCompleted >= milestone.words) {
            newMax = Math.max(newMax, milestone.slots);
          }
        }
        if (newMax !== state.maxEggSlots) {
          set({ maxEggSlots: newMax });
        }
      },

      recordWordResult: (word, correct) => {
        const state = get();
        const existing = state.wordStats[word];
        const today = getTodayISO();

        const calcMastery = (c: number, w: number, s: number): number => {
          if (c >= 10 && s >= 5) return 5;
          if (c >= 7 && s >= 3) return 4;
          if (c >= 4) return 3;
          if (c >= 1) return 2;
          return 1;
        };

        const updated: WordStat = existing
          ? {
              correct: existing.correct + (correct ? 1 : 0),
              wrong: existing.wrong + (correct ? 0 : 1),
              streak: correct ? existing.streak + 1 : 0,
              lastSeen: today,
              mastery: correct
                ? calcMastery(existing.correct + 1, existing.wrong, existing.streak + 1)
                : Math.max(0, existing.mastery - 1),
            }
          : {
              correct: correct ? 1 : 0,
              wrong: correct ? 0 : 1,
              streak: correct ? 1 : 0,
              lastSeen: today,
              mastery: correct ? 1 : 0,
            };

        set(s => ({
          wordStats: { ...s.wordStats, [word]: updated },
        }));
      },

      getWeakWords: (limit = 5) => {
        const state = get();
        return Object.entries(state.wordStats)
          .filter(([, s]) => s.mastery < 4)
          .sort((a, b) => b[1].wrong - a[1].wrong || a[1].mastery - b[1].mastery)
          .slice(0, limit)
          .map(([word, s]) => {
            const entry = wordBank.find(w => w.en === word);
            return { word, zh: entry?.zh ?? '', wrong: s.wrong, mastery: s.mastery };
          });
      },

      getShareData: () => {
        const state = get();
        let rarest: Creature | null = null;
        const rarityOrder: Record<string, number> = { common: 0, rare: 1, epic: 2, legendary: 3 };

        for (const entry of state.collection) {
          const c = getCreature(entry.creatureId);
          if (c && (!rarest || rarityOrder[c.rarity] > rarityOrder[rarest.rarity])) {
            rarest = c;
          }
        }

        return {
          towerHeight: state.bestHeight,
          totalWordsCompleted: state.totalWordsCompleted,
          totalCreaturesCollected: state.collection.length,
          rarestCreature: rarest,
          energyStones: state.energyStones,
          date: getTodayISO(),
        };
      },
    }),
    {
      name: 'word-tower-game-state',
      version: 1,
    }
  )
);
