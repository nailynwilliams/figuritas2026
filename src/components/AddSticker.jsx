import { useState } from 'react';
import { STICKER_MAP } from '../data/album';
import Tesseract from 'tesseract.js';

const MODES = { manual: 'manual', scan: 'scan' };

function parseCode(raw) {
  const match = raw.toUpperCase().match(/[A-Z]{2,4}\d{1,3}/);
  return match ? match[0] : null;
}

async function openNativeCamera() {
  // Capacitor native camera
  try {
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
    const photo = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      allowEditing: false,
    });
    return photo.dataUrl;
  } catch {
    return null;
  }
}

async function openBrowserCamera() {
  // Fallback: file input (works on browser/iOS)
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
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

async function getPhoto() {
  // Try native Capacitor first, fall back to file input
  const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
  if (isCapacitor) {
    return openNativeCamera();
  }
  return openBrowserCamera();
}

export default function AddSticker({ onAdd }) {
  const [mode, setMode] = useState(MODES.manual);
  const [input, setInput] = useState('');
  const [ocrStatus, setOcrStatus] = useState('');
  const [lastAdded, setLastAdded] = useState(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const code = parseCode(input);
    if (!code) { setError('Código inválido. Ejemplo: BRA14'); return; }
    if (!STICKER_MAP[code]) { setError(`No existe la figurita "${code}"`); return; }
    const result = onAdd(code);
    if (result.success) { setLastAdded(result.sticker); setError(''); setInput(''); }
  };

  const handleScan = async () => {
    setScanning(true);
    setOcrStatus('Abriendo cámara…');
    setError('');

    const dataUrl = await getPhoto();
    if (!dataUrl) {
      setOcrStatus('');
      setScanning(false);
      return;
    }

    setOcrStatus('Leyendo código…');
    try {
      const { data } = await Tesseract.recognize(dataUrl, 'eng', { logger: () => {} });
      const code = parseCode(data.text);
      if (code && STICKER_MAP[code]) {
        setOcrStatus(`✅ Detectado: ${code}`);
        const result = onAdd(code);
        if (result.success) setLastAdded(result.sticker);
      } else {
        setOcrStatus('No detecté código. Intentá de nuevo con mejor luz.');
      }
    } catch {
      setOcrStatus('Error al leer. Intentá de nuevo.');
    }
    setScanning(false);
  };

  return (
    <div className="add-page">
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === MODES.manual ? 'active' : ''}`} onClick={() => setMode(MODES.manual)}>
          ✏️ Manual
        </button>
        <button className={`mode-tab ${mode === MODES.scan ? 'active' : ''}`} onClick={() => setMode(MODES.scan)}>
          📷 Escanear
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
            <button className="btn-primary" onClick={handleScan} disabled={scanning}>
              {scanning ? 'Procesando…' : 'Abrir cámara'}
            </button>
            {ocrStatus && <p className="ocr-status">{ocrStatus}</p>}
            {error && <p className="add-error">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
