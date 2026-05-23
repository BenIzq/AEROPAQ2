import React, { useState, useEffect } from 'react';
import api from '../../api';
import './MisEnvios.css';

const MisEnvios = () => {
  const [envios, setEnvios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Nuevos estados para la lógica dual
  const [tipoEnvio, setTipoEnvio] = useState('nacional');
  const [destinosInt, setDestinosInt] = useState([]);
  
  const [formData, setFormData] = useState({
    origen: '',
    destino: '',
    descripcion_paquete: '',
    peso: '',
    costo_estimado: 0
  });

  // Cargar datos iniciales (envíos y destinos internacionales)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [enviosRes, destinosRes] = await Promise.all([
          api.get('/envios'),
          api.get('/destinos-internacionales')
        ]);
        setEnvios(enviosRes.data);
        setDestinosInt(destinosRes.data);
        setError('');
      } catch (err) {
        setError('No se pudieron cargar los datos iniciales.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      origen: tipoEnvio === 'internacional' ? 'Guatemala' : '',
      destino: '',
      descripcion_paquete: '',
      peso: '',
      costo_estimado: 0
    });
  };

  // Manejar cambio de tipo de envío
  useEffect(() => {
    resetForm();
  }, [tipoEnvio]);

  const { origen, destino, descripcion_paquete, peso, costo_estimado } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    if (tipoEnvio === 'nacional') {
      if (name === 'peso') {
        const newPeso = parseFloat(value) || 0;
        newFormData.costo_estimado = (newPeso / 4) * 30;
      }
    } else if (tipoEnvio === 'internacional') {
      const destinoSeleccionado = destinosInt.find(d => d.pais === newFormData.destino);
      const precioPorKg = destinoSeleccionado ? parseFloat(destinoSeleccionado.precio_base) : 0;
      const pesoNumerico = parseFloat(newFormData.peso) || 0;
      newFormData.costo_estimado = precioPorKg * pesoNumerico;
    }
    
    setFormData(newFormData);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/envios', formData);
      resetForm();
      // Recargar la lista de envíos
      const res = await api.get('/envios');
      setEnvios(res.data);
    } catch (err) {
      setError('Error al crear el envío. Verifique los datos.');
      console.error(err);
    }
  };

  return (
    <div className="mis-envios-container">
      <div className="crear-envio-section">
        <h2>Crear Nuevo Envío</h2>
        
        <div className="tipo-envio-selector">
          <label>
            <input type="radio" value="nacional" checked={tipoEnvio === 'nacional'} onChange={(e) => setTipoEnvio(e.target.value)} />
            Nacional
          </label>
          <label>
            <input type="radio" value="internacional" checked={tipoEnvio === 'internacional'} onChange={(e) => setTipoEnvio(e.target.value)} />
            Internacional
          </label>
        </div>

        <form onSubmit={onSubmit} className="envio-form">
          {tipoEnvio === 'nacional' ? (
            // FORMULARIO NACIONAL
            <>
              <div className="form-row">
                <input type="text" placeholder="Origen" name="origen" value={origen} onChange={onChange} required />
                <input type="text" placeholder="Destino" name="destino" value={destino} onChange={onChange} required />
              </div>
              <div className="form-row">
                <input type="number" step="0.01" placeholder="Peso (Kg)" name="peso" value={peso} onChange={onChange} required />
                <div className="costo-display">
                  <span>Costo Estimado:</span>
                  <strong>Q {parseFloat(costo_estimado).toFixed(2)}</strong>
                </div>
              </div>
            </>
          ) : (
            // FORMULARIO INTERNACIONAL
            <>
              <div className="form-row">
                <input type="text" placeholder="Origen" name="origen" value="Guatemala" readOnly />
                <select name="destino" value={destino} onChange={onChange} required>
                  <option value="">Selecciona un país de destino</option>
                  {destinosInt.map(d => <option key={d.pais} value={d.pais}>{d.pais}</option>)}
                </select>
              </div>
              <div className="form-row">
                <input type="number" step="0.01" placeholder="Peso (Kg)" name="peso" value={peso} onChange={onChange} required />
                <div className="costo-display">
                  <span>Costo Total:</span>
                  <strong>Q {parseFloat(costo_estimado).toFixed(2)}</strong>
                </div>
              </div>
            </>
          )}
          
          <textarea placeholder="Descripción del paquete (opcional)" name="descripcion_paquete" value={descripcion_paquete} onChange={onChange}></textarea>
          <button type="submit" className="btn">Crear Envío</button>
        </form>
      </div>

      <div className="listado-envios-section">
        <h2>Mis Envíos</h2>
        {loading && <p>Cargando...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && envios.length > 0 && (
          <table className="envios-table">
            <thead>
              <tr>
                <th>Código Guía</th>
                <th>Destino</th>
                <th>Fecha Creación</th>
                <th>Estado</th>
                <th>Costo (Q)</th>
              </tr>
            </thead>
            <tbody>
              {envios.map((envio) => (
                <tr key={envio.codigo_guia}>
                  <td>{envio.codigo_guia}</td>
                  <td>{envio.destino}</td>
                  <td>{new Date(envio.fecha_creacion).toLocaleDateString()}</td>
                  <td><span className={`status status-${envio.estado.toLowerCase()}`}>{envio.estado}</span></td>
                  <td>{parseFloat(envio.costo_estimado).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MisEnvios;