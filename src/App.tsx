import { useState } from 'react';
import './index.css';

export default function App() {
  
  const [pantalla, setPantalla] = useState('0');
  const [valorAnterior, setValorAnterior] = useState<string | null>(null);
  const [operador, setOperador] = useState<string | null>(null);
  const [esperandoNuevoValor, setEsperandoNuevoValor] = useState(false);

  const [historial, setHistorial] = useState('');
  const botones = ['C', '+/-', '%', '÷', '7', '8', '9', 'x', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='];

  const calcular = (a: string, b: string, op: string) => {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);
    if (op === '+') return (num1 + num2).toString();
    if (op === '-') return (num1 - num2).toString();
    if (op === 'x') return (num1 * num2).toString();
    if (op === '÷') return num2 === 0 ? 'Error' : (num1 / num2).toString();
    return b;
  };

  const manejarClick = (boton: string) => {
  if (boton === 'C') {
    setPantalla('0');
    setValorAnterior(null);
    setOperador(null);
    setHistorial('');
    return;
  }

  if (boton === '+/-') return setPantalla((parseFloat(pantalla) * -1).toString());
  if (boton === '%') return setPantalla((parseFloat(pantalla) / 100).toString());

  if (/[0-9.]/.test(boton)) {
    if (boton === '.' && pantalla.includes('.') && !esperandoNuevoValor) return;
    if (historial.includes('=')) setHistorial('');

    if (esperandoNuevoValor || pantalla === '0') {
      setPantalla(boton === '.' ? '0.' : boton);
      setEsperandoNuevoValor(false);
    } else {
      setPantalla(pantalla + boton);
    }
    return;
  }

  if (['+', '-', 'x', '÷', '='].includes(boton)) {
    if (boton === '=') {
      if (operador && valorAnterior) {
        const resultado = calcular(valorAnterior, pantalla, operador);
        setPantalla(resultado);
        setHistorial(`${historial}${pantalla} =`);
        setValorAnterior(null);
        setOperador(null);
        setEsperandoNuevoValor(true);
      }
      return;
    }

    if (esperandoNuevoValor && operador) {
      setHistorial(historial.slice(0, -1) + boton);
      setOperador(boton);
      return;
    }

    const baseHistorial = historial.includes('=') ? pantalla : `${historial}${pantalla}`;
    setHistorial(`${baseHistorial}${boton}`);
    
    if (operador && valorAnterior) {
      const resultado = calcular(valorAnterior, pantalla, operador);
      setPantalla(resultado);
      setValorAnterior(resultado);
    } else {
      setValorAnterior(pantalla);
    }
    
    setOperador(boton);
    setEsperandoNuevoValor(true);
    }
  };

  
  const obtenerClaseBoton = (boton: string) => {
    if (boton === '0') return 'btn-cero';
    if (['÷', 'x', '-', '+', '='].includes(boton)) return 'btn-operador';
    if (['C', '+/-', '%'].includes(boton)) return 'btn-accion';
    return '';
  };

  return (
    
    <div className="calculadora">
      <div className='titulo'>Calculadora Simple</div>
      <div className="mini-pantalla">
      {historial}
      
      </div>
      <div className="pantalla">{pantalla}</div>
      <div className="teclado">
        {botones.map((boton) => (
          <button 
            key={boton} 
            className={obtenerClaseBoton(boton)}
            onClick={() => manejarClick(boton)} 
          >
            {boton}
          </button>
        ))}
      </div>
    </div>
  );
}