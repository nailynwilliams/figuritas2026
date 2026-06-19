import { useState, useEffect, useCallback } from 'react';
import { STICKER_MAP } from '../data/album';

// FWC00 es el único caso especial: si el usuario escribe "FWC0" lo resolvemos
function resolveKey(raw) {
  const k = raw.toUpperCase().trim();
  if (k === 'FWC0') return 'FWC00';
  return k;
}

const STORAGE_KEY = 'figuritas2026';
const PROFILE_KEY = 'figuritas2026_profile';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// state shape: { [stickerKey]: count }  e.g. { "BRA14": 2 }

export function useAlbum() {
  const [collection, setCollection] = useState(loadState);

  useEffect(() => {
    saveState(collection);
  }, [collection]);

  const addSticker = useCallback((key) => {
    const k = resolveKey(key);
    if (!STICKER_MAP[k]) return { success: false, error: `Figurita "${key.toUpperCase().trim()}" no encontrada` };
    setCollection(prev => ({ ...prev, [k]: (prev[k] || 0) + 1 }));
    return { success: true, sticker: STICKER_MAP[k], count: (collection[k] || 0) + 1 };
  }, [collection]);

  const removeSticker = useCallback((key) => {
    const k = key.toUpperCase().trim();
    setCollection(prev => {
      const next = { ...prev };
      if (!next[k] || next[k] <= 0) return prev;
      next[k] = next[k] - 1;
      if (next[k] === 0) delete next[k];
      return next;
    });
  }, []);

  const setCount = useCallback((key, count) => {
    const k = key.toUpperCase().trim();
    setCollection(prev => {
      const next = { ...prev };
      if (count <= 0) {
        delete next[k];
      } else {
        next[k] = count;
      }
      return next;
    });
  }, []);

  const getStatus = useCallback((key) => {
    const count = collection[key] || 0;
    if (count === 0) return 'missing';
    if (count === 1) return 'owned';
    return 'duplicate';
  }, [collection]);

  const getCount = useCallback((key) => collection[key] || 0, [collection]);

  const stats = (() => {
    const total = Object.keys(STICKER_MAP).length;
    const owned = Object.keys(collection).filter(k => STICKER_MAP[k]).length;
    const duplicates = Object.values(collection).reduce((sum, c) => sum + Math.max(0, c - 1), 0);
    const missing = total - owned;
    return { total, owned, missing, duplicates, percent: Math.round((owned / total) * 100) };
  })();

  return { collection, addSticker, removeSticker, setCount, getStatus, getCount, stats };
}

export function useProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { name: '', id: crypto.randomUUID() };
  });

  const saveProfile = (data) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  };

  return { profile, saveProfile };
}
