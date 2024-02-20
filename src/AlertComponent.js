import React from 'react';

const AlertComponent = ({ message }) => {
  // Verifica si hay un mensaje de error y si es una cadena no vacía
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return null; // Si no hay mensaje de error válido, no se renderiza nada
  }

  return (
    <div className="alert">
      {message}
    </div>
  );
};

export default AlertComponent;
