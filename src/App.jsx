import React, { useState, useRef } from 'react';

import './App.css';
import Header from './components/Header.jsx';
import MiBoton from './MiBoton.jsx';
import Tarjeta from './Tarjeta.jsx';
import ListaUsuarios from './ListaUsuarios.jsx';
import Formulario from './components/Formulario.jsx';
import BtnGenerico from './components/BtnGenerico.jsx';

function App() {
  const Usuarios = [
    { id: 1, nombre: 'Juan', edad: 28, profesion: 'Ingeniero' },
    { id: 2, nombre: 'María', edad: 34, profesion: 'Diseñadora' },
    { id: 3, nombre: 'Pedro', edad: 22, profesion: 'Estudiante' },
  ];
  const [count, setCount] = useState(0);

  const animationFrameRef = useRef();
  const isMouseDownRef = useRef(false);
  const lastIncrementTimeRef = useRef(0);
  const incrementInterval = 200; // ms

  const loop = (currentTime) => {
    if (!isMouseDownRef.current) return;

    if (currentTime - lastIncrementTimeRef.current > incrementInterval) {
      setCount(prev => prev + 1);
      lastIncrementTimeRef.current = currentTime;
    }
    animationFrameRef.current = requestAnimationFrame(loop);
  }

  const handleMouseDown = (e) => {
    e.preventDefault();
    isMouseDownRef.current = true;
    setCount(prev => prev + 1);
    lastIncrementTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(loop);
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
    cancelAnimationFrame(animationFrameRef.current);
  };

  return (
    <>
      <Header />
      <div><hr /></div>
      <BtnGenerico texto="Botón Genérico" color="teal" onClick={() => alert('Botón Genérico clickeado!')} />
     
      <div><hr /></div>
      <div>
        <MiBoton 
          onMouseDown={handleMouseDown} 
          onMouseUp={handleMouseUpOrLeave} 
          onMouseLeave={handleMouseUpOrLeave} 
          texto='Suma' 
          color='white' 
        />

        <MiBoton onClick={() => setCount(count - 1)} texto='Resta' color='red' />

        <MiBoton onMouseOver={() => alert(`Total: ${count}`)} texto='Total' color='green' />
      </div>
      <div><hr /></div>
      <h3>Contador: {count} </h3>
      <div><hr /></div>

      <MiBoton onMouseOver={() => setCount(0)} texto='vaciar' color='blue' />
      
      <div><hr /></div>

      <Formulario />
      <div><hr /></div>
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
  );
} 
export default App;


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