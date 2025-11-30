import { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import ProductCreatedModal from '../components/ProductCreatedModal';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaSearch, FaBoxOpen, FaImage, FaCloudUploadAlt, FaUsers, FaUserShield, FaUser } from 'react-icons/fa';

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
  
  // Estados para manejo de archivos
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(false);

  // Estados para gestión de usuarios
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' o 'usuarios'
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [modalConfigUser, setModalConfigUser] = useState({ isOpen: false, onConfirm: null, userName: '', action: '' });

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
      const response = await fetch('https://api.mabcontrol.ar/api/products');
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
        // Avatar es opcional, solo validar si hay un valor
        if (value.trim() === '') {
          delete newErrors.avatar;
        } else {
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
    // Si el campo está vacío, limpiar preview
    if (value.trim() === '') {
      setImagePreview('');
      return;
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

  // ========== NUEVAS FUNCIONES PARA UPLOAD DE IMÁGENES ==========
  
  // Función para subir imagen al backend
  const uploadImage = async (file) => {
    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch('https://api.mabcontrol.ar/api/products/upload-image', {
        method: 'POST',
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      
      // Actualizar el campo avatar con la URL generada
      setFormData({ ...formData, avatar: data.imageUrl });
      setImagePreview(data.imageUrl);
      showToast('Imagen subida exitosamente', 'success');
      
      return data.imageUrl;
    } catch (error) {
      showToast('Error al subir la imagen', 'error');
      console.error(error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Manejadores de drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  const handleFileSelect = async (file) => {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Solo se permiten imágenes (JPG, PNG, GIF, WEBP)', 'error');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen no debe superar 5MB', 'error');
      return;
    }

    setSelectedFile(file);
    
    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Subir automáticamente
    await uploadImage(file);
  };

  // ========== FIN NUEVAS FUNCIONES ==========

  // ========== FUNCIONES DE GESTIÓN DE USUARIOS ==========

  const cargarUsuarios = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('https://api.mabcontrol.ar/api/users');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      showToast('Error al cargar usuarios', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  const actualizarRol = async (userId, nuevoRol) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.mabcontrol.ar/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nuevoRol })
      });

      if (await handleApiError(response, 'Error al actualizar rol')) {
        showToast('Rol actualizado exitosamente', 'success');
        cargarUsuarios(); // Recargar lista
      }
    } catch (error) {
      showToast('Error de conexión. Verifica tu internet', 'error');
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.mabcontrol.ar/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (await handleApiError(response, 'Error al eliminar usuario')) {
        showToast('Usuario eliminado exitosamente', 'success');
        cargarUsuarios(); // Recargar lista
      }
    } catch (error) {
      showToast('Error de conexión. Verifica tu internet', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openUserModal = (userId, userName, action, newRole = null) => {
    setModalConfigUser({
      isOpen: true,
      onConfirm: () => {
        if (action === 'delete') {
          eliminarUsuario(userId);
        } else if (action === 'role') {
          actualizarRol(userId, newRole);
        }
      },
      userName: userName,
      action: action
    });
  };

  const closeModalUser = () => {
    setModalConfigUser({ isOpen: false, onConfirm: null, userName: '', action: '' });
  };

  // ========== FIN FUNCIONES DE GESTIÓN DE USUARIOS ==========


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
      
      const response = await fetch('https://api.mabcontrol.ar/api/products', {
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
      const response = await fetch(`https://api.mabcontrol.ar/api/products/${editando}`, {
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
      const response = await fetch(`https://api.mabcontrol.ar/api/products/${id}`, {
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
    setSelectedFile(null);
    setUploadingImage(false);
    setDragActive(false);
    setUseUrlInput(false);
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
      </div>

      {/* Tabs de navegación */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
            style={{ 
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'productos' ? 'white' : 'transparent'
            }}
          >
            <FaBoxOpen className="me-2" />
            Productos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('usuarios');
              cargarUsuarios();
            }}
            style={{ 
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'usuarios' ? 'white' : 'transparent'
            }}
          >
            <FaUsers className="me-2" />
            Usuarios
          </button>
        </li>
      </ul>

      {/* Botón Nuevo Producto (solo en tab productos) */}
      {activeTab === 'productos' && !mostrarForm && (
        <div className="d-flex justify-content-end mb-4">
          <button 
            onClick={() => setMostrarForm(true)}
            className="btn btn-success d-flex align-items-center gap-2 shadow-sm rounded-pill px-4"
            style={{ transition: 'all 0.3s' }}
          >
            <FaPlus /> Nuevo Producto
          </button>
        </div>
      )}

      {/* CONTENIDO SEGÚN TAB ACTIVO */}
      {activeTab === 'productos' && (
        <>

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

                  {/* Zona de Drag & Drop para imagen */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <FaImage className="me-2" />
                      Imagen del Producto
                    </label>
                    
                    <div
                      className={`border-2 border-dashed rounded-3 p-4 text-center position-relative ${
                        dragActive ? 'border-primary bg-light' : 'border-secondary'
                      }`}
                      style={{ 
                        transition: 'all 0.3s',
                        minHeight: '200px',
                        cursor: uploadingImage ? 'wait' : 'pointer'
                      }}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => !uploadingImage && document.getElementById('imageInput').click()}
                    >
                      {imagePreview ? (
                        <div className="position-relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid rounded shadow-sm mb-2"
                            style={{ maxHeight: '150px', objectFit: 'contain' }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview('');
                              setFormData({ ...formData, avatar: '' });
                              setSelectedFile(null);
                            }}
                            disabled={uploadingImage}
                          >
                            <FaTimes />
                          </button>
                          <p className="text-muted small mb-0 mt-2">Click para cambiar imagen</p>
                        </div>
                      ) : (
                        <div>
                          <FaCloudUploadAlt size={48} className="text-muted mb-3" />
                          {uploadingImage ? (
                            <>
                              <div className="spinner-border text-primary mb-2" role="status">
                                <span className="visually-hidden">Subiendo...</span>
                              </div>
                              <p className="mb-0 text-primary">Subiendo imagen...</p>
                            </>
                          ) : (
                            <>
                              <p className="mb-2 fw-bold">Arrastra una imagen aquí</p>
                              <p className="text-muted small mb-0">o haz click para seleccionar</p>
                            </>
                          )}
                        </div>
                      )}
                      
                      <input
                        type="file"
                        id="imageInput"
                        className="d-none"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileSelect(e.target.files[0]);
                          }
                        }}
                        disabled={uploadingImage}
                      />
                    </div>
                    
                    <p className="text-muted small mt-2 mb-2">
                      Formatos: JPG, PNG, GIF, WEBP (máx. 5MB)
                    </p>

                    {/* Opción alternativa: URL manual */}
                    <div className="mt-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="useUrlInstead"
                          checked={useUrlInput}
                          onChange={(e) => setUseUrlInput(e.target.checked)}
                        />
                        <label className="form-check-label text-muted small" htmlFor="useUrlInstead">
                          O usar URL de imagen externa
                        </label>
                      </div>
                      
                      {useUrlInput && (
                        <div className="form-floating mt-2">
                          <input
                            type="url"
                            className={`form-control form-control-sm ${errors.avatar ? 'is-invalid' : ''}`}
                            id="avatarUrl"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={formData.avatar}
                            onChange={(e) => handleImageUrlChange(e.target.value)}
                          />
                          <label htmlFor="avatarUrl">URL de Imagen</label>
                          {errors.avatar && <div className="invalid-feedback">{errors.avatar}</div>}
                        </div>
                      )}
                    </div>
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
              <div className="position-relative" style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                <img 
                  src={producto.avatar || '/no-image.png'} 
                  alt={producto.nombre}
                  className="w-100 h-100 object-fit-cover"
                  style={{ transition: 'transform 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onError={(e) => { e.target.src = '/no-image.png'; }}
                />
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
        </>
      )}

      {/* TAB DE USUARIOS */}
      {activeTab === 'usuarios' && (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0 fw-bold">
                <FaUsers className="me-2" />
                Gestión de Usuarios
              </h3>
              <span className="badge bg-primary rounded-pill">
                {usuarios.length} usuarios
              </span>
            </div>

            {loadingUsers ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted mt-3">Cargando usuarios...</p>
              </div>
            ) : usuarios.length === 0 ? (
              <div className="text-center py-5">
                <FaUsers size={64} className="text-muted opacity-50 mb-3" />
                <h4 className="text-muted">No hay usuarios registrados</h4>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(usuario => (
                      <tr key={usuario.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {usuario.role === 'admin' ? (
                              <FaUserShield className="text-danger me-2" />
                            ) : (
                              <FaUser className="text-secondary me-2" />
                            )}
                            <strong>{usuario.nombre}</strong>
                          </div>
                        </td>
                        <td className="text-muted">{usuario.email}</td>
                        <td>
                          <select
                            className={`form-select form-select-sm ${
                              usuario.role === 'admin' ? 'border-danger text-danger' : 'border-secondary'
                            }`}
                            value={usuario.role || 'user'}
                            onChange={(e) => {
                              const newRole = e.target.value;
                              openUserModal(usuario.id, usuario.nombre, 'role', newRole);
                            }}
                            disabled={loading}
                            style={{ width: '140px' }}
                          >
                            <option value="user">👤 Usuario</option>
                            <option value="admin">🛡️ Admin</option>
                          </select>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => openUserModal(usuario.id, usuario.nombre, 'delete')}
                            disabled={loading}
                            title="Eliminar usuario"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de confirmación para usuarios */}
      <ConfirmModal
        isOpen={modalConfigUser.isOpen}
        onClose={closeModalUser}
        onConfirm={modalConfigUser.onConfirm}
        title={modalConfigUser.action === 'delete' ? 'Confirmar Eliminación' : 'Confirmar Cambio de Rol'}
        message={
          modalConfigUser.action === 'delete'
            ? `¿Estás seguro de que deseas eliminar al usuario "${modalConfigUser.userName}"? Esta acción no se puede deshacer.`
            : `¿Estás seguro de que deseas cambiar el rol del usuario "${modalConfigUser.userName}"?`
        }
        confirmText={modalConfigUser.action === 'delete' ? 'Eliminar' : 'Cambiar Rol'}
        cancelText="Cancelar"
      />
    </div>
  );
}
