interface PixelSpriteProps {
  emoji: string;
  size?: number;
  className?: string;
}

export default function PixelSprite({ emoji, size = 48, className = '' }: PixelSpriteProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ fontSize: size * 0.75, width: size, height: size }}
    >
      {emoji}
    </div>
  );
}
