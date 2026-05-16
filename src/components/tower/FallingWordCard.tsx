import type { FallingWordView } from '../../types/tower';

interface FallingWordCardProps {
  word: FallingWordView;
  feedback: 'correct' | 'wrong' | 'boss_defeated' | null;
  isCorrectWord: boolean;
  onTap: () => void;
}

export default function FallingWordCard({ word, feedback, isCorrectWord, onTap }: FallingWordCardProps) {
  const wordLen = word.word.length;
  const width = Math.min(Math.max(wordLen * 16 + 24, 72), 180);

  // Threat level: words near bottom glow more menacingly
  const threatLevel = Math.min(word.y / 70, 1);

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

  // Dark enemy glow based on how close to bottom
  const enemyGlow = !feedback
    ? `0 0 ${4 + threatLevel * 16}px rgba(147,51,234,${0.2 + threatLevel * 0.4})`
    : '';

  return (
    <div
      className={`absolute flex items-center justify-center rounded-lg font-bold text-sm
        border transition-all duration-200 active:scale-95 cursor-pointer select-none
        ${borderColor} ${bgColor} ${textColor} ${extraClass}
        ${!feedback ? 'animate-enemy-glow' : ''}`}
      style={{
        width,
        height: 40,
        left: `${word.x}%`,
        top: `${word.y}%`,
        transform: `translateX(-50%) translateX(${Math.sin(word.y * 0.2) * 4}px)`,
        boxShadow: shadowStyle || enemyGlow || undefined,
        zIndex: 1,
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        onTap();
      }}
    >
      {word.word}
    </div>
  );
}
