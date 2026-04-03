import { useState, useRef, useCallback, useEffect } from 'react';
import type { ContainerType } from './WasteContainer';
import { asset } from '../constants/assets';
import { preOptRoutes, postOptRoutes, type TruckRoute } from '../constants/roads';

interface Container {
  x: number;
  y: number;
  type: ContainerType;
  color: 'red' | 'orange';
}

interface RoadPoint {
  x: number;
  y: number;
}

interface EditorTruckRoute {
  truck: 'Truck1' | 'Truck2' | 'Truck3';
  label: string;
  path: RoadPoint[];
  speed: number;
}

interface Props {
  onClose: () => void;
}

const CONTAINER_TYPES: { value: ContainerType; label: string; img: string }[] = [
  { value: 'Trash1', label: 'Skip', img: asset('Trash1.png') },
  { value: 'Trush1', label: 'Wheelie', img: asset('Trush1.png') },
  { value: 'Trush4', label: 'Large', img: asset('Trush4.png') },
  { value: 'Group', label: 'Green Bin', img: asset('Group.png') },
];

const TRUCK_OPTIONS: { value: 'Truck1' | 'Truck2' | 'Truck3'; label: string; img: string }[] = [
  { value: 'Truck1', label: 'Compactor', img: asset('Truck1.png') },
  { value: 'Truck2', label: 'Sweeper', img: asset('Truck2.png') },
  { value: 'Truck3', label: 'Flatbed', img: asset('Truck3.png') },
];

const PRE_ROUTE_COLORS = ['#e3524f', '#dc2723', '#c62320', '#b01f1c', '#fea800', '#d48c00'];
const POST_ROUTE_COLORS = ['#4ac443', '#3ba935', '#68ce62', '#369b31', '#86d882', '#a4e2a1'];

function toEditorRoute(r: TruckRoute, i: number, prefix: string): EditorTruckRoute {
  return { truck: r.truck, label: `${prefix} ${r.truck} #${i + 1}`, path: r.path, speed: r.speed };
}

const INITIAL_CONTAINERS: Container[] = [
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

type Mode = 'container' | 'road' | 'edit' | 'truck';
type RoutePhase = 'pre' | 'post';

export default function MapEditor({ onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containers, setContainers] = useState<Container[]>(INITIAL_CONTAINERS);
  const [currentRoad, setCurrentRoad] = useState<RoadPoint[]>([]);
  const [mode, setMode] = useState<Mode>('edit');
  const [containerColor, setContainerColor] = useState<'red' | 'orange'>('red');
  const [containerType, setContainerType] = useState<ContainerType>('Group');
  const [copied, setCopied] = useState('');
  const [dragging, setDragging] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  // Truck routes — pre and post optimization
  const [preRoutes, setPreRoutes] = useState<EditorTruckRoute[]>(
    preOptRoutes.map((r, i) => toEditorRoute(r, i, 'Pre'))
  );
  const [postRoutes, setPostRoutes] = useState<EditorTruckRoute[]>(
    postOptRoutes.map((r, i) => toEditorRoute(r, i, 'Post'))
  );
  const [routePhase, setRoutePhase] = useState<RoutePhase>('pre');
  const [currentTruckPath, setCurrentTruckPath] = useState<RoadPoint[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<'Truck1' | 'Truck2' | 'Truck3'>('Truck1');
  const [truckSpeed, setTruckSpeed] = useState(8);
  const [truckLabel, setTruckLabel] = useState('');

  // Preview
  const [previewPos, setPreviewPos] = useState<RoadPoint | null>(null);
  const previewRef = useRef<number>(0);
  const previewStartRef = useRef<number | null>(null);

  const activeRoutes = routePhase === 'pre' ? preRoutes : postRoutes;
  const setActiveRoutes = routePhase === 'pre' ? setPreRoutes : setPostRoutes;
  useEffect(() => {
    if (currentTruckPath.length < 2) { setPreviewPos(null); return; }
    const path = currentTruckPath;
    previewStartRef.current = null;
    const animate = (ts: number) => {
      if (previewStartRef.current === null) previewStartRef.current = ts;
      const elapsed = (ts - previewStartRef.current) / 1000;
      let t = (elapsed / truckSpeed) % 1;
      let totalLen = 0;
      const segLens: number[] = [];
      for (let i = 1; i < path.length; i++) {
        const dx = path[i].x - path[i - 1].x, dy = path[i].y - path[i - 1].y;
        segLens.push(Math.sqrt(dx * dx + dy * dy));
        totalLen += segLens[segLens.length - 1];
      }
      const target = t * totalLen;
      let acc = 0;
      for (let i = 0; i < segLens.length; i++) {
        if (acc + segLens[i] >= target) {
          const segT = (target - acc) / segLens[i];
          setPreviewPos({
            x: path[i].x + (path[i + 1].x - path[i].x) * segT,
            y: path[i].y + (path[i + 1].y - path[i].y) * segT,
          });
          break;
        }
        acc += segLens[i];
      }
      previewRef.current = requestAnimationFrame(animate);
    };
    previewRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(previewRef.current);
  }, [currentTruckPath, truckSpeed]);

  const getPercent = useCallback((e: React.MouseEvent | MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(1)),
      y: parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(1)),
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === 'edit') { setSelected(null); return; }
    const pt = getPercent(e);
    if (!pt) return;
    if (mode === 'container') setContainers((prev) => [...prev, { x: pt.x, y: pt.y, type: containerType, color: containerColor }]);
    else if (mode === 'road') setCurrentRoad((prev) => [...prev, pt]);
    else if (mode === 'truck') setCurrentTruckPath((prev) => [...prev, pt]);
  }, [mode, containerColor, containerType, getPercent]);

  const finishRoad = () => { setCurrentRoad([]); };

  const finishTruckRoute = () => {
    if (currentTruckPath.length >= 2) {
      const label = truckLabel || `${routePhase === 'pre' ? 'Pre' : 'Post'} ${selectedTruck} #${activeRoutes.filter(r => r.truck === selectedTruck).length + 1}`;
      setActiveRoutes((prev) => [...prev, { truck: selectedTruck, label, path: currentTruckPath, speed: truckSpeed }]);
    }
    setCurrentTruckPath([]); setTruckLabel(''); setPreviewPos(null);
  };

  const undoLast = () => {
    if (mode === 'container') setContainers((prev) => prev.slice(0, -1));
    else if (mode === 'road') { if (currentRoad.length > 0) setCurrentRoad((prev) => prev.slice(0, -1)); }
    else if (mode === 'truck') { if (currentTruckPath.length > 0) setCurrentTruckPath((prev) => prev.slice(0, -1)); else setActiveRoutes((prev) => prev.slice(0, -1)); }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    if (mode !== 'edit') return; e.stopPropagation(); setDragging(index); setSelected(index);
  }, [mode]);

  useEffect(() => {
    if (dragging === null) return;
    const handleMove = (e: MouseEvent) => { const pt = getPercent(e); if (pt) setContainers((prev) => prev.map((c, i) => i === dragging ? { ...c, x: pt.x, y: pt.y } : c)); };
    const handleUp = () => setDragging(null);
    window.addEventListener('mousemove', handleMove); window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [dragging, getPercent]);

  const deleteSelected = () => { if (selected !== null) { setContainers((prev) => prev.filter((_, i) => i !== selected)); setSelected(null); } };

  const PIN_COLORS = { red: '#e3524f', orange: '#fea800' };

  const copyContainers = () => {
    const code = containers.map((c) => `  { x: ${c.x}, y: ${c.y}, type: '${c.type}', color: '${c.color}' },`).join('\n');
    navigator.clipboard.writeText(`[\n${code}\n]`); setCopied('containers'); setTimeout(() => setCopied(''), 2000);
  };
  const copyTruckRoutes = (routes: EditorTruckRoute[], label: string) => {
    const code = routes.map((r) =>
      `  {\n    truck: '${r.truck}',\n    path: [\n${r.path.map((p) => `      { x: ${p.x}, y: ${p.y} },`).join('\n')}\n    ],\n    speed: ${r.speed},\n  },`
    ).join('\n');
    navigator.clipboard.writeText(`// ${label}\n[\n${code}\n]`); setCopied(label); setTimeout(() => setCopied(''), 2000);
  };
  const copyAll = () => {
    const cCode = containers.map((c) => `  { x: ${c.x}, y: ${c.y}, type: '${c.type}', color: '${c.color}' },`).join('\n');
    const preCode = preRoutes.map((r) => `  {\n    truck: '${r.truck}',\n    path: [\n${r.path.map((p) => `      { x: ${p.x}, y: ${p.y} },`).join('\n')}\n    ],\n    speed: ${r.speed},\n  },`).join('\n');
    const postCode = postRoutes.map((r) => `  {\n    truck: '${r.truck}',\n    path: [\n${r.path.map((p) => `      { x: ${p.x}, y: ${p.y} },`).join('\n')}\n    ],\n    speed: ${r.speed},\n  },`).join('\n');
    navigator.clipboard.writeText(`// CONTAINERS\n[\n${cCode}\n]\n\n// PRE-OPT ROUTES\n[\n${preCode}\n]\n\n// POST-OPT ROUTES\n[\n${postCode}\n]`);
    setCopied('all'); setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans">
      <aside className="w-72 shrink-0 bg-white shadow-lg p-4 flex flex-col gap-3 z-20 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-grey-900">Map Editor</h2>
          <button onClick={onClose} className="text-xs px-2 py-1 bg-grey-200 rounded hover:bg-grey-300">Exit</button>
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-4 gap-1 bg-grey-100 rounded-lg p-1">
          {(['edit', 'container', 'road', 'truck'] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setSelected(null); }}
              className={`text-[10px] py-1.5 rounded-md font-medium transition-colors ${mode === m ? 'bg-white shadow text-grey-900' : 'text-grey-500'}`}>
              {m === 'truck' ? 'Trucks' : m === 'container' ? 'Add' : m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        {/* Edit mode */}
        {mode === 'edit' && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-grey-500">Drag containers to reposition. Click to select.</p>
            {selected !== null && (
              <div className="flex flex-col gap-2 p-2 bg-grey-50 rounded-md">
                <div className="text-xs text-grey-700 font-medium">#{selected + 1} — {containers[selected].type}</div>
                <div className="text-[10px] text-grey-500 font-mono">({containers[selected].x}%, {containers[selected].y}%)</div>
                <button onClick={deleteSelected} className="px-3 py-1 bg-danger-500 text-white rounded-md text-xs font-medium">Delete</button>
              </div>
            )}
          </div>
        )}

        {/* Container add */}
        {mode === 'container' && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-grey-600 mb-1.5 block">Type</label>
              <div className="grid grid-cols-4 gap-1.5">
                {CONTAINER_TYPES.map((ct) => (
                  <button key={ct.value} onClick={() => setContainerType(ct.value)}
                    className={`flex flex-col items-center p-1.5 rounded-md border-2 transition-all ${containerType === ct.value ? 'border-grey-900 bg-grey-50' : 'border-transparent bg-grey-25'}`}>
                    <img src={ct.img} alt={ct.label} className="w-8 h-8 object-contain" />
                    <span className="text-[9px] text-grey-600 mt-0.5">{ct.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-grey-600 mb-1.5 block">Pin Color</label>
              <div className="flex gap-2">
                {(['red', 'orange'] as const).map((c) => (
                  <button key={c} onClick={() => setContainerColor(c)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border-2 transition-all ${containerColor === c ? 'border-grey-900 bg-grey-50' : 'border-transparent bg-grey-50'}`}>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIN_COLORS[c] }} />
                    {c === 'red' ? 'Red' : 'Orange'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Road mode */}
        {mode === 'road' && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-grey-500">Click points along a road.</p>
            {currentRoad.length > 0 && <p className="text-xs text-evreka-600 font-medium">Drawing: {currentRoad.length} points</p>}
            <button onClick={finishRoad} disabled={currentRoad.length < 2} className="px-3 py-1.5 bg-evreka-400 text-white rounded-md text-xs font-medium disabled:opacity-40">Finish Road</button>
          </div>
        )}

        {/* Truck mode */}
        {mode === 'truck' && (
          <div className="flex flex-col gap-3">
            {/* Pre/Post toggle */}
            <div>
              <label className="text-xs font-medium text-grey-600 mb-1.5 block">Route Phase</label>
              <div className="flex gap-1 bg-grey-100 rounded-lg p-1">
                <button onClick={() => setRoutePhase('pre')}
                  className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${routePhase === 'pre' ? 'bg-danger-500 text-white shadow' : 'text-grey-500'}`}>
                  Pre-Optimization
                </button>
                <button onClick={() => setRoutePhase('post')}
                  className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${routePhase === 'post' ? 'bg-evreka-400 text-white shadow' : 'text-grey-500'}`}>
                  Post-Optimization
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-grey-600 mb-1.5 block">Select Truck</label>
              <div className="grid grid-cols-3 gap-1.5">
                {TRUCK_OPTIONS.map((t) => (
                  <button key={t.value} onClick={() => setSelectedTruck(t.value)}
                    className={`flex flex-col items-center p-1.5 rounded-md border-2 transition-all ${selectedTruck === t.value ? 'border-grey-900 bg-grey-50' : 'border-transparent bg-grey-25'}`}>
                    <img src={t.img} alt={t.label} className="w-10 h-8 object-contain" />
                    <span className="text-[9px] text-grey-600 mt-0.5">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-grey-600 mb-1 block">Speed ({truckSpeed}s)</label>
              <input type="range" min={4} max={30} value={truckSpeed} onChange={(e) => setTruckSpeed(Number(e.target.value))} className="w-full" />
            </div>

            <p className="text-xs text-grey-500">
              Click waypoints along the road. The truck will follow this path.
            </p>

            {currentTruckPath.length > 0 && (
              <p className="text-xs font-medium" style={{ color: routePhase === 'pre' ? '#e3524f' : '#4ac443' }}>
                Waypoints: {currentTruckPath.length}
              </p>
            )}

            <button onClick={finishTruckRoute} disabled={currentTruckPath.length < 2}
              className="px-3 py-1.5 text-white rounded-md text-xs font-medium disabled:opacity-40"
              style={{ backgroundColor: routePhase === 'pre' ? '#e3524f' : '#4ac443' }}>
              Finish {routePhase === 'pre' ? 'Pre' : 'Post'}-Opt Route
            </button>
          </div>
        )}

        {/* Undo */}
        {mode !== 'edit' && (
          <button onClick={undoLast} className="px-3 py-1.5 bg-grey-100 hover:bg-grey-200 rounded-md text-xs font-medium text-grey-700">Undo</button>
        )}

        <hr className="border-grey-200" />

        {/* Lists */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-grey-700">Containers ({containers.length})</span>
            <button onClick={copyContainers} disabled={containers.length === 0} className="text-xs px-2 py-0.5 bg-evreka-400 text-white rounded disabled:opacity-40">
              {copied === 'containers' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-danger-600">Pre-Opt Routes ({preRoutes.length})</span>
            <button onClick={() => copyTruckRoutes(preRoutes, 'PRE-OPT')} disabled={preRoutes.length === 0} className="text-xs px-2 py-0.5 bg-danger-500 text-white rounded disabled:opacity-40">
              {copied === 'PRE-OPT' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="max-h-20 overflow-y-auto text-[10px] text-grey-600 font-mono space-y-0.5">
            {preRoutes.map((r, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: PRE_ROUTE_COLORS[i % PRE_ROUTE_COLORS.length] }} />
                {r.truck} ({r.path.length} pts, {r.speed}s)
                <button onClick={() => setPreRoutes(prev => prev.filter((_, j) => j !== i))} className="ml-auto text-danger-500 hover:text-danger-700">×</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-evreka-600">Post-Opt Routes ({postRoutes.length})</span>
            <button onClick={() => copyTruckRoutes(postRoutes, 'POST-OPT')} disabled={postRoutes.length === 0} className="text-xs px-2 py-0.5 bg-evreka-400 text-white rounded disabled:opacity-40">
              {copied === 'POST-OPT' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="max-h-20 overflow-y-auto text-[10px] text-grey-600 font-mono space-y-0.5">
            {postRoutes.map((r, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: POST_ROUTE_COLORS[i % POST_ROUTE_COLORS.length] }} />
                {r.truck} ({r.path.length} pts, {r.speed}s)
                <button onClick={() => setPostRoutes(prev => prev.filter((_, j) => j !== i))} className="ml-auto text-danger-500 hover:text-danger-700">×</button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={copyAll} disabled={containers.length === 0 && preRoutes.length === 0 && postRoutes.length === 0}
          className="px-3 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-md text-xs font-semibold disabled:opacity-40 transition-colors">
          {copied === 'all' ? 'Copied Everything!' : 'Copy All Data'}
        </button>
      </aside>

      {/* Map */}
      <main className="flex-1 relative bg-grey-50 overflow-hidden">
        <div ref={containerRef} className={`relative w-full h-full ${mode === 'edit' ? 'cursor-default' : 'cursor-crosshair'}`} onClick={handleClick}>
          <img src={asset('city-bg.png')} alt="City map" className="w-full h-full object-cover" draggable={false} />

          {/* Containers */}
          {containers.map((c, i) => (
            <div key={`c-${i}`}
              className={`absolute ${mode === 'edit' ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
              style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -100%)', zIndex: dragging === i ? 50 : selected === i ? 40 : 10 }}
              onMouseDown={(e) => handleMouseDown(e, i)}>
              {selected === i && mode === 'edit' && <div className="absolute -inset-2 border-2 border-evreka-400 rounded-lg pointer-events-none" />}
              <div className="flex flex-col items-center" style={{ marginBottom: '-2px' }}>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white" style={{ backgroundColor: PIN_COLORS[c.color], boxShadow: `0 1px 4px ${PIN_COLORS[c.color]}80` }} />
                <div className="w-0.5 h-2.5" style={{ backgroundColor: PIN_COLORS[c.color] }} />
              </div>
              <img src={asset(`${c.type}.png`)} alt={c.type} className="block w-8 h-8 object-contain" draggable={false} />
            </div>
          ))}

          {/* Route lines overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }} viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Pre-opt routes */}
            {preRoutes.map((r, i) => (
              <polyline key={`pre-${i}`}
                points={r.path.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none" stroke={PRE_ROUTE_COLORS[i % PRE_ROUTE_COLORS.length]}
                strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: '2px' }} opacity={routePhase === 'pre' || mode !== 'truck' ? 0.5 : 0.15}
                strokeDasharray="1.5 0.8" />
            ))}
            {/* Post-opt routes */}
            {postRoutes.map((r, i) => (
              <polyline key={`post-${i}`}
                points={r.path.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none" stroke={POST_ROUTE_COLORS[i % POST_ROUTE_COLORS.length]}
                strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: '2px' }} opacity={routePhase === 'post' || mode !== 'truck' ? 0.5 : 0.15}
                strokeDasharray="1.5 0.8" />
            ))}
            {/* Current path being drawn */}
            {mode === 'truck' && currentTruckPath.length >= 2 && (
              <polyline
                points={currentTruckPath.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none" stroke={routePhase === 'pre' ? '#fea800' : '#86d882'}
                strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: '3px' }} opacity={0.8} strokeDasharray="1 0.5" />
            )}
          </svg>

          {/* Waypoint dots */}
          {mode === 'truck' && currentTruckPath.map((p, i) => (
            <div key={`tp-${i}`} className="absolute w-3 h-3 rounded-full border-2 border-white pointer-events-none"
              style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)', backgroundColor: routePhase === 'pre' ? '#fea800' : '#86d882', zIndex: 25 }} />
          ))}

          {/* Truck preview */}
          {mode === 'truck' && previewPos && (
            <div className="absolute pointer-events-none" style={{ left: `${previewPos.x}%`, top: `${previewPos.y}%`, transform: 'translate(-50%, -50%)', zIndex: 30 }}>
              <img src={asset(`${selectedTruck}.png`)} alt="preview" className="w-10 h-8 object-contain opacity-80" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>
          )}

          {/* Road point markers */}
          {currentRoad.map((p, i) => (
            <div key={`rp-${i}`} className="absolute w-2.5 h-2.5 rounded-full border border-white pointer-events-none"
              style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)', backgroundColor: '#fea800' }} />
          ))}
        </div>
      </main>
    </div>
  );
}
