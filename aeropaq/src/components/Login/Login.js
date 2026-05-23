import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { correo, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!correo || !password) {
      setError('Por favor, ingrese correo y contraseña.');
      return;
    }
    try {
      await login(correo, password);
      // La redirección la maneja el AuthContext
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al iniciar sesión. Verifique sus credenciales.');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={onSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input type="email" id="correo" name="correo" value={correo} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" value={password} onChange={onChange} required />
        </div>
        <button type="submit" className="btn">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;