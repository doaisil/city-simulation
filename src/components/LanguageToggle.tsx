import type { Lang } from '../constants/i18n';

interface Props {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

export default function LanguageToggle({ lang, onChange }: Props) {
  return (
    <div className="flex gap-0.5 bg-grey-100 rounded-md p-0.5">
      <button
        onClick={() => onChange('en')}
        className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
          lang === 'en' ? 'bg-white shadow text-grey-900' : 'text-grey-400'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onChange('tr')}
        className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
          lang === 'tr' ? 'bg-white shadow text-grey-900' : 'text-grey-400'
        }`}
      >
        TR
      </button>
    </div>
  );
}
