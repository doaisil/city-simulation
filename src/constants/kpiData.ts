import type { TranslationKey } from './i18n';

export interface KPI {
  labelKey: TranslationKey;
  unitKey: TranslationKey;
  icon: string;
  base: number;       // base value at default params (5 trucks, 18 containers, 3x/week)
  optimizedRatio: number; // multiplier after optimization (e.g. 0.62 = 38% reduction)
}

export const kpis: KPI[] = [
  { labelKey: 'totalDistance', unitKey: 'km', icon: '🛣️', base: 847, optimizedRatio: 0.62 },
  { labelKey: 'fuelConsumption', unitKey: 'l', icon: '⛽', base: 312, optimizedRatio: 0.62 },
  { labelKey: 'co2Emissions', unitKey: 'kg', icon: '💨', base: 728, optimizedRatio: 0.57 },
  { labelKey: 'collectionTime', unitKey: 'hrs', icon: '⏱️', base: 18.5, optimizedRatio: 0.61 },
];

/**
 * Calculate KPI values based on slider parameters.
 * More containers & frequency → higher values. More trucks → higher resource usage.
 * Anchored to default params (20 trucks, 18 containers, 3x/week).
 */
export function calculateKpi(
  base: number,
  trucks: number,
  containers: number,
  frequency: number,
): number {
  const truckFactor = trucks / 20;           // more trucks = more fuel/distance
  const containerFactor = containers / 18;    // more containers = more work
  const frequencyFactor = frequency / 3;      // higher frequency = more trips

  return Math.round(base * truckFactor * containerFactor * frequencyFactor * 10) / 10;
}
