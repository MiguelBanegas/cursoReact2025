import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1a1a1a',
      color: '#f5f5f5',
      padding: '60px 0 20px 0',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Columna 1: Información de la empresa */}
        <div>
          <h3 style={{ color: '#4CAF50', marginBottom: '20px', fontSize: '18px' }}>🏍️ MAB Motors</h3>
          <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '14px' }}>
            Tu tienda de confianza para motocicletas y accesorios. Calidad y servicio garantizados.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h3 style={{ color: '#4CAF50', marginBottom: '20px', fontSize: '18px' }}>Enlaces Rápidos</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/" style={{ color: '#ddd', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#4CAF50'} onMouseLeave={(e) => e.target.style.color = '#ddd'}>Inicio</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/productos" style={{ color: '#ddd', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#4CAF50'} onMouseLeave={(e) => e.target.style.color = '#ddd'}>Productos</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/servicios" style={{ color: '#ddd', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#4CAF50'} onMouseLeave={(e) => e.target.style.color = '#ddd'}>Servicios</Link>
            </li>
            <li>
              <Link to="/login" style={{ color: '#ddd', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#4CAF50'} onMouseLeave={(e) => e.target.style.color = '#ddd'}>Mi Cuenta</Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h3 style={{ color: '#4CAF50', marginBottom: '20px', fontSize: '18px' }}>Contacto</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#aaa' }}>
            <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📍</span> Av. Siempre Viva 123, Springfield
            </li>
            <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📧</span> contacto@mabmotors.com
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📞</span> +54 11 1234-5678
            </li>
          </ul>
        </div>

        {/* Columna 4: Redes Sociales */}
        <div>
          <h3 style={{ color: '#4CAF50', marginBottom: '20px', fontSize: '18px' }}>Síguenos</h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="#" style={{ fontSize: '24px', textDecoration: 'none', filter: 'grayscale(1)', transition: 'filter 0.2s' }} onMouseEnter={(e) => e.target.style.filter = 'grayscale(0)'} onMouseLeave={(e) => e.target.style.filter = 'grayscale(1)'}>📸</a>
            <a href="#" style={{ fontSize: '24px', textDecoration: 'none', filter: 'grayscale(1)', transition: 'filter 0.2s' }} onMouseEnter={(e) => e.target.style.filter = 'grayscale(0)'} onMouseLeave={(e) => e.target.style.filter = 'grayscale(1)'}>📘</a>
            <a href="#" style={{ fontSize: '24px', textDecoration: 'none', filter: 'grayscale(1)', transition: 'filter 0.2s' }} onMouseEnter={(e) => e.target.style.filter = 'grayscale(0)'} onMouseLeave={(e) => e.target.style.filter = 'grayscale(1)'}>🐦</a>
            <a href="#" style={{ fontSize: '24px', textDecoration: 'none', filter: 'grayscale(1)', transition: 'filter 0.2s' }} onMouseEnter={(e) => e.target.style.filter = 'grayscale(0)'} onMouseLeave={(e) => e.target.style.filter = 'grayscale(1)'}>▶️</a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{
        borderTop: '1px solid #333',
        marginTop: '40px',
        paddingTop: '20px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>© {new Date().getFullYear()} MAB Motors. Todos los derechos reservados.</p>
        <p>Desarrollado por Miguel Angel Banegas</p>
      </div>
    </footer>
  )
}

export default Footer