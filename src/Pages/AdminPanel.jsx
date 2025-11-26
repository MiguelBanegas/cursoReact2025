import { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [modalConfig, setModalConfig] = useState({ isOpen: false, onConfirm: null, productName: '' });
  const { showToast } = useToast();
  const nombreInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    avatar: ''
  });

  // Cargar productos
  useEffect(() => {
    cargarProductos();
  }, []);

  // Auto-focus en el primer campo cuando se edita un producto
  useEffect(() => {
    if (mostrarForm && nombreInputRef.current) {
      nombreInputRef.current.focus();
    }
  }, [mostrarForm, editando]);

  const cargarProductos = async () => {
    try {
      const response = await fetch('https://6921d58e512fb4140be183e1.mockapi.io/api/productos');
      const data = await response.json();
      setProductos(data);
      setCargando(false);
    } catch (error) {
      showToast('Error al cargar productos', 'error');
      setCargando(false);
    }
  };

  // Validación de campos individuales
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'nombre':
        if (value.length < 3) {
          newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        } else if (value.length > 100) {
          newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
        } else {
          delete newErrors.nombre;
        }
        break;

      case 'descripcion':
        if (value.length < 10) {
          newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
        } else if (value.length > 500) {
          newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
        } else {
          delete newErrors.descripcion;
        }
        break;

      case 'precio':
        const precio = parseFloat(value);
        if (isNaN(precio) || precio <= 0) {
          newErrors.precio = 'El precio debe ser mayor a 0';
        } else {
          delete newErrors.precio;
        }
        break;

      case 'avatar':
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
        try {
          const url = new URL(value);
          if (!imageExtensions.test(url.pathname)) {
            newErrors.avatar = 'La URL debe terminar en .jpg, .jpeg, .png, .gif o .webp';
          } else {
            delete newErrors.avatar;
          }
        } catch {
          newErrors.avatar = 'Ingresa una URL válida';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validación completa del formulario
  const validateForm = () => {
    const isNombreValid = validateField('nombre', formData.nombre);
    const isDescripcionValid = validateField('descripcion', formData.descripcion);
    const isPrecioValid = validateField('precio', formData.precio);
    const isAvatarValid = validateField('avatar', formData.avatar);

    return isNombreValid && isDescripcionValid && isPrecioValid && isAvatarValid;
  };

  // Manejar cambios en inputs con validación en tiempo real
  const handleInputChange = (name, value) => {
    // NO aplicar trim aquí para permitir espacios entre palabras
    setFormData({ ...formData, [name]: value });
    
    // Validar solo si el campo ya tiene contenido o ya se mostró un error
    // NO validar precio en onChange (se validará en onBlur)
    if (name !== 'precio' && (value.length > 0 || errors[name])) {
      validateField(name, value);
    }
  };

  // Aplicar trim al salir del campo (onBlur)
  const handleBlur = (name) => {
    if (name === 'nombre' || name === 'descripcion') {
      const trimmedValue = formData[name].trim();
      setFormData({ ...formData, [name]: trimmedValue });
      validateField(name, trimmedValue);
    }
  };

  // Manejar cambios en URL de imagen con preview
  const handleImageUrlChange = (value) => {
    setFormData({ ...formData, avatar: value });
    
    // Validar URL
    if (value.length > 0 || errors.avatar) {
      validateField('avatar', value);
    }

    // Intentar cargar preview
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    try {
      const url = new URL(value);
      if (imageExtensions.test(url.pathname)) {
        setImagePreview(value);
      } else {
        setImagePreview('');
      }
    } catch {
      setImagePreview('');
    }
  };

  // Manejo de errores HTTP
  const handleApiError = async (response, defaultMessage) => {
    if (!response.ok) {
      if (response.status === 400) {
        showToast('Datos inválidos. Verifica el formulario', 'error');
      } else if (response.status === 404) {
        showToast('Producto no encontrado', 'error');
      } else if (response.status === 500) {
        showToast('Error del servidor. Intenta más tarde', 'error');
      } else {
        showToast(defaultMessage, 'error');
      }
      return false;
    }
    return true;
  };

  // CREATE
  const crearProducto = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Por favor corrige los errores del formulario', 'error');
      return;
    }

    setLoading(true);
    try {
      // Calcular el nuevo ID como máximo ID existente + 1
      const maxId = productos.length > 0 
        ? Math.max(...productos.map(p => parseInt(p.id))) 
        : 0;
      const nuevoId = String(maxId + 1);
      
      const response = await fetch('https://6921d58e512fb4140be183e1.mockapi.io/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: nuevoId,
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim()
        })
      });
      
      if (await handleApiError(response, 'Error al crear producto')) {
        showToast('Producto creado exitosamente', 'success');
        cargarProductos();
        resetForm();
      }
    } catch (error) {
      showToast('Error de conexión. Verifica tu internet', 'error');
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const actualizarProducto = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Por favor corrige los errores del formulario', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://6921d58e512fb4140be183e1.mockapi.io/api/productos/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim()
        })
      });
      
      if (await handleApiError(response, 'Error al actualizar producto')) {
        showToast('Producto actualizado exitosamente', 'success');
        cargarProductos();
        resetForm();
      }
    } catch (error) {
      showToast('Error de conexión. Verifica tu internet', 'error');
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const eliminarProducto = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://6921d58e512fb4140be183e1.mockapi.io/api/productos/${id}`, {
        method: 'DELETE'
      });
      
      if (await handleApiError(response, 'Error al eliminar producto')) {
        showToast('Producto eliminado exitosamente', 'success');
        cargarProductos();
      }
    } catch (error) {
      showToast('Error de conexión. Verifica tu internet', 'error');
    } finally {
      setLoading(false);
    }
  };

  const editarProducto = (producto) => {
    setEditando(producto.id);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      avatar: producto.avatar
    });
    setImagePreview(producto.avatar);
    setErrors({});
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', precio: '', avatar: '' });
    setEditando(null);
    setMostrarForm(false);
    setErrors({});
    setImagePreview('');
  };

  const openDeleteModal = (id, nombre) => {
    setModalConfig({
      isOpen: true,
      onConfirm: () => eliminarProducto(id),
      productName: nombre
    });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, onConfirm: null, productName: '' });
  };

  // Estilos para inputs con validación
  const getInputStyle = (fieldName) => ({
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    border: errors[fieldName] 
      ? '2px solid #f44336' 
      : formData[fieldName] && !errors[fieldName] 
        ? '2px solid #4CAF50' 
        : '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.2s'
  });

  if (cargando) return <p>Cargando...</p>;

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <h1>🔧 Panel de Administración</h1>
      
      <button 
        onClick={() => setMostrarForm(!mostrarForm)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {mostrarForm ? 'Cancelar' : '+ Nuevo Producto'}
      </button>

      {/* FORMULARIO */}
      {mostrarForm && (
        <form 
          onSubmit={editando ? actualizarProducto : crearProducto}
          style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px'
          }}
        >
          <h3>{editando ? 'Editar Producto' : 'Crear Producto'}</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Nombre: *</label>
            <input
              ref={nombreInputRef}
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              onBlur={() => handleBlur('nombre')}
              required
              minLength={3}
              maxLength={100}
              placeholder="Ej: Notebook Dell Inspiron"
              style={getInputStyle('nombre')}
            />
            {errors.nombre && (
              <p style={{ color: '#f44336', fontSize: '13px', margin: '5px 0 0 0' }}>
                {errors.nombre}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Descripción: *</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              onBlur={() => handleBlur('descripcion')}
              required
              minLength={10}
              maxLength={500}
              placeholder="Describe las características principales del producto..."
              style={{ ...getInputStyle('descripcion'), minHeight: '80px' }}
            />
            
            {/* Contador de caracteres y errores */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '5px'
            }}>
              {errors.descripcion && (
                <p style={{ color: '#f44336', fontSize: '13px', margin: 0 }}>
                  {errors.descripcion}
                </p>
              )}
              <p style={{ 
                color: formData.descripcion.length > 450 ? '#f44336' : '#666',
                fontSize: '13px', 
                margin: 0,
                marginLeft: errors.descripcion ? '10px' : 'auto'
              }}>
                {formData.descripcion.length}/500 caracteres
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Precio: *</label>
            <input
              type="number"
              value={formData.precio}
              onChange={(e) => handleInputChange('precio', e.target.value)}
              onBlur={(e) => validateField('precio', e.target.value)}
              required
              min="0.01"
              step="0.01"
              placeholder="Ej: 15000"
              style={getInputStyle('precio')}
            />
            {errors.precio && (
              <p style={{ color: '#f44336', fontSize: '13px', margin: '5px 0 0 0' }}>
                {errors.precio}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>URL de Imagen: *</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              required
              style={getInputStyle('avatar')}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {errors.avatar && (
              <p style={{ color: '#f44336', fontSize: '13px', margin: '5px 0 0 0' }}>
                {errors.avatar}
              </p>
            )}
            
            {/* Preview de imagen */}
            {imagePreview && !errors.avatar && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '13px', color: '#666', margin: '0 0 5px 0' }}>
                  Vista previa:
                </p>
                <img 
                  src={imagePreview} 
                  alt="Preview"
                  style={{ 
                    width: '200px', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    border: '2px solid #4CAF50'
                  }}
                  onError={() => {
                    setImagePreview('');
                    setErrors({ ...errors, avatar: 'No se pudo cargar la imagen' });
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              style={{
                padding: '10px 20px',
                backgroundColor: loading || Object.keys(errors).length > 0 ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading || Object.keys(errors).length > 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {loading 
                ? (editando ? 'Actualizando...' : 'Creando...') 
                : (editando ? 'Actualizar' : 'Crear')
              }
            </button>
            <button 
              type="button"
              onClick={resetForm}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#ccc' : '#999',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE PRODUCTOS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {productos.map(producto => (
          <div 
            key={producto.id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            {/* Imagen del producto */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img 
                src={producto.avatar} 
                alt={producto.nombre}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover'
                }}
              />
            </div>
            
            {/* Contenido de la tarjeta */}
            <div style={{ 
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1
            }}>
              {/* Título */}
              <h3 style={{ 
                margin: '0 0 10px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                minHeight: '44px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {producto.nombre}
              </h3>
              
              {/* Descripción truncada */}
              <p style={{ 
                margin: '0 0 10px 0',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.4'
              }}>
                {producto.descripcion.length > 30 
                  ? producto.descripcion.substring(0, 30) + '...' 
                  : producto.descripcion}
              </p>
              
              {/* Precio */}
              <p style={{ 
                margin: '0 0 15px 0',
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#4CAF50'
              }}>
                ${typeof producto.precio === 'string' 
                  ? parseFloat(producto.precio.replace(/\./g, '')).toLocaleString('es-AR')
                  : parseFloat(producto.precio).toLocaleString('es-AR')
                }
              </p>
              
              {/* Espaciador para empujar botones al fondo */}
              <div style={{ flexGrow: 1 }}></div>
              
              {/* Botones en la parte inferior */}
              <div style={{ 
                display: 'flex', 
                gap: '10px',
                marginTop: 'auto'
              }}>
                <button
                  onClick={() => editarProducto(producto)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: loading ? '#ccc' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => openDeleteModal(producto.id, producto.nombre)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: loading ? '#ccc' : '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar "${modalConfig.productName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
