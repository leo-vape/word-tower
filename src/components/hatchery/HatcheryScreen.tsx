import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getCreature } from '../../data/creatures';
import type { Egg } from '../../types/hatchery';
import type { Creature } from '../../types/creature';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import EnergyBadge from '../ui/EnergyBadge';
import EggSlot from './EggSlot';
import EggDetailModal from './EggDetailModal';
import HatchAnimation from './HatchAnimation';
import CreatureRevealCard from './CreatureRevealCard';

export default function HatcheryScreen() {
  const eggs = useGameStore(s => s.eggs);
  const maxSlots = useGameStore(s => s.maxEggSlots);
  const energyStones = useGameStore(s => s.energyStones);
  const addEgg = useGameStore(s => s.addEgg);
  const checkDailyBonus = useGameStore(s => s.checkDailyBonus);

  const [selectedEgg, setSelectedEgg] = useState<Egg | null>(null);
  const [hatchingCreature, setHatchingCreature] = useState<Creature | null>(null);
  const [revealedCreature, setRevealedCreature] = useState<Creature | null>(null);
  const [showHatchAnim, setShowHatchAnim] = useState(false);

  useEffect(() => {
    checkDailyBonus();
  }, []);

  const activeEggs = eggs.filter(e => !e.hatchedAt);
  const hatchedEggs = eggs.filter(e => e.hatchedAt);
  const emptySlots = maxSlots - activeEggs.length;

  const handleEggTap = (egg: Egg) => {
    if (egg.energyFed >= egg.energyRequired) {
      // Auto-hatch
      setSelectedEgg(egg);
      setShowHatchAnim(true);
    } else {
      setSelectedEgg(egg);
    }
  };

  const handleHatchComplete = () => {
    if (!selectedEgg) return;
    const store = useGameStore.getState();
    const creature = store.hatchEgg(selectedEgg.id);
    setShowHatchAnim(false);
    if (creature) {
      // Auto-equip if slot available
      if (store.activeCreatureIds.length < 3 && !store.activeCreatureIds.includes(creature.id)) {
        store.setActiveCreatures([...store.activeCreatureIds, creature.id]);
      }
      setHatchingCreature(null);
      setRevealedCreature(creature);
    }
    setSelectedEgg(null);
  };

  const handleAddEgg = () => {
    addEgg('common');
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">孵蛋场</h2>
        <EnergyBadge amount={energyStones} />
      </div>

      {/* Active eggs */}
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-3">
          孵化中的蛋 ({activeEggs.length}/{maxSlots})
        </div>
        <div className="grid grid-cols-2 gap-3">
          {activeEggs.map(egg => (
            <EggSlot
              key={egg.id}
              egg={egg}
              onTap={() => handleEggTap(egg)}
            />
          ))}
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, emptySlots) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-700 text-gray-600 min-h-[140px]"
            >
              <span className="text-2xl mb-1">❓</span>
              <span className="text-xs">空槽位</span>
            </div>
          ))}
        </div>
        {emptySlots > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddEgg}
            className="w-full mt-3"
          >
            发现新蛋 (5 💎)
          </Button>
        )}
      </div>

      {/* Hatched history */}
      {hatchedEggs.length > 0 && (
        <div>
          <div className="text-sm text-gray-500 mb-3">孵化记录</div>
          <div className="space-y-2">
            {hatchedEggs.slice(-5).reverse().map(egg => {
              const creature = egg.hatchedCreatureId ? getCreature(egg.hatchedCreatureId) : null;
              return (
                <div key={egg.id} className="flex items-center gap-3 bg-bg rounded-xl p-3">
                  <span className="text-2xl">{creature?.emoji ?? '❓'}</span>
                  <div>
                    <div className="text-sm text-white">{creature?.name ?? '未知'}</div>
                    <div className="text-xs text-gray-500">{egg.rarity}蛋孵化</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Egg detail modal */}
      {selectedEgg && !showHatchAnim && !revealedCreature && (
        <EggDetailModal egg={selectedEgg} onClose={() => setSelectedEgg(null)} />
      )}

      {/* Hatch animation modal */}
      {showHatchAnim && (
        <Modal open onClose={() => {}} title="孵化中...">
          <HatchAnimation onComplete={handleHatchComplete} />
        </Modal>
      )}

      {/* Creature reveal modal */}
      {revealedCreature && (
        <Modal open onClose={() => setRevealedCreature(null)}>
          <CreatureRevealCard
            creature={revealedCreature}
            onClose={() => setRevealedCreature(null)}
          />
        </Modal>
      )}
    </div>
  );
}
