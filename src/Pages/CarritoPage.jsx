import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function CarritoPage() {
  const { carrito, vaciarCarrito, quitarCantidad, agregarCantidad } = useAppContext();

  const total = carrito.reduce((sum, item) => {
    const cantidad = item.cantidad || 1;
    return sum + (item.precio * cantidad);
  }, 0);

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>🛒 Mi Carrito de Compras</h1>
      <hr />
      
      {carrito.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Tu carrito está vacío</p>
          <Link to="/productos">
            <button style={{ 
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Ir a Productos
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            {carrito.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                borderBottom: '1px solid #ddd',
                gap: '20px'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{item.nombre}</h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    ${item.precio.toLocaleString('es-AR')} c/u
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    onClick={() => quitarCantidad(item.id)}
                    style={{
                      width: '30px',
                      height: '30px',
                      fontSize: '18px',
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <span style={{ 
                    minWidth: '40px', 
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    {item.cantidad || 1}
                  </span>
                  <button 
                    onClick={() => agregarCantidad(item.id)}
                    style={{
                      width: '30px',
                      height: '30px',
                      fontSize: '18px',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
                
                <div style={{ 
                  minWidth: '120px', 
                  textAlign: 'right',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  ${(item.precio * (item.cantidad || 1)).toLocaleString('es-AR')}
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              <span>Total:</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/checkout" style={{ flex: 1 }}>
                <button style={{ 
                  width: '100%',
                  padding: '15px',
                  fontSize: '16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Proceder al Pago
                </button>
              </Link>
              
              <button 
                onClick={vaciarCarrito}
                style={{ 
                  padding: '15px 30px',
                  fontSize: '16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>

          <Link to="/productos">
            <button style={{ 
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '14px'
            }}>
              ← Seguir Comprando
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
