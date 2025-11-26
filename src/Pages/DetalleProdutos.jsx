import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const ProductoDetalle = () => {
  const { id, nombre } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const producto = location.state?.producto;
  const { agregarAlCarrito } = useCart();
  const { showToast } = useToast();

  const agregarAlCarritoHandler = () => {
    agregarAlCarrito(producto);
    showToast(`${producto.nombre} agregado al carrito`, 'success');
  };

  if (!producto) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '50px auto', 
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#f44336', marginBottom: '20px' }}>⚠️ Producto no encontrado</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          No se pudo cargar la información del producto
        </p>
        <Link to="/productos" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            ← Volver a Productos
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '20px auto', 
      padding: '20px'
    }}>
      {/* Botón volver */}
      <button 
        onClick={() => navigate(-1)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
      >
        ← Volver
      </button>

      {/* Contenedor principal */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          padding: '40px'
        }}>
          {/* Columna izquierda - Imagen */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={producto.avatar} 
                alt={producto.nombre}
                style={{ 
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>

          {/* Columna derecha - Información */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Título */}
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#333',
              margin: 0,
              lineHeight: '1.2'
            }}>
              {producto.nombre}
            </h1>

            {/* Precio */}
            <div style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              border: '2px solid #4CAF50'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: '0 0 8px 0'
              }}>
                Precio
              </p>
              <p style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#4CAF50',
                margin: 0
              }}>
                ${producto.precio.toLocaleString('es-AR')}
              </p>
            </div>

            {/* Descripción */}
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '10px'
              }}>
                📝 Descripción
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#666',
                lineHeight: '1.6',
                margin: 0
              }}>
                {producto.descripcion}
              </p>
            </div>

            {/* Separador */}
            <hr style={{
              border: 'none',
              borderTop: '1px solid #e0e0e0',
              margin: '10px 0'
            }} />

            {/* Información adicional */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '20px' }}>✅</span>
                <span style={{ color: '#666', fontSize: '14px' }}>Stock disponible</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '20px' }}>🚚</span>
                <span style={{ color: '#666', fontSize: '14px' }}>Envío a todo el país</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '20px' }}>💳</span>
                <span style={{ color: '#666', fontSize: '14px' }}>Aceptamos todos los medios de pago</span>
              </div>
            </div>

            {/* Espaciador */}
            <div style={{ flexGrow: 1 }}></div>

            {/* Botones de acción */}
            <div style={{
              display: 'flex',
              gap: '15px',
              marginTop: '20px'
            }}>
              <button
                onClick={agregarAlCarritoHandler}
                style={{
                  flex: 2,
                  padding: '16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
              >
                🛒 Agregar al carrito
              </button>

              <Link 
                to="/carrito" 
                style={{ 
                  flex: 1,
                  textDecoration: 'none' 
                }}
              >
                <button
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
                >
                  Ver carrito
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sección adicional - Productos relacionados o información extra */}
      <div style={{
        marginTop: '40px',
        padding: '30px',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '15px'
        }}>
          ℹ️ Información adicional
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>🔒 Compra segura</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Tus datos están protegidos con encriptación SSL
            </p>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>↩️ Devoluciones</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              30 días para devoluciones sin costo adicional
            </p>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>📞 Soporte</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Atención al cliente 24/7 para ayudarte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;