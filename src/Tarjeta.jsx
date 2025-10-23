import MiBoton from "./MiBoton"
function Tarjeta({ titulo, descripcion, botonTexto, color }) {
  return (
    <div className="tarjeta">
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
      <MiBoton texto={botonTexto} color={color} />
    </div>
  )
}
export default Tarjeta