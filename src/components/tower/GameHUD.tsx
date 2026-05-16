import { STARTING_LIVES } from '../../utils/constants';
import type { Creature } from '../../types/creature';

interface GameHUDProps {
  height: number;
  energy: number;
  combo: number;
  lives: number;
  level: number;
  elapsedMs: number;
  activeCreatures: Creature[];
}

function getBuffSummary(creatures: Creature[]): string[] {
  const buffs: string[] = [];
  let bonusEnergy = 0;
  let slowPercent = 0;
  let extraLives = 0;

  for (const c of creatures) {
    const e = c.skill.effect;
    switch (e.type) {
      case 'bonus_energy': bonusEnergy += e.amount; break;
      case 'slow_letters': slowPercent += e.percent; break;
      case 'extra_life': extraLives += e.count; break;
    }
  }

  if (bonusEnergy > 0) buffs.push(`+${bonusEnergy}💎/词`);
  if (slowPercent > 0) buffs.push(`↓${slowPercent}%速度`);
  if (extraLives > 0) buffs.push(`+${extraLives}❤️`);

  return buffs;
}

export default function GameHUD({ height, energy, combo, lives, level, elapsedMs, activeCreatures }: GameHUDProps) {
  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const maxLives = STARTING_LIVES + 2;
  const buffs = getBuffSummary(activeCreatures);

  // Fire color for combo
  let comboColor = 'text-primary';
  if (combo >= 10) comboColor = 'text-yellow-300 animate-fire-pulse';
  else if (combo >= 7) comboColor = 'text-accent';
  else if (combo >= 5) comboColor = 'text-orange-400';
  else if (combo >= 3) comboColor = 'text-red-400';

  return (
    <div className="flex flex-col bg-surface/90 backdrop-blur border-b border-gray-800">
      {/* Main HUD row */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-bg rounded-lg px-2 py-0.5">
            <span className="text-accent font-bold text-sm drop-shadow-[0_0_4px_rgba(245,197,24,0.5)]">
              {height}
            </span>
            <span className="text-gray-500 text-xs">层</span>
          </div>
          <div className="flex items-center gap-1 bg-bg rounded-lg px-2 py-0.5">
            <span className="text-energy font-bold text-sm">{energy}</span>
            <span className="text-gray-500 text-xs">💎</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {combo > 1 && (
            <span className={`text-xs font-bold animate-bounce-in rounded-full px-2 py-0.5 bg-bg ${comboColor}`}>
              🔥 x{combo}
            </span>
          )}
          <div className="flex gap-0.5">
            {Array.from({ length: maxLives }).map((_, i) => (
              <span key={i} className={`text-xs transition-all duration-300 ${
                i < lives ? '' : 'grayscale opacity-20'
              }`}>
                {i < lives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500 bg-bg rounded px-1.5 py-0.5">Lv.{level}</span>
          <span className="text-xs text-gray-500 font-mono bg-bg rounded px-1.5 py-0.5">
            {minutes}:{secs.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Active buffs row */}
      {buffs.length > 0 && (
        <div className="flex items-center gap-2 px-3 pb-1.5">
          {activeCreatures.slice(0, 3).map(c => (
            <span key={c.id} className="text-sm" title={c.skill.description}>{c.emoji}</span>
          ))}
          <div className="flex gap-1.5">
            {buffs.map((b, i) => (
              <span key={i} className="text-[10px] text-gray-400 bg-bg rounded-full px-2 py-0.5">
                {b}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
