import { useState, useEffect } from "react"
import productos from '../JSON_Productos/productos.json'
import './buscador.css'

const Buscador = ({ handleSearch, scrollTablaVentas }) => {
  const [resultado, setResultado] = useState([])
  const [busqueda, setBusqueda] = useState('')

  const handleFilter = (e) => {
    const valorBusqueda = e.target.value.toLocaleLowerCase()
    setResultado(
      productos.filter(
        (p) => JSON.stringify(p).toLocaleLowerCase().includes(valorBusqueda)
      )
    )
    setBusqueda(valorBusqueda)
    handleSearch(valorBusqueda)
  }

  const handleReset = () => {
    setBusqueda('')
    handleFilter({target: {value: ''}})
  }

  useEffect(() => {
    if (productos) setResultado(productos)
  }, [productos])

  const handleTabla = () => {
    setTimeout(() => {
      scrollTablaVentas();
    }, 100);
  };

  return (
    <nav className="buscador">
      <div className="input-container">
        <input type="text" placeholder="Buscador" value={busqueda} onChange={handleFilter} />
        <button onClick={handleReset}>Resetear</button>
      </div>
    </nav>
  )
}

export default Buscador

  