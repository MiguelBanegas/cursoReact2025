import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function CarritoCompras() {
  const { carrito, vaciarCarrito, quitarCantidad, agregarCantidad } = useAppContext();

  const total = carrito.reduce((sum, item) => {
    const cantidad = item.cantidad || 1;
    return sum + (item.precio * cantidad);
  }, 0);

  return (
    <div>
      <hr />
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {carrito.map((item) => (
            <div key={item.id}>
                {item.nombre} - ${item.precio.toLocaleString('es-AR')}
                (Cantidad: {item.cantidad || 1})
                <button onClick={() => quitarCantidad(item.id)}>-</button>
                 <button onClick={() => agregarCantidad(item.id)}>+</button>
            </div>
          ))}

          <div>
            <hr />
            Total: ${total.toLocaleString('es-AR')}
          </div>
          <Link to="/checkout">
            <button style={{ marginRight: '10px' }}>
              Proceder al Pago
            </button>
          </Link>
          <button onClick={vaciarCarrito}>
            Vaciar Carrito
          </button>
        </>
      )}
      <Link to="/">
        <button>Volver al Inicio</button>
      </Link> 
    </div>
  );
}