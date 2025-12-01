import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ShoppingCartIcon, MotorcycleIcon } from '../components/Icons'

function Navbar() {
  const { user, logout } = useAuth();
  const { carrito } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  // Cerrar el menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav 
        className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}
        style={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
          backdropFilter: 'blur(10px)',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          padding: '12px 0'
        }}
      >
        <div className="container-fluid" style={{ maxWidth: '1400px' }}>
          {/* Logo/Brand */}
          <Link 
            className="navbar-brand d-flex align-items-center" 
            to="/" 
            style={{ 
              fontSize: '26px', 
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textDecoration: 'none',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <MotorcycleIcon className="brand-icon" size={32} color="#667eea" style={{ marginRight: '8px' }} />
            <span className="brand-text-full">MAB Motors</span>
            <span className="brand-text-short">MAB</span>
          </Link>

          {/* Cart Icon - Visible always (except admin) */}
          {!user?.isAdmin && (
            <div className="d-flex align-items-center order-lg-last ms-auto ms-lg-0 me-3 me-lg-0">
              <Link 
                to="/carrito" 
                className="position-relative text-decoration-none" 
                onClick={handleLinkClick}
              >
                <div 
                  className="cart-icon-container"
                  style={{
                    padding: '8px',
                    borderRadius: '50%',
                    backgroundColor: isActive('/carrito') ? '#e8f5e9' : 'transparent',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ShoppingCartIcon size={28} color={isActive('/carrito') ? '#4CAF50' : '#667eea'} />
                </div>
                {totalItems > 0 && (
                  <span 
                    className="position-absolute badge rounded-pill"
                    style={{
                      top: '12%',
                      right: '10%',
                      backgroundColor: '#4CAF50',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      border: '2px solid white',
                      transform: 'translate(0%, 0%)'
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* Hamburger Button */}
          <button 
            className="navbar-toggler border-0 shadow-none" 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="navbarNav"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.3s'
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Content */}
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
            {/* Navigation Links */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-center" style={{ gap: '10px' }}>
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  to="/" 
                  onClick={handleLinkClick}
                  style={{
                    color: isActive('/') ? '#667eea' : '#333',
                    fontWeight: isActive('/') ? '700' : '500',
                    fontSize: '16px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: isActive('/') ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    transition: 'all 0.3s',
                  }}
                >
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  to="/productos" 
                  onClick={handleLinkClick}
                  style={{
                    color: isActive('/productos') ? '#667eea' : '#333',
                    fontWeight: isActive('/productos') ? '700' : '500',
                    fontSize: '16px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: isActive('/productos') ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    transition: 'all 0.3s',
                  }}
                >
                  Catálogo
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link" 
                  to="/servicios" 
                  onClick={handleLinkClick}
                  style={{
                    color: isActive('/servicios') ? '#667eea' : '#333',
                    fontWeight: isActive('/servicios') ? '700' : '500',
                    fontSize: '16px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: isActive('/servicios') ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    transition: 'all 0.3s',
                  }}
                >
                  Servicios
                </Link>
              </li>
              
              {/* Admin Link - solo visible para admin */}
              {user?.isAdmin && (
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to="/admin" 
                    onClick={handleLinkClick}
                    style={{
                      color: '#f44336',
                      fontWeight: isActive('/admin') ? '700' : '600',
                      fontSize: '16px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: isActive('/admin') ? 'rgba(244, 67, 54, 0.1)' : 'transparent',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>🔧</span> Admin
                  </Link>
                </li>
              )}
            </ul>

            {/* Right Side: User */}
            <div className="d-flex align-items-center gap-3 justify-content-center mt-3 mt-lg-0">
              {/* User / Login */}
              {user?.isAuthenticated ? (
                <div className="d-flex align-items-center gap-2">
                  <div 
                    style={{ 
                      background: user?.isAdmin 
                        ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user?.isAdmin ? '👑 Admin' : `👤 ${user.nombre}`}
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      handleLinkClick();
                    }}
                    className="btn btn-outline-danger btn-sm"
                    style={{
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontWeight: '500',
                      transition: 'all 0.3s'
                    }}
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={handleLinkClick} style={{ textDecoration: 'none' }}>
                  <button 
                    className="btn"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '25px',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    Iniciar Sesión
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        body {
          padding-top: 80px;
        }
        
        /* Responsive para pantallas muy pequeñas (360px) */
        @media (max-width: 400px) {
          .navbar-brand {
            font-size: 20px !important;
          }
          .navbar-brand .brand-icon {
            font-size: 26px !important;
            margin-right: 6px !important;
          }
          .brand-text-full {
            display: none;
          }
          .brand-text-short {
            display: inline;
          }
          .cart-icon-container {
            padding: 6px !important;
          }
          .cart-icon-container svg {
            font-size: 24px !important;
          }
          .navbar-toggler {
            padding: 6px 10px !important;
          }
          .navbar-toggler-icon {
            width: 20px;
            height: 20px;
          }
          body {
            padding-top: 70px;
          }
          .navbar {
            padding: 10px 0 !important;
          }
        }
        
        @media (min-width: 401px) {
          .brand-text-short {
            display: none;
          }
        }
        
        @media (max-width: 991px) {
          .navbar-collapse {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            padding: 20px;
            border-radius: 12px;
            margin-top: 10px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
            min-width: 250px;
            z-index: 1000;
          }
          
          .navbar-nav {
            width: 100%;
          }
          
          .nav-item {
            text-align: center;
          }
          
          .nav-link {
            justify-content: center;
            display: flex;
          }
          
          .d-flex.align-items-center.gap-3 {
            width: 100%;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
          }
        }
      `}</style>
    </>
  )
}

export default Navbar
