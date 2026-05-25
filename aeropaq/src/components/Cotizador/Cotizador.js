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

    if (datos.servicio === 'express') {
      costoBase += 15;
      tiempo = 'Hoy mismo';
    }

    let extras = 0;
    if (datos.recoleccion) extras += 5;
    if (datos.seguro) extras += 10;

    const total = costoBase + costoPeso + costoDistancia + extras;

    setResultado({ costoBase, costoPeso, costoDistancia, extras, total, tiempo });
  };

  return (
    <section id="cotizador" className="cotizador">
<h2 className="section-title">Cotizador</h2>
      <div className="cotizador-wrapper">
        <div className="cotizador-image">
          <img src="https://images.pexels.com/photos/5025517/pexels-photo-5025517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Paquetes y cajas de envío" />
        </div>
        <div className="cotizador-content">
          <div className="formulario">

            <div className="field-group">
              <label className="field-label">Origen / Destino</label>
              <select name="origenDestino" onChange={manejarCambio}>
                <option value="misma_ciudad">Misma ciudad</option>
                <option value="otro_departamento">Otro departamento</option>
                <option value="internacional">Internacional</option>
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Peso del paquete</label>
              <input
                type="number"
                name="peso"
                placeholder="Ej: 2.5"
                onChange={manejarCambio}
              />
              <span className="field-hint">kg / lb</span>
            </div>

            <div className="field-group">
              <label className="field-label">Tipo de servicio</label>
              <select name="servicio" onChange={manejarCambio}>
                <option value="estandar">Estándar</option>
                <option value="express">Exprés</option>
              </select>
            </div>

            <div className="extras-group">
              <p className="extras-label">Servicios adicionales</p>
              <div className="toggle-row">
                <label className="toggle-card" htmlFor="recoleccion">
                  <div className="toggle-card-icon">🏠</div>
                  <div className="toggle-card-text">
                    <span className="toggle-card-title">Recolección a domicilio</span>
                    <span className="toggle-card-price">+Q5</span>
                  </div>
                  <div className={`toggle-switch ${datos.recoleccion ? 'on' : ''}`}>
                    <div className="toggle-knob" />
                  </div>
                  <input
                    type="checkbox"
                    id="recoleccion"
                    name="recoleccion"
                    checked={datos.recoleccion}
                    onChange={manejarCambio}
                    className="toggle-hidden"
                  />
                </label>

                <label className="toggle-card" htmlFor="seguro">
                  <div className="toggle-card-icon">🛡️</div>
                  <div className="toggle-card-text">
                    <span className="toggle-card-title">Seguro contra pérdida</span>
                    <span className="toggle-card-price">+Q10</span>
                  </div>
                  <div className={`toggle-switch ${datos.seguro ? 'on' : ''}`}>
                    <div className="toggle-knob" />
                  </div>
                  <input
                    type="checkbox"
                    id="seguro"
                    name="seguro"
                    checked={datos.seguro}
                    onChange={manejarCambio}
                    className="toggle-hidden"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={calcularCosto}
              disabled={!datos.peso || datos.peso <= 0}
            >
              Calcular costo
            </button>

          </div>

          {resultado && (
            <div className="resultado">
              <h3>Resumen del costo</h3>
              <div className="resultado-rows">
                <div className="resultado-row">
                  <span>Costo base</span>
                  <span>Q{resultado.costoBase}</span>
                </div>
                <div className="resultado-row">
                  <span>Por peso</span>
                  <span>Q{resultado.costoPeso}</span>
                </div>
                <div className="resultado-row">
                  <span>Por distancia</span>
                  <span>Q{resultado.costoDistancia}</span>
                </div>
                {resultado.extras > 0 && (
                  <div className="resultado-row">
                    <span>Extras</span>
                    <span>Q{resultado.extras}</span>
                  </div>
                )}
              </div>
              <div className="resultado-total">
                <span>Total estimado</span>
                <span>Q{resultado.total}</span>
              </div>
              <div className="resultado-tiempo">
                <span>⏱ Tiempo estimado:</span>
                <strong>{resultado.tiempo}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cotizador;
