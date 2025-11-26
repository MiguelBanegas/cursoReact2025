import { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// Provider de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Al montar, verificar si hay sesión guardada en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    if (token && userName && userEmail) {
      setUser({
        nombre: userName,
        email: userEmail,
        isAuthenticated: true
      });
    }
  }, []);

  // Función para iniciar sesión
  const login = (nombre, email) => {
    const token = "token" + nombre;
    
    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userName', nombre);
    localStorage.setItem('userEmail', email);
    
    // Actualizar estado
    setUser({
      nombre,
      email,
      isAuthenticated: true
    });
  };

  // Función para cerrar sesión
  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    // Resetear estado a null
    setUser(null);
  };

  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
