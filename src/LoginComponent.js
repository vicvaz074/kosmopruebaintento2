import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginComponent.css';
import { DarkModeContext } from './DarkModeContext';
import loginBasicBot from './assets/img/KOSMO_BOT_BASICO.svg';
import loginUserIcon from './assets/img/LOGO_USER_ICONE.svg';
import loginPasswordIcon from './assets/img/CANDADO.svg';
import eyeIcon from './assets/img/eye_icon.svg';
import AlertComponent from './AlertComponent';
import { useAuth } from './AuthContext';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode } = useContext(DarkModeContext);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://tu-backend.com/login', { // Reemplaza con tu endpoint de login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token); // Guarda el token en localStorage y actualiza el estado de autenticación
        fetchProtectedData(); // Realiza una solicitud a una ruta protegida después del inicio de sesión
        navigate('/store'); // Redirige al usuario a la página 'store'
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al iniciar sesión. Intenta de nuevo.');
      }
    } catch (error) {
      console.error(error);
      setError('Error al iniciar sesión. Por favor, verifica tu conexión y vuelve a intentarlo.');
    }
  };

  const fetchProtectedData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://tu-backend.com/ruta-protegida', { // Reemplaza con tu ruta protegida
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Manejo de la respuesta
      } else {
        throw new Error('No se pudo acceder a los datos protegidos');
      }
    } catch (error) {
      console.error('Error al acceder a los datos protegidos:', error);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className={`login-wrapper ${darkMode ? 'dark-mode' : ''}`}>
      <div className="login-panel-wrapper">
        <div className="login-panel">
          <div className="login-content">
            <h1>INICIA SESIÓN EN TU CUENTA</h1>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <img src={loginUserIcon} alt="User Icon" className="input-icon" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Usuario"
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <img src={loginPasswordIcon} alt="Password Icon" className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Contraseña"
                  className="input-field"
                />
                <button onClick={toggleShowPassword} type="button" className="password-toggle">
                  <img src={eyeIcon} alt="Toggle Password" />
                </button>
              </div>
              <button type="submit" className="loginButton">Iniciar Sesión</button>
              {error && <AlertComponent message={error} />}
              <p className="login-register-link">
                ¿No trabajas con Kosmo? <span onClick={() => navigate('/registrarse')}>Regístrate aquí</span>
              </p>
            </form>
          </div>
        </div>
      </div>
      <div className="login-robot-big">
        <img src={loginBasicBot} alt="Kosmo Bot" className="floating-robot" />
      </div>
      <div className="footer">
        <p>© Kosmo. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default LoginComponent;
