import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import Button from '../ui/Button';

const AVATAR_EMOJIS = ['🧙', '🧙‍♀️', '🧝', '🧝‍♀️', '🦸', '🦸‍♀️', '👩‍🎤', '🧑‍🎤', '🦹', '🦹‍♀️', '👾', '🐱', '🐲', '🦊', '🐼', '🐧', '🌟', '🔥', '💎', '⚡'];

interface ProfileSetupProps {
  onComplete: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🧙');
  const setProfile = useGameStore(s => s.setPlayerProfile);

  const handleConfirm = () => {
    const finalName = name.trim() || '单词法师';
    setProfile(finalName, emoji);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col items-center justify-center p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full">
        <div className="text-6xl mb-4 animate-bounce-in">{emoji}</div>
        <h2 className="text-xl font-bold text-white mb-2">设定你的身份</h2>
        <p className="text-gray-400 text-xs mb-6">设置昵称和头像，你的冒险数据绑定在这个身份上</p>

        {/* Nickname input */}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="输入你的昵称..."
          maxLength={8}
          className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-lg placeholder-gray-600 focus:border-accent focus:outline-none mb-6"
        />

        {/* Emoji picker */}
        <div className="grid grid-cols-10 gap-2 mb-8">
          {AVATAR_EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`w-9 h-9 text-xl flex items-center justify-center rounded-lg transition-all ${
                e === emoji ? 'bg-accent/20 scale-125 ring-2 ring-accent' : 'bg-surface hover:bg-gray-700'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-xs mb-8">
        <Button variant="primary" size="lg" onClick={handleConfirm} className="w-full">
          开始冒险！
        </Button>
      </div>
    </div>
  );
}
