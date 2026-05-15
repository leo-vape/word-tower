import type { EggDefinition } from '../types/hatchery';

export const eggDefinitions: Record<string, EggDefinition> = {
  common: {
    rarity: 'common',
    energyRequired: 10,
    possibleCreatureIds: [
      'flame_hatchling', 'droplet_sprite', 'pebble_turtle',
      'breeze_bird', 'starlight_cat', 'shadow_mouse',
    ],
    hatchChances: {
      flame_hatchling: 17,
      droplet_sprite: 17,
      pebble_turtle: 17,
      breeze_bird: 17,
      starlight_cat: 16,
      shadow_mouse: 16,
    },
  },
  rare: {
    rarity: 'rare',
    energyRequired: 25,
    possibleCreatureIds: [
      'blaze_eagle', 'frost_deer', 'crystal_bear',
      'storm_falcon', 'radiance_fox',
      'flame_hatchling', 'droplet_sprite', 'pebble_turtle',
    ],
    hatchChances: {
      blaze_eagle: 20,
      frost_deer: 20,
      crystal_bear: 20,
      storm_falcon: 20,
      radiance_fox: 15,
      flame_hatchling: 2,
      droplet_sprite: 2,
      pebble_turtle: 1,
    },
  },
  epic: {
    rarity: 'epic',
    energyRequired: 50,
    possibleCreatureIds: [
      'void_raven', 'magma_dragon', 'aurora_whale',
      'blaze_eagle', 'crystal_bear', 'radiance_fox',
    ],
    hatchChances: {
      void_raven: 30,
      magma_dragon: 30,
      aurora_whale: 20,
      blaze_eagle: 8,
      crystal_bear: 7,
      radiance_fox: 5,
    },
  },
  legendary: {
    rarity: 'legendary',
    energyRequired: 100,
    possibleCreatureIds: [
      'genesis_phoenix', 'chaos_dragon',
      'void_raven', 'magma_dragon', 'aurora_whale',
    ],
    hatchChances: {
      genesis_phoenix: 35,
      chaos_dragon: 35,
      void_raven: 12,
      magma_dragon: 10,
      aurora_whale: 8,
    },
  },
};

export function rollCreature(eggDef: EggDefinition): string {
  const roll = Math.random() * 100;
  let cumulative = 0;

  for (const [creatureId, chance] of Object.entries(eggDef.hatchChances)) {
    cumulative += chance;
    if (roll < cumulative) return creatureId;
  }

  return eggDef.possibleCreatureIds[0];
}
