import { memo } from 'react';
import type { FallingWordView } from '../../types/tower';
import type { Creature } from '../../types/creature';
import FallingWordCard from './FallingWordCard';
import ChinesePrompt from './ChinesePrompt';
import BattleLine from './BattleLine';
import CreatureDialogue from './CreatureDialogue';
import HitEffect from './HitEffect';

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
  creatures: Creature[];
  battleAnim: 'idle' | 'attacking' | 'hit' | 'celebrating' | 'boss_alert';
  combo: number;
  dialogueTrigger: number;
  dialogueContext: 'normal' | 'combo' | 'wrong' | 'boss';
  hitEffectTrigger: number;
  lastTappedPos?: { x: number; y: number };
}

export default memo(function WordField({
  words, feedback, correctWordId, onWordTap, fieldRef,
  chinese, letterCount, roundTrigger, phonetic,
  creatures, battleAnim, combo,
  dialogueTrigger, dialogueContext,
  hitEffectTrigger, lastTappedPos,
}: WordFieldProps) {
  const correctWord = feedback === 'wrong'
    ? words.find(w => w.isCorrect)?.word
    : undefined;

  const feedbackType = feedback === 'boss_defeated' ? 'correct' : feedback || undefined;

  return (
    <div
      ref={fieldRef}
      className="absolute inset-0 overflow-hidden"
      style={{ touchAction: 'manipulation' }}
    >
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

      {words.map(word => (
        <FallingWordCard
          key={word.id}
          word={word}
          feedback={feedback}
          isCorrectWord={word.id === correctWordId || word.isCorrect}
          onWordTap={onWordTap}
        />
      ))}

      {feedback && lastTappedPos && (
        <HitEffect
          x={lastTappedPos.x}
          y={lastTappedPos.y}
          type={feedbackType === 'correct' ? 'correct' : 'wrong'}
          trigger={hitEffectTrigger}
        />
      )}

      <CreatureDialogue
        creatures={creatures}
        trigger={dialogueTrigger}
        context={dialogueContext}
      />

      <BattleLine
        creatures={creatures}
        animState={battleAnim}
        combo={combo}
      />
    </div>
  );
});
