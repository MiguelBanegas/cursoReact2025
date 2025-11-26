import { useEffect } from 'react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = '¿Estás seguro?', 
  message = '¿Deseas continuar con esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) {
  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          animation: 'slideIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '24px',
          color: '#333'
        }}>
          {title}
        </h2>
        
        <p style={{ 
          margin: '0 0 25px 0', 
          fontSize: '16px',
          color: '#666',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end' 
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            {cancelText}
          </button>
          
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: '10px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
