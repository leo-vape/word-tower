import { memo } from 'react';
import type { Creature } from '../../types/creature';

interface BattleLineProps {
  creatures: Creature[];
  animState: 'idle' | 'attacking' | 'hit' | 'celebrating' | 'boss_alert';
}

export default memo(function BattleLine({ creatures, animState }: BattleLineProps) {
  if (creatures.length === 0) return null;

  const animClass = (() => {
    switch (animState) {
      case 'attacking': return 'animate-creature-lunge';
      case 'hit': return 'animate-creature-hit';
      case 'celebrating': return 'animate-creature-celebrate';
      case 'boss_alert': return 'animate-shake';
      default: return 'animate-creature-idle';
    }
  })();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none flex justify-center gap-2 pb-4">
      {creatures.map((c, i) => (
        <div
          key={c.id}
          className="flex flex-col items-center"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className={`text-3xl transition-all duration-300 ${animClass}`}>
            {c.emoji}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">{c.name}</div>
        </div>
      ))}
    </div>
  );
});
