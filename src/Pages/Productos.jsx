import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Productos() {
  const { agregarAlCarrito } = useCart();
  const { showToast } = useToast();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const respuesta = await fetch("https://6921d58e512fb4140be183e1.mockapi.io/api/productos");
        
        if (!respuesta.ok) {
          throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();
        
        // Validar que datos sea un array
        if (!Array.isArray(datos)) {
          throw new Error('Los datos recibidos no son válidos');
        }
        
        // Convertir el precio de string a número
        // Eliminar puntos (separadores de miles) antes de convertir
        const productosNormalizados = datos.map(producto => ({
          ...producto,
          precio: typeof producto.precio === 'string' 
            ? parseFloat(producto.precio.replace(/\./g, '')) || 0
            : parseFloat(producto.precio) || 0
        }));
        
        setProductos(productosNormalizados);
        setError(null);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError("Hubo un problema al cargar los productos. Por favor, intenta nuevamente.");
      } finally {
        setCargando(false);
      }
    };
    
    cargarProductos();
  }, []);

  const agregarAlCarritoHandler = (producto) => {
    agregarAlCarrito(producto);
    showToast(`${producto.nombre} agregado al carrito`, 'success');
  };

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '32px', fontWeight: 'bold' }}>🛍️ Nuestros Productos</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {productos.map((producto) => (
          <div 
            key={producto.id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            {/* Imagen del producto */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img 
                src={producto.avatar} 
                alt={producto.nombre}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover'
                }}
              />
            </div>
            
            {/* Contenido de la tarjeta */}
            <div style={{ 
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1
            }}>
              {/* Título */}
              <h3 style={{ 
                margin: '0 0 10px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                minHeight: '44px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {producto.nombre}
              </h3>
              
              {/* Descripción truncada */}
              <p style={{ 
                margin: '0 0 10px 0',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.4'
              }}>
                {producto.descripcion.length > 30 
                  ? producto.descripcion.substring(0, 30) + '...' 
                  : producto.descripcion}
              </p>
              
              {/* Precio */}
              <p style={{ 
                margin: '0 0 15px 0',
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#4CAF50'
              }}>
                ${producto.precio.toLocaleString('es-AR')}
              </p>
              
              {/* Espaciador para empujar botones al fondo */}
              <div style={{ flexGrow: 1 }}></div>
              
              {/* Botones en la parte inferior */}
              <div style={{ 
                display: 'flex', 
                gap: '10px',
                marginTop: 'auto'
              }}>
                <Link 
                  to={`/productos/${producto.id}/${producto.nombre.toLowerCase().replace(/\s+/g, '-')}`} 
                  state={{producto}}
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  <button style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
                  >
                    Ver detalles
                  </button>
                </Link>
                
                <button 
                  onClick={() => agregarAlCarritoHandler(producto)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                >
                  🛒 Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}