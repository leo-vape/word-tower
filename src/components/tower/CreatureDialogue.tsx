import { useEffect, useState } from 'react';
import type { Creature } from '../../types/creature';

interface CreatureDialogueProps {
  creatures: Creature[];
  trigger: number;
  context: 'normal' | 'combo' | 'wrong' | 'boss';
}

const DIALOGUES: Record<string, string[]> = {
  normal: [
    '交给我吧！', '这层小菜一碟～', '冲冲冲！', '看我的！',
    '轻松搞定！', '下一层！', '我可是很强的！',
  ],
  combo: [
    '太强了！', '势不可挡！', '继续继续！', '无敌了！',
    '这就是我们的羁绊！', '燃烧吧！',
  ],
  wrong: [
    '别慌！', '注意看中文！', '再来！', '集中注意力！',
    '差一点！', '认真看！',
  ],
  boss: [
    '危险！BOSS来了！', '全力以赴！', '不能退缩！',
    '终极一战！', '一起上！',
  ],
};

export default function CreatureDialogue({ creatures, trigger, context }: CreatureDialogueProps) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [speakerIdx, setSpeakerIdx] = useState(0);

  useEffect(() => {
    if (trigger === 0 || creatures.length === 0) return;

    const pool = DIALOGUES[context] ?? DIALOGUES.normal;
    const line = pool[Math.floor(Math.random() * pool.length)];
    const spk = Math.floor(Math.random() * creatures.length);

    setText(line);
    setSpeakerIdx(spk);
    setVisible(true);

    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, [trigger, creatures.length, context]);

  if (!visible || creatures.length === 0) return null;

  const speaker = creatures[speakerIdx];

  return (
    <div className="absolute top-[30%] left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-scale-in">
      <div className="flex flex-col items-center">
        <div className="text-2xl mb-1">{speaker?.emoji}</div>
        <div className="bg-surface/95 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-600 shadow-lg">
          {text}
        </div>
      </div>
    </div>
  );
}
