import { useState, useEffect } from 'react';
import { useAlbum, useProfile } from './store/useAlbum';
import { STICKER_MAP } from './data/album';
import Stats from './components/Stats';
import Album from './components/Album';
import AddSticker from './components/AddSticker';
import Duplicates from './components/Duplicates';
import Profile from './components/Profile';
import StickerModal from './components/StickerModal';
import TradeView from './components/TradeView';
import './App.css';

const TABS = [
  { id: 'stats',   label: 'Inicio',    icon: '🏠' },
  { id: 'album',   label: 'Álbum',     icon: '📖' },
  { id: 'add',     label: 'Agregar',   icon: '➕' },
  { id: 'dupes',   label: 'Repetidas', icon: '🔄' },
  { id: 'profile', label: 'Perfil',    icon: '📱' },
];

export default function App() {
  const { collection, addSticker, removeSticker, getStatus, getCount, stats, resetCollection } = useAlbum();
  const { profile, saveProfile } = useProfile();
  const [tab, setTab] = useState('stats');
  const [modal, setModal] = useState(null);
  const [tradeData, setTradeData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('trade');
    if (raw) {
      try {
        setTradeData(JSON.parse(decodeURIComponent(raw)));
        window.history.replaceState({}, '', window.location.pathname);
      } catch {}
    }
  }, []);

  const handleStickerTap = (sticker) => {
    const key = sticker.key || `${sticker.teamCode}${sticker.num}`;
    const info = STICKER_MAP[key];
    if (info) setModal(info);
  };

  if (tradeData) {
    return <TradeView tradeData={tradeData} onClose={() => setTradeData(null)} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="header-logo">⚽</span>
        <h1 className="header-title">Mundial 2026</h1>
        <span className="header-badge">{stats.percent}%</span>
      </header>

      <main className="app-main">
        {tab === 'stats'   && <Stats stats={stats} />}
        {tab === 'album'   && <Album getStatus={getStatus} getCount={getCount} onStickerTap={handleStickerTap} filter={null} />}
        {tab === 'add'     && <AddSticker onAdd={addSticker} />}
        {tab === 'dupes'   && <Duplicates collection={collection} onStickerTap={handleStickerTap} />}
        {tab === 'profile' && <Profile profile={profile} saveProfile={saveProfile} collection={collection} onReset={resetCollection} />}
      </main>

      <nav className="bottom-nav">
        {TABS.map(t => (
          <button key={t.id} className={`nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
            {t.id === 'dupes' && stats.duplicates > 0 && (
              <span className="nav-badge">{stats.duplicates}</span>
            )}
          </button>
        ))}
      </nav>

      {modal && (
        <StickerModal
          sticker={modal}
          count={getCount(modal.key)}
          onAdd={() => addSticker(modal.key)}
          onRemove={() => removeSticker(modal.key)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
