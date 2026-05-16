import { type ReactNode, useMemo, memo } from 'react';
import ScorePopup from './ScorePopup';

interface GameFieldProps {
  children: ReactNode;
  combo: number;
  shake: boolean;
  scorePopups: Array<{ id: string; x: number; y: number; score: number; combo: number }>;
}

// Pre-compute particle config — static, not regenerated each tick
const PARTICLES = Array.from({ length: 10 }).map((_, i) => ({
  key: i,
  width: `${2 + (i * 3) % 4}px`,
  height: `${2 + (i * 3) % 4}px`,
  left: `${(i * 11 + 5) % 100}%`,
  top: `${(i * 9 + 2) % 100}%`,
  color: i % 3 === 0 ? 'rgba(233,69,96,0.2)' : i % 3 === 1 ? 'rgba(245,197,24,0.15)' : 'rgba(147,51,234,0.2)',
  animDuration: `${2.5 + i * 0.6}s`,
  animDelay: `${i * 0.8}s`,
}));

export default memo(function GameField({ children, combo, shake, scorePopups }: GameFieldProps) {
  const comboGlow = useMemo(() => {
    if (combo < 3) return undefined;
    return combo >= 7
      ? 'inset 0 0 40px rgba(255,215,0,0.3), 0 0 25px rgba(255,215,0,0.2)'
      : 'inset 0 0 25px rgba(233,69,96,0.25), 0 0 15px rgba(233,69,96,0.15)';
  }, [combo]);

  return (
    <div
      className={`relative flex-1 min-h-[200px] bg-gradient-to-b from-[#0f0f23] via-[#1a1030] to-[#0f0f23] overflow-hidden transition-all duration-300
        ${combo >= 5 ? 'shadow-[inset_0_0_60px_rgba(233,69,96,0.12)]' : ''}
        ${combo >= 8 ? 'shadow-[inset_0_0_80px_rgba(255,215,0,0.15)]' : ''}
        ${shake ? 'animate-shake' : ''}
      `}
    >
      {combo >= 3 && (
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-xl transition-opacity duration-300"
          style={{ boxShadow: comboGlow }}
        />
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map(p => (
          <div
            key={p.key}
            className="absolute rounded-full"
            style={{
              width: p.width,
              height: p.height,
              left: p.left,
              top: p.top,
              backgroundColor: p.color,
              animation: `float-up ${p.animDuration} ease-in-out infinite`,
              animationDelay: p.animDelay,
            }}
          />
        ))}
      </div>

      {children}

      {scorePopups.map(p => (
        <ScorePopup key={p.id} {...p} />
      ))}
    </div>
  );
});
