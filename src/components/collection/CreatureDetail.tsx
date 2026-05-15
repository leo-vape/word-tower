import type { Creature } from '../../types/creature';
import type { CollectionEntry, CreatureStats } from '../../types/collection';
import Modal from '../ui/Modal';
import PixelSprite from '../ui/PixelSprite';

interface CreatureDetailProps {
  creature: Creature;
  entry: CollectionEntry | undefined;
  stats: CreatureStats | undefined;
  onClose: () => void;
}

export default function CreatureDetail({ creature, entry, stats, onClose }: CreatureDetailProps) {
  return (
    <Modal open onClose={onClose} title={creature.name}>
      <div className="flex flex-col items-center space-y-4">
        {/* Sprite */}
        <PixelSprite emoji={creature.emoji} size={80} />

        {/* Names */}
        <div className="text-center">
          <div className="text-xs text-gray-500">{creature.nameEn}</div>
          <div className="text-sm capitalize mt-1" style={{
            color: creature.rarity === 'common' ? '#a0a0a0' :
                   creature.rarity === 'rare' ? '#4da6ff' :
                   creature.rarity === 'epic' ? '#c471ed' : '#ffd700'
          }}>
            {creature.rarity === 'common' && '⚪ 普通'}
            {creature.rarity === 'rare' && '🔵 稀有'}
            {creature.rarity === 'epic' && '🟣 史诗'}
            {creature.rarity === 'legendary' && '🟡 传说'}
            {' · '}
            {creature.element === 'fire' && '🔥'}
            {creature.element === 'water' && '💧'}
            {creature.element === 'earth' && '🪨'}
            {creature.element === 'wind' && '🌬️'}
            {creature.element === 'light' && '✨'}
            {creature.element === 'dark' && '🌑'}
          </div>
        </div>

        {/* Skill */}
        <div className="bg-bg rounded-xl p-4 w-full">
          <div className="font-bold text-white mb-1">{creature.skill.name}</div>
          <p className="text-sm text-gray-400">{creature.skill.description}</p>
        </div>

        {/* Flavor text */}
        <p className="text-xs text-gray-500 text-center italic">{creature.description}</p>

        {/* Stats */}
        {entry && (
          <div className="grid grid-cols-2 gap-2 w-full">
            <div className="text-center text-xs text-gray-600">
              获得于 {new Date(entry.obtainedAt).toLocaleDateString('zh-CN')}
            </div>
            <div className="text-center text-xs text-gray-600">
              获得 {entry.timesObtained} 次
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
