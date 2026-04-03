import { asset } from '../constants/assets';
import WasteContainer from './WasteContainer';
import type { ContainerType } from './WasteContainer';
import Truck from './Truck';
import RouteLines from './RouteLines';
import { preOptRoutes, postOptRoutes } from '../constants/roads';

const containers: { x: number; y: number; type: ContainerType; color: 'red' | 'orange' }[] = [
  { x: 36.6, y: 49.6, type: 'Trush4', color: 'red' },
  { x: 61.1, y: 74, type: 'Trush1', color: 'red' },
  { x: 63, y: 75.7, type: 'Trush1', color: 'red' },
  { x: 64.8, y: 77.1, type: 'Trush1', color: 'red' },
  { x: 88.1, y: 48.1, type: 'Trash1', color: 'orange' },
  { x: 29.1, y: 70.7, type: 'Group', color: 'red' },
  { x: 54.5, y: 34.6, type: 'Group', color: 'red' },
  { x: 57.9, y: 49.5, type: 'Trush1', color: 'red' },
  { x: 63.5, y: 44.1, type: 'Trush1', color: 'orange' },
  { x: 34.5, y: 19.3, type: 'Group', color: 'orange' },
  { x: 35.9, y: 20.2, type: 'Group', color: 'orange' },
  { x: 37, y: 21.2, type: 'Group', color: 'orange' },
  { x: 38, y: 22.1, type: 'Group', color: 'orange' },
  { x: 15.2, y: 34.4, type: 'Group', color: 'orange' },
  { x: 16.6, y: 35.6, type: 'Group', color: 'orange' },
  { x: 16.9, y: 43.7, type: 'Group', color: 'orange' },
  { x: 5.2, y: 25.7, type: 'Group', color: 'orange' },
  { x: 35.5, y: 76.2, type: 'Trush4', color: 'orange' },
];

interface Props {
  optimized?: boolean;
}

export default function CityMap({ optimized = false }: Props) {
  const routes = optimized ? postOptRoutes : preOptRoutes;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* City background — dirty version underneath, clean on top */}
      <img
        src={asset('city-bg-dirty.png')}
        alt="Polluted city"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <img
        src={asset('city-bg.png')}
        alt="Clean city"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        style={{
          opacity: optimized ? 1 : 0,
          transition: 'opacity 2s ease',
        }}
      />

      {/* Smog/pollution overlay — fades out on optimization */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: optimized
            ? 'transparent'
            : 'linear-gradient(180deg, rgba(120,100,60,0.18) 0%, rgba(140,110,50,0.12) 40%, rgba(100,90,60,0.15) 100%)',
          transition: 'background 1.5s ease',
        }}
      />

      {/* Dirty haze particles (pre-optimization only) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: optimized ? 0 : 1,
          transition: 'opacity 1.5s ease',
        }}
      >
        {/* Scattered smog puffs */}
        {[
          { x: 15, y: 30, size: 120, opacity: 0.08 },
          { x: 45, y: 20, size: 160, opacity: 0.06 },
          { x: 70, y: 35, size: 140, opacity: 0.07 },
          { x: 30, y: 60, size: 130, opacity: 0.06 },
          { x: 60, y: 55, size: 150, opacity: 0.08 },
          { x: 85, y: 50, size: 110, opacity: 0.07 },
          { x: 20, y: 80, size: 140, opacity: 0.05 },
          { x: 55, y: 75, size: 120, opacity: 0.06 },
          { x: 80, y: 70, size: 130, opacity: 0.07 },
        ].map((puff, i) => (
          <div
            key={`smog-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${puff.x}%`,
              top: `${puff.y}%`,
              width: puff.size,
              height: puff.size,
              background: `radial-gradient(circle, rgba(100,80,40,${puff.opacity}) 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
              animation: `smogFloat ${6 + i * 0.7}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Route lines */}
      <RouteLines routes={routes} optimized={optimized} />

      {/* Waste containers */}
      {containers.map((c, i) => (
        <WasteContainer
          key={i}
          x={c.x}
          y={c.y}
          type={c.type}
          color={c.color}
          optimized={optimized}
        />
      ))}

      {/* Trucks */}
      {routes.map((route, i) => (
        <Truck
          key={`${optimized ? 'opt' : 'pre'}-${i}`}
          truck={route.truck}
          path={route.path}
          speed={route.speed}
          loop={true}
        />
      ))}

      {/* Clean/fresh overlay after optimization */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: optimized
            ? 'linear-gradient(180deg, rgba(74,196,67,0.04) 0%, rgba(59,169,53,0.02) 100%)'
            : 'transparent',
          transition: 'background 1.5s ease',
        }}
      />
    </div>
  );
}
