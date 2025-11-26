import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

import html2pdf from 'html2pdf.js';

export default function Checkout() {
  const { user } = useAuth();
  const { carrito, finalizarCompra } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const total = carrito.reduce((sum, item) => {
    const cantidad = item.cantidad || 1;
    return sum + (item.precio * cantidad);
  }, 0);

  const generarFactura = () => {
    const fecha = new Date().toLocaleDateString('es-AR');
    const hora = new Date().toLocaleTimeString('es-AR', { hour12: false });
    const numeroFactura = Math.floor(Math.random() * 1000000).toString().padStart(8, '0');

    // Crear el contenido HTML de la factura
    const contenido = `
      <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #4CAF50; padding-bottom: 20px;">
          <div>
            <h1 style="color: #4CAF50; margin: 0;">FACTURA</h1>
            <p style="margin: 5px 0;">N° ${numeroFactura}</p>
          </div>
          <div style="text-align: right;">
            <h3 style="margin: 0;">MAB Motors</h3>
            <p style="margin: 5px 0;">Fecha: ${fecha}</p>
            <p style="margin: 5px 0;">Hora: ${hora}</p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">Datos del Cliente</h3>
          <p><strong>Nombre:</strong> ${user.nombre}</p>
          <p><strong>Email:</strong> ${user.email}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #4CAF50; color: white;">
              <th style="padding: 12px; text-align: left;">Producto</th>
              <th style="padding: 12px; text-align: center;">Cantidad</th>
              <th style="padding: 12px; text-align: right;">Precio Unit.</th>
              <th style="padding: 12px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${carrito.map(item => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 12px;">${item.nombre}</td>
                <td style="padding: 12px; text-align: center;">${item.cantidad || 1}</td>
                <td style="padding: 12px; text-align: right;">$${item.precio.toLocaleString('es-AR')}</td>
                <td style="padding: 12px; text-align: right;">$${((item.cantidad || 1) * item.precio).toLocaleString('es-AR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 30px;">
          <h2 style="color: #4CAF50; margin: 0;">Total: $${total.toLocaleString('es-AR')}</h2>
        </div>

        <div style="margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
          <p>¡Gracias por tu compra!</p>
          <p>Este documento es un comprobante de venta válido.</p>
        </div>
      </div>
    `;

    // Configuración del PDF
    const opt = {
      margin: 10,
      filename: `factura-${numeroFactura}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generar y guardar
    html2pdf().from(contenido).set(opt).save();
  };

  const handleFinalizarCompra = () => {
    // Generar factura antes de limpiar el carrito
    generarFactura();
    
    const resultado = finalizarCompra(user.email);
    
    if (resultado.success) {
      showToast('¡Compra exitosa! Tu factura se está descargando...', 'success');
      // Pequeño delay para asegurar que la descarga inicie antes de navegar
      setTimeout(() => {
        navigate('/productos');
      }, 2000);
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
