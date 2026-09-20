import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

/* Replaces the showToast() helper of the HTML build. The queue is state;
   the ids and the pending timers are refs, because changing them must not
   cause a re-render. */

const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 3000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const nextId = useRef(0);            // counter that survives re-renders
  const timers = useRef([]);           // every pending setTimeout handle

  function dismissToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function showToast(message, type = 'info') {
    const id = nextId.current;
    nextId.current = id + 1;

    setToasts((current) => [...current, { id, message, type }]);

    const timer = setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
    timers.current.push(timer);
  }

  // Clear any timer still pending when the provider unmounts.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  const value = useMemo(() => ({ toasts, showToast, dismissToast }), [toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used inside <ToastProvider>');
  }
  return context;
}
