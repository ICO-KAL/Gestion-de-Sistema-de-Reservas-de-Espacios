import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReservasProvider } from './context/ReservasContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminRegisterPage } from './pages/AdminRegisterPage';
import { HomePage } from './pages/HomePage';
import { EspaciosPage } from './pages/EspaciosPage';
import { MisReservasPage } from './pages/MisReservasPage';
import { PerfilPage } from './pages/PerfilPage';
import { AdminPanel } from './pages/AdminPanel';
import { CalendarioPage } from './pages/CalendarioPage';
import './styles/Global.css';

/**
 * Componente Principal - Ruteador de la aplicación
 */
function AppContent() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin-register" element={<AdminRegisterPage />} />

          {/* Rutas Protegidas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/espacios" element={<EspaciosPage />} />
          <Route path="/calendario" element={<CalendarioPage />} />
          <Route path="/mis-reservas" element={<MisReservasPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            } 
          />

          {/* Ruta no encontrada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ReservasProvider>
          <AppContent />
        </ReservasProvider>
      </AuthProvider>
    </Router>
  );
}
