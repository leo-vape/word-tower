import { type ReactNode } from 'react';
import ScorePopup from './ScorePopup';

interface GameFieldProps {
  children: ReactNode;
  combo: number;
  shake: boolean;
  scorePopups: Array<{ id: string; x: number; y: number; score: number; combo: number }>;
}

export default function GameField({ children, combo, shake, scorePopups }: GameFieldProps) {
  return (
    <div
      className={`relative flex-1 min-h-[200px] bg-bg/50 overflow-hidden transition-all duration-300
        ${combo >= 5 ? 'shadow-[inset_0_0_40px_rgba(233,69,96,0.15)]' : ''}
        ${combo >= 8 ? 'shadow-[inset_0_0_60px_rgba(255,215,0,0.2)]' : ''}
        ${shake ? 'animate-shake' : ''}
      `}
    >
      {/* Combo border glow */}
      {combo >= 3 && (
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-xl transition-opacity duration-300"
          style={{
            boxShadow: combo >= 7
              ? 'inset 0 0 30px rgba(255,215,0,0.4), 0 0 20px rgba(255,215,0,0.3)'
              : 'inset 0 0 20px rgba(233,69,96,0.3), 0 0 12px rgba(233,69,96,0.2)',
          }}
        />
      )}

      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            style={{
              left: `${(i * 17 + 7) % 100}%`,
              top: `${(i * 13 + 3) % 100}%`,
              animation: `float-up ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Game content */}
      {children}

      {/* Score popups */}
      {scorePopups.map(p => (
        <ScorePopup key={p.id} {...p} />
      ))}
    </div>
  );
}
