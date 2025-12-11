import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast, useNotifications } from '../components/Toast';

describe('Toast Component', () => {
  it('renderiza el toast correctamente', () => {
    const handleClose = () => {};
    render(
      <Toast
        message="Test message"
        type="success"
        onClose={handleClose}
      />
    );

    expect(screen.getByText('Test message')).toBeDefined();
  });

  it('muestra el icono correcto según el tipo', () => {
    const handleClose = () => {};
    const { rerender } = render(
      <Toast message="Test" type="success" onClose={handleClose} />
    );

    let successIcon = screen.getByText('✓');
    expect(successIcon).toBeDefined();

    rerender(
      <Toast message="Test" type="error" onClose={handleClose} />
    );

    let errorIcon = screen.getByText('✕');
    expect(errorIcon).toBeDefined();
  });

  it('llama a onClose cuando se hace clic en el botón de cerrar', () => {
    const handleClose = vi.fn();
    render(
      <Toast message="Test" type="info" onClose={handleClose} />
    );

    const closeBtn = screen.getByText('×');
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalled();
  });
});

describe('useNotifications Hook', () => {
  it('proporciona métodos para mostrar y eliminar notificaciones', () => {
    let notifications = null;
    let showNotification = null;
    let removeNotification = null;

    function TestComponent() {
      const hook = useNotifications();
      notifications = hook.notifications;
      showNotification = hook.showNotification;
      removeNotification = hook.removeNotification;
      return <div />;
    }

    render(<TestComponent />);

    expect(showNotification).toBeDefined();
    expect(removeNotification).toBeDefined();
    expect(notifications).toBeDefined();
    expect(Array.isArray(notifications)).toBe(true);
  });
});
