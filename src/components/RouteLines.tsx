import { useState, useEffect, useRef } from 'react';
import { type RoadPoint } from '../constants/roads';

interface Route {
  truck: string;
  path: RoadPoint[];
  speed: number;
}

interface Props {
  routes: Route[];
  optimized?: boolean;
}

const PRE_OPT_COLORS = ['#e3524f', '#dc2723', '#c62320'];
const POST_OPT_COLORS = ['#4ac443', '#3ba935', '#68ce62'];

function TrailingLine({ path, speed, color }: { path: RoadPoint[]; speed: number; color: string }) {
  const [trailPoints, setTrailPoints] = useState<string>('');
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = null;

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      const t = elapsed / speed;
      const progress = t % 1;

      // Build trail from start of current loop to current position
      const totalLen = pathLength(path);
      const currentDist = progress * totalLen;

      const points: string[] = [];
      let acc = 0;
      points.push(`${path[0].x},${path[0].y}`);

      for (let i = 1; i < path.length; i++) {
        const dx = path[i].x - path[i - 1].x;
        const dy = path[i].y - path[i - 1].y;
        const segLen = Math.sqrt(dx * dx + dy * dy);

        if (acc + segLen <= currentDist) {
          points.push(`${path[i].x},${path[i].y}`);
          acc += segLen;
        } else {
          // Partial segment
          const segT = (currentDist - acc) / segLen;
          const x = path[i - 1].x + dx * segT;
          const y = path[i - 1].y + dy * segT;
          points.push(`${x},${y}`);
          break;
        }
      }

      setTrailPoints(points.join(' '));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [path, speed]);

  return (
    <polyline
      points={trailPoints}
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      style={{ strokeWidth: '4px' }}
      opacity={0.6}
    />
  );
}

function pathLength(path: RoadPoint[]): number {
  let len = 0;
  for (let i = 1; i < path.length; i++) {
    const dx = path[i].x - path[i - 1].x;
    const dy = path[i].y - path[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

export default function RouteLines({ routes, optimized = false }: Props) {
  const colors = optimized ? POST_OPT_COLORS : PRE_OPT_COLORS;
  const animKey = optimized ? 'opt' : 'pre';

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 20 }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {routes.map((route, i) => (
        <TrailingLine
          key={`${animKey}-${i}`}
          path={route.path}
          speed={route.speed}
          color={colors[i % colors.length]}
        />
      ))}
    </svg>
  );
}
