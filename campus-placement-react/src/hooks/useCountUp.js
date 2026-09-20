import { useDebugValue, useEffect, useRef, useState } from 'react';

const EASE_OUT_CUBIC = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Animates a number from 0 up to `target` once `active` becomes true.
 * The value lives in state, so React writes the text — the hook never
 * touches the DOM. The frame id is kept in a ref so the effect can
 * cancel it on cleanup.
 */
export function useCountUp(target, { duration = 1200, decimals = 0, active = true } = {}) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(0);

  useDebugValue(active ? 'animating to ' + target : 'waiting');

  useEffect(() => {
    if (!active) return;

    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(target * EASE_OUT_CUBIC(progress));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    }

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, active]);

  return decimals > 0 ? value.toFixed(decimals) : String(Math.floor(value));
}
