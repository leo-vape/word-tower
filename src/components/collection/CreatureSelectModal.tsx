import type { Creature } from '../../types/creature';
import Modal from '../ui/Modal';
import PixelSprite from '../ui/PixelSprite';
import Button from '../ui/Button';
import { MAX_ACTIVE_CREATURES } from '../../utils/constants';

interface CreatureSelectModalProps {
  owned: Creature[];
  activeIds: string[];
  onToggle: (creatureId: string) => void;
  onClose: () => void;
}

export default function CreatureSelectModal({ owned, activeIds, onToggle, onClose }: CreatureSelectModalProps) {
  return (
    <Modal open onClose={onClose} title={`选择出战精灵 (${activeIds.length}/${MAX_ACTIVE_CREATURES})`}>
      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
        {owned.length === 0 ? (
          <p className="text-center text-gray-500 py-8">还没有精灵，快去孵蛋吧！</p>
        ) : (
          owned.map(creature => {
            const isActive = activeIds.includes(creature.id);
            return (
              <button
                key={creature.id}
                onClick={() => onToggle(creature.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isActive ? 'bg-primary/20 border border-primary/40' : 'bg-bg border border-transparent'
                }`}
              >
                <PixelSprite emoji={creature.emoji} size={40} />
                <div className="flex-1 text-left">
                  <div className="text-sm font-bold text-white">{creature.name}</div>
                  <div className="text-xs text-gray-400">{creature.skill.name}</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isActive ? 'border-primary bg-primary text-white' : 'border-gray-600'
                }`}>
                  {isActive && '✓'}
                </div>
              </button>
            );
          })
        )}
      </div>
      <Button variant="primary" onClick={onClose} className="w-full mt-4">
        确定
      </Button>
    </Modal>
  );
}
