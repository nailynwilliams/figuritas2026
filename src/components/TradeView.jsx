import { useState, useEffect } from 'react';
import { STICKER_MAP } from '../data/album';

// Shown when someone scans your QR — they see your duplicates and select what they want
export default function TradeView({ tradeData, onClose }) {
  const [selected, setSelected] = useState({});
  const [sent, setSent] = useState(false);

  const dupes = (tradeData.duplicates || [])
    .filter(k => STICKER_MAP[k])
    .map(k => STICKER_MAP[k]);

  const toggle = (key) => {
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedList = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);

  const handleRequest = () => {
    // In a full app with Firebase this would send a real-time notification
    // For now we show a summary and copy to clipboard
    const text = `Hola ${tradeData.name}! Quiero cambiar: ${selectedList.join(', ')}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    setSent(true);
  };

  if (sent) {
    return (
      <div className="trade-page">
        <div className="trade-sent">
          <div className="sent-icon">✅</div>
          <h2>¡Listo!</h2>
          <p>Pedido enviado a <strong>{tradeData.name}</strong></p>
          <p className="sent-list">Pediste: {selectedList.join(', ')}</p>
          <p className="sent-note">El texto fue copiado al portapapeles para que lo mandes por WhatsApp o el medio que prefieras.</p>
          <button className="btn-primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    );
  }

  if (dupes.length === 0) {
    return (
      <div className="trade-page">
        <div className="empty-state">
          <div className="empty-icon">😕</div>
          <p><strong>{tradeData.name}</strong> no tiene figuritas repetidas para dar</p>
          <button className="btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    );
  }

  // Group by team
  const byTeam = {};
  for (const s of dupes) {
    if (!byTeam[s.teamCode]) byTeam[s.teamCode] = [];
    byTeam[s.teamCode].push(s);
  }

  return (
    <div className="trade-page">
      <div className="trade-header">
        <button className="link-btn" onClick={onClose}>← Volver</button>
        <h2>Repetidas de <strong>{tradeData.name}</strong></h2>
        <p>Seleccioná las que querés</p>
      </div>

      <div className="trade-list">
        {Object.entries(byTeam).map(([teamCode, stickers]) => (
          <div key={teamCode} className="dupe-team">
            <div className="dupe-team-header">
              <span>{stickers[0].flag}</span>
              <span>{stickers[0].teamName}</span>
            </div>
            <div className="dupe-list">
              {stickers.map(s => (
                <button
                  key={s.key}
                  className={`dupe-item ${selected[s.key] ? 'selected' : ''}`}
                  onClick={() => toggle(s.key)}
                >
                  <span className="dupe-code">{s.key}</span>
                  <span className="dupe-label">{s.label}</span>
                  {selected[s.key] && <span className="dupe-badge">✓</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedList.length > 0 && (
        <div className="trade-footer">
          <span>{selectedList.length} seleccionada{selectedList.length > 1 ? 's' : ''}</span>
          <button className="btn-primary" onClick={handleRequest}>
            Pedir cambio
          </button>
        </div>
      )}
    </div>
  );
}
