import React, { useState, useEffect } from 'react';
import api from '../../api';
import './AdminPanel.css';

// --- Sub-componente Dashboard ---
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <p>Cargando estadísticas...</p>;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Usuarios</h3>
        <p>{stats.totalUsuarios}</p>
      </div>
      <div className="stat-card">
        <h3>Total Envíos</h3>
        <p>{stats.totalEnvios}</p>
      </div>
    </div>
  );
};

// --- Sub-componente GestionUsuarios ---
const GestionUsuarios = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        api.get('/admin/usuarios').then(res => setUsers(res.data)).catch(console.error);
    }, []);

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id_usuario}>
                            <td>{user.nombre_completo}</td>
                            <td>{user.correo}</td>
                            <td>{user.telefono}</td>
                            <td>{user.rol}</td>
                            <td>{user.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Sub-componente GestionEnvios (con lógica de actualización) ---
const GestionEnvios = () => {
    const [envios, setEnvios] = useState([]);
    const [estados, setEstados] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [enviosRes, estadosRes] = await Promise.all([
                    api.get('/admin/envios'),
                    api.get('/estados-envio')
                ]);
                setEnvios(enviosRes.data);
                setEstados(estadosRes.data);
            } catch (err) {
                setError('No se pudieron cargar los datos.');
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleStatusChange = async (id_envio, new_id_estado) => {
        try {
            await api.put(`/admin/envios/${id_envio}`, { id_estado: new_id_estado });
            // Actualizar el estado localmente para reflejar el cambio instantáneamente
            setEnvios(prevEnvios => 
                prevEnvios.map(envio => 
                    envio.id_envio === id_envio 
                    ? { ...envio, id_estado: parseInt(new_id_estado), estado: estados.find(e => e.id_estado === parseInt(new_id_estado)).nombre } 
                    : envio
                )
            );
        } catch (err) {
            setError('No se pudo actualizar el estado.');
            console.error(err);
        }
    };

    return (
        <div className="table-container">
            {error && <p className="error-message">{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Código Guía</th>
                        <th>Cliente</th>
                        <th>Destino</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {envios.map(envio => (
                        <tr key={envio.id_envio}>
                            <td>{envio.codigo_guia}</td>
                            <td>{envio.cliente}</td>
                            <td>{envio.destino}</td>
                            <td>{new Date(envio.fecha_creacion).toLocaleDateString()}</td>
                            <td>
                                <select 
                                    value={envios.find(e => e.id_envio === envio.id_envio)?.id_estado || ''}
                                    onChange={(e) => handleStatusChange(envio.id_envio, e.target.value)}
                                    className="status-select"
                                >
                                    {estados.map(estado => (
                                        <option key={estado.id_estado} value={estado.id_estado}>
                                            {estado.nombre}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Componente Principal AdminPanel ---
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'usuarios':
        return <GestionUsuarios />;
      case 'envios':
        return <GestionEnvios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Panel de Administración</h2>
      <div className="admin-tabs">
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>Dashboard</button>
        <button onClick={() => setActiveTab('usuarios')} className={activeTab === 'usuarios' ? 'active' : ''}>Gestionar Usuarios</button>
        <button onClick={() => setActiveTab('envios')} className={activeTab === 'envios' ? 'active' : ''}>Gestionar Envíos</button>
      </div>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
