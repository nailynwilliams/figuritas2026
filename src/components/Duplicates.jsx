import { STICKER_MAP } from '../data/album';

export default function Duplicates({ collection, onStickerTap }) {
  const dupes = Object.entries(collection)
    .filter(([k, c]) => STICKER_MAP[k] && c > 1)
    .map(([k, c]) => ({ ...STICKER_MAP[k], count: c, extra: c - 1 }))
    .sort((a, b) => a.teamName.localeCompare(b.teamName));

  if (dupes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔄</div>
        <p>No tenés figuritas repetidas todavía</p>
        <span>Cuando tengas repetidas aparecerán acá para cambiar</span>
      </div>
    );
  }

  // Group by team
  const byTeam = {};
  for (const d of dupes) {
    if (!byTeam[d.teamCode]) byTeam[d.teamCode] = [];
    byTeam[d.teamCode].push(d);
  }

  return (
    <div className="duplicates-page">
      <div className="dupes-summary">
        <strong>{dupes.reduce((s, d) => s + d.extra, 0)}</strong> figuritas repetidas listas para cambiar
      </div>
      {Object.entries(byTeam).map(([teamCode, stickers]) => (
        <div key={teamCode} className="dupe-team">
          <div className="dupe-team-header">
            <span>{stickers[0].flag}</span>
            <span>{stickers[0].teamName}</span>
          </div>
          <div className="dupe-list">
            {stickers.map(s => (
              <button key={s.key} className="dupe-item" onClick={() => onStickerTap(s)}>
                <span className="dupe-code">{s.key}</span>
                <span className="dupe-label">{s.label}</span>
                <span className="dupe-badge">×{s.count}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
