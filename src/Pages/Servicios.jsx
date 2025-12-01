import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

function Servicios() {
  const services = [
    {
      icon: '🛡️',
      title: 'Garantías',
      description: 'Cobertura completa en todos nuestros productos y servicios. Garantía extendida disponible.',
      features: ['Garantía de fábrica', 'Cobertura de repuestos', 'Garantía extendida opcional', 'Sin letra chica'],
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '🔧',
      title: 'Taller Especializado',
      description: 'Técnicos certificados con experiencia en todas las marcas de motocicletas.',
      features: ['Diagnóstico computarizado', 'Repuestos originales', 'Mano de obra certificada', 'Equipamiento profesional'],
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '⚙️',
      title: 'Mantenimiento',
      description: 'Servicios preventivos y correctivos para mantener tu moto en óptimas condiciones.',
      features: ['Mantenimiento preventivo', 'Cambio de aceite', 'Ajuste de frenos', 'Revisión completa'],
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '📞',
      title: 'Soporte Técnico',
      description: 'Atención personalizada 24/7 para resolver todas tus consultas y emergencias.',
      features: ['Atención 24/7', 'Asesoramiento técnico', 'Asistencia en ruta', 'Consultas online'],
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  return (
    <>
      <SEO 
        title="Servicios Post-Venta"
        description="Servicios integrales para tu motocicleta: garantías, taller especializado, mantenimiento preventivo y soporte técnico 24/7. Tu satisfacción es nuestra prioridad."
        keywords="taller de motos, mantenimiento motos, reparación motocicletas, servicio técnico motos, garantía motos"
        type="website"
      />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 20px',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}></div>
          
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 0 20px 0',
            position: 'relative',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            Servicios Post-Venta
          </h1>
          <p style={{
            fontSize: '20px',
            maxWidth: '700px',
            margin: '0 auto',
            opacity: 0.95,
            position: 'relative',
            lineHeight: '1.6'
          }}>
            Tu satisfacción es nuestra prioridad. <br />
            Ofrecemos servicios integrales para que tu experiencia con nosotros sea excepcional.
          </p>
        </div>

        {/* Services Grid */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '60px 20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            marginBottom: '50px'
          }}>
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '30px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
              >
                {/* Gradient Header */}
                <div style={{
                  background: service.gradient,
                  borderRadius: '15px',
                  padding: '20px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '50px', marginBottom: '10px' }}>
                    {service.icon}
                  </div>
                  <h3 style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: 0
                  }}>
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <p style={{
                  color: '#666',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  {service.description}
                </p>

                {/* Features List */}
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {service.features.map((feature, idx) => (
                    <li key={idx} style={{
                      padding: '8px 0',
                      color: '#333',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{
                        color: '#4CAF50',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div style={{
            borderRadius: '20px',
            padding: '50px 30px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#333',
              marginBottom: '20px'
            }}>
              ¿Necesitas ayuda?
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#666',
              marginBottom: '30px',
              maxWidth: '600px',
              margin: '0 auto 30px auto'
            }}>
              Nuestro equipo está listo para atenderte. Contáctanos para agendar tu servicio o resolver cualquier consulta.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
              }}
              >
                📞 Contactar Ahora
              </button>
              
              <Link to="/" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'white',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  padding: '15px 40px',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#667eea';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  🏠 Volver al Inicio
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Servicios
