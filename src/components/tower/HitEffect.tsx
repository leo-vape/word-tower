import { useEffect, useState } from 'react';

interface HitEffectProps {
  x: number;
  y: number;
  type: 'correct' | 'wrong';
  trigger: number; // increment to fire
}

const SPARK_COUNT = 8;
const SPARK_COLORS = ['#f5c518', '#e94560', '#00e5ff', '#c471ed', '#4da6ff', '#ff6b6b'];

export default function HitEffect({ x, y, type, trigger }: HitEffectProps) {
  const [sparks, setSparks] = useState<Array<{ id: number; sx: number; sy: number; color: string }>>([]);

  useEffect(() => {
    if (trigger === 0) return;

    if (type === 'correct') {
      const items = Array.from({ length: SPARK_COUNT }).map((_, i) => ({
        id: Date.now() + i,
        sx: (Math.random() - 0.5) * 80,
        sy: (Math.random() - 0.5) * 80,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      }));
      setSparks(items);
      const t = setTimeout(() => setSparks([]), 700);
      return () => clearTimeout(t);
    }
  }, [trigger, type]);

  if (type === 'wrong') {
    return (
      <div
        className="absolute z-30 pointer-events-none text-red-500 text-2xl font-bold animate-scale-in"
        style={{ left: `${x}%`, top: `${y}%` }}
      >
        ✕
      </div>
    );
  }

  if (sparks.length === 0) return null;

  return (
    <>
      {sparks.map(s => (
        <div
          key={s.id}
          className="absolute z-30 pointer-events-none w-1.5 h-1.5 rounded-full animate-spark-burst"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            backgroundColor: s.color,
            '--sx': `${s.sx}px`,
            '--sy': `${s.sy}px`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}
