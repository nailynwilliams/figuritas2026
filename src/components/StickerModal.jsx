import { useEffect } from 'react';

export default function StickerModal({ sticker, count, onAdd, onRemove, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!sticker) return null;

  const status = count === 0 ? 'missing' : count === 1 ? 'owned' : 'duplicate';
  const statusLabel = { missing: 'Me falta', owned: 'La tengo', duplicate: `Repetida ×${count}` };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-flag">{sticker.flag || '🌍'}</div>
        <div className="modal-code">{sticker.key || `${sticker.teamCode}${sticker.num}`}</div>
        <div className="modal-label">{sticker.label}</div>
        <div className="modal-team">{sticker.teamName}</div>
        {sticker.group && <div className="modal-group">Grupo {sticker.group}</div>}

        <div className={`modal-status status-${status}`}>{statusLabel[status]}</div>

        <div className="modal-actions">
          <button className="btn-remove" onClick={onRemove} disabled={count === 0}>−</button>
          <span className="modal-count">{count}</span>
          <button className="btn-add" onClick={onAdd}>+</button>
        </div>

        <p className="modal-hint">Toca + para agregar, − para quitar</p>
      </div>
    </div>
  );
}
