import type { PersistedGameState } from '../types/storage';

const STORAGE_KEY = 'word-tower-game-state';
const CURRENT_VERSION = 1;

export function loadState(): PersistedGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.state?.version !== CURRENT_VERSION) {
      return migrate(parsed?.state, parsed?.version ?? 0);
    }
    return parsed.state ?? parsed;
  } catch {
    return null;
  }
}

function migrate(state: PersistedGameState, fromVersion: number): PersistedGameState {
  if (fromVersion < 1) {
    state.version = CURRENT_VERSION;
    state.eggs = state.eggs ?? [];
    state.maxEggSlots = state.maxEggSlots ?? 2;
    state.collection = state.collection ?? [];
    state.creatureStats = state.creatureStats ?? {};
    state.activeCreatureIds = state.activeCreatureIds ?? [];
  }
  return state;
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}
