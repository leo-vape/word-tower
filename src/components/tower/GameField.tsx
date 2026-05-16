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
      className={`relative flex-1 min-h-[200px] bg-gradient-to-b from-[#0f0f23] via-[#1a1030] to-[#0f0f23] overflow-hidden transition-all duration-300
        ${combo >= 5 ? 'shadow-[inset_0_0_60px_rgba(233,69,96,0.12)]' : ''}
        ${combo >= 8 ? 'shadow-[inset_0_0_80px_rgba(255,215,0,0.15)]' : ''}
        ${shake ? 'animate-shake' : ''}
      `}
    >
      {/* Combo border glow */}
      {combo >= 3 && (
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-xl transition-opacity duration-300"
          style={{
            boxShadow: combo >= 7
              ? 'inset 0 0 40px rgba(255,215,0,0.3), 0 0 25px rgba(255,215,0,0.2)'
              : 'inset 0 0 25px rgba(233,69,96,0.25), 0 0 15px rgba(233,69,96,0.15)',
          }}
        />
      )}

      {/* Battle field particles — embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${(i * 11 + 5) % 100}%`,
              top: `${(i * 9 + 2) % 100}%`,
              backgroundColor: i % 3 === 0 ? 'rgba(233,69,96,0.2)' : i % 3 === 1 ? 'rgba(245,197,24,0.15)' : 'rgba(147,51,234,0.2)',
              animation: `float-up ${2.5 + i * 0.6}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
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
