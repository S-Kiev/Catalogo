import React, { useState, useEffect } from 'react';
import Quagga from 'quagga';
import beepSound from '../audio/beep.mp3';
import productos from '../JSON_Productos/productos.json';
import './lectorQR.css'


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

  /*
  useEffect(()=>{
    calcularVenta(productoEscaneado?.Id)
  },[productoEscaneado])
  */

  const calcularVenta = (id) =>{

    const idNumerico = Number(id);

    const venta = props.productosVenta.find((v) => v.Producto == idNumerico);
    const productoExiste = productos.find((p) => p.Id == idNumerico);

    if (venta) {
      const cantidad = venta.Cantidad + 1;
      const precioVenta = productoEscaneado?.Precio;
      const subTotal = productoEscaneado?.Precio  * cantidad;
      const ganancia = (productoEscaneado?.Precio - productoEscaneado?.PrecioBase) * cantidad;
      const repo = productoEscaneado?.PrecioBase * cantidad;


      props.recibirVenta({
        Producto: idNumerico, 
        Cantidad : cantidad,
        PrecioVenta : precioVenta,
        SubTotal: subTotal,
        Ganancia : ganancia,
        Reposicion: repo
      })

    } else if (!venta && productoExiste) {
      const cantidad = 1;
      const precioVenta = productoExiste?.Precio;
      const subTotal = productoExiste?.Precio  * cantidad;
      const ganancia = (productoExiste?.Precio - productoExiste?.PrecioBase) * cantidad;
      const repo = productoExiste?.PrecioBase * cantidad;

      props.recibirVenta({
        Producto: idNumerico, 
        Cantidad : cantidad,
        PrecioVenta : precioVenta,
        SubTotal: subTotal,
        Ganancia : ganancia,
        Reposicion: repo
      })
    }
  }

  useEffect(() => {
    const styles = {
      button: {
        padding: canScan ? '13px' : '10px',
        boxShadow: canScan ? '0px 0px 5px gold' : 'none',
      },
    };


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
      }
    });
    
    

    return () => {
      Quagga.stop();
    };
  }, [canScan]);

  useEffect(() => {
    let timeout;
    if (!canScan) {
      timeout = setTimeout(() => {
        setCanScan(true);
      }, 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [canScan]);
  

  const handleEscanear =()=>{
    if (canScan){
      setCanScan(false)
    } else {
      setCanScan(true)
    }
  }

  return (
    <div>
      <div id="scanner-container" style={{ width: '100%', height: 'auto' }}></div>
      <p>{result}</p>
      <button
       onClick={() => handleEscanear()}
       className={`scanner-btn ${canScan ? 'scanner-btn-active' : ''}`}
      >
                Escanear
        </button>
    </div>
  );
};

export default BarcodeScanner;


