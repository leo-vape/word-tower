import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getCreature, creatures as allCreatures } from '../../data/creatures';
import type { Creature } from '../../types/creature';
import Button from '../ui/Button';
import CreatureThumb from './CreatureThumb';
import CreatureDetail from './CreatureDetail';
import CreatureSelectModal from './CreatureSelectModal';
import { MAX_ACTIVE_CREATURES } from '../../utils/constants';

export default function CollectionScreen() {
  const collection = useGameStore(s => s.collection);
  const activeCreatureIds = useGameStore(s => s.activeCreatureIds);
  const creatureStats = useGameStore(s => s.creatureStats);
  const setActiveCreatures = useGameStore(s => s.setActiveCreatures);

  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [showSelect, setShowSelect] = useState(false);

  const collectedCreatureIds = new Set(collection.map(e => e.creatureId));
  const ownedCreatures = allCreatures.filter(c => collectedCreatureIds.has(c.id));

  const handleToggleCreature = (creatureId: string) => {
    if (activeCreatureIds.includes(creatureId)) {
      setActiveCreatures(activeCreatureIds.filter(id => id !== creatureId));
    } else {
      if (activeCreatureIds.length >= MAX_ACTIVE_CREATURES) {
        // Remove oldest
        setActiveCreatures([...activeCreatureIds.slice(1), creatureId]);
      } else {
        setActiveCreatures([...activeCreatureIds, creatureId]);
      }
    }
  };

  const selectedEntry = selectedCreature
    ? collection.find(e => e.creatureId === selectedCreature.id)
    : undefined;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">精灵图鉴</h2>
        <Button variant="secondary" size="sm" onClick={() => setShowSelect(true)}>
          编辑出战
        </Button>
      </div>

      {/* Collection progress */}
      <div className="text-sm text-gray-500 mb-4">
        已收集 {collectedCreatureIds.size} / {allCreatures.length} 只
      </div>

      {/* Active team */}
      {activeCreatureIds.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">当前出战</div>
          <div className="flex gap-2">
            {activeCreatureIds.map(id => {
              const c = getCreature(id);
              if (!c) return null;
              return (
                <div key={id} className="text-center">
                  <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-2xl ring-1 ring-accent">
                    {c.emoji}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{c.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All creatures grid */}
      <div className="grid grid-cols-3 gap-3">
        {allCreatures.map(creature => {
          const isRevealed = collectedCreatureIds.has(creature.id);
          const isEquipped = activeCreatureIds.includes(creature.id);
          return (
            <CreatureThumb
              key={creature.id}
              creature={creature}
              isRevealed={isRevealed}
              isEquipped={isEquipped}
              onTap={() => isRevealed && setSelectedCreature(creature)}
            />
          );
        })}
      </div>

      {/* Creature detail modal */}
      {selectedCreature && (
        <CreatureDetail
          creature={selectedCreature}
          entry={selectedEntry}
          stats={creatureStats[selectedCreature.id]}
          onClose={() => setSelectedCreature(null)}
        />
      )}

      {/* Select modal */}
      {showSelect && (
        <CreatureSelectModal
          owned={ownedCreatures}
          activeIds={activeCreatureIds}
          onToggle={handleToggleCreature}
          onClose={() => setShowSelect(false)}
        />
      )}
    </div>
  );
}
