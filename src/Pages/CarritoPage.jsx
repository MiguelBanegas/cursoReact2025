import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { TrashIcon, MinusIcon, PlusIcon, ArrowLeftIcon, CreditCardIcon, ShoppingBagIcon } from '../components/Icons';

export default function CarritoPage() {
  const { carrito, vaciarCarrito, quitarCantidad, agregarCantidad, eliminarProducto } = useCart();

  const total = carrito.reduce((sum, item) => {
    const cantidad = item.cantidad || 1;
    return sum + (item.precio * cantidad);
  }, 0);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="display-5 fw-bold text-dark mb-0">
          <ShoppingBagIcon className="me-3 text-primary" />
          Mi Carrito
        </h1>
        {carrito.length > 0 && (
          <button 
            onClick={vaciarCarrito}
            className="btn btn-outline-danger d-flex align-items-center gap-2 hover-scale"
          >
            <TrashIcon /> Vaciar Carrito
          </button>
        )}
      </div>

      <hr className="mb-5" />
      
      {carrito.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4 text-muted opacity-25">
            <ShoppingBagIcon size={100} />
          </div>
          <h3 className="text-muted mb-4">Tu carrito está vacío</h3>
          <Link to="/productos">
            <button className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2 shadow-sm hover-lift">
              <ArrowLeftIcon /> Ir a Productos
            </button>
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Lista de Productos */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body p-0">
                {carrito.map((item, index) => (
                  <div key={item.id} className={`p-4 ${index !== carrito.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="row align-items-center g-3">
                      {/* Imagen y Nombre */}
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-light rounded-3 p-2 d-flex align-items-center justify-content-center position-relative" style={{ width: '80px', height: '80px' }}>
                             {item.avatar ? (
                                <img src={item.avatar} alt={item.nombre} className="img-fluid img-hover-zoom" style={{ maxHeight: '100%', transition: 'transform 0.3s ease' }} />
                             ) : (
                                <ShoppingBagIcon className="text-secondary fs-2" />
                             )}
                          </div>
                          <div>
                            <h5 className="fw-bold mb-1">{item.nombre}</h5>
                            <p className="text-muted mb-0 small">
                              Unitario: ${item.precio.toLocaleString('es-AR')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Controles de Cantidad */}
                      <div className="col-6 col-md-3">
                        <div className="input-group input-group-sm">
                          <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => quitarCantidad(item.id)}
                          >
                            <MinusIcon size={12} />
                          </button>
                          <span className="input-group-text bg-white px-3 fw-bold border-secondary border-opacity-25">
                            {item.cantidad || 1}
                          </span>
                          <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => agregarCantidad(item.id)}
                          >
                            <PlusIcon size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-6 col-md-3 text-end">
                        <h5 className="fw-bold text-primary mb-0">
                          ${(item.precio * (item.cantidad || 1)).toLocaleString('es-AR')}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <Link to="/productos" className="text-decoration-none">
                <button className="btn btn-link text-secondary d-inline-flex align-items-center gap-2 ps-0">
                  <ArrowLeftIcon /> Seguir Comprando
                </button>
              </Link>
            </div>
          </div>

          {/* Resumen de Compra */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 bg-light">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Resumen</h4>
                
                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString('es-AR')}</span>
                </div>
                <div className="d-flex justify-content-between mb-4 text-muted">
                  <span>Envío</span>
                  <span className="text-success fw-bold">Gratis</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-4">
                  <span className="fs-4 fw-bold">Total</span>
                  <span className="fs-4 fw-bold text-primary">${total.toLocaleString('es-AR')}</span>
                </div>

                <Link to="/checkout" className="d-block text-decoration-none">
                  <button className="btn btn-success w-100 py-3 fw-bold shadow-sm hover-lift d-flex align-items-center justify-content-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', border: 'none' }}
                  >
                    <CreditCardIcon /> Proceder al Pago
                  </button>
                </Link>
                
                <div className="mt-3 text-center">
                  <small className="text-muted d-flex align-items-center justify-content-center gap-1">
                    <CreditCardIcon /> Pago 100% Seguro
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        .img-hover-zoom {
          cursor: pointer;
          position: relative;
          z-index: 1;
        }
        .img-hover-zoom:hover {
          transform: scale(2.5);
          z-index: 100;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          border-radius: 8px;
          background-color: white;
        }
      `}</style>
    </div>
  );
}
