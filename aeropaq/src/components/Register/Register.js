import React, { useState, useContext } from 'react';
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

  const { nombre_completo, correo, telefono, direccion, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!nombre_completo || !correo || !telefono || !direccion || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    try {
      await register(formData);
      // El AuthContext se encarga de la redirección
      setSuccess('¡Registro exitoso! Redirigiendo a la página de login...');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error en el registro. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="register-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={onSubmit}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="form-group">
          <label htmlFor="nombre_completo">Nombre Completo</label>
          <input type="text" id="nombre_completo" name="nombre_completo" value={nombre_completo} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input type="email" id="correo" name="correo" value={correo} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input type="tel" id="telefono" name="telefono" value={telefono} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input type="text" id="direccion" name="direccion" value={direccion} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" value={password} onChange={onChange} required minLength="6" />
        </div>
        <button type="submit" className="btn">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;