import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [status, setStatus] = useState({
    isLoading: true,
    isAuthenticated: false,
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('Inicio de la verificación del token...');

    const verifyToken = async () => {
      if (!token) {
        console.log('No se encontró token: Usuario NO autenticado.');
        setStatus({ isLoading: false, isAuthenticated: false });
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
  }, [token]);

  if (status.isLoading) {
    console.log('Cargando: Verificando autenticación...');
    return <div>Loading...</div>; // Considera usar un spinner o componente de carga aquí
  }

  if (!status.isAuthenticated) {
    console.log('Redirigiendo a login: No autenticado.');
    return <Navigate to="/login" replace />;
  }

  console.log('Acceso concedido a la ruta protegida.');
  return children;
};

export default PrivateRoute;
