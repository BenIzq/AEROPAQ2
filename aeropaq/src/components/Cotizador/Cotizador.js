import React, { useState, useEffect } from 'react';
import api from '../../api';
import './Cotizador.css';

const Cotizador = () => {
  const [datos, setDatos] = useState({
    tipoEnvio: 'nacional', // 'nacional' o 'internacional'
    destinoNacional: 'misma_ciudad',
    destinoInternacional: '',
    peso: '',
    servicio: 'estandar',
    recoleccion: false,
    seguro: false
  });

  const [destinosInt, setDestinosInt] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  // Cargar destinos internacionales al montar el componente
  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        const response = await api.get('/destinos-internacionales');
        setDestinosInt(response.data);
      } catch (err) {
        setError('No se pudieron cargar los destinos internacionales.');
        console.error(err);
      }
    };
    fetchDestinos();
  }, []);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos(prevDatos => ({
      ...prevDatos,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calcularCosto = () => {
    let costoBase = 0;
    const pesoNum = parseFloat(datos.peso) || 0;

    if (pesoNum <= 0) {
      setResultado(null);
      return;
    }

    // 1. Calcular Costo Base
    if (datos.tipoEnvio === 'nacional') {
      costoBase = (pesoNum / 4) * 30;
    } else { // Internacional
      const destinoSeleccionado = destinosInt.find(d => d.pais === datos.destinoInternacional);
      if (destinoSeleccionado) {
        const precioPorKg = parseFloat(destinoSeleccionado.precio_base);
        costoBase = pesoNum * precioPorKg;
      }
    }

    // 2. Calcular Extras
    let costoExtras = 0;
    if (datos.servicio === 'express') costoExtras += 15;
    if (datos.recoleccion) costoExtras += 5;
    if (datos.seguro) costoExtras += 10;

    // 3. Calcular Total
    const total = costoBase + costoExtras;

    setResultado({
      costoBase,
      costoExtras,
      total,
      tiempo: datos.servicio === 'express' ? '' : (datos.tipoEnvio === 'nacional' ? '1-4 días' : '5-10 días')
    });
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
              <label className="field-label">Tipo de Envío</label>
              <select name="tipoEnvio" value={datos.tipoEnvio} onChange={manejarCambio}>
                <option value="nacional">Nacional</option>
                <option value="internacional">Internacional</option>
              </select>
            </div>

            {datos.tipoEnvio === 'nacional' ? (
              <div className="field-group">
                <label className="field-label">Origen / Destino</label>
                <select name="destinoNacional" value={datos.destinoNacional} onChange={manejarCambio}>
                  <option value="misma_ciudad">Misma ciudad</option>
                  <option value="otro_departamento">Otro departamento</option>
                </select>
              </div>
            ) : (
              <div className="field-group">
                <label className="field-label">País de Destino</label>
                <select name="destinoInternacional" value={datos.destinoInternacional} onChange={manejarCambio} required>
                  <option value="">Selecciona un país</option>
                  {destinosInt.map(d => <option key={d.pais} value={d.pais}>{d.pais}</option>)}
                </select>
                {error && <p className="error-text">{error}</p>}
              </div>
            )}

            <div className="field-group">
              <label className="field-label">Peso del paquete (kg)</label>
              <input
                type="number"
                name="peso"
                placeholder="Ej: 2.5"
                value={datos.peso}
                onChange={manejarCambio}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Tipo de servicio</label>
              <select name="servicio" value={datos.servicio} onChange={manejarCambio}>
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
              disabled={!datos.peso || datos.peso <= 0 || (datos.tipoEnvio === 'internacional' && !datos.destinoInternacional)}
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
                  <span>Q{resultado.costoBase.toFixed(2)}</span>
                </div>
                {resultado.costoExtras > 0 && (
                  <div className="resultado-row">
                    <span>Extras</span>
                    <span>Q{resultado.costoExtras.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="resultado-total">
                <span>Total estimado</span>
                <span>Q{resultado.total.toFixed(2)}</span>
              </div>
              {resultado.tiempo && (
                <div className="resultado-tiempo">
                  <span>⏱ Tiempo estimado:</span>
                  <strong>{resultado.tiempo}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cotizador;
