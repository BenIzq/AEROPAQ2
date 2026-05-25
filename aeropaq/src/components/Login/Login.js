import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.correo || !formData.password) {
      setError('Por favor, ingrese correo y contraseña.');
      return;
    }
    try {
      await login(formData.correo, formData.password);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al iniciar sesión. Verifique sus credenciales.');
    }
  };

  return (
    <div className="login-container">

      {/* LEFT — Branding */}
      <div className="login-branding">
        <span className="brand-logo">SkyShip</span>
        <h2>Bienvenido de vuelta</h2>
        <div className="brand-divider" />
        <p>Accede a tu cuenta para gestionar tus envíos, rastrear paquetes y más.</p>
      </div>

      {/* RIGHT — Form card */}
      <div className="login-card">
        <div className="login-card-header">
          <h3>Iniciar Sesión</h3>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'contents' }}>
          {error && <div className="login-error">{error}</div>}

          <div className="login-form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="tu@correo.com"
              value={formData.correo}
              onChange={onChange}
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={onChange}
              required
            />
          </div>

          <button type="submit">Iniciar Sesión</button>
        </form>

        <p className="login-subtext">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>

    </div>
  );
};

export default Login;
