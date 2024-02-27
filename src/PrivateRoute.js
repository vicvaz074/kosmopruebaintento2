import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './AuthContext'; // Ajusta la ruta según sea necesario


const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Utiliza useAuth para obtener el estado de autenticación

  // Redirige a login si no está autenticado, de lo contrario, renderiza los children
  return isAuthenticated ? children : <Navigate to="/store" replace />;
};

export default PrivateRoute;
