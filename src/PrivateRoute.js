import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null indica estado de "cargando"
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      console.log('Verificando token...');
      if (token) {
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
            setIsAuthenticated(true);
          } else {
            console.log('Token verificado: Usuario NO autenticado.');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error al verificar el token:', error);
          setIsAuthenticated(false);
        }
      } else {
        console.log('No se encontró token: Usuario NO autenticado.');
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [token]); // Dependencia al token para re-ejecutar si cambia

  // Manejo de estado de carga
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Mostrar algo más representativo o un spinner de carga
  }

  // Redireccionamiento basado en el estado de autenticación
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
