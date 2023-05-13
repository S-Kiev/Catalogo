import productos from '/src/JSON_Productos/productos.json';
import "./TablaVentas.css";
import React, { useRef } from 'react';


const TablaVentas = (props) => {

  const tablaRef = useRef(null);

  const nombreProducto = (id) => {
    let nombreTemp = '';
    productos.forEach((producto) => {
      if (producto.Id === id) {
        nombreTemp = producto.Nombre;
      }
    });
    return nombreTemp;
  };

  const handleEliminarVenta = (id) => {
    props.EliminarVenta(id);
  };

  const ultimaFila =()=>{
    return(
      <tr key={Math.random()}>
      <td></td>
      <td></td>
      <td></td>
      <td>Total: </td>
      <td>      
        {props.Total}
      </td>
    </tr>
    )
  }


  const listarVentas = () => {
    // Filtrar los productos con cantidad y precio diferentes de 0
    const productosFiltrados = props.productosVenta.filter(
      (producto) => producto.Cantidad !== 0 && producto.PrecioVenta !== 0
    );
    return productosFiltrados.map((producto) => {
      return (
        <tr key={producto.Producto}>
          <td>{nombreProducto(producto.Producto)}</td>
          <td>{producto.PrecioVenta}</td>
          <td>{producto.Cantidad}</td>
          <td>{producto.Cantidad * producto.PrecioVenta}</td>
          <td>      
            <button onClick={() => handleEliminarVenta(producto.Producto)}>
                Eliminar
            </button>
          </td>
        </tr>
      );
    });
  };

  const handleScrollToTabla = () => {
    tablaRef.current.scrollIntoView({ behavior: "smooth" });
  };  

  const handleResetearVentas = () =>{
    props.resetarVentas();
  }

  const listarTabla =()=>{
    if (props.Total != 0) {
      return(
        <div>
        <table className="default" ref={tablaRef} id="tablaVentas">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>SubTotal</th>
              <th>Eliminar</th>
            </tr>
          </thead>
    
          <tbody>
            {listarVentas()}
            {ultimaFila()}
          </tbody>
        </table>
        <button onClick={() => handleResetearVentas()}>
                Resetear
        </button>
        </div>
      );
    } else {
      return (
        <p>Sin Ventas</p>
      )
    }

  }

  return (
    listarTabla()
  );
};

export default TablaVentas;




