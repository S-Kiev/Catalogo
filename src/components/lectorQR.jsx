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
  

  useEffect(() => {
    if (productoEscaneado) { // Verifica si productoEscaneado no es nulo
       const ventaExistente = props.Ventas.find((venta) => venta.Producto === productoEscaneado?.Id);
       console.log(ventaExistente)
       if(ventaExistente) {
        const nuevaCantidad = ventaExistente.Cantidad + 1;
        const ventaPorCodigo = {
          Producto: productoEscaneado?.Id,
          Cantidad: nuevaCantidad,
          PrecioVenta: productoEscaneado?.Precio,
          SubTotal: productoEscaneado?.Precio * nuevaCantidad,
          Ganancia: (productoEscaneado?.Precio * nuevaCantidad) - (productoEscaneado?.PrecioBase * nuevaCantidad),
          Reposicion: (productoEscaneado?.PrecioBase * nuevaCantidad),
        };
        console.log(ventaPorCodigo)
        props.recibirVenta(ventaPorCodigo)
       } else {
        const ventaPorCodigo = {
          Producto: productoEscaneado?.Id,
          Cantidad: 1,
          PrecioVenta: productoEscaneado?.Precio,
          SubTotal: productoEscaneado?.Precio,
          Ganancia: productoEscaneado?.Precio - productoEscaneado?.PrecioBase,
          Reposicion: productoEscaneado?.PrecioBase,
        };
        console.log(ventaPorCodigo)
        props.recibirVenta(ventaPorCodigo);
       }
    }
  }, [productoEscaneado]);

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
        buscarProducto(code)
        setCanScan(false);
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


