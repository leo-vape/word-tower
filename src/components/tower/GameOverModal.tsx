import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useGameStore } from '../../store/useGameStore';

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
  const weakWords = useGameStore(s => s.getWeakWords(5));

  return (
    <Modal open onClose={onPlayAgain} title="爬塔结束！">
      <div className="space-y-4">
        {/* Last word */}
        {lastChinese && (
          <div className="text-center py-2 bg-bg rounded-xl">
            <div className="text-xs text-gray-500">最后一词</div>
            <div className="text-xl font-bold text-white">{lastChinese}</div>
            <div className="text-sm text-gray-400">{lastWord}</div>
          </div>
        )}

        {/* Tower height - main stat */}
        <div className="text-center py-4">
          <div className="text-5xl font-bold text-accent">{height}</div>
          <div className="text-sm text-gray-400 mt-1">层</div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-energy">{energy}</div>
            <div className="text-xs text-gray-500">能量石</div>
          </div>
          <div className="bg-bg rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-primary">{wordsCompleted}</div>
            <div className="text-xs text-gray-500">拼对词数</div>
          </div>
          <div className="bg-bg rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-yellow-400">x{maxCombo}</div>
            <div className="text-xs text-gray-500">最大连击</div>
          </div>
          <div className="bg-bg rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-gray-300">{minutes}:{secs.toString().padStart(2, '0')}</div>
            <div className="text-xs text-gray-500">持续时间</div>
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
                      {'⬤'.repeat(Math.max(1, w.mastery))}{'⬤'.repeat(5 - Math.max(1, w.mastery)).replace(/⬤/g, '〇')}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button variant="primary" size="lg" onClick={onPlayAgain} className="w-full">
          再来一局
        </Button>
      </div>
    </Modal>
  );
}
