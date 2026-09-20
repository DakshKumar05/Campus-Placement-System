import { useEffect, useRef, useState } from 'react';

/**
 * Reports whether the element the returned ref is attached to has been
 * scrolled into view. The ref is a plain DOM ref; the effect sets up the
 * observer and disconnects it on cleanup.
 */
export function useIntersectionObserver(threshold = 0.2) {
  const ref = useRef(null);            // attached to a DOM node by the caller
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);              // fallback for older browsers
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();     // animate once only
          }
        });
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}
