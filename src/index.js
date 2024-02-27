import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DarkModeProvider } from './DarkModeContext';
import { AuthProvider } from './AuthContext'; // Asegúrate de ajustar la ruta a tu AuthContext

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Envuelve tu aplicación con AuthProvider */}
      <DarkModeProvider> {/* DarkModeProvider ya está correctamente envolviendo App */}
        <App />
      </DarkModeProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
