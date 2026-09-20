import { useEffect } from 'react';

/** Keeps the browser tab title in sync with the page being shown. */
export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;   // restore on unmount
    };
  }, [title]);
}
