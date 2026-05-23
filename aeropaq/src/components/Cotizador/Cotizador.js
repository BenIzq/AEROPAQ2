import React, { useState } from 'react';
import './Cotizador.css';

const Cotizador = () => {
  const [datos, setDatos] = useState({
    origenDestino: 'misma_ciudad',
    peso: '',
    servicio: 'estandar',
    recoleccion: false,
    seguro: false
  });

  const [resultado, setResultado] = useState(null);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos({
      ...datos,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const calcularCosto = () => {
    let costoBase = 0;
    let costoPeso = datos.peso * 2; 
    let costoDistancia = 0;
    let tiempo = '';

    // Distancia
    switch (datos.origenDestino) {
      case 'misma_ciudad':
        costoBase = 10;
        costoDistancia = 5;
        tiempo = '1 - 2 días';
        break;
      case 'otro_departamento':
        costoBase = 20;
        costoDistancia = 15;
        tiempo = '2 - 4 días';
        break;
      case 'internacional':
        costoBase = 50;
        costoDistancia = 40;
        tiempo = '5 - 10 días';
        break;
      default:
        break;
    }

    // Servicio
    if (datos.servicio === 'express') {
      costoBase += 15;
      tiempo = 'Hoy mismo';
    }

    // Extras
    let extras = 0;
    if (datos.recoleccion) extras += 5;
    if (datos.seguro) extras += 10;

    const total = costoBase + costoPeso + costoDistancia + extras;

    setResultado({
      costoBase,
      costoPeso,
      costoDistancia,
      extras,
      total,
      tiempo
    });
  };

  return (
    <section id="cotizador" className="cotizador">
      <div className="section-title">
        <h2>Cotizador</h2>
      </div>
      <div className="cotizador-wrapper">
        <div className="cotizador-image">
          <img src="https://images.pexels.com/photos/5025517/pexels-photo-5025517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Paquetes y cajas de envío" />
        </div>
        <div className="cotizador-content">
          <div className="formulario">
            <select name="origenDestino" onChange={manejarCambio}>
              <option value="misma_ciudad">Misma ciudad</option>
              <option value="otro_departamento">Otro departamento</option>
              <option value="internacional">Internacional</option>
            </select>

            <input
              type="number"
              name="peso"
              placeholder="Peso (kg/lb)"
              onChange={manejarCambio}
            />

            <select name="servicio" onChange={manejarCambio}>
              <option value="estandar">Estándar</option>
              <option value="express">Exprés</option>
            </select>

            <label>
              <input type="checkbox" name="recoleccion" onChange={manejarCambio} />
              Recolección a domicilio
            </label>

            <label>
              <input type="checkbox" name="seguro" onChange={manejarCambio} />
              Seguro contra pérdida
            </label>

            <button 
            onClick={calcularCosto}
            disabled={!datos.peso || datos.peso <= 0}>Calcular</button>
          </div>

          {resultado && (
            <div className="resultado">
              <h3>Resultado</h3>
              <p>Costo base: Q{resultado.costoBase}</p>
              <p>Costo por peso: Q{resultado.costoPeso}</p>
              <p>Costo por distancia: Q{resultado.costoDistancia}</p>
              <p>Extras: Q{resultado.extras}</p>
              <hr />
              <h4>Total: Q{resultado.total}</h4>
              <p>Tiempo estimado: {resultado.tiempo}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cotizador;
