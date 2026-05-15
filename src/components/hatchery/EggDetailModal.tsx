import type { Egg } from '../../types/hatchery';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ProgressRing from '../ui/ProgressRing';
import { useGameStore } from '../../store/useGameStore';
import { eggDefinitions } from '../../data/eggs';
import { getCreature } from '../../data/creatures';

interface EggDetailModalProps {
  egg: Egg;
  onClose: () => void;
}

const rarityColors: Record<string, string> = {
  common: '#a0a0a0',
  rare: '#4da6ff',
  epic: '#c471ed',
  legendary: '#ffd700',
};

const rarityNames: Record<string, string> = {
  common: '普通蛋', rare: '稀有蛋', epic: '史诗蛋', legendary: '传说蛋',
};

export default function EggDetailModal({ egg, onClose }: EggDetailModalProps) {
  const energyStones = useGameStore(s => s.energyStones);
  const feedEgg = useGameStore(s => s.feedEgg);
  const hatchEgg = useGameStore(s => s.hatchEgg);
  const setActiveCreatures = useGameStore(s => s.setActiveCreatures);
  const activeCreatureIds = useGameStore(s => s.activeCreatureIds);

  const progress = egg.energyRequired > 0 ? egg.energyFed / egg.energyRequired : 0;
  const remaining = egg.energyRequired - egg.energyFed;
  const isReady = progress >= 1;
  const color = rarityColors[egg.rarity] ?? '#a0a0a0';

  // Get possible creatures from this egg
  const eggDef = eggDefinitions[egg.rarity];
  const possibleCreatures = eggDef
    ? eggDef.possibleCreatureIds.map(id => getCreature(id)).filter(c => c != null)
    : [];

  const handleFeedAll = () => {
    const amount = Math.min(remaining, energyStones);
    if (amount <= 0) return;
    feedEgg(egg.id, amount);
    onClose();
  };

  const handleHatch = () => {
    const creature = hatchEgg(egg.id);
    if (creature) {
      // Auto-equip if slot available
      if (activeCreatureIds.length < 3 && !activeCreatureIds.includes(creature.id)) {
        setActiveCreatures([...activeCreatureIds, creature.id]);
      }
      onClose();
    }
  };

  return (
    <Modal open onClose={onClose} title="蛋的详情">
      <div className="flex flex-col items-center space-y-4">
        {/* Progress */}
        <div className="relative">
          <ProgressRing progress={progress} size={100} strokeWidth={8} color={color} />
          <span className="absolute inset-0 flex items-center justify-center text-3xl">
            {isReady ? '✨' : '🥚'}
          </span>
        </div>

        {/* Rarity + progress */}
        <div className="text-center">
          <span className="text-lg font-bold" style={{ color }}>{rarityNames[egg.rarity]}</span>
          <div className="text-sm text-gray-400">
            {egg.energyFed} / {egg.energyRequired} 💎
          </div>
        </div>

        {/* Possible creatures preview */}
        {!isReady && possibleCreatures.length > 0 && (
          <div className="w-full">
            <div className="text-xs text-gray-500 mb-2 text-center">可能孵出的精灵</div>
            <div className="flex justify-center gap-2 flex-wrap">
              {possibleCreatures.slice(0, 4).map(c => (
                <div key={c!.id} className="flex flex-col items-center bg-bg rounded-lg px-2 py-1.5 min-w-[60px]">
                  <span className="text-lg">{c!.emoji}</span>
                  <span className="text-xs text-gray-400">{c!.name}</span>
                  <span className="text-[10px] text-gray-600 leading-tight text-center max-w-[70px]">
                    {c!.skill.description.slice(0, 12)}...
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {isReady ? (
          <Button variant="primary" size="lg" onClick={handleHatch} className="w-full">
            孵化！✨
          </Button>
        ) : (
          <div className="w-full space-y-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleFeedAll}
              disabled={energyStones <= 0}
              className="w-full"
            >
              喂满能量 ({Math.min(remaining, energyStones)} 💎)
            </Button>
            <p className="text-xs text-gray-500 text-center">
              拥有 {energyStones} 💎 · 还需 {remaining} 💎
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
