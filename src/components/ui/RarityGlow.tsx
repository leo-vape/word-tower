import type { ReactNode } from 'react';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

const rarityStyles: Record<Rarity, string> = {
  common: 'border-gray-500 shadow-[0_0_8px_rgba(160,160,160,0.3)]',
  rare: 'border-blue-400 shadow-[0_0_12px_rgba(77,166,255,0.5)]',
  epic: 'border-purple-400 shadow-[0_0_16px_rgba(196,113,237,0.6)]',
  legendary: 'border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.7)] animate-glow-pulse',
};

export default function RarityGlow({ rarity, children }: { rarity: Rarity; children: ReactNode }) {
  return (
    <div className={`border-2 rounded-xl ${rarityStyles[rarity]}`}>
      {children}
    </div>
  );
}
