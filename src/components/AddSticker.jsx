import { useState } from 'react';
import { TEAMS, ORDER, STICKER_MAP, stickerKey } from '../data/album';
import Tesseract from 'tesseract.js';

const MODES = { manual: 'manual', scan: 'scan', page: 'page' };

function parseCode(raw) {
  const match = raw.toUpperCase().match(/[A-Z]{2,4}\d{1,3}/);
  return match ? match[0] : null;
}

// Derive team code from a sticker code like "MEX7" → "MEX"
function teamFromCode(code) {
  const m = code.match(/^([A-Z]{2,4})\d/);
  return m ? m[1] : null;
}

async function getPhoto() {
  const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
  if (isCapacitor) {
    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        allowEditing: false,
      });
      return photo.dataUrl;
    } catch { return null; }
  }
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.readAsDataURL(file);
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}

// Review screen: full team grid, tap to toggle missing/owned
function PageReview({ missing, onConfirm, onCancel }) {
  // Detect teams from missing codes
  const detectedTeams = [...new Set(missing.map(teamFromCode).filter(Boolean))].filter(t => TEAMS[t]);
  const [selectedTeam, setSelectedTeam] = useState(detectedTeams[0] || null);
  // missingSet = stickers the user says they DON'T have (red = missing)
  const [missingSet, setMissingSet] = useState(() => new Set(missing));

  const team = selectedTeam ? TEAMS[selectedTeam] : null;

  const toggle = (key) => {
    setMissingSet(prev => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key); else s.add(key);
      return s;
    });
  };

  const owned = team
    ? team.stickers.map(s => stickerKey(selectedTeam, s.num)).filter(k => !missingSet.has(k) && STICKER_MAP[k])
    : [];

  const ownedByTeam = selectedTeam ? { [selectedTeam]: owned } : {};

  // If no team was detected, show team picker from ORDER
  if (!selectedTeam) {
    return (
      <div className="page-review">
        <h3 className="review-title">¿Qué equipo es esta página?</h3>
        <p className="review-label">La IA no detectó el equipo. Seleccionalo:</p>
        <div className="review-team-grid">
          {ORDER.map(code => (
            <button key={code} className="review-team-btn" onClick={() => setSelectedTeam(code)}>
              <span>{TEAMS[code].flag}</span><span>{code}</span>
            </button>
          ))}
        </div>
        <button className="btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    );
  }

  return (
    <div className="page-review">
      <div className="review-header">
        <span className="review-team-flag">{team.flag}</span>
        <div>
          <h3 className="review-title">{team.name}</h3>
          <p className="review-label">Verde = tengo · Rojo = me falta · Tocá para cambiar</p>
        </div>
        <button className="review-change-team" onClick={() => setSelectedTeam(null)}>Cambiar</button>
      </div>

      <div className="review-grid">
        {team.stickers.map(s => {
          const key = stickerKey(selectedTeam, s.num);
          const isMissing = missingSet.has(key);
          return (
            <button
              key={key}
              className={`review-cell ${isMissing ? 'missing' : 'owned'}`}
              onClick={() => toggle(key)}
            >
              <span className="review-cell-num">{key}</span>
            </button>
          );
        })}
      </div>

      <div className="review-summary">
        ✅ <strong>{owned.length}</strong> tengo &nbsp;·&nbsp; 📭 <strong>{missingSet.size}</strong> me falta
      </div>

      <div className="review-actions">
        <button className="btn-primary" onClick={() => onConfirm(missingSet, ownedByTeam)} disabled={owned.length === 0}>
          Confirmar
        </button>
        <button className="btn-secondary" onClick={onCancel}>Volver a escanear</button>
      </div>
    </div>
  );
}

export default function AddSticker({ onAdd }) {
  const [mode, setMode] = useState(MODES.manual);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const [lastAdded, setLastAdded] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState(null); // { missing: [] }
  const [done, setDone] = useState(null);     // { added, missing }

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const code = parseCode(input);
    if (!code) { setError('Código inválido. Ejemplo: BRA14'); return; }
    if (!STICKER_MAP[code]) { setError(`No existe la figurita "${code}"`); return; }
    const result = onAdd(code);
    if (result.success) { setLastAdded(result.sticker); setError(''); setInput(''); }
  };

  const handleScanBack = async () => {
    setBusy(true); setStatus('Abriendo cámara…'); setError('');
    const dataUrl = await getPhoto();
    if (!dataUrl) { setStatus(''); setBusy(false); return; }
    setStatus('Leyendo código…');
    try {
      const { data } = await Tesseract.recognize(dataUrl, 'eng', { logger: () => {} });
      const code = parseCode(data.text);
      if (code && STICKER_MAP[code]) {
        setStatus(`✅ Detectado: ${code}`);
        const result = onAdd(code);
        if (result.success) setLastAdded(result.sticker);
      } else {
        setStatus('No detecté código. Intentá con mejor luz o más cerca.');
      }
    } catch { setStatus('Error al leer. Intentá de nuevo.'); }
    setBusy(false);
  };

  const handleScanPage = async () => {
    setBusy(true); setStatus('Abriendo cámara…'); setError(''); setReview(null); setDone(null);
    const dataUrl = await getPhoto();
    if (!dataUrl) { setStatus(''); setBusy(false); return; }
    setStatus('Analizando con IA… (~10 seg)');
    try {
      const res = await fetch('/api/scan-page', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      });
      const { missing, error: apiErr } = await res.json();
      if (apiErr) throw new Error(apiErr);
      setStatus('');
      setReview({ missing: missing || [] });
    } catch (e) {
      setStatus('Error: ' + e.message);
    }
    setBusy(false);
  };

  const handleConfirm = (missingSet, ownedByTeam) => {
    let added = 0;
    Object.values(ownedByTeam).flat().forEach(k => { if (onAdd(k).success) added++; });
    setDone({ added, missing: [...missingSet] });
    setReview(null);
  };

  const resetPage = () => { setReview(null); setDone(null); setStatus(''); };

  return (
    <div className="add-page">
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === MODES.manual ? 'active' : ''}`} onClick={() => { setMode(MODES.manual); resetPage(); }}>
          ✏️ Manual
        </button>
        <button className={`mode-tab ${mode === MODES.scan ? 'active' : ''}`} onClick={() => { setMode(MODES.scan); resetPage(); }}>
          📷 Dorso
        </button>
        <button className={`mode-tab ${mode === MODES.page ? 'active' : ''}`} onClick={() => { setMode(MODES.page); resetPage(); }}>
          📖 Página
        </button>
      </div>

      {lastAdded && (
        <div className="added-banner">
          <span>{lastAdded.flag} ¡Agregada! <strong>{lastAdded.teamName} #{lastAdded.num}</strong> — {lastAdded.label}</span>
          <button onClick={() => setLastAdded(null)}>✕</button>
        </div>
      )}

      {mode === MODES.manual && (
        <div className="manual-mode">
          <p className="add-hint">Escribí el código del dorso de la figurita<br /><span>Ejemplo: <strong>BRA14</strong>, <strong>ARG3</strong>, <strong>MEX11</strong></span></p>
          <form onSubmit={handleManualSubmit} className="manual-form">
            <input className="code-input" value={input} onChange={e => { setInput(e.target.value); setError(''); }}
              placeholder="BRA14" autoFocus maxLength={8} autoComplete="off" autoCapitalize="characters" />
            <button type="submit" className="btn-primary">Agregar</button>
          </form>
          {error && <p className="add-error">{error}</p>}
          <div className="quick-hint">
            <p>Cómo leer el código:</p>
            <div className="sticker-example">
              <div className="ex-back">DORSO<br /><strong>BRA 14</strong></div>
              <span>→</span>
              <div className="ex-code">Escribís: <strong>BRA14</strong></div>
            </div>
          </div>
        </div>
      )}

      {mode === MODES.scan && (
        <div className="scan-mode">
          <div className="scan-start">
            <div className="scan-icon">📷</div>
            <p>Sacá una foto al <strong>dorso</strong> de la figurita donde está el código</p>
            <button className="btn-primary" onClick={handleScanBack} disabled={busy}>
              {busy ? 'Procesando…' : 'Abrir cámara'}
            </button>
            {status && <p className="ocr-status">{status}</p>}
          </div>
        </div>
      )}

      {mode === MODES.page && (
        <div className="scan-mode">
          {!review && !done && (
            <div className="scan-start">
              <div className="scan-icon">📖</div>
              <p>Sacá foto a una <strong>página del álbum</strong>. La IA detecta las casillas vacías y vos confirmás antes de marcar.</p>
              <button className="btn-primary" onClick={handleScanPage} disabled={busy}>
                {busy ? 'Analizando…' : 'Fotografiar página'}
              </button>
              {status && <p className="ocr-status">{status}</p>}
            </div>
          )}

          {review && (
            <PageReview
              missing={review.missing}
              onConfirm={handleConfirm}
              onCancel={resetPage}
            />
          )}

          {done && (
            <div className="scan-start">
              <div className="scan-icon">✅</div>
              <p><strong>{done.added}</strong> figuritas marcadas como tengo.</p>
              {done.missing.length > 0 && (
                <p className="ocr-status">📭 Faltan: {done.missing.join(', ')}</p>
              )}
              <button className="btn-primary" onClick={resetPage}>Escanear otra página</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
