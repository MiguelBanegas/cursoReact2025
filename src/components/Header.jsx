import React, { useState } from 'react';

function Header() {
  const [isHovered, setIsHovered] = useState(false); // Estado para rastrear si el mouse está sobre el header

  const handleMouseEnter = () => {
    setIsHovered(true); // Cambia el estado cuando el mouse entra en el header
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const headerStyle = {
    backgroundColor: isHovered ? 'red' : 'blue', // Cambia el color de fondo basado en el estado
    padding: '10px',
    textAlign: 'center',
    color: 'white',
    cursor: 'pointer' 
  };

  return (
    <header
      style={headerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h1>{isHovered ? 'Hola!!!' : 'Mi Aplicación'}</h1>
    </header>
  );
}

export default Header;