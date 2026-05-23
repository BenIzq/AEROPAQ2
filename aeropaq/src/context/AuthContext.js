import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.post('/api/usuarios/login', { correo, password });
      const { token, usuario } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      setToken(token);
      setUser(usuario);
      
      // Redirigir según el rol
      if (usuario.rol === 'ADMIN') {
        navigate('/admin'); // Futura ruta de admin
      } else {
        navigate('/mis-envios'); // Futura ruta de cliente
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      // Lanza el error para que el componente de Login pueda manejarlo
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('/api/usuarios/registro', userData);
      navigate('/login'); // Redirige a login después de un registro exitoso
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
