import { useGameStore } from '../../store/useGameStore';
import EnergyBadge from '../ui/EnergyBadge';

export default function TopBar() {
  const energyStones = useGameStore(s => s.energyStones);

  return (
    <header className="pt-safe bg-surface border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold text-white">🗼 单词爬塔</h1>
      <div className="flex items-center gap-3">
        <EnergyBadge amount={energyStones} />
      </div>
    </header>
  );
}
