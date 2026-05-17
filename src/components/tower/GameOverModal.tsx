import { useMemo, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useGameStore } from '../../store/useGameStore';
import { showToast } from '../ui/Toast';
import { wordBank } from '../../data/wordBank';

interface GameOverModalProps {
  height: number;
  energy: number;
  maxCombo: number;
  wordsCompleted: number;
  elapsedMs: number;
  lastChinese: string;
  lastWord: string;
  onPlayAgain: () => void;
}

export default function GameOverModal({
  height,
  energy,
  maxCombo,
  wordsCompleted,
  elapsedMs,
  lastChinese,
  lastWord,
  onPlayAgain,
}: GameOverModalProps) {
  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const wordStats = useGameStore(s => s.wordStats);
  const playerName = useGameStore(s => s.playerName);
  const playerEmoji = useGameStore(s => s.playerEmoji);
  const bestHeight = useGameStore(s => s.bestHeight);

  const isNewBest = height > 0 && height >= bestHeight;

  // Build share URL with score encoded in query params
  const shareUrl = useMemo(() => {
    const base = 'https://word-tower.pages.dev';
    const name = playerName || '单词法师';
    const emoji = playerEmoji || '🧙';
    const params = new URLSearchParams();
    params.set('h', String(height));
    params.set('e', String(energy));
    params.set('c', String(maxCombo));
    params.set('w', String(wordsCompleted));
    params.set('n', name);
    params.set('em', emoji);
    return `${base}?${params.toString()}`;
  }, [height, energy, maxCombo, wordsCompleted, playerName, playerEmoji]);

  // Update browser URL so WeChat "..." menu shares the link with score
  useEffect(() => {
    history.replaceState(null, '', shareUrl);
  }, [shareUrl]);

  const weakWords = useMemo(() => {
    return Object.entries(wordStats)
      .filter(([, s]) => s.mastery < 4)
      .sort((a, b) => b[1].wrong - a[1].wrong || a[1].mastery - b[1].mastery)
      .slice(0, 5)
      .map(([word, s]) => {
        const entry = wordBank.find(w => w.en === word);
        return { word, zh: entry?.zh ?? '', wrong: s.wrong, mastery: s.mastery };
      });
  }, [wordStats]);

  const shareText = `${playerEmoji} ${playerName || '单词法师'} 向你发起挑战！
🗼 爬到了 ${height} 层
⚡ 能量石 +${energy}
🔥 最大连击 x${maxCombo}
⏱ ${minutes}:${String(secs).padStart(2, '0')}

来试试你能不能超过我吧！
${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('🔗 链接已复制，去微信粘贴给好友吧！');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('🔗 链接已复制，去微信粘贴给好友吧！');
    }
  };

  const handleCopyCard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      showToast('📋 挑战书已复制，去粘贴吧！');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('📋 挑战书已复制，去粘贴吧！');
    }
  };

  return (
    <Modal open onClose={onPlayAgain} title="爬塔结束！">
      <div className="space-y-4">
        {/* Player identity */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{playerEmoji || '🧙'}</span>
          <span className="text-white font-bold">{playerName || '单词法师'}</span>
        </div>

        {/* Last word */}
        {lastChinese && (
          <div className="text-center py-2 bg-bg rounded-xl">
            <div className="text-xs text-gray-500">最后一词</div>
            <div className="text-xl font-bold text-white">{lastChinese}</div>
            <div className="text-sm text-gray-400">{lastWord}</div>
          </div>
        )}

        {/* WeChat share guide */}
        <div className="bg-energy/10 border border-energy/30 rounded-xl p-4 text-center">
          <div className="text-lg mb-2">📤 分享战绩给好友</div>
          <div className="text-sm text-gray-300 leading-relaxed">
            点击右上角 <span className="text-white font-bold text-lg">···</span> → <span className="text-white font-bold">发送给朋友</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">好友会看到你的战绩，点开就能挑战你！</div>
        </div>

        {/* Stats card */}
        <div className="bg-gradient-to-b from-[#1a1040] to-[#0f0f23] rounded-2xl p-5 text-center relative overflow-hidden border border-purple-800/40">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent/30 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent/30 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-accent/30 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent/30 rounded-br-2xl" />

          {isNewBest && (
            <div className="text-xs text-yellow-400 mb-2 animate-pulse">🏆 新纪录！</div>
          )}
          <div className="text-5xl font-bold text-accent drop-shadow-[0_0_12px_rgba(255,107,107,0.4)]">{height}</div>
          <div className="text-sm text-gray-400 mt-1">层</div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-bg/60 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-energy">{energy}</div>
              <div className="text-xs text-gray-500">能量石</div>
            </div>
            <div className="bg-bg/60 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-primary">{wordsCompleted}</div>
              <div className="text-xs text-gray-500">拼对词数</div>
            </div>
            <div className="bg-bg/60 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-yellow-400">x{maxCombo}</div>
              <div className="text-xs text-gray-500">最大连击</div>
            </div>
            <div className="bg-bg/60 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-gray-300">{minutes}:{String(secs).padStart(2, '0')}</div>
              <div className="text-xs text-gray-500">持续时间</div>
            </div>
          </div>
        </div>

        {/* Weak words */}
        {weakWords.length > 0 && (
          <div className="bg-bg rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-2">📝 需要加强的单词</div>
            <div className="space-y-1">
              {weakWords.map(w => (
                <div key={w.word} className="flex items-center justify-between text-xs">
                  <span>
                    <span className="text-white font-bold">{w.word}</span>
                    <span className="text-gray-500 ml-1">{w.zh}</span>
                  </span>
                  <span className="text-gray-600">
                    错{w.wrong}次
                    <span className={`ml-1 ${w.mastery <= 1 ? 'text-red-400' : w.mastery <= 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {'⬤'.repeat(Math.max(1, w.mastery))}{'〇'.repeat(5 - Math.max(1, w.mastery))}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" size="lg" onClick={handleCopyLink} className="flex-1">
            🔗 复制链接
          </Button>
          <Button variant="secondary" size="lg" onClick={handleCopyCard} className="flex-1">
            📋 复制挑战书
          </Button>
          <Button variant="primary" size="lg" onClick={onPlayAgain} className="flex-1">
            再来一局
          </Button>
        </div>
      </div>
    </Modal>
  );
}
