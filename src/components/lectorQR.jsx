import React, { useState, useEffect } from 'react';
import Quagga from 'quagga';
import beepSound from '../audio/beep.mp3';
import productos from '../JSON_Productos/productos.json';


const BarcodeScanner = (props) => {
  const [result, setResult] = useState('');
  const [canScan, setCanScan] = useState(true);
  const [productoEscaneado, setProductoEscaneado] = useState(null);


  const playBeepSound = () => {
    const audio = new Audio(beepSound);
    audio.play();
  };

  const buscarProducto = (id) => {
    const producto = productos.find(product => product?.Id == id);
    if (producto) {
      setProductoEscaneado(producto);
    }
  };

  useEffect(()=>{
    calcularVenta(productoEscaneado?.Id)
  },[productoEscaneado])

  const calcularVenta = (id) =>{
    console.log("producto escaneado: ")
    console.log(productoEscaneado)
    console.log("el ide es: " + id)

    console.log("lista de ventas: ")
    console.log(props.productosVenta)

    const venta = props.productosVenta.find((v) => v.Producto == id);
    const productoExiste = productos.find((p) => p.Id == id);

    console.log("venta: ")
    console.log(venta)

    if (venta) {
      const cantidad = venta.Cantidad + 1;
      const precioVenta = productoEscaneado?.Precio;
      const subTotal = productoEscaneado?.Precio  * cantidad;
      const ganancia = (productoEscaneado?.Precio - productoEscaneado?.PrecioBase) * cantidad;
      const repo = productoEscaneado?.PrecioBase * cantidad;

      console.log("cantidad")
      console.log(cantidad)
      console.log("venta")
      console.log(venta)

      props.recibirVenta({
        Producto: id, 
        Cantidad : cantidad,
        PrecioVenta : precioVenta,
        SubTotal: subTotal,
        Ganancia : ganancia,
        Reposicion: repo
      })

    } else if (!venta && productoExiste) {
      const cantidad = 1;
      const precioVenta = productoEscaneado?.Precio;
      const subTotal = productoEscaneado?.Precio  * cantidad;
      const ganancia = (productoEscaneado?.Precio - productoEscaneado?.PrecioBase) * cantidad;
      const repo = productoEscaneado?.PrecioBase * cantidad;

      console.log("cantidad")
      console.log(cantidad)
      console.log("venta")
      console.log(venta)

      props.recibirVenta({
        Producto: id, 
        Cantidad : cantidad,
        PrecioVenta : precioVenta,
        SubTotal: subTotal,
        Ganancia : ganancia,
        Reposicion: repo
      })
    }
  }

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: '#scanner-container',
          constraints: {
            width: 480,
            height: 320,
            facingMode: 'environment', // or user for front camera
          },
        },
        decoder: {
          readers: ['ean_reader'], // List of active readers
        },
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((data) => {
      if (canScan) {
        const code = data.codeResult.code;
        setResult(code);
        setCanScan(false);
        buscarProducto(code);
        calcularVenta(code)
        playBeepSound();
        setTimeout(() => {
          setCanScan(true);
        }, 3000);
        
      }
    });
    
    

    return () => {
      Quagga.stop();
    };
  }, [canScan]);

  return (
    <div>
      <div id="scanner-container" style={{ width: '100%', height: 'auto' }}></div>
      <p>{result}</p>
    </div>
  );
};

export default BarcodeScanner;


