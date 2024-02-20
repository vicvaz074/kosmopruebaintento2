import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);

  React.useEffect(() => {
    if (token) {
      fetch('https://kosmov2-c8cfe0aa7eb5.herokuapp.com/store', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        // Asumiendo que tu servidor responde con un código de estado para indicar validez
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  if (isAuthenticated === null) {
    // Renderizar algo mientras se verifica la autenticación, como un spinner de carga
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
