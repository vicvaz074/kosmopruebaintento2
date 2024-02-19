import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/login', { // Asegúrate de ajustar la URL según tu configuración
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error(data.error || 'Inicio de sesión fallido');
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Método para registro (ajustar según necesidad)
  const register = async (username, email, password) => {
    try {
      // Asume una ruta de API '/api/registrarse' para el registro
      const response = await fetch('/registrarse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error(data.error || 'Registro fallido');
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

