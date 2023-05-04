import React, { useState, useEffect } from 'react';
import Quagga from 'quagga';
import beepSound from '../audio/beep.mp3';

const BarcodeScanner = (props) => {
  const [result, setResult] = useState('');
  const [canScan, setCanScan] = useState(true);

  const playBeepSound = () => {
    const audio = new Audio(beepSound);
    audio.play();
  };

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
        //props.onScan(code);
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


