import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface Props {
  label: string;
  unit: string;
  icon: string;
  value: number;
  optimizedValue: number;
  optimized: boolean;
}

export default function KpiCard({ label, unit, icon, value, optimizedValue, optimized }: Props) {
  const target = optimized ? optimizedValue : value;
  const animated = useAnimatedCounter(target, 1800, true);
  const isDecimal = target % 1 !== 0 || target < 20;
  const display = isDecimal ? animated.toFixed(1) : Math.round(animated).toString();

  const savings = value > 0 ? Math.round(((value - optimizedValue) / value) * 100) : 0;

  return (
    <div className="bg-grey-25 rounded-lg p-3 border border-grey-200">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-medium text-grey-500">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xl font-bold text-grey-900">{display}</span>
          <span className="text-xs text-grey-400 ml-1">{unit}</span>
        </div>
        {optimized && savings > 0 && (
          <span className="text-xs font-semibold text-evreka-500 bg-evreka-25 px-1.5 py-0.5 rounded">
            -{savings}%
          </span>
        )}
      </div>
    </div>
  );
}
