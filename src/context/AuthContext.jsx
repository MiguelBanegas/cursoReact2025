import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

const API_URL = 'https://api.mabcontrol.ar/api/users';

// Función para fetch con timeout
const fetchWithTimeout = async (url, options = {}, timeout = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('La conexión está tardando mucho. Por favor, intenta nuevamente.');
    }
    throw error;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Al montar, verificar si hay sesión guardada en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (token && userName && userEmail) {
      setUser({
        id: userId,
        nombre: userName,
        email: userEmail,
        isAuthenticated: true,
        isAdmin: isAdmin
      });
    }
  }, []);

  // Función para registrar un nuevo usuario
  const register = async (nombre, email, password) => {
    try {
      // Verificar si el email ya existe
      const response = await fetchWithTimeout(API_URL);
      const usuarios = await response.json();
      
      const emailExiste = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExiste) {
        throw new Error('El email ya está registrado');
      }

      // Crear nuevo usuario
      const nuevoUsuario = {
        nombre,
        email,
        pass: password
      };

      const createResponse = await fetchWithTimeout(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
      });

      if (!createResponse.ok) {
        throw new Error('Error al crear el usuario');
      }

      const usuarioCreado = await createResponse.json();

      // Iniciar sesión automáticamente después del registro
      const isAdmin = email === '1234@admin.com';
      const token = "token" + usuarioCreado.id;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userName', nombre); // Usar el parámetro nombre directamente
      localStorage.setItem('userEmail', email); // Usar el parámetro email directamente
      localStorage.setItem('userId', usuarioCreado.id);
      localStorage.setItem('isAdmin', isAdmin.toString());
      
      setUser({
        id: usuarioCreado.id,
        nombre: nombre, // Usar el parámetro nombre directamente
        email: email, // Usar el parámetro email directamente
        isAuthenticated: true,
        isAdmin: isAdmin
      });

      return { success: true, user: { id: usuarioCreado.id, nombre, email } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      // Obtener todos los usuarios
      const response = await fetchWithTimeout(API_URL);
      if (!response.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const usuarios = await response.json();
      
      // Buscar usuario por email y contraseña
      const usuario = usuarios.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.pass === password
      );

      if (!usuario) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Verificar si es admin
      const isAdmin = email === '1234@admin.com';
      const token = "token" + usuario.id;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userName', usuario.nombre);
      localStorage.setItem('userEmail', usuario.email);
      localStorage.setItem('userId', usuario.id);
      localStorage.setItem('isAdmin', isAdmin.toString());
      
      // Actualizar estado
      setUser({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        isAuthenticated: true,
        isAdmin: isAdmin
      });

      return { success: true, user: usuario };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
