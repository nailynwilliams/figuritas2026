import { useState } from 'react';
import { STICKER_MAP } from '../data/album';
import Tesseract from 'tesseract.js';

const MODES = { manual: 'manual', scan: 'scan', page: 'page' };

function parseCode(raw) {
  const match = raw.toUpperCase().match(/[A-Z]{2,4}\d{1,3}/);
  return match ? match[0] : null;
}

async function getPhoto(capture = 'environment') {
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
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = capture;
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

export default function AddSticker({ onAdd }) {
  const [mode, setMode] = useState(MODES.manual);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const [lastAdded, setLastAdded] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [pageResults, setPageResults] = useState(null);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const code = parseCode(input);
    if (!code) { setError('Código inválido. Ejemplo: BRA14'); return; }
    if (!STICKER_MAP[code]) { setError(`No existe la figurita "${code}"`); return; }
    const result = onAdd(code);
    if (result.success) { setLastAdded(result.sticker); setError(''); setInput(''); }
  };

  // Scan back of single sticker via OCR
  const handleScanBack = async () => {
    setBusy(true);
    setStatus('Abriendo cámara…');
    setError('');
    const dataUrl = await getPhoto('environment');
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

  // Scan album page via Claude Vision AI
  const handleScanPage = async () => {
    setBusy(true);
    setStatus('Abriendo cámara…');
    setError('');
    setPageResults(null);
    const dataUrl = await getPhoto('environment');
    if (!dataUrl) { setStatus(''); setBusy(false); return; }
    setStatus('Analizando página con IA… (puede tardar ~10 seg)');
    try {
      const res = await fetch('/api/scan-page', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      });
      const { owned, empty, error: apiErr } = await res.json();
      if (apiErr) throw new Error(apiErr);
      if (!owned || owned.length === 0) {
        setStatus('No detecté ninguna página de equipo. Intentá con más luz y la página bien encuadrada.');
      } else {
        // Add all owned stickers (only increments if not already owned)
        let added = 0;
        owned.forEach(c => { if (STICKER_MAP[c] && onAdd(c).success) added++; });
        setPageResults({ owned, empty: empty || [], added });
        setStatus('');
      }
    } catch (e) {
      setStatus('Error de IA: ' + e.message);
    }
    setBusy(false);
  };

  return (
    <div className="add-page">
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === MODES.manual ? 'active' : ''}`} onClick={() => { setMode(MODES.manual); setStatus(''); setPageResults(null); }}>
          ✏️ Manual
        </button>
        <button className={`mode-tab ${mode === MODES.scan ? 'active' : ''}`} onClick={() => { setMode(MODES.scan); setStatus(''); setPageResults(null); }}>
          📷 Dorso
        </button>
        <button className={`mode-tab ${mode === MODES.page ? 'active' : ''}`} onClick={() => { setMode(MODES.page); setStatus(''); setPageResults(null); }}>
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
            <input
              className="code-input"
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              placeholder="BRA14"
              autoFocus
              maxLength={8}
              autoComplete="off"
              autoCapitalize="characters"
            />
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
            <p>Sacá una foto al <strong>dorso</strong> de la figurita donde está el código (ej: BRA14)</p>
            <button className="btn-primary" onClick={handleScanBack} disabled={busy}>
              {busy ? 'Procesando…' : 'Abrir cámara'}
            </button>
            {status && <p className="ocr-status">{status}</p>}
          </div>
        </div>
      )}

      {mode === MODES.page && (
        <div className="scan-mode">
          <div className="scan-start">
            <div className="scan-icon">📖</div>
            <p>Sacá una foto de una <strong>página del álbum</strong>. La IA detecta todas las figuritas pegadas y las marca automáticamente.</p>
            <button className="btn-primary" onClick={handleScanPage} disabled={busy}>
              {busy ? 'Analizando…' : 'Fotografiar página'}
            </button>
            {status && <p className="ocr-status">{status}</p>}
            {pageResults && (
              <div className="page-results">
                <p className="page-results-title">✅ {pageResults.added} figuritas marcadas</p>
                {pageResults.empty.length > 0 && (
                  <p className="page-results-skip">📭 Faltan: {pageResults.empty.join(', ')}</p>
                )}
                {pageResults.empty.length === 0 && (
                  <p className="page-results-codes">¡Página completa!</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
