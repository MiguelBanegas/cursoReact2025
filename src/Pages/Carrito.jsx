import React from 'react';
import { Link } from 'react-router-dom';

export default function CarritoCompras({ carrito, setCarrito }) {
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const quitarCantidad = (idProducto) => {
    const carritoActualizado = carrito.map(producto => {
      if (producto.id === idProducto) {
        const cantidadActual = producto.cantidad || 1;
        if (cantidadActual === 1) {
          return null;
        }
        return { ...producto, cantidad: cantidadActual - 1 };
      }
      return producto;
    }).filter(producto => producto !== null);

    setCarrito(carritoActualizado);
  };

    const agregarCantidad = (idProducto) => {
    const nuevoCarrito = carrito.map(producto => {
      if (producto.id === idProducto) {
        return {
          ...producto,
          cantidad: (producto.cantidad || 1) + 1
        };
      }
      return producto;
    });
    setCarrito(nuevoCarrito);
  };

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