import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          SkyShip
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/servicios" className="nav-links" onClick={closeMobileMenu}>
              Servicios
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contacto" className="nav-links" onClick={closeMobileMenu}>
              Contacto
            </Link>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <Link to="/mis-envios" className="nav-links" onClick={closeMobileMenu}>
                  Mis Envíos
                </Link>
              </li>
              {user.rol === 'ADMIN' && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-links" onClick={closeMobileMenu}>
                    Panel Admin
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <span className="nav-links-user">Hola, {user.nombre.split(' ')[0]}</span>
              </li>
              <li className="nav-item">
                <button className="nav-links-btn logout" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links-btn" onClick={closeMobileMenu}>
                  Iniciar Sesión
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/registro" className="nav-links-btn" onClick={closeMobileMenu}>
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
