import { useState, useEffect } from 'react';

const RELOAD_DELAY = 5000; // opcional: recarga automática después de X ms

function UpdateNotifier({ wsUrl }) {
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [ws, setWs] = useState(null);

  // Función para inicializar WebSocket y reconexión automática
  const initWebSocket = () => {
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("✅ Conectado a WebSocket");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_BUILD") {
        setLastUpdate(data.deployTime);
        setShowBanner(true);

        // Recarga automática opcional
        if (RELOAD_DELAY > 0) {
          setTimeout(() => {
            window.location.reload();
          }, RELOAD_DELAY);
        }
      }
    };

    socket.onclose = () => {
      console.log("⚠️ WebSocket desconectado, reintentando en 3s...");
      setTimeout(initWebSocket, 3000);
    };

    setWs(socket);
  };

  useEffect(() => {
    initWebSocket();
    return () => ws && ws.close();
  }, []);

  const handleReload = () => window.location.reload();

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
      La página se actualizó el {new Date(lastUpdate).toLocaleString()}.
      <button onClick={handleReload} style={{ marginLeft: '10px', cursor: 'pointer' }}>
        Recargar
      </button>
    </div>
  );
}

export default UpdateNotifier;
