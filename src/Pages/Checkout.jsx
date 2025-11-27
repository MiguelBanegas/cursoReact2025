import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { FaFileInvoice, FaCheckCircle, FaUser, FaEnvelope, FaShoppingBag, FaCreditCard, FaLock } from 'react-icons/fa';
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
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #4CAF50; padding-bottom: 20px;">
          <div>
            <h1 style="color: #4CAF50; margin: 0; font-size: 28px;">FACTURA</h1>
            <p style="margin: 5px 0; color: #666;">N° ${numeroFactura}</p>
          </div>
          <div style="text-align: right;">
            <h3 style="margin: 0; color: #333;">MAB Motors</h3>
            <p style="margin: 5px 0; color: #666;">Fecha: ${fecha}</p>
            <p style="margin: 5px 0; color: #666;">Hora: ${hora}</p>
          </div>
        </div>

        <div style="margin-bottom: 40px; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #4CAF50; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Datos del Cliente</h3>
          <p style="margin: 10px 0;"><strong>Nombre:</strong> ${user.nombre}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${user.email}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #4CAF50; color: white;">
              <th style="padding: 15px; text-align: left; border-radius: 8px 0 0 8px;">Producto</th>
              <th style="padding: 15px; text-align: center;">Cantidad</th>
              <th style="padding: 15px; text-align: right;">Precio Unit.</th>
              <th style="padding: 15px; text-align: right; border-radius: 0 8px 8px 0;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${carrito.map((item, index) => `
              <tr style="border-bottom: 1px solid #eee; background-color: ${index % 2 === 0 ? '#fff' : '#fcfcfc'};">
                <td style="padding: 15px;"><strong>${item.nombre}</strong></td>
                <td style="padding: 15px; text-align: center;">${item.cantidad || 1}</td>
                <td style="padding: 15px; text-align: right;">$${item.precio.toLocaleString('es-AR')}</td>
                <td style="padding: 15px; text-align: right; font-weight: bold;">$${((item.cantidad || 1) * item.precio).toLocaleString('es-AR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 30px; padding-top: 20px; border-top: 2px solid #4CAF50;">
          <h2 style="color: #4CAF50; margin: 0; font-size: 32px;">Total: $${total.toLocaleString('es-AR')}</h2>
        </div>

        <div style="margin-top: 60px; text-align: center; color: #888; font-size: 14px;">
          <p style="margin-bottom: 10px;">¡Gracias por confiar en MAB Motors!</p>
          <p>Este documento es un comprobante de venta válido.</p>
          <p>www.mabmotors.com</p>
        </div>
      </div>
    `;

    // Configuración del PDF
    const opt = {
      margin: 10,
      filename: `factura-mabmotors-${numeroFactura}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-success bg-gradient text-white p-4 text-center">
              <h2 className="mb-0 fw-bold d-flex align-items-center justify-content-center gap-3">
                <FaCheckCircle /> Finalizar Compra
              </h2>
            </div>
            
            <div className="card-body p-4 p-md-5">
              {/* Datos del Cliente */}
              <div className="mb-5">
                <h4 className="fw-bold text-secondary mb-3 d-flex align-items-center gap-2">
                  <FaUser className="text-success" /> Datos del Comprador
                </h4>
                <div className="card bg-light border-0 rounded-3">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="text-muted small mb-1">Nombre Completo</label>
                        <div className="d-flex align-items-center gap-2 fs-5 fw-medium">
                          <FaUser className="text-secondary opacity-50" /> {user.nombre}
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="text-muted small mb-1">Correo Electrónico</label>
                        <div className="d-flex align-items-center gap-2 fs-5 fw-medium">
                          <FaEnvelope className="text-secondary opacity-50" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen de Compra */}
              <div className="mb-5">
                <h4 className="fw-bold text-secondary mb-3 d-flex align-items-center gap-2">
                  <FaShoppingBag className="text-success" /> Resumen del Pedido
                </h4>
                
                {carrito.length === 0 ? (
                  <div className="alert alert-warning text-center">
                    No hay productos en el carrito
                  </div>
                ) : (
                  <div className="border rounded-3 overflow-hidden">
                    <ul className="list-group list-group-flush">
                      {carrito.map((item) => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                          <div>
                            <span className="fw-bold">{item.nombre}</span>
                            <span className="text-muted ms-2">x {item.cantidad || 1}</span>
                          </div>
                          <span className="fw-bold text-dark">
                            ${(item.precio * (item.cantidad || 1)).toLocaleString('es-AR')}
                          </span>
                        </li>
                      ))}
                      <li className="list-group-item bg-light p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fs-5">Total a Pagar</span>
                          <span className="fs-4 fw-bold text-success">
                            ${total.toLocaleString('es-AR')}
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Botón de Confirmación */}
              <div className="d-grid gap-3">
                <button 
                  onClick={handleFinalizarCompra}
                  disabled={carrito.length === 0}
                  className="btn btn-success btn-lg py-3 fw-bold shadow-sm hover-lift d-flex align-items-center justify-content-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', border: 'none' }}
                >
                  <FaFileInvoice /> Confirmar Compra y Generar Factura
                </button>
                
                <div className="text-center text-muted small mt-2 d-flex align-items-center justify-content-center gap-2">
                  <FaLock /> Sus datos están protegidos. La factura se descargará automáticamente.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}
