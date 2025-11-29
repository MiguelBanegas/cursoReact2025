import React , { useEffect }  from 'react'
import Inicio from './Pages/Inicio'
import Servicios from './Pages/Servicios'
import Navbar from './Pages/Navbar'
import Productos from './Pages/Productos'
import ProductoDetalle from './Pages/DetalleProdutos'
import Login from './Pages/Login'
import Checkout from './Pages/Checkout'
import CarritoPage from './Pages/CarritoPage'
import AdminPanel from './Pages/AdminPanel'
import Footer from './Pages/Footer'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import ScrollToTop from './components/ScrollToTop'
import UpdateNotifier from './components/UpdateNotifier'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Componente interno que tiene acceso al contexto de Auth
function AppContent() {
  const { user } = useAuth();

   // 🔹 Conexión WebSocket para recarga automática de builds
  useEffect(() => {
    const ws = new WebSocket('wss://mabcontrol.ar/ws');

    ws.onopen = () => console.log('Conectado al WebSocket');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_BUILD') {
        console.log('Nuevo build detectado, recargando...');
        window.location.reload(); // recarga automática
      }
    };

    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('WebSocket cerrado');

    return () => ws.close();
  }, []);
  
  return (
    <CartProvider userEmail={user?.email}>
      <UpdateNotifier wsUrl="wss://mabcontrol.ar/ws" />
      <ScrollToTop />
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/servicios' element={<Servicios />} />
          <Route path='/productos' element={<Productos />} />
          <Route path='/productos/:id/:nombre' element={<ProductoDetalle />} />
          <Route path='/carrito' element={<CarritoPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/checkout' element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path='/admin' element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  )
}

export default App