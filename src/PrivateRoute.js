import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://kosmov2-c8cfe0aa7eb5.herokuapp.com/store', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isLoading) {
    // Renderiza un componente de carga mientras se verifica el token
    return <div>Loading...</div>;
  }

  // Redirecciona al usuario al login si no está autenticado
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
