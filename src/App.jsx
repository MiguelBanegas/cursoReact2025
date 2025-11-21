import React from 'react'
import Inicio from './Pages/Inicio'
import Servicios from './Pages/Servicios'
import Navbar from './Pages/Navbar'
import Productos from './Pages/Productos'
import ProductoDetalle from './Pages/DetalleProdutos'
import Footer from './Pages/Footer'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/servicios' element={<Servicios />} />
        <Route path='/productos' element={<Productos />} />
        <Route path='/productos/:id' element={<ProductoDetalle />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App