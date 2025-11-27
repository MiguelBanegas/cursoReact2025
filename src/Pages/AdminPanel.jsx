import { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import ProductCreatedModal from '../components/ProductCreatedModal';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaImage, FaSearch, FaBoxOpen } from 'react-icons/fa';

export default function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [modalConfig, setModalConfig] = useState({ isOpen: false, onConfirm: null, productName: '' });
  const [productCreatedModal, setProductCreatedModal] = useState({ isOpen: false, productName: '' });
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
    setFormData({ ...formData, [name]: value });
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
    if (value.length > 0 || errors.avatar) {
      validateField('avatar', value);
    }
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
        const productName = formData.nombre.trim();
        showToast('Producto creado exitosamente', 'success');
        cargarProductos();
        resetForm();
        setProductCreatedModal({ isOpen: true, productName });
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

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0 fw-bold" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          <span className="me-2">🔧</span> Panel de Administración
        </h1>
        
        {!mostrarForm && (
          <button 
            onClick={() => setMostrarForm(true)}
            className="btn btn-success d-flex align-items-center gap-2 shadow-sm rounded-pill px-4"
            style={{ transition: 'all 0.3s' }}
          >
            <FaPlus /> Nuevo Producto
          </button>
        )}
      </div>

      {/* FORMULARIO */}
      {mostrarForm && (
        <div className="card border-0 shadow-lg rounded-4 mb-5 animate__animated animate__fadeIn">
          <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h3 className="mb-0 fw-bold text-secondary">
              {editando ? <><FaEdit className="me-2"/>Editar Producto</> : <><FaPlus className="me-2"/>Crear Producto</>}
            </h3>
            <button 
              onClick={resetForm}
              className="btn btn-light rounded-circle p-2"
              title="Cerrar formulario"
            >
              <FaTimes />
            </button>
          </div>
          <div className="card-body p-4">
            <form onSubmit={editando ? actualizarProducto : crearProducto}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      ref={nombreInputRef}
                      type="text"
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                      id="nombre"
                      placeholder="Nombre del producto"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      onBlur={() => handleBlur('nombre')}
                      required
                      minLength={3}
                      maxLength={100}
                    />
                    <label htmlFor="nombre">Nombre del producto *</label>
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
                      id="precio"
                      placeholder="Precio"
                      value={formData.precio}
                      onChange={(e) => handleInputChange('precio', e.target.value)}
                      onBlur={(e) => validateField('precio', e.target.value)}
                      required
                      min="0.01"
                      step="0.01"
                    />
                    <label htmlFor="precio">Precio *</label>
                    {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="url"
                      className={`form-control ${errors.avatar ? 'is-invalid' : ''}`}
                      id="avatar"
                      placeholder="URL de imagen"
                      value={formData.avatar}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      required
                    />
                    <label htmlFor="avatar">URL de Imagen *</label>
                    {errors.avatar && <div className="invalid-feedback">{errors.avatar}</div>}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating mb-3 h-100">
                    <textarea
                      className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                      id="descripcion"
                      placeholder="Descripción"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      onBlur={() => handleBlur('descripcion')}
                      required
                      minLength={10}
                      maxLength={500}
                      style={{ height: '100%', minHeight: '120px' }}
                    ></textarea>
                    <label htmlFor="descripcion">Descripción *</label>
                    <div className="d-flex justify-content-between mt-1">
                      {errors.descripcion && <div className="invalid-feedback d-block">{errors.descripcion}</div>}
                      <small className={`text-muted ms-auto ${formData.descripcion.length > 450 ? 'text-danger' : ''}`}>
                        {formData.descripcion.length}/500
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview de imagen */}
              {imagePreview && !errors.avatar && (
                <div className="mb-4 p-3 bg-light rounded-3 text-center">
                  <p className="text-muted small mb-2">Vista previa de la imagen</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                    onError={() => {
                      setImagePreview('');
                      setErrors({ ...errors, avatar: 'No se pudo cargar la imagen' });
                    }}
                  />
                </div>
              )}

              <div className="d-flex gap-2 justify-content-end mt-4">
                <button 
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="btn btn-light px-4"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading || Object.keys(errors).length > 0}
                  className="btn btn-primary px-4 d-flex align-items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      {editando ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <FaSave /> {editando ? 'Actualizar Producto' : 'Guardar Producto'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTA DE PRODUCTOS */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {productos.map(producto => (
          <div key={producto.id} className="col">
            <div className="card h-100 border-0 shadow-sm hover-lift rounded-4 overflow-hidden">
              <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                <img 
                  src={producto.avatar} 
                  alt={producto.nombre}
                  className="w-100 h-100 object-fit-cover"
                  style={{ transition: 'transform 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div className="position-absolute top-0 end-0 p-2">
                  <span className="badge bg-white text-dark shadow-sm rounded-pill">
                    ID: {producto.id}
                  </span>
                </div>
              </div>
              
              <div className="card-body d-flex flex-column p-3">
                <h5 className="card-title fw-bold text-truncate" title={producto.nombre}>
                  {producto.nombre}
                </h5>
                <p className="card-text text-muted small flex-grow-1" style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {producto.descripcion}
                </p>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                  <span className="h5 mb-0 fw-bold text-success">
                    ${typeof producto.precio === 'string' 
                      ? parseFloat(producto.precio.replace(/\./g, '')).toLocaleString('es-AR')
                      : parseFloat(producto.precio).toLocaleString('es-AR')
                    }
                  </span>
                </div>
                
                <div className="d-flex gap-2 mt-auto">
                  <button
                    onClick={() => editarProducto(producto)}
                    disabled={loading}
                    className="btn btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-1 btn-sm"
                  >
                    <FaEdit /> Editar
                  </button>
                  <button
                    onClick={() => openDeleteModal(producto.id, producto.nombre)}
                    disabled={loading}
                    className="btn btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-1 btn-sm"
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {productos.length === 0 && !cargando && (
        <div className="text-center py-5">
          <div className="mb-3 text-muted opacity-50">
            <FaBoxOpen size={64} />
          </div>
          <h3 className="text-muted">No hay productos disponibles</h3>
          <p className="text-muted">Comienza creando uno nuevo con el botón superior.</p>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar "${modalConfig.productName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {/* Modal de producto creado */}
      <ProductCreatedModal
        isOpen={productCreatedModal.isOpen}
        onClose={() => setProductCreatedModal({ isOpen: false, productName: '' })}
        onContinue={() => setMostrarForm(true)}
        productName={productCreatedModal.productName}
      />

      <style>{`
        .hover-lift {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .form-floating > .form-control:focus ~ label,
        .form-floating > .form-control:not(:placeholder-shown) ~ label {
          color: #667eea;
          transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
        }
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
        }
      `}</style>
    </div>
  );
}
