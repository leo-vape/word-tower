import type { Egg } from '../../types/hatchery';
import ProgressRing from '../ui/ProgressRing';
import RarityGlow from '../ui/RarityGlow';

interface EggSlotProps {
  egg: Egg;
  onTap: () => void;
}

const rarityColors: Record<string, string> = {
  common: '#a0a0a0',
  rare: '#4da6ff',
  epic: '#c471ed',
  legendary: '#ffd700',
};

const eggEmojis: Record<string, string> = {
  common: '🥚',
  rare: '🥚',
  epic: '🥚',
  legendary: '🥚',
};

export default function EggSlot({ egg, onTap }: EggSlotProps) {
  const progress = egg.energyRequired > 0 ? egg.energyFed / egg.energyRequired : 0;
  const isReady = progress >= 1;
  const color = rarityColors[egg.rarity] ?? '#a0a0a0';

  return (
    <button
      onClick={onTap}
      className={`relative flex flex-col items-center p-3 rounded-xl transition-transform active:scale-95
        ${isReady ? 'animate-glow-pulse' : ''}`}
    >
      <RarityGlow rarity={egg.rarity}>
        <div className="p-3">
          <div className="relative flex items-center justify-center">
            <ProgressRing
              progress={progress}
              size={80}
              strokeWidth={6}
              color={color}
            />
            <span className="absolute text-3xl">
              {isReady ? '✨' : eggEmojis[egg.rarity]}
            </span>
          </div>
        </div>
      </RarityGlow>
      <div className="mt-2 text-center">
        <span className="text-xs capitalize" style={{ color }}>
          {egg.rarity === 'common' && '普通'}
          {egg.rarity === 'rare' && '稀有'}
          {egg.rarity === 'epic' && '史诗'}
          {egg.rarity === 'legendary' && '传说'}
        </span>
        <div className="text-xs text-gray-500 mt-0.5">
          {isReady ? '可以孵化！' : `${egg.energyFed}/${egg.energyRequired}`}
        </div>
      </div>
    </button>
  );
}
