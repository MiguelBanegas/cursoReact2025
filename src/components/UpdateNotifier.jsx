import { useState, useEffect } from 'react';

function UpdateNotifier() {
  const [showBanner, setShowBanner] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    // Verificar si hay un Service Worker esperando al cargar
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Si ya hay un worker esperando
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowBanner(true);
        }

        // Escuchar nuevas actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setShowBanner(true);
            }
          });
        });
      });

      // Escuchar evento de cambio de controlador (cuando se actualiza la página)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    }
  }, []);

  const handleReload = () => {
    if (waitingWorker) {
      // Enviar mensaje al SW para que tome el control
      waitingWorker.postMessage('SKIP_WAITING');
    } else {
      window.location.reload();
    }
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      background: '#fffae6',
      color: '#333',
      padding: '10px',
      textAlign: 'center',
      zIndex: 9999,
      boxShadow: '0px 2px 5px rgba(0,0,0,0.2)'
    }}>
      🚀 Hay una nueva versión disponible.
      <button onClick={handleReload} style={{ 
        marginLeft: '10px', 
        cursor: 'pointer',
        padding: '5px 15px',
        border: 'none',
        borderRadius: '4px',
        background: '#333',
        color: 'white'
      }}>
        Actualizar ahora
      </button>
    </div>
  );
}

export default UpdateNotifier;
