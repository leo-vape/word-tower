import { forwardRef } from 'react';
import type { ShareCardData } from '../../types/share';

interface ShareCardProps {
  data: ShareCardData;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard({ data }, ref) {
  return (
    <div
      ref={ref}
      className="w-[375px] bg-bg p-6 flex flex-col items-center"
      style={{ minHeight: 500 }}
    >
      {/* Title */}
      <div className="text-lg font-bold text-white mb-4">🗼 单词爬塔</div>

      {/* Main stat */}
      <div className="text-center mb-4">
        <div className="text-6xl font-bold text-accent">{data.towerHeight}</div>
        <div className="text-sm text-gray-400 mt-1">最高层数</div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 w-full mb-4">
        <div className="bg-surface rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-energy">{data.totalWordsCompleted}</div>
          <div className="text-xs text-gray-500">总拼词数</div>
        </div>
        <div className="bg-surface rounded-xl p-3 text-center">
          <div className="text-lg font-bold" style={{ color: '#c471ed' }}>
            {data.totalCreaturesCollected}
          </div>
          <div className="text-xs text-gray-500">收集精灵</div>
        </div>
      </div>

      {/* Rarest creature */}
      {data.rarestCreature && (
        <div className="bg-surface rounded-xl p-3 w-full flex items-center gap-3 mb-4">
          <span className="text-3xl">{data.rarestCreature.emoji}</span>
          <div>
            <div className="text-sm font-bold text-white">{data.rarestCreature.name}</div>
            <div className="text-xs text-gray-400">
              {data.rarestCreature.rarity === 'legendary' && '传说精灵'}
              {data.rarestCreature.rarity === 'epic' && '史诗精灵'}
              {data.rarestCreature.rarity === 'rare' && '稀有精灵'}
              {data.rarestCreature.rarity === 'common' && '普通精灵'}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-gray-600 mt-auto">
        来一起爬塔拼词吧！
      </div>
    </div>
  );
});

export default ShareCard;
