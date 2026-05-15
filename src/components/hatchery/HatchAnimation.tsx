import { useState, useEffect } from 'react';

interface HatchAnimationProps {
  onComplete: () => void;
}

export default function HatchAnimation({ onComplete }: HatchAnimationProps) {
  const [phase, setPhase] = useState<'shake' | 'crack' | 'glow'>('shake');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('crack'), 600);
    const t2 = setTimeout(() => setPhase('glow'), 1200);
    const t3 = setTimeout(() => onComplete(), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className={`text-6xl transition-all duration-300 ${
        phase === 'shake' ? 'animate-shake' :
        phase === 'crack' ? 'animate-crack' :
        'scale-150 opacity-0'
      }`}>
        {phase === 'glow' ? '✨' : '🥚'}
      </div>
    </div>
  );
}
