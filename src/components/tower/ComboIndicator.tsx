import { useEffect, useState } from 'react';

interface ComboIndicatorProps {
  combo: number;
  trigger: number;
}

export default function ComboIndicator({ combo, trigger }: ComboIndicatorProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger > 0 && combo > 1) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 1200);
      return () => clearTimeout(t);
    }
  }, [trigger, combo]);

  if (!show) return null;

  const fireColor = combo >= 10 ? 'text-yellow-300 drop-shadow-[0_0_16px_rgba(253,224,71,0.8)]'
    : combo >= 7 ? 'text-accent drop-shadow-[0_0_12px_rgba(245,197,24,0.6)]'
    : combo >= 5 ? 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]'
    : 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]';

  return (
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
      <div className="animate-float-up text-center">
        <span className={`text-2xl font-extrabold ${fireColor}`}>
          🔥 x{combo} 连击!
        </span>
      </div>
    </div>
  );
}
