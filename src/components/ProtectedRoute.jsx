import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Si el usuario NO está autenticado, redirigir a login
  if (!user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el componente hijo
  return children;
}
