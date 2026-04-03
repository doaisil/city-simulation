import { useState } from 'react';
import { asset } from '../constants/assets';
import KpiCard from './KpiCard';
import LanguageToggle from './LanguageToggle';
import { kpis, calculateKpi } from '../constants/kpiData';
import { t, type Lang } from '../constants/i18n';

interface Props {
  optimized: boolean;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  onOptimize: () => void;
  onReset: () => void;
  onOpenEditor: () => void;
}

export default function ControlPanel({ optimized, lang, onLangChange, onOptimize, onReset, onOpenEditor }: Props) {
  const [trucks, setTrucks] = useState(20);
  const [containers, setContainers] = useState(18);
  const [frequency, setFrequency] = useState<7 | 3 | 1>(3);
  const [routeMethod, setRouteMethod] = useState<'dynamic' | 'static'>('static');

  return (
    <aside className="w-80 shrink-0 bg-white shadow-lg flex flex-col z-10 overflow-y-auto">
      {/* Header */}
      <div className="p-5 pb-3 border-b border-grey-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={asset('evreka-icon.png')} alt="Evreka" className="w-8 h-8 rounded-lg" />
            <div>
              <h1 className="text-base font-bold text-grey-900 leading-tight">{t(lang, 'brand')}</h1>
              <p className="text-[10px] text-grey-400 font-medium">{t(lang, 'subtitle')}</p>
            </div>
          </div>
          <LanguageToggle lang={lang} onChange={onLangChange} />
        </div>
      </div>

      {/* Sliders */}
      <div className="p-5 pb-3 space-y-4">
        <h2 className="text-xs font-semibold text-grey-700 uppercase tracking-wider">{t(lang, 'parameters')}</h2>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium text-grey-600">{t(lang, 'trucks')}</label>
            <span className="text-xs font-bold text-grey-900">{trucks}</span>
          </div>
          <input type="range" min={10} max={100} step={5} value={trucks}
            onChange={(e) => setTrucks(Number(e.target.value))}
            className="w-full h-1.5 bg-grey-200 rounded-full appearance-none cursor-pointer accent-evreka-400" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium text-grey-600">{t(lang, 'containers')}</label>
            <span className="text-xs font-bold text-grey-900">{containers}</span>
          </div>
          <input type="range" min={10} max={500} step={10} value={containers}
            onChange={(e) => setContainers(Number(e.target.value))}
            className="w-full h-1.5 bg-grey-200 rounded-full appearance-none cursor-pointer accent-evreka-400" />
        </div>

        <div>
          <label className="text-xs font-medium text-grey-600 mb-1.5 block">{t(lang, 'collectionFrequency')}</label>
          <div className="flex gap-1 bg-grey-100 rounded-lg p-1">
            {([7, 3, 1] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`flex-1 text-[11px] py-1.5 rounded-md font-medium transition-all ${
                  frequency === f ? 'bg-white shadow text-grey-900' : 'text-grey-500 hover:text-grey-700'
                }`}
              >
                {f === 7 ? t(lang, 'freqDaily') : f === 3 ? t(lang, 'freq3x') : t(lang, 'freq1x')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Route Method Toggle */}
      <div className="px-5 pb-4">
        <h2 className="text-xs font-semibold text-grey-700 uppercase tracking-wider mb-2">{t(lang, 'routeMethod')}</h2>
        <div className="flex gap-1 bg-grey-100 rounded-lg p-1">
          <button
            onClick={() => setRouteMethod('dynamic')}
            className={`flex-1 text-xs py-2 rounded-md font-medium transition-all ${
              routeMethod === 'dynamic' ? 'bg-white shadow text-grey-900' : 'text-grey-500 hover:text-grey-700'
            }`}
          >
            {t(lang, 'dynamic')}
          </button>
          <button
            onClick={() => setRouteMethod('static')}
            className={`flex-1 text-xs py-2 rounded-md font-medium transition-all ${
              routeMethod === 'static' ? 'bg-white shadow text-grey-900' : 'text-grey-500 hover:text-grey-700'
            }`}
          >
            {t(lang, 'static')}
          </button>
        </div>
      </div>

      <hr className="border-grey-100" />

      {/* KPIs */}
      <div className="p-5 space-y-2.5">
        <h2 className="text-xs font-semibold text-grey-700 uppercase tracking-wider">{t(lang, 'liveKpis')}</h2>
        {kpis.map((kpi) => {
          // Static routes are ~15% less efficient than dynamic
          const routeFactor = routeMethod === 'static' ? 1.15 : 1;
          const currentValue = Math.round(calculateKpi(kpi.base, trucks, containers, frequency) * routeFactor * 10) / 10;
          const optimizedValue = Math.round(currentValue * kpi.optimizedRatio * 10) / 10;
          return (
            <KpiCard
              key={kpi.labelKey}
              label={t(lang, kpi.labelKey)}
              unit={t(lang, kpi.unitKey)}
              icon={kpi.icon}
              value={currentValue}
              optimizedValue={optimizedValue}
              optimized={optimized}
            />
          );
        })}
      </div>

      {/* Optimize Button */}
      <div className="p-5 pt-0 mt-auto">
        {!optimized ? (
          <button
            onClick={onOptimize}
            className="w-full py-3 rounded-xl text-white font-bold text-sm bg-evreka-400 hover:bg-evreka-500 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            {t(lang, 'optimizeButton')}
          </button>
        ) : (
          <button
            onClick={onReset}
            className="w-full py-3 rounded-xl text-grey-700 font-semibold text-sm bg-grey-100 hover:bg-grey-200 transition-all"
          >
            {t(lang, 'resetButton')}
          </button>
        )}
        <button
          onClick={onOpenEditor}
          className="w-full mt-2 py-2 rounded-lg text-grey-500 font-medium text-[10px] hover:bg-grey-50 transition-colors"
        >
          {t(lang, 'openEditor')}
        </button>
      </div>
    </aside>
  );
}
