import { useGameStore } from '../../store/useGameStore';
import EnergyBadge from '../ui/EnergyBadge';

interface TopBarProps {
  onShare: () => void;
}

export default function TopBar({ onShare }: TopBarProps) {
  const energyStones = useGameStore(s => s.energyStones);

  return (
    <header className="pt-safe bg-surface border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold text-white">🗼 单词爬塔</h1>
      <div className="flex items-center gap-3">
        <EnergyBadge amount={energyStones} />
        <button
          onClick={onShare}
          className="text-gray-400 hover:text-white active:text-primary transition-colors"
        >
          📤
        </button>
      </div>
    </header>
  );
}
