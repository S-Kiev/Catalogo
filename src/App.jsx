import { useState, useEffect, useRef } from 'react'
import './App.css'
import productos from '../src/JSON_Productos/productos.json'
import { PHONE_NUMBER } from '../env'
import Buscador from './components/buuscador'
import Card from './components/card'
import TablaVentas from './components/tabla'
import BarcodeScanner from './components/lectorQR'

function App() {
  const [mensaje, setMensaje] = useState("")
  const [ventas, setVentas] = useState([])
  const [ventaActual, setVentaActual] = useState(null);
  const [total, setTotal] = useState(0);
  const [ganacia, setGanancia] = useState(0);
  const [reposicion, setReposicion] = useState(0);
  const [productosFiltrados, setProductosFiltrados] = useState(productos)


  useEffect(() => {
    handleCalcularTotal();
    handleCalcularGanancia();
    handleCalcularReposicion();
  }, [ventas]);

  const hijoRef = useRef();

  const llamarFuncionHijo = () => {
    // Acceder a la función del hijo mediante la referencia
    hijoRef.current.resetear();
  };



  const handleCalcularTotal = () => {
    const totalVentas = ventas.reduce((total, venta) => {
      return total + venta.SubTotal;
    }, 0);
    setTotal(totalVentas);
  };

  const handleCalcularGanancia = () => {
    const totalGanancia = ventas.reduce((ganancia, venta) => {
      return ganancia + venta.Ganancia;
    }, 0);
    setGanancia(totalGanancia);
  };

  const handleCalcularReposicion = () => {
    const totalReposicion = ventas.reduce((reposicion, venta) => {
      return reposicion + venta.Reposicion;
    }, 0);
    setReposicion(totalReposicion);
  };
  

  const handleMensajeChange = (event) => {
    setMensaje(event.target.value)
  }

  const recibirVenta = (productoVendido) => {
    const { Producto, Cantidad, PrecioVenta, SubTotal, Ganancia, Reposicion } = productoVendido;
    const nuevaVenta = { Producto, Cantidad, PrecioVenta, SubTotal, Ganancia, Reposicion };
  
    // Verificar si el producto ya existe en el array de ventas
    const productoExistente = ventas.find(venta => venta.Producto === Producto);
  
    if (productoExistente) {
      // Si el producto ya existe, reemplazarlo en el array de ventas
      const ventasActualizadas = ventas.map(venta => {
        if (venta.Producto === Producto) {
          return nuevaVenta;
        }
        return venta;
      });
      setVentas(ventasActualizadas);
      handleCalcularTotal()
      handleCalcularGanancia()
      handleCalcularReposicion()
    } else {
      // Si el producto no existe, agregarlo al array de ventas
      setVentas([...ventas, nuevaVenta]);
      handleCalcularTotal()
      handleCalcularGanancia()
      handleCalcularReposicion()
    }
  
    setVentaActual(nuevaVenta);
  };

  const handleEliminarVenta = (id) => {
    setVentas(ventas.filter(venta => venta.Producto !== id));
    hijoRef.current.resetear();
  }

  const handleSearch = (query) => {
    const filteredProducts = productos.filter(producto => producto.Nombre.toLowerCase().includes(query.toLowerCase()))
    setProductosFiltrados(filteredProducts)
  }
  const handleGoToInicio = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollTablaVentas = () => {
    setTimeout(() => {
      const tablaVentas = document.getElementById("tablaVentas");
      tablaVentas && tablaVentas.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  const recibirProductoPorCodigo = (id) => {
    console.log(id)
    const producto = productos.find(product => product.Id === id);
    console.log(producto)
  
    const nuevaVenta = { 
      Producto : id, 
      Cantidad : 1, 
      PrecioVenta: producto.Precio, 
      SubTotal : producto.Precio, 
      Ganancia : (producto.Precio - producto.PrecioBase), 
      Reposicion : producto.PrecioBase
    };
  
    if (producto) {
      setVentas([...ventas, nuevaVenta]);
      handleCalcularTotal()
      handleCalcularGanancia()
      handleCalcularReposicion()
    }
    
    setVentaActual(nuevaVenta);
  }
  

  //<BarcodeScanner onScan={recibirProductoPorCodigo} />
  
  return (
    <div className="App">
      <Buscador handleSearch={handleSearch}/>


      <div className='card-container'>
        {productosFiltrados.map((producto)=>(
          <Card ref={hijoRef} key={producto.Id} Id={producto.Id} Nombre={producto.Nombre} Precio={producto.Precio} PrecioBase={producto.PrecioBase} Imagen={producto.Imagen} recibirVenta={recibirVenta} eliminarVenta={handleEliminarVenta} ventas={ventas}/>
          ))
        }
      </div>
        {
      ventaActual && (
        <TablaVentas productosVenta={ventas} EliminarVenta={handleEliminarVenta} Total={total} id="tabla-ventas"/>
      )
    }
    <p>Total: {total}</p>
    <p>Ganancia: {ganacia}</p>
    <p>Reposicion: {reposicion}</p>

    <div className="botones">
        <button className="purple" onClick={handleGoToInicio}>↑</button>
        <button className="green" onClick={scrollTablaVentas}>↓</button>
    </div>

      <h1>Escriba su Mensaje</h1>
      <textarea value={mensaje} onChange={handleMensajeChange}></textarea><br/>
      <button onClick={() => window.location.href = `https://wa.me/${PHONE_NUMBER}?text=${mensaje}`} className="button">Enviar Pedido</button>
    </div>
  )
}

export default App

//
