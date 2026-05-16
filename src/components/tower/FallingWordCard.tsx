import { memo } from 'react';
import type { FallingWordView } from '../../types/tower';

interface FallingWordCardProps {
  word: FallingWordView;
  feedback: 'correct' | 'wrong' | 'boss_defeated' | null;
  isCorrectWord: boolean;
  onWordTap: (id: string) => void;
}

export default memo(function FallingWordCard({ word, feedback, isCorrectWord, onWordTap }: FallingWordCardProps) {
  const wordLen = word.word.length;
  const width = Math.min(Math.max(wordLen * 16 + 24, 72), 180);

  let borderColor = 'border-purple-800/60';
  let bgColor = 'bg-purple-950/30';
  let textColor = 'text-purple-200';
  let shadowStyle = '';
  let extraClass = '';

  if ((feedback === 'correct' || feedback === 'boss_defeated') && isCorrectWord) {
    if (feedback === 'boss_defeated') {
      borderColor = 'border-accent';
      bgColor = 'bg-accent/20';
      textColor = 'text-accent';
      extraClass = 'scale-125';
      shadowStyle = '0 0 30px rgba(245,197,24,0.9), 0 0 60px rgba(245,197,24,0.5)';
    } else {
      borderColor = 'border-green-400';
      bgColor = 'bg-green-500/20';
      textColor = 'text-green-300';
      shadowStyle = '0 0 20px rgba(74,222,128,0.7), 0 0 40px rgba(74,222,128,0.3)';
    }
  } else if (feedback === 'wrong') {
    if (isCorrectWord) {
      borderColor = 'border-green-400';
      bgColor = 'bg-green-500/20';
      textColor = 'text-green-300';
      shadowStyle = '0 0 16px rgba(74,222,128,0.5)';
    } else if (!isCorrectWord) {
      borderColor = 'border-gray-800';
      bgColor = 'bg-gray-900/20';
      textColor = 'text-gray-700';
    }
  }

  // Enemy glow — use CSS animation instead of per-frame JS computation
  const enemyGlow = !feedback ? 'animate-enemy-glow' : '';

  return (
    <div
      className={`absolute flex items-center justify-center rounded-lg font-bold text-sm
        border transition-all duration-200 active:scale-95 cursor-pointer select-none
        ${borderColor} ${bgColor} ${textColor} ${extraClass} ${enemyGlow}`}
      style={{
        width,
        height: 40,
        left: `${word.x}%`,
        top: `${word.y}%`,
        transform: `translateX(-50%)`,
        boxShadow: shadowStyle || undefined,
        zIndex: 1,
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        onWordTap(word.id);
      }}
    >
      {word.word}
    </div>
  );
});
