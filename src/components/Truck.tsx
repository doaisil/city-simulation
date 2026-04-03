import { useState, useEffect, useRef } from 'react';
import { interpolatePath, type RoadPoint } from '../constants/roads';
import { asset } from '../constants/assets';

interface Props {
  truck: 'Truck1' | 'Truck2' | 'Truck3';
  path: RoadPoint[];
  speed: number;
  loop?: boolean;
}

const TRUCK_SIZES = {
  Truck1: { w: 44, h: 34 },
  Truck2: { w: 36, h: 28 },
  Truck3: { w: 40, h: 30 },
};

export default function Truck({ truck, path, speed, loop = true }: Props) {
  const [pos, setPos] = useState({ x: path[0].x, y: path[0].y });
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      let t = elapsed / speed;

      if (loop) {
        t = t % 1; // always restart from beginning
      } else {
        t = Math.min(t, 1);
      }

      const newPos = interpolatePath(path, t);
      setPos(newPos);

      if (loop || t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [path, speed, loop]);

  const size = TRUCK_SIZES[truck];

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
      }}
    >
      <img
        src={asset(`${truck}.png`)}
        alt={truck}
        width={size.w}
        height={size.h}
        className="block"
        draggable={false}
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
        }}
      />
    </div>
  );
}
