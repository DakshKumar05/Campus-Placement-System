import { useDebugValue, useEffect, useState } from 'react';

/**
 * State that is mirrored into localStorage, so it survives a page reload.
 * Returns the same [value, setValue] pair as useState.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    // Lazy initialiser: localStorage is read once, not on every render.
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initialValue : JSON.parse(stored);
    } catch {
      return initialValue;
    }
  });

  useDebugValue(key + ' = ' + JSON.stringify(value));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage blocked (private window) — the app still works */
    }
  }, [key, value]);

  return [value, setValue];
}
