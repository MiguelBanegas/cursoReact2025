import { createContext, useContext, useState } from 'react';

// Crear el contexto
const AppContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de un AppProvider');
  }
  return context;
};

// Provider que envuelve la aplicación
export const AppProvider = ({ children }) => {
  // Estado del usuario
  const [user, setUser] = useState({
    nombre: '',
    email: '',
    isAuthenticated: false
  });

  // Estado del carrito
  const [carrito, setCarrito] = useState([]);

  // Función para iniciar sesión
  const login = (nombre, email) => {
    setUser({
      nombre,
      email,
      isAuthenticated: true
    });
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser({
      nombre: '',
      email: '',
      isAuthenticated: false
    });
  };

  // Función para agregar producto al carrito
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
  };

  // Función para quitar cantidad de un producto
  const quitarCantidad = (idProducto) => {
    const carritoActualizado = carrito.map(producto => {
      if (producto.id === idProducto) {
        const cantidadActual = producto.cantidad || 1;
        if (cantidadActual === 1) {
          return null; // Marca para eliminar
        }
        return { ...producto, cantidad: cantidadActual - 1 };
      }
      return producto;
    }).filter(producto => producto !== null);

    setCarrito(carritoActualizado);
  };

  // Función para agregar cantidad de un producto
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

  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Función para finalizar compra
  const finalizarCompra = () => {
    // Simular envío de email
    console.log(`📧 Enviando compra a: ${user.email}`);
    console.log('Productos:', carrito);
    
    // Limpiar el carrito
    vaciarCarrito();
    
    return {
      success: true,
      message: `¡Compra realizada con éxito! Se envió la confirmación a ${user.email}`
    };
  };

  // Valor que se compartirá con todos los componentes
  const value = {
    user,
    carrito,
    login,
    logout,
    agregarAlCarrito,
    quitarCantidad,
    agregarCantidad,
    vaciarCarrito,
    finalizarCompra
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
