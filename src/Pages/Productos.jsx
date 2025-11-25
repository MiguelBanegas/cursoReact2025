import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function Productos() {
  const { carrito, agregarAlCarrito } = useAppContext(); // Obtener del contexto
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://6921d58e512fb4140be183e1.mockapi.io/api/productos")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        // Convertir el precio de string a número
        // Eliminar puntos (separadores de miles) antes de convertir
        const productosNormalizados = datos.map(producto => ({
          ...producto,
          precio: parseFloat(producto.precio.replace(/\./g, '')) || 0
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

  const agregarAlCarritoHandler = (producto) => {
    agregarAlCarrito(producto); // Usar la función del contexto
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
          {/* Navega a la página de detalles y pasa el producto completo via state */}
          <Link to={`/productos/${producto.id}/${producto.nombre.toLowerCase().replace(/\s+/g, '-')}`} state={{producto}}><button>Más detalles</button></Link> 
          <button onClick={() => agregarAlCarritoHandler(producto)}>Agregar al carrito</button>
        </li>
      ))}
    </ul>
    </>
  );
}