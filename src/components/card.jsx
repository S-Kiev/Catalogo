import React, { useState, useRef, useEffect } from 'react';
import "./Card.css";


const Card = React.forwardRef((props, ref) => {
  const [cantidad, setCantidad] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(props.Precio);
  const [subTotal, setSubTotal] = useState(0);
  const [ganancia, setGanancia] = useState(0);
  const [reposicion, setReposicion] = useState(0);


  const botonCalcularRef = useRef(null); // Referencia al botón de calcular


  const botonEliminarRef = useRef(null);


  useEffect(() => {
    // Llamar a la función recibirVenta con el valor actualizado del subtotal
    props.recibirVenta({
      Producto: props.Id,
      Cantidad: cantidad,
      PrecioVenta: precioVenta,
      SubTotal: subTotal,
      Ganancia : ganancia,
      Reposicion: reposicion
    });
  }, [subTotal]);


  const ventasAnteriores = useRef(props.ventas);




  const restar = () => {
    if (cantidad > 0) {
      setCantidad(cantidad - 1);
    }
  };


  const sumar = () => {
    setCantidad(cantidad + 1);
  };

  const descuento = () => {
    if (precioVenta > props.PrecioBase) {
      setPrecioVenta(precioVenta - 5);
    }
  };

  const aumento = () => {
    setPrecioVenta(precioVenta + 5);
  };



  const establecerPrecioVenta = (event) => {
    const precio = parseFloat(event.target.value);
    setPrecioVenta(precio);
  };


  const simularDobleClick = () => {
    // Simular dos clics en el botón de calcular
    botonCalcularRef.current.click();
    botonEliminarRef.current.click();
    setTimeout(() => {
      botonCalcularRef.current.click();
      botonEliminarRef.current.click();
    }, 100);
  };


  const calcularSubTotal = () => {
    if (cantidad > 0 && precioVenta > 0) {
      const ganado = (precioVenta - props.PrecioBase) * cantidad;
      const reposicion = props.PrecioBase * cantidad;
      const subtotal = cantidad * precioVenta;
      setSubTotal(subtotal);
      setGanancia(ganado)
      setReposicion(reposicion)
      if (subtotal > 0) {
        props.recibirVenta({
          Producto: props.Id,
          Cantidad: cantidad,
          PrecioVenta: precioVenta,
          SubTotal: subtotal,
          Ganancia : ganado,
          Reposicion: reposicion
        });
      }
    }
  };




  const resetear=()=>{
    setCantidad(0);
    setGanancia(0);
    setPrecioVenta(props.Precio);
    setReposicion(0);
    setSubTotal(0);
  }


  React.useImperativeHandle(ref, () => ({
    resetear
  }));


  return (
    <div className="card" key={props.Id}>
      <h2>{props.Nombre}</h2>
      <img src={props.Imagen} alt={props.Nombre} />
      <p>${props.Precio}</p>
      <p>Cantidad:</p>
      <button value="-" onClick={restar} />
      <input type="number" value={cantidad} onChange={restar} />
      <button value="+" onClick={sumar} />
      <p>Precio Venta:</p>
      <button value="-" onClick={descuento} />
      <input type="number" readOnly value={precioVenta.toString()} onChange={(event) => establecerPrecioVenta(event)} />
      <button value="+" onClick={aumento} />
      <br/>
        <button ref={botonCalcularRef} onClick={calcularSubTotal} className="calcular">
          Calcular
        </button>
        <button onClick={resetear} className="resetear">
          Resetear
        </button>
      <p>SubTotal:   {subTotal.toString()}</p>
    </div>
  );
});


export default Card;





