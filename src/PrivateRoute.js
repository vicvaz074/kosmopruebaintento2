import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Asegúrate de importar correctamente el contexto

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext); // Usa el contexto para determinar si el usuario está autenticado

  // Redirect to login if not authenticated, otherwise render children
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
