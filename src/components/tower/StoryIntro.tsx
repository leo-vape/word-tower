import { useState } from 'react';
import Button from '../ui/Button';

interface StoryIntroProps {
  onComplete: () => void;
}

const SCENES = [
  {
    emoji: '🗼',
    title: '巴别塔的危机',
    text: '古老的巴别塔被黑暗吞噬，单词之力失去了意义。语言陷入混乱，世界等待一位勇者……',
  },
  {
    emoji: '🧙',
    title: '单词法师',
    text: '你，一位年轻的单词法师，肩负着恢复语言之力的使命。带领你的精灵伙伴，攀登高塔！',
  },
  {
    emoji: '⚔️',
    title: '战斗方式',
    text: '每个单词怪物只有找到正确的中文意思才能被击败。擦亮眼睛，和精灵一起战斗吧！',
  },
];

export default function StoryIntro({ onComplete }: StoryIntroProps) {
  const [scene, setScene] = useState(0);

  const next = () => {
    if (scene < SCENES.length - 1) {
      setScene(s => s + 1);
    } else {
      onComplete();
    }
  };

  const s = SCENES[scene];

  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col items-center justify-center p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm">
        {/* Scene emoji */}
        <div className="text-8xl mb-8 animate-bounce-in">
          {s.emoji}
        </div>

        {/* Scene title */}
        <h2 className="text-2xl font-bold text-white mb-4 animate-fade-in">
          {s.title}
        </h2>

        {/* Scene text */}
        <p className="text-gray-400 text-center text-sm leading-relaxed animate-fade-in">
          {s.text}
        </p>

        {/* Scene dots */}
        <div className="flex gap-2 mt-8">
          {SCENES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === scene ? 'bg-accent w-4' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom: skip + next */}
      <div className="w-full max-w-xs flex gap-3 mb-8">
        <Button variant="ghost" size="sm" onClick={onComplete}>
          跳过
        </Button>
        <div className="flex-1">
          <Button variant="primary" size="sm" onClick={next}>
            {scene < SCENES.length - 1 ? '继续' : '开始冒险！'}
          </Button>
        </div>
      </div>
    </div>
  );
}
