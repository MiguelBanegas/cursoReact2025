import React from 'react';
import { useState } from 'react';

function Formulario() {

  const [formulario, setFormulario] = useState({ // Estado inicial del formulario
    nombre: '',
    edad: '',
    profesion: '',
    email: ''
  });

    const handleSubmit = (e) => { // Maneja el envío del formulario
      e.preventDefault(); // Evita el comportamiento por defecto del formulario
      console.log('Nombre:', formulario.nombre);
      console.log('Edad:', formulario.edad);
      console.log('Profesión:', formulario.profesion);
      console.log('Email:', formulario.email);


      setFormulario({ // Actualiza el estado del formulario a valores vacíos
        nombre: '',
        edad: '',
        profesion: '',
        email: ''
      });   
    
    };

    const manejarCambio = (e) => { // Maneja los cambios en los campos del formulario
        const { name, value } = e.target; // Obtiene el nombre y valor del campo que cambió
        
        setFormulario({ // Actualiza el estado del formulario con el nuevo valor
          ...formulario, // Copia el estado actual
          [name]: name === 'nombre' || name === 'profesion' ? value.toUpperCase() : value // Actualiza el campo específico con el valor proporcionado en mayúsculas si es nombre o profesión
        });
      };


    return (
      <form onSubmit={handleSubmit}> {/* Maneja el envío del formulario */}
        <h2>Formulario</h2>
        <input
          type="text"
          placeholder="Nombre"
          name="nombre"
          value={formulario.nombre}
          onChange={manejarCambio} 
        />
        <p>{formulario.nombre}</p> {/* Muestra el valor del campo en tiempo real */}
        <input
          type="number"
          placeholder="Edad"
          name="edad"
          value={formulario.edad}
          onChange={manejarCambio} 
        />
        <p>{formulario.edad}</p>
        <input
          type="text"
          placeholder="Profesión"
          name="profesion"
          value={formulario.profesion}
          onChange={manejarCambio}
        />
        <p>{formulario.profesion}</p>
        
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formulario.email}
          onChange={manejarCambio}
        />
        <p>{formulario.email}</p>
        <br />
        <button type="submit">Enviar</button>
      </form>
    );
}

export default Formulario;