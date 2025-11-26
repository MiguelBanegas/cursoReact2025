import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { user } = useAuth();
  const { carrito, finalizarCompra } = useCart();
  const navigate = useNavigate();

  const total = carrito.reduce((sum, item) => {
    const cantidad = item.cantidad || 1;
    return sum + (item.precio * cantidad);
  }, 0);

  const handleFinalizarCompra = () => {
    const resultado = finalizarCompra(user.email);
    
    if (resultado.success) {
      alert(resultado.message);
      navigate('/productos');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Finalizar Compra</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0' }}>
        <h3>Datos del comprador:</h3>
        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <h3>Resumen de tu compra:</h3>
      
      {carrito.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {carrito.map((item) => (
              <li key={item.id} style={{ 
                padding: '10px', 
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{item.nombre} x {item.cantidad || 1}</span>
                <span>${(item.precio * (item.cantidad || 1)).toLocaleString('es-AR')}</span>
              </li>
            ))}
          </ul>

          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#e8f5e9',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            Total: ${total.toLocaleString('es-AR')}
          </div>

          <button 
            onClick={handleFinalizarCompra}
            style={{ 
              width: '100%', 
              padding: '15px', 
              fontSize: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Confirmar Compra
          </button>
        </>
      )}
    </div>
  );
}
