import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo: '',
    telefono: '',
    direccion: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const { nombre_completo, correo, telefono, direccion, password } = formData;
    if (!nombre_completo || !correo || !telefono || !direccion || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    try {
      await register(formData);
      setSuccess('¡Registro exitoso! Redirigiendo...');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error en el registro. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="register-container">

      {/* LEFT — Branding */}
      <div className="register-branding">
        <span className="brand-logo">SkyShip</span>
        <h2>Crea tu cuenta</h2>
        <div className="brand-divider" />
        <p>Únete a miles de clientes que confían en nosotros para sus envíos.</p>
        <div className="register-perks">
          <div className="register-perk">
            <div className="register-perk-icon">📦</div>
            <span>Rastreo en tiempo real de tus paquetes</span>
          </div>
          <div className="register-perk">
            <div className="register-perk-icon">🌎</div>
            <span>Cobertura nacional e internacional</span>
          </div>
          <div className="register-perk">
            <div className="register-perk-icon">⚡</div>
            <span>Cotizaciones instantáneas y envío exprés</span>
          </div>
        </div>
      </div>

      {/* RIGHT — Form card */}
      <div className="register-card">
        <div className="register-card-header">
          <h3>Crear Cuenta</h3>
          <p>Completa el formulario para registrarte</p>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'contents' }}>
          {error   && <div className="register-error">{error}</div>}
          {success && <div className="register-success">{success}</div>}

          <div className="register-form-group">
            <label htmlFor="nombre_completo">Nombre Completo</label>
            <input type="text" id="nombre_completo" name="nombre_completo"
              placeholder="Juan Pérez" value={formData.nombre_completo} onChange={onChange} required />
          </div>

          <div className="register-form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input type="email" id="correo" name="correo"
              placeholder="tu@correo.com" value={formData.correo} onChange={onChange} required />
          </div>

          <div className="register-form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input type="tel" id="telefono" name="telefono"
              placeholder="5555-5555" value={formData.telefono} onChange={onChange} required />
          </div>

          <div className="register-form-group">
            <label htmlFor="direccion">Dirección</label>
            <input type="text" id="direccion" name="direccion"
              placeholder="Zona 10, Ciudad de Guatemala" value={formData.direccion} onChange={onChange} required />
          </div>

          <div className="register-form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password"
              placeholder="Mínimo 6 caracteres" value={formData.password} onChange={onChange} required minLength="6" />
          </div>

          <button type="submit">Crear Cuenta</button>
        </form>

        <p className="register-subtext">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>

    </div>
  );
};

export default Register;
