import { useState } from 'react';
import CityMap from './components/CityMap';
import ControlPanel from './components/ControlPanel';
import SavingsPopup from './components/SavingsPopup';
import MapEditor from './components/MapEditor';
import { t, type Lang } from './constants/i18n';

function App() {
  const [optimized, setOptimized] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [lang, setLang] = useState<Lang>('en');

  if (editorMode) {
    return <MapEditor onClose={() => setEditorMode(false)} />;
  }

  const handleOptimize = () => {
    setOptimized(true);
    setShowPopup(true);
  };

  const handleReset = () => {
    setOptimized(false);
    setShowPopup(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-grey-50 font-sans">
      <ControlPanel
        optimized={optimized}
        lang={lang}
        onLangChange={setLang}
        onOptimize={handleOptimize}
        onReset={handleReset}
        onOpenEditor={() => setEditorMode(true)}
      />

      <main className="flex-1 relative bg-grey-50 overflow-hidden">
        <CityMap optimized={optimized} />

        {/* Floating optimize button on the map */}
        {!optimized && (
          <button
            onClick={handleOptimize}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-8 py-4 rounded-2xl text-white font-bold text-base tracking-wide shadow-2xl animate-pulse-glow transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #4ac443 0%, #3ba935 50%, #369b31 100%)',
              boxShadow: '0 0 20px rgba(74, 196, 67, 0.4), 0 0 60px rgba(74, 196, 67, 0.15), 0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            ✨ {t(lang, 'optimizeButton')}
          </button>
        )}

        <SavingsPopup visible={showPopup} lang={lang} onClose={() => setShowPopup(false)} />
      </main>
    </div>
  );
}

export default App;
