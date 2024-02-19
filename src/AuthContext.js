// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  useEffect(() => {
    // Aquí podrías verificar el almacenamiento local o una cookie para el token existente
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí podrías decodificar el token para obtener la información del usuario o hacer una petición para validar el token
      setAuth({ ...auth, token: token });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
