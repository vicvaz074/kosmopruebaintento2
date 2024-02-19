import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Asume que AuthContext es el contexto de autenticación

const NavigationComponent = () => {
  const navigate = useNavigate();
  const { authToken, setAuthToken } = useContext(AuthContext);

  const handleLogout = () => {
    // Limpia el token de la sesión y cualquier otro estado relacionado con la autenticación
    setAuthToken(null);
    localStorage.removeItem('authToken');
    // Redirecciona al usuario al inicio
    navigate('/#inicio');
  };

  return (
    <nav>
      <ul>
        {/* Links que siempre están presentes */}
        <li><Link to="/#inicio">Inicio</Link></li>
        <li><Link to="/store">Tienda</Link></li>

        {/* Links que dependen del estado de autenticación */}
        {authToken ? (
          <>
            <li><Link to="/mi-sesion">Mi Sesión</Link></li>
            <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Iniciar Sesión</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavigationComponent;
