import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { STICKER_MAP } from '../data/album';

export default function Profile({ profile, saveProfile, collection, onReset }) {
  const [editing, setEditing] = useState(!profile.name);
  const [confirmReset, setConfirmReset] = useState(false);
  const [name, setName] = useState(profile.name || '');
  const [qrUrl, setQrUrl] = useState('');

  const dupeCount = Object.entries(collection)
    .filter(([k, c]) => STICKER_MAP[k] && c > 1).length;

  const profileData = {
    id: profile.id,
    name: profile.name,
    duplicates: Object.entries(collection)
      .filter(([k, c]) => STICKER_MAP[k] && c > 1)
      .map(([k]) => k),
  };

  useEffect(() => {
    const url = `${window.location.origin}?trade=${encodeURIComponent(JSON.stringify(profileData))}`;
    QRCode.toDataURL(url, { width: 220, margin: 2, color: { dark: '#1e293b', light: '#f8fafc' } })
      .then(setQrUrl)
      .catch(() => {});
  }, [collection, profile.name]); // eslint-disable-line

  const handleSave = () => {
    if (!name.trim()) return;
    saveProfile({ name: name.trim() });
    setEditing(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}?trade=${encodeURIComponent(JSON.stringify(profileData))}`;
    if (navigator.share) {
      await navigator.share({ title: `Figuritas de ${profile.name}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('¡Link copiado al portapapeles!');
    }
  };

  const ResetBlock = () => (
    <div className="reset-section">
      {!confirmReset ? (
        <button className="btn-reset" onClick={() => setConfirmReset(true)}>
          🗑️ Reiniciar álbum
        </button>
      ) : (
        <div className="reset-confirm">
          <p>¿Segura? Se borran <strong>todas</strong> las figuritas marcadas.</p>
          <div className="reset-confirm-btns">
            <button className="btn-reset-confirm" onClick={() => { onReset(); setConfirmReset(false); }}>
              Sí, borrar todo
            </button>
            <button className="btn-secondary" onClick={() => setConfirmReset(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-page">
      {editing ? (
        <div className="profile-edit">
          <h2>¿Cómo te llamás?</h2>
          <input
            className="code-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tu nombre"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <button className="btn-primary" onClick={handleSave} disabled={!name.trim()}>
            Guardar
          </button>
          <ResetBlock />
        </div>
      ) : (
        <>
          <div className="profile-header">
            <div className="profile-avatar">{profile.name?.[0]?.toUpperCase() || '?'}</div>
            <div>
              <h2 className="profile-name">{profile.name}</h2>
              <button className="link-btn" onClick={() => setEditing(true)}>Editar nombre</button>
            </div>
          </div>

          <div className="profile-stats-row">
            <div className="profile-stat">
              <span>{dupeCount}</span>
              <label>Repetidas para dar</label>
            </div>
          </div>

          <div className="qr-section">
            <p className="qr-hint">Mostrá este QR para que alguien pueda ver tus repetidas y pedirte un cambio</p>
            {qrUrl && <img src={qrUrl} alt="QR perfil" className="qr-image" />}
            <button className="btn-secondary" onClick={handleShare}>
              Compartir mi perfil
            </button>
          </div>

          <ResetBlock />
        </>
      )}
    </div>
  );
}
