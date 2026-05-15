import { useEffect, useState } from 'react';

interface ScorePopupProps {
  id: string;
  x: number;       // percentage 0-100
  y: number;       // percentage 0-100
  score: number;
  combo: number;
}

export default function ScorePopup({ x, y, score, combo }: ScorePopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="absolute z-30 pointer-events-none animate-float-up"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <div className="text-lg font-extrabold text-energy drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]">
        +{score}
      </div>
      {combo > 2 && (
        <div className="text-xs font-bold text-accent text-center -mt-1">
          x{combo}连击!
        </div>
      )}
    </div>
  );
}
