import type { Creature } from '../../types/creature';
import RarityGlow from '../ui/RarityGlow';

interface CreatureThumbProps {
  creature: Creature;
  isRevealed: boolean;
  onTap: () => void;
  isEquipped?: boolean;
}

export default function CreatureThumb({ creature, isRevealed, onTap, isEquipped }: CreatureThumbProps) {
  return (
    <button
      onClick={onTap}
      className={`relative flex flex-col items-center p-2 rounded-xl transition-transform active:scale-95
        ${isEquipped ? 'ring-2 ring-accent' : ''}`}
    >
      <RarityGlow rarity={creature.rarity}>
        <div className={`p-3 flex items-center justify-center ${!isRevealed ? 'grayscale opacity-30' : ''}`}>
          <span className="text-3xl">{isRevealed ? creature.emoji : '❓'}</span>
        </div>
      </RarityGlow>
      <span className="text-xs text-gray-300 mt-1 text-center">
        {isRevealed ? creature.name : '???'}
      </span>
    </button>
  );
}
