import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [status, setStatus] = useState({
    isLoading: true,
    isAuthenticated: false,
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        console.log('No se encontró token: Usuario NO autenticado.');
        setStatus({ isLoading: false, isAuthenticated: false });
        return;
      }

      try {
        const response = await fetch('https://kosmov2-c8cfe0aa7eb5.herokuapp.com/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        if (response.ok) {
          console.log('Token verificado: Usuario autenticado.');
          setStatus({ isLoading: false, isAuthenticated: true });
        } else {
          console.log('Token no válido o expirado: Usuario NO autenticado.');
          setStatus({ isLoading: false, isAuthenticated: false });
        }
      } catch (error) {
        console.error('Error durante la verificación del token:', error);
        setStatus({ isLoading: false, isAuthenticated: false });
      }
    };

    verifyToken();
  }, [token]); // Dependencia al token para re-ejecutar la verificación si cambia

  if (status.isLoading) {
    return <div>Loading...</div>;
  }

  if (!status.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

