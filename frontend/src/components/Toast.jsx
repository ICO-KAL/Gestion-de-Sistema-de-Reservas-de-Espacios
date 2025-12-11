import React from 'react';
import '../styles/Toast.css';

/**
 * Componente Toast - Notificaciones
 */
export const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'success' && <span className="toast-icon">✓</span>}
        {type === 'error' && <span className="toast-icon">✕</span>}
        {type === 'warning' && <span className="toast-icon">⚠</span>}
        {type === 'info' && <span className="toast-icon">ℹ</span>}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

/**
 * Hook para manejar notificaciones
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = React.useState([]);

  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = Math.random();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return { notifications, showNotification, removeNotification };
};
