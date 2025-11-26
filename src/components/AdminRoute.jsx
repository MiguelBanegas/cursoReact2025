import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // Si no está autenticado, redirigir a login
  if (!user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero NO es admin, redirigir a productos
  if (!user?.isAdmin) {
    return <Navigate to="/productos" replace />;
  }

  // Si es admin, mostrar el componente hijo
  return children;
}
