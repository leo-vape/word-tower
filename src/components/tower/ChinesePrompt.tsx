import { memo, useEffect, useState } from 'react';

interface ChinesePromptProps {
  chinese: string;
  letterCount: number;
  feedback: 'correct' | 'wrong' | 'boss_defeated' | null;
  correctWord?: string;
  trigger: number;
  phonetic?: string;
}

export default memo(function ChinesePrompt({ chinese, letterCount, feedback, correctWord, trigger, phonetic }: ChinesePromptProps) {
  const [animClass, setAnimClass] = useState('');

  useEffect(() => {
    setAnimClass('animate-scale-in');
    const t = setTimeout(() => setAnimClass(''), 300);
    return () => clearTimeout(t);
  }, [trigger]);

  const glowColor = feedback === 'correct' ? 'drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]'
    : feedback === 'wrong' ? 'drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]'
    : feedback === 'boss_defeated' ? 'drop-shadow-[0_0_8px_rgba(245,197,24,0.4)]'
    : '';

  return (
    <div className="flex flex-col items-center py-1.5 px-3 bg-bg/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className={`
          text-2xl font-bold transition-all duration-200
          ${feedback === 'correct' ? 'text-green-400' : ''}
          ${feedback === 'wrong' ? 'text-red-400' : ''}
          ${feedback === 'boss_defeated' ? 'text-accent' : ''}
          ${!feedback ? 'text-white' : ''}
          ${animClass} ${glowColor}
        `}>
          📜 {chinese}
          <span className="text-xs text-gray-500 font-normal ml-2">({letterCount}字母)</span>
        </div>

        {phonetic && (
          <div className="text-base text-gray-300 font-mono mt-0.5 tracking-wide">
            {phonetic}
          </div>
        )}
      </div>

      {feedback === 'wrong' && correctWord && (
        <div className="mt-2 px-4 py-2 bg-green-500/15 border border-green-500/40 rounded-lg animate-scale-in">
          <div className="text-xs text-green-400/70 mb-0.5">正确答案</div>
          <div className="text-xl font-bold text-green-300 tracking-wider">
            {correctWord}
          </div>
        </div>
      )}
    </div>
  );
});
