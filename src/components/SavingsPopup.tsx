import { useEffect, useState } from 'react';
import { kpis } from '../constants/kpiData';
import { t, type Lang } from '../constants/i18n';

interface Props {
  visible: boolean;
  lang: Lang;
  onClose: () => void;
}

export default function SavingsPopup({ visible, lang, onClose }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [visible]);

  if (!show) return null;

  const savings = kpis.map((kpi) => ({
    labelKey: kpi.labelKey,
    unitKey: kpi.unitKey,
    icon: kpi.icon,
    percent: Math.round((1 - kpi.optimizedRatio) * 100),
    saved: Math.round(kpi.base * (1 - kpi.optimizedRatio) * 10) / 10,
  }));

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        style={{ animation: 'fadeIn 0.3s ease forwards' }}
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 pointer-events-auto"
        style={{ animation: 'popupSlideIn 0.4s ease forwards' }}
      >
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-evreka-25 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ac443" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-bold text-grey-900 text-center mb-1">
          {t(lang, 'routesOptimized')}
        </h3>
        <p className="text-xs text-grey-500 text-center mb-4">
          {t(lang, 'popupDescription')}
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {savings.map((s) => (
            <div key={s.labelKey} className="bg-grey-25 rounded-lg p-3 text-center border border-grey-100">
              <span className="text-lg">{s.icon}</span>
              <div className="text-xl font-bold text-evreka-500 mt-1">-{s.percent}%</div>
              <div className="text-[10px] text-grey-500 mt-0.5">{t(lang, s.labelKey)}</div>
              <div className="text-[10px] text-grey-400">
                {Number.isInteger(s.saved) ? s.saved : s.saved.toFixed(1)} {t(lang, s.unitKey)} {t(lang, 'saved')}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-white font-semibold text-sm bg-evreka-400 hover:bg-evreka-500 transition-colors"
        >
          {t(lang, 'viewCity')}
        </button>
      </div>
    </div>
  );
}
