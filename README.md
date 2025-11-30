# 🛒 E-commerce MAB Control

Sistema de comercio electrónico completo desarrollado con React, Node.js y Firebase. Incluye panel de administración, gestión de usuarios con roles, carrito de compras persistente y sistema de carga de imágenes optimizado.

![React](https://img.shields.io/badge/React-19-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange) ![Vite](https://img.shields.io/badge/Vite-Build-purple)

## 🚀 Características Principales

### 🛍️ Frontend (Cliente)

- **Catálogo de Productos:** Visualización dinámica con filtrado y búsqueda.
- **Carrito de Compras:** Persistencia local y en base de datos (para usuarios registrados).
- **Autenticación:** Login y Registro con validación de roles (Admin/User).
- **Panel de Administración:**
  - CRUD completo de productos.
  - **Gestión de Imágenes:** Drag & drop, upload automático y optimización.
  - **Gestión de Usuarios:** Asignación de roles y eliminación de usuarios.
- **PWA & Offline:** Service Worker para funcionamiento offline y notificaciones de actualización.
- **UI Moderna:** Diseño responsivo con Bootstrap y React Icons.

### 🔙 Backend (API)

- **REST API:** Construida con Express.js.
- **Base de Datos:** Firebase Firestore (NoSQL).
- **Almacenamiento:** Sistema de archivos local (VPS) servido estáticamente.
- **Optimización de Imágenes:** Procesamiento automático con `sharp` (resize + compresión).
- **Seguridad:** Validación de roles y manejo de errores centralizado.

---

## 🛠️ Tecnologías

### Frontend

- **React 19** + **Vite**
- **React Router DOM** (Navegación)
- **Context API** (Gestión de estado global: Auth, Cart, Toast)
- **Bootstrap 5** (Estilos)
- **React Icons**

### Backend

- **Node.js** + **Express**
- **Firebase Admin SDK** (Conexión a Firestore)
- **Multer** (Manejo de `multipart/form-data`)
- **Sharp** (Procesamiento de imágenes)
- **UUID** (Generación de IDs únicos)

---

## 📂 Estructura del Proyecto

```
carrito/
├── public/              # Archivos estáticos y Service Worker (sw.js)
├── src/
│   ├── components/      # Componentes reutilizables (Navbar, ProtectedRoute, etc.)
│   ├── context/         # Contextos (AuthContext, CartContext)
│   ├── Pages/           # Vistas principales (Inicio, Productos, AdminPanel)
│   ├── services/        # Lógica de conexión con API
│   └── App.jsx          # Componente principal
├── .api-files/          # Código fuente del Backend (para deploy)
│   └── src/
│       ├── controllers/ # Lógica de negocio (productController, userController)
│       ├── middleware/  # Middlewares (uploadMiddleware)
│       └── app.js       # Configuración de Express
└── README.md            # Documentación
```

---

## 🔌 Documentación de la API

La API corre en el puerto `3000` (o `3003` según configuración) y sirve los endpoints bajo `/api`.

### 📦 Productos

| Método   | Endpoint                     | Descripción                 |
| -------- | ---------------------------- | --------------------------- |
| `GET`    | `/api/products`              | Obtener todos los productos |
| `POST`   | `/api/products`              | Crear nuevo producto        |
| `PUT`    | `/api/products/:id`          | Actualizar producto         |
| `DELETE` | `/api/products/:id`          | Eliminar producto           |
| `POST`   | `/api/products/upload-image` | Subir imagen (Multipart)    |

### 👥 Usuarios

| Método   | Endpoint              | Descripción                                |
| -------- | --------------------- | ------------------------------------------ |
| `GET`    | `/api/users`          | Obtener todos los usuarios                 |
| `POST`   | `/api/users`          | Registrar usuario (Rol 'user' por defecto) |
| `PUT`    | `/api/users/:id/role` | Cambiar rol (`{ role: "admin" }`)          |
| `DELETE` | `/api/users/:id`      | Eliminar usuario                           |

### 🛒 Carrito

| Método | Endpoint            | Descripción                 |
| ------ | ------------------- | --------------------------- |
| `GET`  | `/api/cart/:userId` | Obtener carrito del usuario |
| `POST` | `/api/cart/:userId` | Guardar/Actualizar carrito  |

---

## ⚙️ Instalación y Despliegue

### 1. Configuración Local

```bash
# Instalar dependencias frontend
npm install

# Instalar dependencias backend (si se corre local)
cd .api-files
npm install
```

### 2. Variables de Entorno

El backend requiere las credenciales de Firebase (`serviceAccountKey.json`) en `src/config/firebase.js`.

### 3. Despliegue en VPS

1. **Backend:** Copiar el contenido de `.api-files` al servidor (`/var/www/api-ecommerce`).
2. **Nginx:** Configurar proxy reverso y servir estáticos.
   ```nginx
   location /uploads/ {
       alias /var/www/api-ecommerce/uploads/;
   }
   ```
3. **Frontend:** Build de producción.
   ```bash
   npm run build
   ```

---

## 🌟 Funcionalidades Destacadas

### Sistema de Roles

Los usuarios tienen un campo `role` en Firestore (`admin` o `user`).

- **AuthContext** lee este rol al iniciar sesión.
- **AdminRoute** protege las rutas sensibles.
- **AdminPanel** permite cambiar roles dinámicamente.

### Carga de Imágenes

1. Usuario arrastra imagen en AdminPanel.
2. Frontend valida tipo y tamaño.
3. Backend recibe archivo con `multer`.
4. `sharp` redimensiona a max 1200px y comprime (JPEG/WebP).
5. Se guarda en disco y se genera URL pública.

### Notificaciones de Actualización

El **Service Worker** detecta cambios en la versión de la app.

- Muestra un banner "🚀 Nueva versión disponible".
- Permite actualizar sin perder el estado de la sesión.

---

Desarrollado por **Miguel Banegas** - 2025
