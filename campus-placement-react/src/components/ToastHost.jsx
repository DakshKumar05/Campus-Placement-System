import { createPortal } from 'react-dom';
import { useToastContext } from '../context/ToastContext.jsx';

/* Renders the toast stack into document.body so no panel can clip it. */

export default function ToastHost() {
  const { toasts, dismissToast } = useToastContext();

  return createPortal(
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={'toast toast-' + toast.type}
          onClick={() => dismissToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>,
    document.body
  );
}
