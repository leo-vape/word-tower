import { useEffect, useState } from 'react';

interface ComboIndicatorProps {
  combo: number;
  trigger: number; // increment when a word event fires
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

  return (
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
      <div className="animate-float-up text-center">
        <span className="text-2xl font-bold text-primary">x{combo} 连击!</span>
      </div>
    </div>
  );
}
