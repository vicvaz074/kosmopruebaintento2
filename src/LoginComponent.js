import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginComponent.css';
import { DarkModeContext } from './DarkModeContext';
import loginBasicBot from './assets/img/KOSMO_BOT_BASICO.svg';
import loginUserIcone from './assets/img/LOGO_USER_ICONE.svg';
import loginPasswordIcone from './assets/img/CANDADO.svg';
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
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://kosmov2-c8cfe0aa7eb5.herokuapp.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token); // Utiliza la función login del contexto para actualizar el estado global
        alert("¡Inicio de sesión exitoso!");
        navigate('/store'); // Redirige al usuario a la ruta deseada
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      console.error(error);
      setError('Error al iniciar sesión. Intenta de nuevo.'); // Maneja el estado de error para mostrar el mensaje en la UI
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
                <img src={loginUserIcone} alt="User Icon" className="input-icon" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Usuario"
                  className="input-field"
                  style={{ borderBottom: '1px solid #000' }}
                />
                <AlertComponent message={usernameError} />
              </div>
              <div className="input-group">
                <img src={loginPasswordIcone} alt="Password Icon" className="input-icon" />
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
                <AlertComponent message={passwordError} />
              </div>
              <button type="submit" className='loginButton'>Iniciar Sesión</button>
              <p className="login-register-link">
                ¿No trabajas con Kosmo? <span onClick={() => navigate('/registrarse')}>Regístrate aquí</span>
              </p>
              {error && <AlertComponent message={error} />}
              <div className="login-robot">
                <img src={loginBasicBot} alt="Kosmo Bot" className="floating-robot" />
              </div>
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
