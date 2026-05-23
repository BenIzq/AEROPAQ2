import React, { useState, useEffect } from 'react';
import api from '../../api';
import Modal from '../Modal/Modal';
import './AdminPanel.css';

// --- Formulario de Edición de Usuario (dentro del Modal) ---
const UserEditForm = ({ user, roles, onUpdate, onClose }) => {
    const [formData, setFormData] = useState({ ...user });

    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/usuarios/${user.id_usuario}`, formData);
            onUpdate(formData); // Actualiza el estado en el componente padre
            onClose(); // Cierra el modal
        } catch (err) {
            console.error("Error al actualizar el usuario", err);
            // Aquí se podría mostrar un mensaje de error en el formulario
        }
    };

    return (
        <form onSubmit={onSubmit} className="edit-form">
            <h3>Editando a {user.nombre_completo}</h3>
            <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="nombre_completo" value={formData.nombre_completo} onChange={onChange} />
            </div>
            <div className="form-group">
                <label>Correo</label>
                <input type="email" name="correo" value={formData.correo} onChange={onChange} />
            </div>
            <div className="form-group">
                <label>Teléfono</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={onChange} />
            </div>
            <div className="form-group">
                <label>Dirección</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={onChange} />
            </div>
            <div className="form-group">
                <label>Rol</label>
                <select name="id_rol" value={formData.id_rol} onChange={onChange}>
                    {roles.map(rol => (
                        <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Estado</label>
                <select name="estado" value={formData.estado} onChange={onChange}>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                </select>
            </div>
            <button type="submit" className="btn">Guardar Cambios</button>
        </form>
    );
};


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

// --- Sub-componente GestionUsuarios (con Edición y Desactivación) ---
const GestionUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, rolesRes] = await Promise.all([
                    api.get('/admin/usuarios'),
                    api.get('/roles')
                ]);
                setUsers(usersRes.data);
                setRoles(rolesRes.data);
            } catch (err) {
                setError('No se pudieron cargar los datos.');
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleDeactivate = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres desactivar a este usuario?')) {
            try {
                await api.delete(`/admin/usuarios/${userId}`);
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user.id_usuario === userId ? { ...user, estado: 'INACTIVO' } : user
                    )
                );
            } catch (err) {
                setError('No se pudo desactivar el usuario.');
            }
        }
    };

    const handleEdit = (user) => {
        // Necesitamos el id_rol, no el nombre del rol
        const userWithRoleId = {
            ...user,
            id_rol: roles.find(r => r.nombre === user.rol)?.id_rol || ''
        };
        setEditingUser(userWithRoleId);
        setIsModalOpen(true);
    };

    const handleUpdateUser = (updatedUser) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id_usuario === updatedUser.id_usuario ? { ...updatedUser, rol: roles.find(r => r.id_rol == updatedUser.id_rol)?.nombre } : user
            )
        );
    };

    return (
        <div className="table-container">
            {error && <p className="error-message">{error}</p>}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editingUser && (
                    <UserEditForm 
                        user={editingUser} 
                        roles={roles}
                        onUpdate={handleUpdateUser}
                        onClose={() => setIsModalOpen(false)} 
                    />
                )}
            </Modal>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id_usuario}>
                            <td>{user.nombre_completo}</td>
                            <td>{user.correo}</td>
                            <td>{user.telefono}</td>
                            <td>{user.rol}</td>
                            <td>
                                <span className={`status-user-${user.estado.toLowerCase()}`}>
                                    {user.estado}
                                </span>
                            </td>
                            <td>
                                <button className="btn-action btn-edit" onClick={() => handleEdit(user)}>Editar</button>
                                <button 
                                    className="btn-action btn-delete" 
                                    onClick={() => handleDeactivate(user.id_usuario)}
                                    disabled={user.estado === 'INACTIVO'}
                                >
                                    Desactivar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Sub-componente GestionEnvios ---
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
                setEnvios(enviosRes.data.map(e => ({...e, id_estado: e.id_estado || estadosRes.data.find(s => s.nombre === e.estado)?.id_estado })));
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
                                    value={envio.id_estado}
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
