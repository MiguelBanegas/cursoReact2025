import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); // Toggle entre login y registro
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar campo individual
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'nombre':
        if (!isLogin && value.trim().length < 3) {
          newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        } else {
          delete newErrors.nombre;
        }
        break;

      case 'email':
        if (!validateEmail(value)) {
          newErrors.email = 'Ingresa un email válido';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (value.length < 6) {
          newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (!isLogin && value !== password) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en inputs
  const handleInputChange = (name, value) => {
    switch (name) {
      case 'nombre':
        setNombre(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    // Validar si el campo ya tiene contenido o ya se mostró un error
    if (value.length > 0 || errors[name]) {
      validateField(name, value);
    }
  };

  // Cambiar entre login y registro
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setNombre('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  // Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos
    const isEmailValid = validateField('email', email);
    const isPasswordValid = validateField('password', password);
    const isNombreValid = isLogin || validateField('nombre', nombre);
    const isConfirmPasswordValid = isLogin || validateField('confirmPassword', confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isNombreValid || !isConfirmPasswordValid) {
      showToast('Por favor corrige los errores del formulario', 'error');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const result = await login(email, password);
        
        if (result.success) {
          showToast(`¡Bienvenido ${result.user.nombre}!`, 'success');
          
          // Redirigir según el tipo de usuario
          if (email === '1234@admin.com') {
            navigate('/admin');
          } else {
            navigate('/productos');
          }
        } else {
          showToast(result.error, 'error');
        }
      } else {
        // REGISTRO
        const result = await register(nombre, email, password);
        
        if (result.success) {
          showToast(`¡Registro exitoso! Bienvenido ${result.user.nombre}!`, 'success');
          
          // Redirigir según el tipo de usuario
          if (email === '1234@admin.com') {
            navigate('/admin');
          } else {
            navigate('/productos');
          }
        } else {
          showToast(result.error, 'error');
        }
      }
    } catch (error) {
      showToast('Error de conexión. Intenta nuevamente', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Estilos para inputs con validación
  const getInputStyle = (fieldName) => ({
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: errors[fieldName]
      ? '2px solid #f44336'
      : '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s'
  });

  return (
    <div style={{ 
      maxWidth: '450px', 
      margin: '50px auto', 
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Título */}
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '10px',
        fontSize: '28px',
        color: '#333'
      }}>
        {isLogin ? '🔐 Iniciar Sesión' : '📝 Registrarse'}
      </h2>
      
      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '30px',
        fontSize: '14px'
      }}>
        {isLogin 
          ? 'Ingresa tus credenciales para continuar' 
          : 'Crea una cuenta para comenzar a comprar'}
      </p>

      <form onSubmit={handleSubmit}>
        {/* Campo Nombre (solo en registro) */}
        {!isLogin && (
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="nombre" style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Nombre completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              onBlur={() => validateField('nombre', nombre)}
              placeholder="Ej: Juan Pérez"
              autoComplete="name"
              style={getInputStyle('nombre')}
              required={!isLogin}
            />
            {errors.nombre && (
              <p style={{ color: '#f44336', fontSize: '13px', margin: '5px 0 0 0' }}>
                {errors.nombre}
              </p>
            )}
          </div>
        )}

        {/* Campo Email */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: '#333'
          }}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => validateField('email', email)}
            placeholder="tu@email.com"
            autoComplete="email"
            style={getInputStyle('email')}
            required
          />
          {errors.email && (
            <p style={{ color: '#f44336', fontSize: '13px', margin: '5px 0 0 0' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Campo Contraseña */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: '#333'
          }}>
            Contraseña *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            onBlur={() => validateField('password', password)}
            placeholder="Mínimo 6 caracteres"
            autoComplete={isLogin ? "current-password" : "new-password"}
            style={getInputStyle('password')}
            required
          />
          {errors.password && (
            <p style={{ color: '#f44336', fontSize: '13px', margin: '5px 0 0 0' }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Campo Confirmar Contraseña (solo en registro) */}
        {!isLogin && (
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="confirmPassword" style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Confirmar contraseña *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onBlur={() => validateField('confirmPassword', confirmPassword)}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              style={getInputStyle('confirmPassword')}
              required={!isLogin}
            />
            {errors.confirmPassword && (
              <p style={{ color: '#f44336', fontSize: '13px', margin: '5px 0 0 0' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading || Object.keys(errors).length > 0}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: loading || Object.keys(errors).length > 0 ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading || Object.keys(errors).length > 0 ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            marginBottom: '20px'
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <svg 
                style={{ 
                  animation: 'spin 1s linear infinite', 
                  height: '20px', 
                  width: '20px', 
                  color: 'white' 
                }} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  style={{ opacity: 0.25 }} 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  style={{ opacity: 0.75 }} 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
                <style>
                  {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                </style>
              </svg>
              <span>{isLogin ? 'Iniciando sesión...' : 'Registrando...'}</span>
            </div>
          ) : (
            isLogin ? 'Iniciar Sesión' : 'Registrarse'
          )}
        </button>
      </form>

      {/* Toggle entre Login y Registro */}
      <div style={{ 
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #e0e0e0'
      }}>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
          {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
        </p>
        <button
          type="button"
          onClick={toggleMode}
          disabled={loading}
          style={{
            backgroundColor: 'transparent',
            color: '#2196F3',
            border: 'none',
            fontSize: '15px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isLogin ? 'Crear cuenta nueva' : 'Iniciar sesión'}
        </button>
      </div>
    </div>
  );
}
