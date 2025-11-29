import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Productos() {
  const { agregarAlCarrito } = useCart();
  const { showToast } = useToast();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Ref para hacer scroll al inicio de los productos
  const productosRef = useRef(null);
  
  // Cargar búsqueda desde localStorage al iniciar
  const [busqueda, setBusqueda] = useState(() => {
    const busquedaGuardada = localStorage.getItem('busquedaProductos');
    return busquedaGuardada || '';
  });

  // Estado para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;

  // Guardar búsqueda en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('busquedaProductos', busqueda);
  }, [busqueda]);

  // Resetear página al buscar
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const respuesta = await fetch("https://api.mabcontrol.ar/api/products");
        
        if (!respuesta.ok) {
          throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();
        
        // Validar que datos sea un array
        if (!Array.isArray(datos)) {
          throw new Error('Los datos recibidos no son válidos');
        }
        
        // Convertir el precio de string a número
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

  // Filtrar productos según el término de búsqueda
  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Lógica de paginación
  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    // Scroll al top de la página
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <h1 ref={productosRef} style={{ marginBottom: '20px', fontSize: '32px', fontWeight: 'bold' }}>🛍️ Nuestros Productos</h1>
      
      {/* Buscador */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ position: 'relative', maxWidth: '500px' }}>
          {/* Icono de lupa */}
          <span style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            color: '#999',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            🔍
          </span>
          
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar productos por nombre..."
            style={{
              width: '100%',
              padding: '14px 50px 14px 50px',
              fontSize: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '30px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4CAF50';
              e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#999',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}
              onMouseEnter={(e) => e.target.style.color = '#333'}
              onMouseLeave={(e) => e.target.style.color = '#999'}
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Resultados de búsqueda */}
        {busqueda && (
          <p style={{
            marginTop: '10px',
            fontSize: '14px',
            color: '#666'
          }}>
            {productosFiltrados.length === 0 
              ? `No se encontraron productos con "${busqueda}"`
              : `Mostrando ${productosFiltrados.length} ${productosFiltrados.length === 1 ? 'producto' : 'productos'} de ${productos.length}`
            }
          </p>
        )}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        {productosFiltrados.length === 0 && busqueda ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>No se encontraron productos</h3>
            <p style={{ fontSize: '16px' }}>Intenta con otro término de búsqueda</p>
          </div>
        ) : (
          productosPaginados.map((producto) => (
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
                src={producto.avatar || '/no-image.png'} 
                alt={producto.nombre}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover'
                }}
                onError={(e) => { e.target.src = '/no-image.png'; }}
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
          ))
        )}
      </div>

      {/* Controles de Paginación */}
      {totalPaginas > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            style={{
              padding: '10px 20px',
              backgroundColor: paginaActual === 1 ? '#e0e0e0' : '#667eea',
              color: paginaActual === 1 ? '#999' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            ← Anterior
          </button>
          
          <span style={{ fontSize: '16px', fontWeight: '500', color: '#555' }}>
            Página {paginaActual} de {totalPaginas}
          </span>
          
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            style={{
              padding: '10px 20px',
              backgroundColor: paginaActual === totalPaginas ? '#e0e0e0' : '#667eea',
              color: paginaActual === totalPaginas ? '#999' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}