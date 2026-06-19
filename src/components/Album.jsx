import { useState } from 'react';
import { TEAMS, ORDER, stickerKey } from '../data/album';

const STATUS_ICON = { owned: '✅', duplicate: '🔄', missing: '' };
const STATUS_CLASS = { owned: 'owned', duplicate: 'duplicate', missing: 'missing' };

function StickerCard({ sticker, status, count, onTap }) {
  return (
    <button
      className={`sticker-card ${STATUS_CLASS[status]}`}
      onClick={() => onTap(sticker)}
      title={sticker.label}
    >
      <span className="sticker-num">{sticker.key}</span>
      {status !== 'missing' && (
        <span className="sticker-status-icon">{STATUS_ICON[status]}</span>
      )}
      {count > 1 && <span className="sticker-count">×{count}</span>}
    </button>
  );
}

function TeamSection({ code, team, getStatus, getCount, onStickerTap }) {
  const [open, setOpen] = useState(true);
  const owned = team.stickers.filter(s => getStatus(stickerKey(code, s.num)) !== 'missing').length;
  const total = team.stickers.length;
  const pct = Math.round((owned / total) * 100);

  return (
    <div className="team-section">
      <button className="team-header" onClick={() => setOpen(o => !o)}>
        <div className="team-header-left">
          <span className="team-flag">{team.flag}</span>
          <span className="team-name">{team.name}</span>
        </div>
        <div className="team-header-right">
          <span className="team-progress">{owned}/{total}</span>
          <div className="team-mini-bar">
            <div className="team-mini-fill" style={{ width: `${pct}%`, backgroundColor: team.color }} />
          </div>
          <span className="team-chevron">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="stickers-grid">
          {team.stickers.map(s => {
            const key = stickerKey(code, s.num);
            return (
              <StickerCard
                key={key}
                sticker={{ ...s, teamCode: code, key }}
                status={getStatus(key)}
                count={getCount(key)}
                onTap={onStickerTap}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Album({ getStatus, getCount, onStickerTap, filter }) {
  const [search, setSearch] = useState('');

  const filtered = ORDER.filter(code => {
    const team = TEAMS[code];
    if (!team) return false;
    if (search && !team.name.toLowerCase().includes(search.toLowerCase()) && !code.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'missing') {
      return team.stickers.some(s => getStatus(`${code}${s.num}`) === 'missing');
    }
    if (filter === 'duplicate') {
      return team.stickers.some(s => getStatus(`${code}${s.num}`) === 'duplicate');
    }
    return true;
  });

  return (
    <div className="album-page">
      <div className="album-search-wrap">
        <input
          className="album-search"
          placeholder="Buscar selección…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="album-list">
        {filtered.map(code => (
          <TeamSection
            key={code}
            code={code}
            team={TEAMS[code]}
            getStatus={getStatus}
            getCount={getCount}
            onStickerTap={onStickerTap}
          />
        ))}
      </div>
    </div>
  );
}
