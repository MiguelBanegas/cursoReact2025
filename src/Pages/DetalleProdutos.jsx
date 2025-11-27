import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { FaShoppingCart, FaArrowLeft, FaCheckCircle, FaTruck, FaCreditCard, FaLock, FaUndo, FaHeadset } from 'react-icons/fa';

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
      <div className="container text-center py-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <h2 className="alert-heading fw-bold">⚠️ Producto no encontrado</h2>
          <p>No se pudo cargar la información del producto.</p>
          <hr />
          <Link to="/productos" className="btn btn-primary">
            <FaArrowLeft className="me-2" /> Volver a Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Botón volver */}
      <button 
        onClick={() => navigate(-1)}
        className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2 hover-scale"
      >
        <FaArrowLeft /> Volver
      </button>

      {/* Contenedor principal */}
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5">
        <div className="row g-0">
          {/* Columna izquierda - Imagen */}
          <div className="col-lg-6 bg-light d-flex align-items-center justify-content-center p-4">
            <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
              <img 
                src={producto.avatar} 
                alt={producto.nombre}
                className="img-fluid rounded-3 shadow-sm hover-zoom"
                style={{ maxHeight: '500px', objectFit: 'contain', transition: 'transform 0.3s ease' }}
              />
            </div>
          </div>

          {/* Columna derecha - Información */}
          <div className="col-lg-6 p-4 p-lg-5">
            <div className="d-flex flex-column h-100">
              {/* Título */}
              <h1 className="display-5 fw-bold text-dark mb-2">{producto.nombre}</h1>
              
              {/* Precio */}
              <div className="mb-4">
                <span className="badge bg-success bg-opacity-10 text-success fs-5 px-3 py-2 rounded-pill border border-success border-opacity-25">
                  Precio: ${producto.precio.toLocaleString('es-AR')}
                </span>
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <h5 className="fw-bold text-secondary mb-2">📝 Descripción</h5>
                <p className="text-muted lead fs-6">{producto.descripcion}</p>
              </div>

              <hr className="my-4 text-muted opacity-25" />

              {/* Información adicional */}
              <div className="d-flex flex-column gap-3 mb-5">
                <div className="d-flex align-items-center gap-3 text-secondary">
                  <FaCheckCircle className="text-success fs-5" />
                  <span>Stock disponible para entrega inmediata</span>
                </div>
                <div className="d-flex align-items-center gap-3 text-secondary">
                  <FaTruck className="text-primary fs-5" />
                  <span>Envío gratis a todo el país</span>
                </div>
                <div className="d-flex align-items-center gap-3 text-secondary">
                  <FaCreditCard className="text-warning fs-5" />
                  <span>Hasta 12 cuotas sin interés</span>
                </div>
              </div>

              <div className="mt-auto">
                {/* Botones de acción */}
                <div className="d-grid gap-3 d-md-flex">
                  <button
                    onClick={agregarAlCarritoHandler}
                    className="btn btn-success btn-lg flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm hover-lift"
                    style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', border: 'none' }}
                  >
                    <FaShoppingCart /> Agregar al carrito
                  </button>

                  <Link to="/carrito" className="flex-grow-1 text-decoration-none">
                    <button className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm hover-lift"
                      style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)', border: 'none' }}
                    >
                      Ver carrito
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección adicional - Info Cards */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm hover-lift transition-all">
            <div className="card-body text-center p-4">
              <div className="mb-3 text-primary">
                <FaLock size={40} />
              </div>
              <h5 className="card-title fw-bold">Compra Segura</h5>
              <p className="card-text text-muted small">
                Tus datos están protegidos con los más altos estándares de seguridad y encriptación SSL.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm hover-lift transition-all">
            <div className="card-body text-center p-4">
              <div className="mb-3 text-success">
                <FaUndo size={40} />
              </div>
              <h5 className="card-title fw-bold">Devolución Garantizada</h5>
              <p className="card-text text-muted small">
                Si no estás satisfecho, tienes 30 días para devolver tu producto sin costo adicional.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm hover-lift transition-all">
            <div className="card-body text-center p-4">
              <div className="mb-3 text-info">
                <FaHeadset size={40} />
              </div>
              <h5 className="card-title fw-bold">Soporte 24/7</h5>
              <p className="card-text text-muted small">
                Nuestro equipo de expertos está disponible todo el día para resolver tus dudas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-scale:hover {
          transform: scale(1.05);
          transition: transform 0.2s ease;
        }
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .hover-zoom:hover {
          transform: scale(1.02) !important;
        }
      `}</style>
    </div>
  );
};

export default ProductoDetalle;