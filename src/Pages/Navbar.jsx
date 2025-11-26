import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { user, logout } = useAuth();
  const { carrito } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar estilo
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calcular el número total de items en el carrito
  const totalItems = carrito.reduce((total, item) => total + (item.cantidad || 1), 0);

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    textDecoration: 'none',
    color: isActive(path) ? '#4CAF50' : '#333',
    fontWeight: isActive(path) ? '700' : '500',
    fontSize: '16px',
    transition: 'color 0.2s',
    position: 'relative',
    padding: '5px 0'
  });

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
      backdropFilter: 'blur(10px)',
      boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.3s ease',
      padding: '15px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
          <span>🏍️ MAB Motors</span>
        </Link>

        {/* Enlaces de Navegación */}
        <ul style={{ display: 'flex', listStyle: 'none', gap: '30px', margin: 0, padding: 0, alignItems: 'center' }}>
          <li><Link to="/" style={linkStyle('/')}>Inicio</Link></li>
          <li><Link to="/productos" style={linkStyle('/productos')}>Catálogo</Link></li>
          <li><Link to="/servicios" style={linkStyle('/servicios')}>Servicios</Link></li>
          
          {/* Link Admin - solo visible para admin */}
          {user?.isAdmin && (
            <li>
              <Link to="/admin" style={{ 
                ...linkStyle('/admin'),
                color: '#f44336', 
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span>🔧</span> Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Sección Derecha: Carrito y Usuario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* Icono del carrito - NO visible para admin */}
          {!user?.isAdmin && (
            <Link to="/carrito" style={{ position: 'relative', textDecoration: 'none', color: '#333' }}>
              <div style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: isActive('/carrito') ? '#e8f5e9' : 'transparent',
                transition: 'background-color 0.2s'
              }}>
                <span style={{ fontSize: '24px' }}>🛒</span>
              </div>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  border: '2px solid white'
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Usuario / Login */}
          {user?.isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                background: user?.isAdmin 
                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '8px 16px',
                borderRadius: '20px',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                {user?.isAdmin ? '👑 Admin' : `👤 ${user.nombre}`}
              </div>
              <button 
                onClick={logout}
                style={{
                  background: 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#666',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#f44336';
                  e.currentTarget.style.color = '#f44336';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ddd';
                  e.currentTarget.style.color = '#666';
                }}
              >
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button style={{
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '30px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4CAF50';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                Iniciar Sesión
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar