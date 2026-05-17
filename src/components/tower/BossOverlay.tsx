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
        <div className="text-center animate-scale-in">
          <div className="text-5xl mb-2 drop-shadow-[0_0_20px_rgba(239,68,68,0.7)]">
            👹
          </div>
          <div className="text-3xl font-extrabold text-red-500 mb-1">
            BOSS
          </div>
          <div className="text-lg text-white font-bold">
            {chinese}
          </div>
        </div>
      )}

      {defeated && (
        <div className="text-center animate-bounce-in">
          <div className="text-6xl mb-2 drop-shadow-[0_0_20px_rgba(245,197,24,0.7)]">
            💥
          </div>
          <div className="text-2xl font-extrabold text-accent">
            BOSS 击败！
          </div>
        </div>
      )}
    </div>
  );
}
