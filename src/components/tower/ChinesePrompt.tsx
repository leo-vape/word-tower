import { useEffect, useState } from 'react';

interface ChinesePromptProps {
  chinese: string;
  letterCount: number;
  feedback: 'correct' | 'wrong' | 'boss_defeated' | null;
  correctWord?: string;
  trigger: number;
  phonetic?: string;
}

export default function ChinesePrompt({ chinese, letterCount, feedback, correctWord, trigger, phonetic }: ChinesePromptProps) {
  const [animClass, setAnimClass] = useState('');

  useEffect(() => {
    setAnimClass('animate-scale-in');
    const t = setTimeout(() => setAnimClass(''), 300);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div className="flex flex-col items-center py-1.5 px-3 bg-bg/80 backdrop-blur-sm">
      <div className={`
        text-2xl font-bold transition-colors duration-200
        ${feedback === 'correct' ? 'text-green-400' : ''}
        ${feedback === 'wrong' ? 'text-red-400' : ''}
        ${feedback === 'boss_defeated' ? 'text-accent' : ''}
        ${!feedback ? 'text-white' : ''}
        ${animClass}
      `}>
        {chinese}
        <span className="text-xs text-gray-500 font-normal ml-2">({letterCount}字母)</span>
      </div>

      {phonetic && (
        <div className="text-xs text-gray-400 font-mono mt-0.5">
          {phonetic}
        </div>
      )}

      {feedback === 'wrong' && correctWord && (
        <div className="text-xs text-green-400 font-bold animate-fade-in">
          正确答案: {correctWord}
        </div>
      )}
    </div>
  );
}
