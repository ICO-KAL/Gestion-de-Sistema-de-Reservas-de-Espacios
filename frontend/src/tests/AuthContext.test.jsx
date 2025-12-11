import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Test del contexto de autenticación
describe('AuthContext', () => {
  it('proporciona métodos de autenticación', () => {
    let authValue = null;

    function TestComponent() {
      authValue = useAuth();
      return <div>Test</div>;
    }

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(authValue).toBeDefined();
    expect(authValue.login).toBeDefined();
    expect(authValue.logout).toBeDefined();
    expect(authValue.register).toBeDefined();
  });

  it('inicia sin usuario autenticado', () => {
    let authValue = null;

    function TestComponent() {
      authValue = useAuth();
      return <div>{authValue.isAuthenticated ? 'Auth' : 'No Auth'}</div>;
    }

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('No Auth')).toBeDefined();
    expect(authValue.isAuthenticated).toBe(false);
  });

  it('maneja logout correctamente', () => {
    let authValue = null;

    function TestComponent() {
      authValue = useAuth();
      return (
        <button onClick={() => authValue.logout()}>
          Logout
        </button>
      );
    }

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(authValue.isAuthenticated).toBe(false);
    expect(authValue.token).toBeNull();
  });
});
