import React from 'react'
import Inicio from './Pages/Inicio'
import Servicios from './Pages/Servicios'
import Navbar from './Pages/Navbar'
import Productos from './Pages/Productos'
import ProductoDetalle from './Pages/DetalleProdutos'
import Login from './Pages/Login'
import Checkout from './Pages/Checkout'
import CarritoPage from './Pages/CarritoPage'
import Footer from './Pages/Footer'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
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
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App