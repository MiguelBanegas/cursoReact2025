import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAppContext();

  // Si el usuario NO está autenticado, redirigir a login
  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el componente hijo
  return children;
}
