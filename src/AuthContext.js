import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const AuthContext = createContext(); // Declaración única de AuthContext

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/#inicio'); // O simplemente navigate('/') para redirigir a la raíz
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; // Exporta AuthContext aquí si realmente necesitas accederlo directamente fuera
