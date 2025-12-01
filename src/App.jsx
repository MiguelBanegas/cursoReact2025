import React, { lazy, Suspense } from 'react'
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

// Lazy load all page components for code splitting
const Inicio = lazy(() => import('./Pages/Inicio'))
const Servicios = lazy(() => import('./Pages/Servicios'))
const Navbar = lazy(() => import('./Pages/Navbar'))
const Productos = lazy(() => import('./Pages/Productos'))
const ProductoDetalle = lazy(() => import('./Pages/DetalleProdutos'))
const Login = lazy(() => import('./Pages/Login'))
const Checkout = lazy(() => import('./Pages/Checkout'))
const CarritoPage = lazy(() => import('./Pages/CarritoPage'))
const AdminPanel = lazy(() => import('./Pages/AdminPanel'))
const Footer = lazy(() => import('./Pages/Footer'))

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f8f8'
  }}>
    <div style={{
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #ff4444',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>Cargando...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

// Componente interno que tiene acceso al contexto de Auth
function AppContent() {
  const { user } = useAuth();

  return (
    <CartProvider userEmail={user?.email}>
      <UpdateNotifier />
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
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
      </Suspense>
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