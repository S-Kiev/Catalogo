import { useState, useEffect } from "react"
import productos from '../JSON_Productos/productos.json'
import './buscador.css'

const Buscador = ({ handleSearch, scrollTablaVentas }) => {
    const [resultado, setResultado] = useState([])
  
    const handleFilter = (e) => {
      const valorBusqueda = e.target.value.toLocaleLowerCase()
      setResultado(
        productos.filter(
          (p) => JSON.stringify(p).toLocaleLowerCase().includes(valorBusqueda)
        )
      )
      handleSearch(valorBusqueda)
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
          <input type="text" placeholder="Buscador" onChange={handleFilter} />             
      </nav>
    )
  }

  export default Buscador
  