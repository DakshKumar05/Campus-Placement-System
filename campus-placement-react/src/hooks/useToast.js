import { useDebugValue } from 'react';
import { useToastContext } from '../context/ToastContext.jsx';

/** Components that only need to raise a toast use this instead of the
    full context value. */
export function useToast() {
  const { toasts, showToast } = useToastContext();
  useDebugValue(toasts.length + ' toast(s) on screen');
  return showToast;
}
