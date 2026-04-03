import { asset } from '../constants/assets';

export type ContainerType = 'Trash1' | 'Trush1' | 'Trush4' | 'Group';

interface Props {
  x: number;
  y: number;
  type: ContainerType;
  color: 'red' | 'orange';
  optimized?: boolean;
}

const PIN_COLORS = {
  red: '#e3524f',
  orange: '#fea800',
  green: '#4ac443',
};

const CONTAINER_SIZES: Record<ContainerType, { w: number; h: number }> = {
  Trash1: { w: 36, h: 30 },
  Trush1: { w: 28, h: 30 },
  Trush4: { w: 28, h: 34 },
  Group: { w: 24, h: 32 },
};

export default function WasteContainer({ x, y, type, color, optimized = false }: Props) {
  // Pre-opt: red stays red, orange stays orange
  // Post-opt: red → orange, orange → green
  const pinFill = optimized
    ? (color === 'red' ? PIN_COLORS.orange : PIN_COLORS.green)
    : PIN_COLORS[color];

  const size = CONTAINER_SIZES[type];

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {/* Pin floating above */}
      <div className="flex flex-col items-center" style={{ marginBottom: '-2px' }}>
        <div
          className="w-3.5 h-3.5 rounded-full border-2 border-white"
          style={{
            backgroundColor: pinFill,
            transition: 'background-color 0.5s ease, box-shadow 0.5s ease',
            boxShadow: `0 1px 4px ${pinFill}80, 0 0 8px ${pinFill}30`,
            animation: !optimized && color === 'red' ? 'pinPulse 2s ease-in-out infinite' : 'none',
          }}
        />
        <div
          className="w-0.5 h-2.5"
          style={{
            backgroundColor: pinFill,
            transition: 'background-color 0.5s ease',
          }}
        />
      </div>

      {/* Container image */}
      <img
        src={asset(`${type}.png`)}
        alt={type}
        width={size.w}
        height={size.h}
        className="block"
        draggable={false}
      />
    </div>
  );
}
