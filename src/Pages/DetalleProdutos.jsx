import { Link, useParams, useLocation } from "react-router-dom";

const ProductoDetalle = () => {
 
    const { id, nombre } = useParams(); // Obtiene el ID y nombre del producto desde la URL
    const location = useLocation(); // Obtiene el estado de la ubicación actual
    const producto = location.state?.producto; // Obtiene el producto desde el estado
 
if (!producto) { // Si no se encuentra el producto
    return (
      <div>
        <p>No se pudo cargar el producto</p>
        <Link to="/productos">
          <button>Volver a Productos</button>
        </Link>
      </div>
    );
  }
 
  return(
    <>
    <h2>Detalles del Producto: {producto.nombre}</h2>
    <ul>
        <li key={producto.id}>  
            {producto.nombre}
            <br />
            <p><strong>Descripción: </strong>{producto.descripcion}</p>
            <p>Precio: ${producto.precio.toLocaleString('es-AR')}</p>
            <img src={producto.avatar} alt={producto.nombre} width="30%" /> 
        </li>
        <hr />
        <Link to={`/productos`}><button>Volver</button></Link>
    </ul>
    </>
  );
}; export default ProductoDetalle;