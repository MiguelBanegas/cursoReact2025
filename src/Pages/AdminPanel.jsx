import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

export default function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const { showToast } = useToast();

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

  // CREATE
  const crearProducto = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://6921d58e512fb4140be183e1.mockapi.io/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        showToast('Producto creado exitosamente', 'success');
        cargarProductos();
        resetForm();
      }
    } catch (error) {
      showToast('Error al crear producto', 'error');
    }
  };

  // UPDATE
  const actualizarProducto = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://6921d58e512fb4140be183e1.mockapi.io/api/productos/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        showToast('Producto actualizado exitosamente', 'success');
        cargarProductos();
        resetForm();
      }
    } catch (error) {
      showToast('Error al actualizar producto', 'error');
    }
  };

  // DELETE
  const eliminarProducto = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;
    
    try {
      const response = await fetch(`https://6921d58e512fb4140be183e1.mockapi.io/api/productos/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showToast('Producto eliminado exitosamente', 'success');
        cargarProductos();
      }
    } catch (error) {
      showToast('Error al eliminar producto', 'error');
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
    setMostrarForm(true);
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', precio: '', avatar: '' });
    setEditando(null);
    setMostrarForm(false);
  };

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
            <label>Nombre:</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Descripción:</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '80px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Precio:</label>
            <input
              type="number"
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>URL de Imagen:</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({...formData, avatar: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {editando ? 'Actualizar' : 'Crear'}
            </button>
            <button 
              type="button"
              onClick={resetForm}
              style={{
                padding: '10px 20px',
                backgroundColor: '#999',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
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
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: 'white'
            }}
          >
            <img 
              src={producto.avatar} 
              alt={producto.nombre}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }}
            />
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
              ${typeof producto.precio === 'string' 
                ? parseFloat(producto.precio.replace(/\./g, '')).toLocaleString('es-AR')
                : parseFloat(producto.precio).toLocaleString('es-AR')
              }
            </p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => editarProducto(producto)}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Editar
              </button>
              <button
                onClick={() => eliminarProducto(producto.id, producto.nombre)}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
