
function MiBoton({texto, color, ...props}) {

  const estilo = {
      backgroundColor: color || 'blue',
      color: 'black',
      padding: '10px 20px',
      border: 'none',
        borderRadius: '5px',
      cursor: 'pointer',
    }
  
  return (
    <button style={estilo} {...props}>{texto} </button>
  )
}
export default MiBoton