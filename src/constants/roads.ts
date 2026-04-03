export interface RoadPoint {
  x: number;
  y: number;
}

export interface TruckRoute {
  truck: 'Truck1' | 'Truck2' | 'Truck3';
  path: RoadPoint[];
  speed: number;
}

// Pre-optimization truck routes
export const preOptRoutes: TruckRoute[] = [
  {
    truck: 'Truck1',
    path: [
      { x: 1.7, y: 99 },
      { x: 43.7, y: 63.9 },
      { x: 0.6, y: 23.8 },
    ],
    speed: 8,
  },
  {
    truck: 'Truck2',
    path: [
      { x: 97.2, y: 70.8 },
      { x: 74.8, y: 91.1 },
      { x: 43.4, y: 63.9 },
      { x: 90.7, y: 23.7 },
      { x: 99.5, y: 30.7 },
    ],
    speed: 8,
  },
  {
    truck: 'Truck3',
    path: [
      { x: 83.7, y: 98.8 },
      { x: 43.7, y: 63.8 },
      { x: 58, y: 51.3 },
      { x: 48.6, y: 42.2 },
      { x: 34.4, y: 54.9 },
      { x: 21.4, y: 42.8 },
      { x: 40.3, y: 26.1 },
      { x: 12, y: 0.4 },
    ],
    speed: 8,
  },
];

// Post-optimization routes
export const postOptRoutes: TruckRoute[] = [
  {
    truck: 'Truck1',
    path: [
      { x: 1.1, y: 99.6 },
      { x: 12.1, y: 90.7 },
      { x: 28.7, y: 76.5 },
      { x: 43.5, y: 63.9 },
      { x: 58.4, y: 77 },
      { x: 71.6, y: 88.3 },
      { x: 59.7, y: 99.9 },
    ],
    speed: 6,
  },
  {
    truck: 'Truck2',
    path: [
      { x: 0.3, y: 23.7 },
      { x: 8.6, y: 31.7 },
      { x: 21.4, y: 43.1 },
      { x: 32.6, y: 33 },
      { x: 40.3, y: 26.1 },
      { x: 12.2, y: 0.6 },
    ],
    speed: 6,
  },
  {
    truck: 'Truck3',
    path: [
      { x: 71.1, y: 0.5 },
      { x: 67.2, y: 4.9 },
      { x: 77.6, y: 17.1 },
      { x: 34.5, y: 54.4 },
      { x: 43.8, y: 63.6 },
      { x: 90.9, y: 23.7 },
      { x: 99.5, y: 30.6 },
    ],
    speed: 6,
  },
  {
    truck: 'Truck1',
    path: [
      { x: 99.8, y: 30.5 },
      { x: 90.7, y: 23.9 },
      { x: 66.5, y: 44.1 },
      { x: 43.8, y: 63.9 },
      { x: 60.2, y: 78.4 },
      { x: 74.9, y: 91.5 },
      { x: 97.5, y: 71.3 },
      { x: 99.5, y: 68.9 },
    ],
    speed: 6,
  },
];

/** Interpolate position along a path. t goes from 0 to 1. */
export function interpolatePath(path: RoadPoint[], t: number): { x: number; y: number } {
  if (path.length < 2) return { x: path[0].x, y: path[0].y };

  let totalLen = 0;
  const segLens: number[] = [];
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].x - path[i - 1].x;
    const dy = path[i].y - path[i - 1].y;
    const l = Math.sqrt(dx * dx + dy * dy);
    segLens.push(l);
    totalLen += l;
  }

  const targetDist = t * totalLen;
  let accumulated = 0;

  for (let i = 0; i < segLens.length; i++) {
    if (accumulated + segLens[i] >= targetDist) {
      const segT = (targetDist - accumulated) / segLens[i];
      return {
        x: path[i].x + (path[i + 1].x - path[i].x) * segT,
        y: path[i].y + (path[i + 1].y - path[i].y) * segT,
      };
    }
    accumulated += segLens[i];
  }

  return { x: path[path.length - 1].x, y: path[path.length - 1].y };
}
