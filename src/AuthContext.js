import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/verify-token', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setIsAuthenticated(response.data.isAuthenticated);
        } catch (error) {
          console.error("Error al verificar el token", error);
          setIsAuthenticated(false);
        }
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
