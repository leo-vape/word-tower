import { useEffect, useState } from 'react';

interface ComboIndicatorProps {
  combo: number;
  trigger: number;
}

export default function ComboIndicator({ combo, trigger }: ComboIndicatorProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger > 0 && combo >= 5) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(t);
    }
  }, [trigger, combo]);

  if (!show) return null;

  const color = combo >= 10 ? 'text-yellow-300'
    : combo >= 7 ? 'text-accent'
    : 'text-orange-400';

  return (
    <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-float-up text-center">
      <span className={`text-xl font-extrabold ${color}`}>
        x{combo} 连击
      </span>
    </div>
  );
}
