import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'modules/shared/store/hooks';
import { clearToast } from 'modules/shared/store/slices/uiSlice';
import './Toast.scss';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const Toast = () => {
  const dispatch = useAppDispatch();
  const { toastMessage, toastType } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => dispatch(clearToast()), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);

  if (!toastMessage || !toastType) return null;

  const Icon = ICONS[toastType];

  return (
    <div className={`toast toast--${toastType}`}>
      <Icon size={20} className="toast__icon" />
      <span className="toast__message">{toastMessage}</span>
      <button className="toast__close" onClick={() => dispatch(clearToast())} aria-label="Cerrar">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
