import React from 'react';
import '../styles/Loading.css';

/**
 * Componente Loading - Indicador de carga
 */
export const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando...</p>
    </div>
  );
};

/**
 * Componente para mostrar errores
 */
export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Error</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn-retry" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
};

/**
 * Componente para pantalla vacía
 */
export const EmptyState = ({ title, message, icon = '📭' }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
};
