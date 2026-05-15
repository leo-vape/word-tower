interface EnergyBadgeProps {
  amount: number;
  size?: 'sm' | 'md';
}

export default function EnergyBadge({ amount, size = 'md' }: EnergyBadgeProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <span className={`inline-flex items-center gap-1 ${textSize} text-energy font-semibold`}>
      <span>💎</span>
      <span>{amount}</span>
    </span>
  );
}
