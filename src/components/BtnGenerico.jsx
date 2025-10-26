import { useState } from "react"  ;

function BtnGenerico({ texto, color, ...props }) {
  const [hover, setHover] = useState(false);
  const [estilo, setEstilo] = useState({backgroundColor: color || 'blue',});
    const handleMouseOver = () => {
      setEstilo({backgroundColor: 'darkblue', color: 'white'});
    }
    const handleMouseOut = () => {
      setEstilo({backgroundColor: color || 'blue', color: 'black'});
    }

  const estilo2 = {
    backgroundColor: hover ? 'darkblue' : color || 'blue',
    color: 'black',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }

  return (
    <button
      style={estilo2}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      {...props}
    >
      {texto}
    </button>
  )
}

export default BtnGenerico;
