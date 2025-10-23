import React from 'react'
import './App.css'
import Header from './components/Header.jsx'
import MiBoton from './MiBoton.jsx'
import Tarjeta from './Tarjeta.jsx'
import ListaUsuarios from './ListaUsuarios.jsx'

function App() {
  const Usuarios  = [
    { id: 1, nombre: 'Juan', edad: 28, profesion: 'Ingeniero' },
    { id: 2, nombre: 'María', edad: 34, profesion: 'Diseñadora' },
    { id: 3, nombre: 'Pedro', edad: 22, profesion: 'Estudiante' },
];

  return (
    <>
      <Header />
      <h1 className='hello'>Hello World</h1>
      <h2>Hello World</h2>
      <Subtitulos />
      <MiBoton texto='Haz clic aquí' color='white' />
      <MiBoton texto='Haz clic aquí' color='red' />
      <MiBoton texto='Haz clic aquí' color='green' />

      <Tarjeta 
        titulo='Mi Tarjeta' 
        descripcion='Esta es una descripción de la tarjeta.' 
        botonTexto='Presiona 1' 
        color='orange'
      />
      <Tarjeta 
        titulo='Mi Tarjeta 2' 
        descripcion='Esta es otra descripción de la tarjeta.' 
        botonTexto='Presiona 2' 
        color='purple'
      />
      <Tarjeta 
        titulo='Mi Tarjeta 3' 
        descripcion='Esta es otra descripción de la tarjeta 3.' 
        botonTexto='Presiona 3' 
        color='pink'
      />
      <div><hr /></div>
      <ListaUsuarios Usuarios={Usuarios} />
      <div><hr /></div>
      <Boton />
    </>

  )
} 
export default App

function Subtitulos(){
  return (
    <>
    <h2 className='sub1'>sub1</h2>
    <h3 className='sub2'>sub2</h3>
    </>
  )
} 
export {Subtitulos}

function Boton(){
  return (
    <button className='Boton' onClick={() => alert('Button clicked!')}>Click</button>
  )
}
export {Boton}