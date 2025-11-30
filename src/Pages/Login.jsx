import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CiLogin } from "react-icons/ci";

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
          
          // Redirigir según el rol del usuario
          if (result.user.role === 'admin') {
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
          
          // Redirigir según el rol del usuario
          if (result.user.role === 'admin') {
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

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100" style={{ background: '#f8f9fa' }}>
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '450px', borderRadius: '15px' }}>
        <div className="card-body p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="mb-3 d-inline-block p-3 rounded-circle" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <CiLogin style={{ fontSize: '40px', color: 'white' }} />
            </div>
            <h2 className="fw-bold mb-1" style={{ color: '#333' }}>
              {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
            </h2>
            <p className="fw-bold">
              {isLogin 
                ? 'Ingresa tus credenciales para continuar' 
                : 'Regístrate para comenzar a comprar'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Campo Nombre (solo en registro) */}
            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label fw-semibold small text-secondary">Nombre completo</label>
                <input
                  type="text"
                  className={`form-control form-control-lg ${errors.nombre ? 'is-invalid' : ''}`}
                  id="nombre"
                  value={nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  onBlur={() => validateField('nombre', nombre)}
                  placeholder="Ej: Juan Pérez"
                  style={{ fontSize: '15px' }}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>
            )}

            {/* Campo Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold small text-secondary">Email</label>
              <input
                type="email"
                className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => validateField('email', email)}
                placeholder="tu@email.com"
                style={{ fontSize: '15px' }}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Campo Contraseña */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold small text-secondary">Contraseña</label>
              <input
                type="password"
                className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => validateField('password', password)}
                placeholder="Mínimo 6 caracteres"
                style={{ fontSize: '15px' }}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            {/* Campo Confirmar Contraseña (solo en registro) */}
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label fw-semibold small text-secondary">Confirmar contraseña</label>
                <input
                  type="password"
                  className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => validateField('confirmPassword', confirmPassword)}
                  placeholder="Repite tu contraseña"
                  style={{ fontSize: '15px' }}
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              className="btn w-100 py-3 mt-2 fw-bold text-white shadow-sm"
              disabled={loading || Object.keys(errors).length > 0}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Procesando...</span>
                </div>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Registrarse'
              )}
            </button>
          </form>

          {/* Toggle entre Login y Registro */}
          <div className="text-center mt-4 pt-3 border-top">
            <p className="fst-italic">
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              className="btn btn-link text-decoration-none fw-bold p-0"
              style={{ color: '#667eea' }}
            >
              {isLogin ? 'Crear cuenta nueva' : 'Iniciar sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
