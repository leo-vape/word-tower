import { useGameStore } from '../../store/useGameStore';
import { getCreature } from '../../data/creatures';
import { APP_VERSION } from '../../utils/constants';
import Button from '../ui/Button';
import PixelSprite from '../ui/PixelSprite';
import EnergyBadge from '../ui/EnergyBadge';

interface TowerStartScreenProps {
  onStart: () => void;
  onShowHelp?: () => void;
}

export default function TowerStartScreen({ onStart, onShowHelp }: TowerStartScreenProps) {
  const bestHeight = useGameStore(s => s.bestHeight);
  const totalWords = useGameStore(s => s.totalWordsCompleted);
  const energyStones = useGameStore(s => s.energyStones);
  const activeCreatureIds = useGameStore(s => s.activeCreatureIds);
  const collection = useGameStore(s => s.collection);
  const playerName = useGameStore(s => s.playerName);
  const playerEmoji = useGameStore(s => s.playerEmoji);

  const activeCreatures = activeCreatureIds
    .map(id => getCreature(id))
    .filter(c => c != null);

  return (
    <div className="flex flex-col items-center min-h-[80vh] p-6">
      {/* Title */}
      <div className="text-6xl mb-3">🗼</div>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-2xl font-bold text-white">单词爬塔</h2>
        {onShowHelp && (
          <button
            onClick={onShowHelp}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-surface border border-gray-700 text-gray-400 text-sm hover:text-white hover:border-gray-500 transition-colors"
            title="玩法说明"
          >
            ?
          </button>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-4">看中文，选英文，爬塔收集精灵！</p>

      {/* Player identity */}
      {playerName && (
        <div className="flex items-center gap-2 mb-5 bg-surface rounded-full px-4 py-1.5 border border-gray-700">
          <span className="text-lg">{playerEmoji}</span>
          <span className="text-white text-sm font-medium">{playerName}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-5">
        <div className="bg-surface rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-accent">{bestHeight}</div>
          <div className="text-xs text-gray-500">最佳层数</div>
        </div>
        <div className="bg-surface rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-energy">{totalWords}</div>
          <div className="text-xs text-gray-500">总拼词数</div>
        </div>
      </div>

      {/* Active creatures */}
      <div className="w-full max-w-xs mb-5">
        <div className="text-xs text-gray-500 mb-2 text-center">出战精灵</div>
        <div className="flex justify-center gap-3">
          {activeCreatures.length === 0 ? (
            <span className="text-xs text-gray-600">无出战精灵（去图鉴选择）</span>
          ) : (
            activeCreatures.map(c => (
              <div key={c!.id} className="flex flex-col items-center">
                <PixelSprite emoji={c!.emoji} size={44} />
                <span className="text-xs text-gray-400 mt-1">{c!.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Energy */}
      <div className="mb-6">
        <EnergyBadge amount={energyStones} />
      </div>

      {/* Start button */}
      <Button variant="primary" size="lg" onClick={onStart}>
        开始爬塔
      </Button>

      <div className="mt-auto pt-8 text-xs text-gray-700">v{APP_VERSION}</div>
    </div>
  );
}
