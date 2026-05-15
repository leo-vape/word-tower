import type { FallingWordView } from '../../types/tower';
import FallingWordCard from './FallingWordCard';
import ChinesePrompt from './ChinesePrompt';

interface WordFieldProps {
  words: FallingWordView[];
  feedback: 'correct' | 'wrong' | 'boss_defeated' | null;
  correctWordId: string | null;
  onWordTap: (id: string) => void;
  fieldRef: React.Ref<HTMLDivElement>;
  chinese: string;
  letterCount: number;
  roundTrigger: number;
  phonetic: string;
}

export default function WordField({
  words, feedback, correctWordId, onWordTap, fieldRef,
  chinese, letterCount, roundTrigger, phonetic,
}: WordFieldProps) {
  const correctWord = feedback === 'wrong'
    ? words.find(w => w.isCorrect)?.word
    : undefined;

  return (
    <div
      ref={fieldRef}
      className="absolute inset-0 overflow-hidden rounded-xl mx-1"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Chinese prompt — overlay at top, compact */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <ChinesePrompt
          chinese={chinese}
          letterCount={letterCount}
          feedback={feedback}
          correctWord={correctWord}
          trigger={roundTrigger}
          phonetic={phonetic}
        />
      </div>

      {/* Column guides */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div className="flex-1 border-r border-gray-700/20" />
        <div className="flex-1 border-r border-gray-700/20" />
        <div className="flex-1" />
      </div>

      {/* Empty hint */}
      {words.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm pointer-events-none">
          准备中...
        </div>
      )}

      {/* Falling words */}
      {words.map(word => (
        <FallingWordCard
          key={word.id}
          word={word}
          feedback={feedback}
          isCorrectWord={word.id === correctWordId || word.isCorrect}
          onTap={() => onWordTap(word.id)}
        />
      ))}
    </div>
  );
}
