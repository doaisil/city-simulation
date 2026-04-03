interface Props {
  /** Percentage position (0-100) relative to container */
  x: number;
  y: number;
  count: number;
  color: string;
  optimizedColor?: string;
  optimized?: boolean;
}

export default function LocationPin({
  x,
  y,
  count,
  color,
  optimizedColor,
  optimized = false,
}: Props) {
  const fill = optimized && optimizedColor ? optimizedColor : color;

  return (
    <div
      className="absolute flex flex-col items-center pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -100%)',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Badge */}
      <div
        className="px-2 py-1 rounded-md text-white font-semibold text-xs leading-none shadow-md"
        style={{
          backgroundColor: fill,
          fontFamily: 'Inter, sans-serif',
          minWidth: '24px',
          textAlign: 'center',
          transition: 'background-color 0.5s ease',
        }}
      >
        {count}
      </div>
      {/* Triangle pointer */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `6px solid ${fill}`,
          transition: 'border-top-color 0.5s ease',
        }}
      />
    </div>
  );
}
