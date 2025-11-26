import { createContext, useContext, useState, useEffect, useRef } from 'react';

// Crear el contexto del carrito
const CartContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

// Provider del carrito
export const CartProvider = ({ children, userEmail }) => {
  // Inicializar carrito desde localStorage si existe (asociado al usuario)
  const [carrito, setCarrito] = useState(() => {
    if (!userEmail) return []; // Si no hay usuario, carrito vacío
    
    const carritoKey = `carrito_${userEmail}`;
    const carritoGuardado = localStorage.getItem(carritoKey);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  // Ref para evitar guardar en el primer render
  const isFirstRender = useRef(true);

  // Cargar carrito cuando cambia el usuario
  useEffect(() => {
    if (userEmail) {
      const carritoKey = `carrito_${userEmail}`;
      const carritoGuardado = localStorage.getItem(carritoKey);
      setCarrito(carritoGuardado ? JSON.parse(carritoGuardado) : []);
    } else {
      // Si no hay usuario logueado, vaciar el carrito
      setCarrito([]);
    }
    // Marcar que ya pasó el primer render
    isFirstRender.current = false;
  }, [userEmail]);

  // Guardar carrito en localStorage cada vez que cambie (asociado al usuario)
  // PERO solo después del primer render para evitar sobrescribir al cargar
  useEffect(() => {
    // No guardar en el primer render ni cuando se está cargando el usuario
    if (isFirstRender.current) return;
    
    if (userEmail && carrito) {
      const carritoKey = `carrito_${userEmail}`;
      localStorage.setItem(carritoKey, JSON.stringify(carrito));
    }
  }, [carrito, userEmail]);

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

  // Función para vaciar el carrito (solo del estado, NO de localStorage)
  // El carrito se mantiene en localStorage para cuando el usuario vuelva
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Función para finalizar compra (recibe email como parámetro)
  const finalizarCompra = (userEmail) => {
    // Simular envío de email
    console.log(`📧 Enviando compra a: ${userEmail}`);
    console.log('Productos:', carrito);
    
    // Limpiar el carrito del estado
    setCarrito([]);
    
    // TAMBIÉN limpiar de localStorage (compra finalizada)
    if (userEmail) {
      const carritoKey = `carrito_${userEmail}`;
      localStorage.removeItem(carritoKey);
    }
    
    return {
      success: true,
      message: `¡Compra realizada con éxito! Se envió la confirmación a ${userEmail}`
    };
  };

  const value = {
    carrito,
    agregarAlCarrito,
    quitarCantidad,
    agregarCantidad,
    vaciarCarrito,
    finalizarCompra
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
