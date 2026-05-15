import type { Creature } from '../../types/creature';
import Button from '../ui/Button';
import RarityGlow from '../ui/RarityGlow';
import PixelSprite from '../ui/PixelSprite';

interface CreatureRevealCardProps {
  creature: Creature;
  onClose: () => void;
}

export default function CreatureRevealCard({ creature, onClose }: CreatureRevealCardProps) {
  return (
    <div className="flex flex-col items-center space-y-4 animate-bounce-in">
      <div className="text-sm text-gray-400">获得新精灵！</div>

      <RarityGlow rarity={creature.rarity}>
        <div className="p-4">
          <PixelSprite emoji={creature.emoji} size={80} />
        </div>
      </RarityGlow>

      <div className="text-center">
        <h3 className="text-xl font-bold text-white">{creature.name}</h3>
        <p className="text-sm text-gray-400">{creature.nameEn}</p>
      </div>

      <div className="bg-bg rounded-xl p-3 text-center w-full">
        <div className="font-bold text-sm mb-1" style={{ color: 'var(--glow-color)' }}>
          {creature.skill.name}
        </div>
        <p className="text-xs text-gray-400">{creature.skill.description}</p>
      </div>

      <p className="text-xs text-gray-500 text-center">{creature.description}</p>

      <div className="text-xs text-energy text-center">✅ 已自动出战（可去图鉴调整）</div>

      <Button variant="primary" onClick={onClose} className="w-full">
        太棒了！
      </Button>
    </div>
  );
}
