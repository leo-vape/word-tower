import { useMemo, useCallback } from 'react';
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

  const shareText = `${playerEmoji} ${playerName || '单词法师'}\n🗼 爬塔 ${height} 层 | 最佳 ${bestHeight} 层\n⚡ 能量石 +${energy}\n📝 拼对 ${wordsCompleted} 词\n🔥 最大连击 x${maxCombo}\n⏱ ${minutes}:${secs.toString().padStart(2, '0')}\n\n🧙 单词爬塔 — 和朋友一起挑战吧！`;

  // Generate a share image using Canvas (works offline, no library needed)
  const generateShareImage = useCallback(async (): Promise<File> => {
    const W = 600;
    const H = 800;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#1a1040');
    bg.addColorStop(1, '#0f0f23');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = 'rgba(245,197,24,0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // Corner accents
    const c = (x: number, y: number, sx: number, sy: number) => {
      ctx.strokeStyle = 'rgba(245,197,24,0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + sx * 30, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + sy * 30);
      ctx.stroke();
    };
    c(20, 20, 1, 1);
    c(W - 20, 20, -1, 1);
    c(20, H - 20, 1, -1);
    c(W - 20, H - 20, -1, -1);

    // Title
    ctx.fillStyle = '#ccc';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧙 单词爬塔 · 战绩', W / 2, 70);

    // Player name
    ctx.font = '22px sans-serif';
    ctx.fillText(`${playerEmoji || '🧙'} ${playerName || '单词法师'}`, W / 2, 110);

    // Layer (main stat)
    ctx.fillStyle = '#f5c518';
    ctx.font = 'bold 80px sans-serif';
    ctx.fillText(`${height}`, W / 2, 210);
    ctx.fillStyle = '#888';
    ctx.font = '22px sans-serif';
    ctx.fillText('层', W / 2, 245);

    if (isNewBest) {
      ctx.fillStyle = '#f5c518';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🏆 新纪录！', W / 2, 275);
    }

    // Stat boxes
    const boxW = 240;
    const boxH = 110;
    const drawBox = (x: number, y: number) => {
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.beginPath();
      ctx.roundRect(x, y, boxW, boxH, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };
    const drawStat = (x: number, y: number, value: string, label: string, color: string) => {
      ctx.fillStyle = color;
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(value, x + boxW / 2, y + 40);
      ctx.fillStyle = '#999';
      ctx.font = '17px sans-serif';
      ctx.fillText(label, x + boxW / 2, y + 72);
    };

    const gx1 = 50;
    const gx2 = 310;
    const gy1 = 300;
    const gy2 = 430;

    drawBox(gx1, gy1); drawStat(gx1, gy1, `${energy}`, '能量石', '#f5c518');
    drawBox(gx2, gy1); drawStat(gx2, gy1, `${wordsCompleted}`, '拼对词数', '#e94560');
    drawBox(gx1, gy2); drawStat(gx1, gy2, `x${maxCombo}`, '最大连击', '#f5c518');
    drawBox(gx2, gy2); drawStat(gx2, gy2, `${minutes}:${secs.toString().padStart(2, '0')}`, '持续时间', '#ccc');

    // Weak words
    if (weakWords.length > 0) {
      const wy = 565;
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.beginPath();
      ctx.roundRect(50, wy, 500, 30 + weakWords.length * 30, 14);
      ctx.fill();

      ctx.fillStyle = '#999';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('📝 需要加强的单词', 70, wy + 25);

      weakWords.forEach((w, i) => {
        const ly = wy + 55 + i * 28;
        ctx.fillStyle = '#fff';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(w.word, 70, ly);
        ctx.fillStyle = '#888';
        ctx.fillText(w.zh, 190, ly);
        ctx.fillStyle = '#666';
        ctx.font = '15px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`错${w.wrong}次`, 530, ly);
      });
    }

    // Footer
    ctx.fillStyle = '#555';
    ctx.font = '15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('扫码或点击链接一起挑战！', W / 2, H - 45);
    ctx.fillText('word-tower.pages.dev', W / 2, H - 25);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob!], 'word-tower-share.png', { type: 'image/png' }));
      }, 'image/png');
    });
  }, [playerEmoji, playerName, height, energy, wordsCompleted, maxCombo, minutes, secs, isNewBest, weakWords]);

  const handleShare = useCallback(async () => {
    // Tier 1: Web Share API with image (best for WeChat Moments)
    if (navigator.share && navigator.canShare) {
      try {
        const file = await generateShareImage();
        const data = { title: '单词爬塔 · 战绩分享', text: shareText, files: [file] };
        if (navigator.canShare(data)) {
          await navigator.share(data);
          return;
        }
      } catch { /* fall through */ }
      // Text-only share
      try {
        await navigator.share({ title: '单词爬塔 · 战绩分享', text: shareText });
        return;
      } catch { /* fall through */ }
    }

    // Tier 2: Clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      showToast('📋 战绩已复制，去朋友圈粘贴吧！');
      return;
    } catch { /* fall through */ }

    // Tier 3: Legacy copy
    try {
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) { showToast('📋 战绩已复制，去朋友圈粘贴吧！'); return; }
    } catch { /* fall through */ }

    // Tier 4: Download image as last resort
    try {
      const file = await generateShareImage();
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = '单词爬塔战绩.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('📷 图片已保存，发朋友圈吧！');
    } catch {
      showToast('请截图保存战绩，分享到朋友圈');
    }
  }, [shareText, generateShareImage]);

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

        {/* Share card */}
        <div id="share-card" className="bg-gradient-to-b from-[#1a1040] to-[#0f0f23] rounded-2xl p-5 border border-purple-800/40 text-center relative overflow-hidden">
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
              <div className="text-lg font-bold text-gray-300">{minutes}:{secs.toString().padStart(2, '0')}</div>
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
          <Button variant="secondary" size="lg" onClick={handleShare} className="flex-1">
            📤 分享战绩
          </Button>
          <Button variant="primary" size="lg" onClick={onPlayAgain} className="flex-1">
            再来一局
          </Button>
        </div>
      </div>
    </Modal>
  );
}
