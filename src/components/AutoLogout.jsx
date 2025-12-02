import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

// Tiempo de inactividad en milisegundos (2 minutos)
const INACTIVITY_TIME = 2 * 60 * 1000; 
const CHECK_INTERVAL = 10000; // Revisar cada 10 segundos

const AutoLogout = () => {
  const { user, logout } = useAuth();

  const handleLogout = useCallback(() => {
    if (user) {
      console.log("Sesión cerrada por inactividad");
      logout();
      window.location.href = '/login'; 
    }
  }, [user, logout]);

  useEffect(() => {
    if (!user) return;

    // Función para actualizar la marca de tiempo en localStorage
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Función para verificar si pasó el tiempo
    const checkActivity = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      
      if (lastActivity) {
        const now = Date.now();
        const timeDiff = now - parseInt(lastActivity, 10);

        if (timeDiff >= INACTIVITY_TIME) {
          handleLogout();
        }
      } else {
        // Si no hay marca de tiempo, la creamos ahora
        updateActivity();
      }
    };

    // Eventos que consideramos como "actividad"
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ];

    // Inicializar
    updateActivity();

    // Intervalo para chequear periódicamente (el "reloj" compartido)
    const intervalId = setInterval(checkActivity, CHECK_INTERVAL);

    // Listeners para actualizar actividad
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Listener especial para cuando otra pestaña actualiza el storage
    const handleStorageChange = (e) => {
      if (e.key === 'lastActivity') {
        // Si otra pestaña actualizó la actividad, no hacemos nada explícito,
        // el próximo checkActivity leerá el nuevo valor.
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(intervalId);
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, handleLogout]);

  return null;
};

export default AutoLogout;
