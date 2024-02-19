import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Asegúrate de que la ruta sea correcta

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Utiliza useAuth para obtener el estado de autenticación

  // Redirige a login si no está autenticado, de lo contrario, renderiza los children
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
