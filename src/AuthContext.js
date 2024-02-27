import React, { createContext, useContext, useState, useEffect } from 'react';
// Otros imports si son necesarios

const AuthContext = createContext();

// Aquí definimos el hook useAuth para que pueda ser usado en otros componentes
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Agrega aquí la lógica para verificar el token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar el token con tu backend y actualizar el estado según sea necesario
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Asegúrate de pasar todos los estados y funciones que quieras proveer
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
