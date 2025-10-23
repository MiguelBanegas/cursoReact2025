import React from 'react'

function ListaUsuarios({ Usuarios }) {
   /*  const Usuarios  = [ */
   /*      { id: 1, nombre: 'Juan', edad: 28, profesion: 'Ingeniero' }, */
   /*      { id: 2, nombre: 'María', edad: 34, profesion: 'Diseñadora' }, */
   /*      { id: 3, nombre: 'Pedro', edad: 22, profesion: 'Estudiante' }, */
   /*  ]; */

  return (
    <> 
      <div>Lista de Usuarios</div>
      <ol>
        {Usuarios.map(persona => (
          <li key={persona.id}>
            Usuario con ID {persona.id} - {persona.nombre} de {persona.edad} años es {persona.profesion}
            </li>
        ))}
      </ol>
    </>
  )
}

export default ListaUsuarios