import { useEffect, useState } from 'react';

interface TowerDisplayProps {
  height: number;
}

const FLOOR_COLORS = [
  '#e94560', '#f5c518', '#00e5ff', '#c471ed',
  '#4da6ff', '#ff6b6b', '#54d2c8', '#ffa94d',
];

export default function TowerDisplay({ height }: TowerDisplayProps) {
  const [newFloorIdx, setNewFloorIdx] = useState(-1);
  const [prevHeight, setPrevHeight] = useState(0);

  useEffect(() => {
    if (height > prevHeight) {
      setNewFloorIdx(height - 1);
      const t = setTimeout(() => setNewFloorIdx(-1), 500);
      setPrevHeight(height);
      return () => clearTimeout(t);
    }
  }, [height, prevHeight]);

  const maxVisible = Math.min(height, 20);

  let bgGradient: string;
  let atmosphere: string;
  if (height >= 50) {
    bgGradient = 'from-[#0a0a2e] via-[#1a1040] to-[#0a0a2e]';
    atmosphere = '✨ ⭐ 🌙';
  } else if (height >= 30) {
    bgGradient = 'from-[#1a2a4e] via-[#2a3a5e] to-[#1a2a4e]';
    atmosphere = '☁️ 🌤️ ☁️';
  } else if (height >= 15) {
    bgGradient = 'from-[#1a1a2e] via-[#2a2a3e] to-[#1a1a2e]';
    atmosphere = '🌙 🌲 🌲';
  } else {
    bgGradient = 'from-[#1a1a2e] via-[#16213e] to-[#1a1a2e]';
    atmosphere = '🪨 🔥 🪨';
  }

  return (
    <>
      {/* Tower container — left side, compact */}
      <div className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-b ${bgGradient} pointer-events-none flex flex-col justify-end items-center pb-2 transition-all duration-1000`}>
        {/* Milestone flags */}
        {Array.from({ length: maxVisible }).map((_, i) => {
          const floorNum = height - i;
          if (floorNum > 0 && floorNum % 10 === 0) {
            return (
              <div
                key={`flag-${floorNum}`}
                className="absolute left-[85%] animate-flag-wave"
                style={{ bottom: `${(i / maxVisible) * 85 + 8}%` }}
              >
                <span className="text-base">🚩</span>
                <span className="text-[8px] text-accent font-bold block -mt-1 text-center">{floorNum}</span>
              </div>
            );
          }
          return null;
        })}

        {/* Tower floors — built from bottom */}
        <div className="flex flex-col-reverse items-center w-full">
          {Array.from({ length: maxVisible }).map((_, i) => {
            const floorNum = height - i;
            const isNew = floorNum === newFloorIdx;
            const isMilestone = floorNum % 10 === 0;
            const color = FLOOR_COLORS[floorNum % FLOOR_COLORS.length];

            const floorWidth = isMilestone ? 52 : 34;
            const floorHeight = isMilestone ? 12 : 7;
            const marginBottom = isMilestone ? 2 : 1;

            return (
              <div
                key={floorNum}
                className="transition-all duration-300 rounded-sm"
                style={{
                  width: isNew ? floorWidth + 14 : floorWidth,
                  height: floorHeight,
                  backgroundColor: color,
                  marginBottom,
                  boxShadow: isMilestone
                    ? `0 0 8px ${color}, 0 0 16px ${color}80`
                    : `0 0 2px ${color}40`,
                  transform: isNew ? 'scale(1.3)' : 'scale(1)',
                  opacity: 0.85,
                }}
              >
                {!isMilestone && floorWidth >= 34 && (
                  <div className="flex justify-center gap-1.5 h-full items-center">
                    <div className="w-1 h-1 rounded-full bg-yellow-300/50" />
                    <div className="w-1 h-1 rounded-full bg-yellow-300/30" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Base */}
        <div
          className="w-14 h-2 rounded-t-sm"
          style={{ backgroundColor: '#555', boxShadow: '0 0 4px rgba(100,100,100,0.3)' }}
        />

        {/* Height counter */}
        <div className="mt-1 text-center">
          <span className="text-xs font-extrabold text-accent drop-shadow-[0_0_6px_rgba(245,197,24,0.6)]">
            {height}层
          </span>
        </div>
      </div>
    </>
  );
}
