import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

/**
 * Componente Navbar - Navegación principal
 */
export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="material-icons logo-icon">event_note</span>
          SpaceBooker
        </Link>

        {isAuthenticated && (
          <div className="navbar-menu">
            <div className="navbar-links">
              <Link to="/" className="nav-link">
                <span className="material-icons">home</span>
                Inicio
              </Link>
              <Link to="/espacios" className="nav-link">
                <span className="material-icons">business</span>
                Espacios
              </Link>
              <Link to="/calendario" className="nav-link">
                <span className="material-icons">calendar_month</span>
                Calendario
              </Link>
              <Link to="/mis-reservas" className="nav-link">
                <span className="material-icons">calendar_today</span>
                Mis Reservas
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link admin">
                  <span className="material-icons">admin_panel_settings</span>
                  Panel Admin
                </Link>
              )}
            </div>

            <div className="navbar-user">
              <span className="user-icon material-icons">account_circle</span>
              <span className="user-name">
                {user?.nombre || 'Usuario'}
              </span>
              <Link to="/perfil" className="nav-link perfil">
                <span className="material-icons">edit</span>
                Perfil
              </Link>
              <button
                className="btn-logout"
                onClick={handleLogout}
              >
                <span className="material-icons">logout</span>
                Salir
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
