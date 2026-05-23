import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const RutaProtegida = ({ roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Si no hay usuario, redirigir a la página de login
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.rol)) {
    // Si se requieren roles y el usuario no tiene el rol adecuado,
    // redirigir a la página de inicio (o a una página de "no autorizado")
    return <Navigate to="/" />;
  }

  // Si el usuario está autenticado y (si se requiere) autorizado, renderizar el contenido
  return <Outlet />;
};

export default RutaProtegida;
