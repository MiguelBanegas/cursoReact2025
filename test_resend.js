/**
 * Script de prueba para verificar el envío de emails con Resend
 *
 * INSTRUCCIONES:
 * 1. Instala resend: npm install resend
 * 2. Crea un archivo .env en la raíz del proyecto con:
 *    RESEND_API_KEY=tu_api_key_aqui
 * 3. Ejecuta: node test_resend.js
 */

import { Resend } from "resend";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmailSend() {
  console.log("🧪 Iniciando prueba de envío de email con Resend...\n");

  // Datos de prueba simulando una compra
  const testData = {
    userEmail: "tu-email@ejemplo.com", // ⚠️ CAMBIA ESTO por tu email real
    cartItems: [
      { nombre: "Producto de Prueba 1", cantidad: 2, precio: 1500 },
      { nombre: "Producto de Prueba 2", cantidad: 1, precio: 2500 },
    ],
    total: 5500,
  };

  try {
    console.log("📧 Enviando email a:", testData.userEmail);
    console.log("📦 Productos:", testData.cartItems.length);
    console.log("💰 Total: $", testData.total);
    console.log("\n⏳ Procesando...\n");

    const { data, error } = await resend.emails.send({
      from: "Ventas <noreply@mabcontrol.ar>", // Remitente verificado en Resend
      to: testData.userEmail,
      subject: "✅ Confirmación de Compra - Prueba",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .product-list { list-style: none; padding: 0; }
            .product-item { padding: 10px; border-bottom: 1px solid #ddd; }
            .total { font-size: 1.2em; font-weight: bold; color: #4CAF50; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Gracias por tu compra!</h1>
            </div>
            <div class="content">
              <p>Hemos recibido tu pedido correctamente.</p>
              <h2>Detalle de tu compra:</h2>
              <ul class="product-list">
                ${testData.cartItems
                  .map(
                    (item) => `
                  <li class="product-item">
                    <strong>${item.nombre}</strong><br>
                    Cantidad: ${item.cantidad} × $${item.precio} = $${
                      item.cantidad * item.precio
                    }
                  </li>
                `
                  )
                  .join("")}
              </ul>
              <div class="total">
                Total: $${testData.total}
              </div>
              <p style="margin-top: 30px;">
                <strong>Este es un email de prueba.</strong><br>
                Si recibiste este correo, ¡Resend está funcionando correctamente! 🎉
              </p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Error al enviar el email:", error);
      return;
    }

    console.log("✅ ¡Email enviado exitosamente!");
    console.log("📬 ID del email:", data.id);
    console.log(
      "\n🎉 Revisa tu bandeja de entrada (y spam) en:",
      testData.userEmail
    );
  } catch (error) {
    console.error("❌ Error inesperado:", error.message);

    if (error.message.includes("API key")) {
      console.log("\n⚠️  Asegúrate de:");
      console.log("   1. Tener un archivo .env con RESEND_API_KEY");
      console.log("   2. Que la API key sea válida");
    }
  }
}

// Ejecutar la prueba
testEmailSend();
