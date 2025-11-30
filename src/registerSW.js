// Registra el Service Worker y detecta actualizaciones
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registrado correctamente");

          // Verifica actualizaciones cada 60 segundos
          setInterval(() => {
            registration.update();
          }, 60000);

          // Detecta cuando hay una nueva versión disponible
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            console.log("🔄 Nueva versión detectada, instalando...");

            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // Hay una nueva versión disponible
                console.log("✨ Nueva versión lista para activar");

                // Opción 1: Pregunta al usuario
                const shouldUpdate = confirm(
                  "🎉 Hay una nueva versión de MAB Motors disponible.\n\n" +
                    "¿Deseas actualizar ahora para obtener las últimas mejoras?"
                );

                if (shouldUpdate) {
                  // Envía mensaje al SW para que se active inmediatamente
                  newWorker.postMessage("SKIP_WAITING");
                  window.location.reload();
                } else {
                  console.log(
                    "⏳ Actualización pospuesta. Se aplicará en la próxima visita."
                  );
                }

                // Opción 2: Actualización automática (descomenta si prefieres esto)
                // newWorker.postMessage('SKIP_WAITING');
                // setTimeout(() => window.location.reload(), 1000);
              }
            });
          });
        })
        .catch((error) => {
          console.error("❌ Error al registrar Service Worker:", error);
        });
    });
  } else {
    console.warn("⚠️ Service Workers no soportados en este navegador");
  }
}
