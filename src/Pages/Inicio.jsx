import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Inicio() {
  const { user } = useAuth();

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#333'
    }}>
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1558981852-426c6c22a060?w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
          filter: 'blur(2px)'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            letterSpacing: '2px'
          }}>
            MAB MOTORS
          </h1>
          
          <p style={{
            fontSize: '1.5rem',
            marginBottom: '40px',
            fontWeight: '300',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Tu pasión sobre dos ruedas comienza aquí
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/productos">
              <button style={{
                padding: '15px 40px',
                fontSize: '1.1rem',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(255, 68, 68, 0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 68, 68, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255, 68, 68, 0.4)';
              }}
              >
                Ver Motocicletas
              </button>
            </Link>
            
            <Link to="/servicios">
              <button style={{
                padding: '15px 40px',
                fontSize: '1.1rem',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
              >
                Nuestros Servicios
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section style={{
        padding: '80px 20px',
        backgroundColor: '#f8f8f8'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            marginBottom: '60px',
            color: '#1a1a1a'
          }}>
            ¿Por qué elegir MAB Motors?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px'
          }}>
            {/* Feature 1 */}
            <div style={{
              backgroundColor: 'white',
              padding: '40px 30px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏍️</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1a1a1a' }}>
                Amplio Stock
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Las mejores marcas y modelos del mercado. Encuentra la moto perfecta para ti.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              backgroundColor: 'white',
              padding: '40px 30px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔧</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1a1a1a' }}>
                Servicio Técnico
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Mantenimiento y reparación con técnicos especializados y repuestos originales.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              backgroundColor: 'white',
              padding: '40px 30px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💳</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1a1a1a' }}>
                Financiación
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Planes de financiación flexibles. Hacé realidad tu sueño hoy mismo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            {user?.isAuthenticated 
              ? `¡Bienvenido de vuelta, ${user.nombre}!` 
              : '¿Listo para tu próxima aventura?'}
          </h2>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '40px',
            opacity: 0.9
          }}>
            {user?.isAuthenticated
              ? 'Explorá nuestro catálogo y encontrá la moto de tus sueños'
              : 'Iniciá sesión y descubrí ofertas exclusivas'}
          </p>
          
          {user?.isAuthenticated ? (
            <Link to="/productos">
              <button style={{
                padding: '15px 50px',
                fontSize: '1.1rem',
                backgroundColor: 'white',
                color: '#ff4444',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Ver Catálogo
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button style={{
                padding: '15px 50px',
                fontSize: '1.1rem',
                backgroundColor: 'white',
                color: '#ff4444',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Iniciar Sesión
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* FOOTER INFO */}
      <section style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>MAB MOTORS</h3>
          <p style={{ color: '#999', marginBottom: '10px' }}>
            📍 Av. Principal 1234, Ciudad
          </p>
          <p style={{ color: '#999', marginBottom: '10px' }}>
            📞 (011) 1234-5678
          </p>
          <p style={{ color: '#999' }}>
            ✉️ info@mabmotors.com
          </p>
        </div>
      </section>
    </div>
  );
}