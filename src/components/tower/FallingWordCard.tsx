import type { FallingWordView } from '../../types/tower';

interface FallingWordCardProps {
  word: FallingWordView;
  feedback: 'correct' | 'wrong' | 'boss_defeated' | null;
  isCorrectWord: boolean;
  onTap: () => void;
}

export default function FallingWordCard({ word, feedback, isCorrectWord, onTap }: FallingWordCardProps) {
  // Calculate width based on word length
  const wordLen = word.word.length;
  const width = Math.min(Math.max(wordLen * 16 + 24, 72), 180);

  let borderColor = 'border-cyan-400/60';
  let bgColor = 'bg-cyan-500/10';
  let textColor = 'text-white';
  let extraClass = '';

  if ((feedback === 'correct' || feedback === 'boss_defeated') && isCorrectWord) {
    borderColor = feedback === 'boss_defeated' ? 'border-accent' : 'border-green-400';
    bgColor = feedback === 'boss_defeated' ? 'bg-accent/30' : 'bg-green-500/30';
    textColor = feedback === 'boss_defeated' ? 'text-accent' : 'text-green-300';
    extraClass = 'scale-125 shadow-[0_0_24px_rgba(245,197,24,0.8)]';
  } else if (feedback === 'wrong') {
    if (isCorrectWord) {
      // Highlight the correct answer
      borderColor = 'border-green-400';
      bgColor = 'bg-green-500/30';
      textColor = 'text-green-300';
      extraClass = 'shadow-[0_0_16px_rgba(74,222,128,0.6)]';
    } else if (word.isCorrect === false && !isCorrectWord) {
      // Dim wrong answers
      borderColor = 'border-gray-700';
      bgColor = 'bg-gray-800/30';
      textColor = 'text-gray-600';
    }
  }

  return (
    <div
      className={`absolute flex items-center justify-center rounded-xl font-bold text-base
        border-2 transition-all duration-200 active:scale-95 cursor-pointer select-none
        ${borderColor} ${bgColor} ${textColor} ${extraClass}`}
      style={{
        width,
        height: 44,
        left: `${word.x}%`,
        top: `${word.y}%`,
        transform: `translateX(-50%) translateX(${Math.sin(word.y * 0.3) * 6}px)`,
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
