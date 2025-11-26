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
    if (!userEmail) {
      // Si no hay usuario, cargar carrito anónimo
      const carritoAnonimo = localStorage.getItem('carrito_anonimo');
      return carritoAnonimo ? JSON.parse(carritoAnonimo) : [];
    }
    
    const carritoKey = `carrito_${userEmail}`;
    const carritoGuardado = localStorage.getItem(carritoKey);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  // Ref para evitar guardar en el primer render
  const isFirstRender = useRef(true);
  const previousEmail = useRef(userEmail);

  // Cargar y fusionar carrito cuando cambia el usuario
  useEffect(() => {
    if (userEmail && userEmail !== previousEmail.current) {
      // Usuario acaba de loguearse
      const carritoAnonimo = localStorage.getItem('carrito_anonimo');
      const carritoKey = `carrito_${userEmail}`;
      const carritoUsuario = localStorage.getItem(carritoKey);
      
      let carritoAnonimoArray = carritoAnonimo ? JSON.parse(carritoAnonimo) : [];
      let carritoUsuarioArray = carritoUsuario ? JSON.parse(carritoUsuario) : [];
      
      // Fusionar carritos
      if (carritoAnonimoArray.length > 0) {
        const carritoFusionado = [...carritoUsuarioArray];
        let productosAgregados = 0;
        
        carritoAnonimoArray.forEach(itemAnonimo => {
          const existente = carritoFusionado.find(item => item.id === itemAnonimo.id);
          
          if (existente) {
            // Si existe, sumar cantidades
            existente.cantidad = (existente.cantidad || 1) + (itemAnonimo.cantidad || 1);
          } else {
            // Si no existe, agregarlo
            carritoFusionado.push(itemAnonimo);
            productosAgregados++;
          }
        });
        
        setCarrito(carritoFusionado);
        
        // Limpiar carrito anónimo
        localStorage.removeItem('carrito_anonimo');
        
        // Mostrar notificación si hay productos del carrito anónimo
        if (carritoAnonimoArray.length > 0) {
          // Usar setTimeout para asegurar que el toast context esté disponible
          setTimeout(() => {
            const event = new CustomEvent('showToast', {
              detail: {
                message: `Se agregaron ${carritoAnonimoArray.length} producto(s) de tu sesión anterior`,
                type: 'info'
              }
            });
            window.dispatchEvent(event);
          }, 500);
        }
      } else {
        // No hay carrito anónimo, solo cargar el del usuario
        setCarrito(carritoUsuarioArray);
      }
    } else if (!userEmail && previousEmail.current) {
      // Usuario hizo logout, vaciar carrito
      setCarrito([]);
    }
    
    previousEmail.current = userEmail;
    isFirstRender.current = false;
  }, [userEmail]);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (isFirstRender.current) return;
    
    if (userEmail) {
      // Usuario logueado: guardar en su carrito personal
      const carritoKey = `carrito_${userEmail}`;
      localStorage.setItem(carritoKey, JSON.stringify(carrito));
    } else {
      // Usuario anónimo: guardar en carrito anónimo
      localStorage.setItem('carrito_anonimo', JSON.stringify(carrito));
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
