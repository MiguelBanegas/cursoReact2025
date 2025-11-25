import React from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

function Navbar() {
  const { user, logout, carrito } = useAppContext();

  // Calcular el número total de items en el carrito
  const totalItems = carrito.reduce((total, item) => total + (item.cantidad || 1), 0);

  return (
    <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', alignItems: 'center' }}>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            
            {/* Icono del carrito con contador */}
            <li style={{ position: 'relative' }}>
              <Link to="/productos" style={{ fontSize: '24px', textDecoration: 'none' }}>
                🛒
                {totalItems > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-10px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
            
            {user.isAuthenticated ? (
              <>
                <li style={{ marginLeft: 'auto' }}>
                  Hola, {user.nombre}
                </li>
                <li>
                  <button onClick={logout}>Cerrar Sesión</button>
                </li>
              </>
            ) : (
              <li style={{ marginLeft: 'auto' }}>
                <Link to="/login">
                  <button>Iniciar Sesión</button>
                </Link>
              </li>
            )}
        </ul>
    </nav>
  )
}

export default Navbar