import { useMemo, useEffect, useCallback } from 'react';
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

  const shareUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set('h', String(height));
    params.set('e', String(energy));
    params.set('c', String(maxCombo));
    params.set('w', String(wordsCompleted));
    params.set('n', playerName || '单词法师');
    params.set('em', playerEmoji || '🧙');
    return `https://word-tower.pages.dev?${params.toString()}`;
  }, [height, energy, maxCombo, wordsCompleted, playerName, playerEmoji]);

  useEffect(() => {
    history.replaceState(null, '', shareUrl);
  }, [shareUrl]);

  const weakWords = useMemo(() => {
    return Object.entries(wordStats)
      .filter(([, s]) => s.mastery < 4)
      .sort((a, b) => b[1].wrong - a[1].wrong || a[1].mastery - b[1].mastery)
      .slice(0, 3)
      .map(([word, s]) => {
        const entry = wordBank.find(w => w.en === word);
        return { word, zh: entry?.zh ?? '', wrong: s.wrong, mastery: s.mastery };
      });
  }, [wordStats]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: `${playerEmoji} ${playerName} 的单词爬塔战绩`,
        text: `🗼 爬到了 ${height} 层！来挑战我吧！`,
        url: shareUrl,
      });
      return;
    } catch { /* fall through */ }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('🔗 链接已复制，点右上角 ··· 发送给朋友');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('🔗 链接已复制，点右上角 ··· 发送给朋友');
    }
  }, [shareUrl, playerEmoji, playerName, height]);

  return (
    <Modal open onClose={onPlayAgain} title="爬塔结束！">
      <div className="space-y-3">
        {/* Player + best badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{playerEmoji || '🧙'}</span>
            <span className="text-white font-bold text-sm">{playerName || '单词法师'}</span>
          </div>
          {isNewBest && (
            <span className="text-xs text-yellow-400 animate-pulse">🏆 新纪录！</span>
          )}
        </div>

        {/* Last word */}
        {lastChinese && (
          <div className="text-center py-1.5 bg-bg rounded-lg">
            <span className="text-xs text-gray-500 mr-1">最后一词</span>
            <span className="text-sm font-bold text-white">{lastChinese}</span>
            <span className="text-xs text-gray-400 ml-1">{lastWord}</span>
          </div>
        )}

        {/* Compact stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-bg rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-accent">{height}</div>
            <div className="text-[10px] text-gray-500">层</div>
          </div>
          <div className="bg-bg rounded-lg p-2 text-center">
            <div className="text-base font-bold text-energy">{energy}</div>
            <div className="text-[10px] text-gray-500">能量</div>
          </div>
          <div className="bg-bg rounded-lg p-2 text-center">
            <div className="text-base font-bold text-yellow-400">x{maxCombo}</div>
            <div className="text-[10px] text-gray-500">连击</div>
          </div>
          <div className="bg-bg rounded-lg p-2 text-center">
            <div className="text-base font-bold text-gray-300">{minutes}:{String(secs).padStart(2, '0')}</div>
            <div className="text-[10px] text-gray-500">用时</div>
          </div>
        </div>

        {/* Weak words — only if any, max 3 */}
        {weakWords.length > 0 && (
          <div className="bg-bg rounded-lg p-2">
            <div className="text-[10px] text-gray-500 mb-1">📝 需要加强</div>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5">
              {weakWords.map(w => (
                <span key={w.word} className="text-xs">
                  <span className="text-white font-medium">{w.word}</span>
                  <span className="text-gray-500 ml-1">{w.zh}</span>
                  <span className="text-gray-600 ml-1">错{w.wrong}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Buttons — always at bottom */}
        <div className="flex gap-2 pt-1">
          <Button variant="primary" size="lg" onClick={handleShare} className="flex-1">
            📤 分享给好友
          </Button>
          <Button variant="secondary" size="lg" onClick={onPlayAgain} className="flex-1">
            再来一局
          </Button>
        </div>
      </div>
    </Modal>
  );
}
