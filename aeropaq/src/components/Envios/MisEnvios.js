import React, { useState, useEffect } from 'react';
import api from '../../api'; 
import './MisEnvios.css';

const MisEnvios = () => {
  const [envios, setEnvios] = useState([]);
  const [formData, setFormData] = useState({
    origen: '',
    destino: '',
    descripcion_paquete: '',
    peso: '',
    costo_estimado: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEnvios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/envios');
      setEnvios(res.data);
      setError('');
    } catch (err) {
      setError('No se pudieron cargar los envíos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvios();
  }, []);

  const { origen, destino, descripcion_paquete, peso, costo_estimado } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/envios', formData);
      setFormData({
        origen: '',
        destino: '',
        descripcion_paquete: '',
        peso: '',
        costo_estimado: ''
      });
      fetchEnvios(); // Recargar la lista de envíos
    } catch (err) {
      setError('Error al crear el envío. Verifique los datos.');
      console.error(err);
    }
  };

  return (
    <div className="mis-envios-container">
      <div className="crear-envio-section">
        <h2>Crear Nuevo Envío</h2>
        <form onSubmit={onSubmit} className="envio-form">
          <div className="form-row">
            <input type="text" placeholder="Origen" name="origen" value={origen} onChange={onChange} required />
            <input type="text" placeholder="Destino" name="destino" value={destino} onChange={onChange} required />
          </div>
          <div className="form-row">
            <input type="number" step="0.01" placeholder="Peso (Kg)" name="peso" value={peso} onChange={onChange} required />
            <input type="number" step="0.01" placeholder="Costo Estimado (Q)" name="costo_estimado" value={costo_estimado} onChange={onChange} required />
          </div>
          <textarea placeholder="Descripción del paquete" name="descripcion_paquete" value={descripcion_paquete} onChange={onChange}></textarea>
          <button type="submit" className="btn">Crear Envío</button>
        </form>
      </div>

      <div className="listado-envios-section">
        <h2>Mis Envíos</h2>
        {loading && <p>Cargando envíos...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && envios.length === 0 && <p>No tienes envíos registrados.</p>}
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