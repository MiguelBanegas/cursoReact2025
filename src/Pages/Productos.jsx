import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CarritoCompras from "./Carrito";

export default function Productos({ carrito, setCarrito }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://6921d58e512fb4140be183e1.mockapi.io/api/productos") //https://68d482e3214be68f8c696ae2.mockapi.io/api/productos
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        // Convertir el precio de string a número
        // Eliminar puntos (separadores de miles) antes de convertir
        const productosNormalizados = datos.map(producto => ({
          ...producto,
          precio: parseFloat(producto.precio.replace(/\./g, '')) || 0 // Convertir el precio a número
        }));
        setProductos(productosNormalizados);
        setCargando(false);
      })
      .catch((error) => {
        {console.error("Error!,", error)}
        setError("Hubo un problema al cargar los productos.");
        setCargando(false);
      });
  }, []);

const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {
      const productoExistente = prevCarrito.find(item => item.id === producto.id);
     
      if (productoExistente) {
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
    alert(`Producto ${producto.nombre} agregado.`);
  };



  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <ul id="lista-productos">
      {productos.map((producto) => (
        <li key={producto.id}>
        <h2>{producto.nombre}</h2>
          <br />
          Descripción: {producto.descripcion}
          <br />
          Precio: ${producto.precio.toLocaleString('es-AR')}
          <br />
          <img src={producto.avatar} alt={producto.nombre} width="80%" />
          <Link to={`/productos/${producto.id}`} state={{producto}}><button>Más detalles</button></Link>
          <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
        </li>
      ))}
    </ul>
    <CarritoCompras carrito={carrito} setCarrito={setCarrito} />
    </>
  );
}