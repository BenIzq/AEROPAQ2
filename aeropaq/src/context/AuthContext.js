import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Importar la instancia de Axios configurada

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  const login = async (correo, password) => {
    try {
      const response = await api.post('/usuarios/login', { correo, password }); // Usar la instancia 'api'
      const { token, usuario } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      setToken(token);
      setUser(usuario);
      
      // Redirigir según el rol
      if (usuario.rol === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/mis-envios');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/usuarios/registro', userData); // Usar la instancia 'api'
      navigate('/login');
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
