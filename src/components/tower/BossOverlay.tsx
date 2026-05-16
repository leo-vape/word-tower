interface BossOverlayProps {
  active: boolean;
  defeated: boolean;
  chinese: string;
}

export default function BossOverlay({ active, defeated, chinese }: BossOverlayProps) {
  if (!active && !defeated) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
      {active && (
        <>
          {/* Pulsing danger border */}
          <div className="absolute inset-0 rounded-xl"
            style={{ boxShadow: 'inset 0 0 80px rgba(233,69,96,0.5), 0 0 50px rgba(233,69,96,0.4), 0 0 100px rgba(147,51,234,0.3)' }}
          />

          {/* Boss card */}
          <div className="text-center animate-scale-in">
            <div className="text-6xl mb-4 drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]">
              👹
            </div>
            <div className="text-4xl font-extrabold text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] mb-2">
              BOSS
            </div>
            <div className="text-xl text-white font-bold">
              {chinese}
            </div>
            <div className="text-sm text-red-400 mt-2 animate-pulse">
              ⚡ 快点击！击败它获得稀有精灵蛋！
            </div>
          </div>
        </>
      )}

      {defeated && (
        <div className="text-center animate-bounce-in">
          <div className="text-7xl mb-3 drop-shadow-[0_0_30px_rgba(245,197,24,0.9)]">
            💥
          </div>
          <div className="text-3xl font-extrabold text-accent drop-shadow-[0_0_20px_rgba(245,197,24,0.8)]">
            BOSS 击败！
          </div>
          <div className="text-sm text-accent/70 mt-2">
            🥚 获得稀有精灵蛋！
          </div>
        </div>
      )}
    </div>
  );
}
