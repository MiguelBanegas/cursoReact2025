import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

// Tiempo de inactividad en milisegundos (15 minutos)
const INACTIVITY_TIME = 3 * 60 * 1000; 

const AutoLogout = () => {
  const { user, logout } = useAuth();

  const handleLogout = useCallback(() => {
    if (user) {
      console.log("Sesión cerrada por inactividad");
      logout();
      window.location.href = '/login'; // Opcional: redirigir explícitamente
    }
  }, [user, logout]);

  useEffect(() => {
    // Si no hay usuario logueado, no hacemos nada
    if (!user) return;

    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, INACTIVITY_TIME);
    };

    // Eventos que consideramos como "actividad"
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart'
    ];

    // Configurar el timer inicial
    resetTimer();

    // Agregar listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Limpieza al desmontar
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [user, handleLogout]);

  return null; // Este componente no renderiza nada visual
};

export default AutoLogout;
