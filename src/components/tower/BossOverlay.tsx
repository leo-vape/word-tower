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
          {/* Pulsing red border */}
          <div className="absolute inset-0 rounded-xl animate-pulse"
            style={{ boxShadow: 'inset 0 0 60px rgba(233,69,96,0.5), 0 0 40px rgba(233,69,96,0.3)' }}
          />

          {/* BOSS text */}
          <div className="text-center animate-scale-in">
            <div className="text-6xl font-extrabold text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] mb-2">
              BOSS
            </div>
            <div className="text-2xl text-white font-bold">
              {chinese}
            </div>
            <div className="text-sm text-red-400 mt-1 animate-pulse">
              快点击！只有一个单词！
            </div>
          </div>
        </>
      )}

      {defeated && (
        <div className="text-center animate-bounce-in">
          <div className="text-6xl mb-2">💥</div>
          <div className="text-3xl font-extrabold text-accent drop-shadow-[0_0_20px_rgba(245,197,24,0.8)]">
            BOSS 击败！
          </div>
        </div>
      )}
    </div>
  );
}
