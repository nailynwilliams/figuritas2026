import { useState, useRef, useEffect, useCallback } from 'react';
import { STICKER_MAP } from '../data/album';
import Tesseract from 'tesseract.js';

const MODES = { manual: 'manual', scan: 'scan' };

function parseCode(raw) {
  // Handles: FWC00, FWC1-FWC19, CUW01-CUW20, JPN01-JPN20, MEX1-MEX20 etc.
  const match = raw.toUpperCase().match(/[A-Z]{2,4}\d{1,3}/);
  return match ? match[0] : null;
}

export default function AddSticker({ onAdd }) {
  const [mode, setMode] = useState(MODES.manual);
  const [input, setInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [lastAdded, setLastAdded] = useState(null);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // --- Manual mode ---
  const handleManualSubmit = (e) => {
    e.preventDefault();
    const code = parseCode(input);
    if (!code) {
      setError('Código inválido. Ejemplo: BRA14');
      return;
    }
    if (!STICKER_MAP[code]) {
      setError(`No existe la figurita "${code}"`);
      return;
    }
    const result = onAdd(code);
    if (result.success) {
      setLastAdded(result.sticker);
      setError('');
      setInput('');
    }
  };

  // --- Scanner mode ---
  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 },
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
      setScanning(true);
      setOcrStatus('Apuntá la cámara al código de la figurita');
    } catch {
      setError('No se pudo acceder a la cámara. Activá los permisos.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);
    setScanning(false);
    setOcrStatus('');
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [stream]);

  const captureAndOCR = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    setOcrStatus('Leyendo código…');
    try {
      const { data } = await Tesseract.recognize(canvas, 'eng', {
        logger: () => {},
      });
      const code = parseCode(data.text);
      if (code && STICKER_MAP[code]) {
        setOcrStatus(`✅ Detectado: ${code}`);
        const result = onAdd(code);
        if (result.success) {
          setLastAdded(result.sticker);
          stopCamera();
        }
      } else {
        setOcrStatus('No detecté código. Acercá más la cámara al texto del dorso.');
      }
    } catch {
      setOcrStatus('Error al leer. Intentá de nuevo.');
    }
  }, [onAdd, stopCamera]);

  useEffect(() => {
    if (scanning) {
      intervalRef.current = setInterval(captureAndOCR, 2500);
    }
    return () => clearInterval(intervalRef.current);
  }, [scanning, captureAndOCR]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      clearInterval(intervalRef.current);
    };
  }, [stream]);

  useEffect(() => {
    if (mode === MODES.manual) stopCamera();
  }, [mode]); // eslint-disable-line

  return (
    <div className="add-page">
      <div className="mode-tabs">
        <button
          className={`mode-tab ${mode === MODES.manual ? 'active' : ''}`}
          onClick={() => setMode(MODES.manual)}
        >
          ✏️ Manual
        </button>
        <button
          className={`mode-tab ${mode === MODES.scan ? 'active' : ''}`}
          onClick={() => setMode(MODES.scan)}
        >
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
          {!scanning ? (
            <div className="scan-start">
              <div className="scan-icon">📷</div>
              <p>Apuntá la cámara al <strong>dorso</strong> de la figurita donde está el código (ej: BRA14)</p>
              <button className="btn-primary" onClick={startCamera}>
                Abrir cámara
              </button>
              {error && <p className="add-error">{error}</p>}
            </div>
          ) : (
            <div className="scan-active">
              <div className="video-wrap">
                <video ref={videoRef} className="scan-video" playsInline muted autoPlay />
                <div className="scan-overlay">
                  <div className="scan-frame" />
                </div>
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <p className="ocr-status">{ocrStatus}</p>
              <button className="btn-secondary" onClick={stopCamera}>Cancelar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
